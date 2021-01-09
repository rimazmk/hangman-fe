import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import { gameInitInterface, gameStateInterface } from "../hangman";
import {
  FormGroup,
  FormControl,
  InputLabel,
  TextField,
  MenuItem,
  Select,
  Button,
} from "@material-ui/core";
import { socket } from "../modules";

function Create({
  setUser,
}: {
  setUser: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [state, setState] = useState<gameInitInterface>({
    username: "",
    lives: "6",
    numRounds: "3",
    rotation: "robin",
    time: "10",
  });
  const [roomID, setRoomID] = useState("");

  const handleLink = (info: {
    gameState: gameStateInterface;
    roomID: string;
  }) => {
    console.log(info);
    setUser(info.gameState.players[0]); // why doesn't state.username itself work
    setRoomID(info.roomID);
  };

  useEffect(() => {
    socket.on("link", handleLink);
    return () => {
      socket.off("link", handleLink);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit("create", state);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <TextField
            type="text"
            value={state.username}
            onChange={(e) => setState({ ...state, username: e.target.value })}
            id="username"
            name="username"
            label="username"
            inputProps={{
              pattern: "(?! )([^*?]| )+(?<! )",
              title: "Username cannot have leading or trailing spaces",
            }}
            onInvalid={(e) => "Please fill out this field"}
            variant="outlined"
            required
          />
          <br />
          <TextField
            type="number"
            label="Lives"
            value={state.lives}
            onChange={(e) => setState({ ...state, lives: e.target.value })}
            id="lives"
            name="lives"
            inputProps={{ min: 6, max: 10 }}
            onInvalid={(e) => "Please fill out this field"}
            variant="outlined"
            required
          />
          <br />
          <TextField
            type="number"
            label="Rounds"
            value={state.numRounds}
            onChange={(e) => setState({ ...state, numRounds: e.target.value })}
            id="numRounds"
            name="numRounds"
            inputProps={{ min: 1 }}
            onInvalid={(e) => "Please fill out this field"}
            variant="outlined"
            required
          />
          <br />
          <FormControl>
            <InputLabel id="rotation-label">Rotation</InputLabel>
            <Select
              labelId="rotation-label"
              name="rotation"
              id="rotation"
              value={state.rotation}
              onChange={(e) =>
                setState({ ...state, rotation: e.target.value as string })
              }
              onInvalid={(e) => "Please fill out this field"}
              variant="outlined"
              required
            >
              <MenuItem value="robin">Round Robin</MenuItem>
              <MenuItem value="king">King of the Hill</MenuItem>
            </Select>{" "}
          </FormControl>
          <br />
          <FormControl>
            <InputLabel id="time-label">Guess Time (sec)</InputLabel>
            <Select
              name="time"
              id="time"
              labelId="time-label"
              onInvalid={(e) => "Please fill out this field"}
              value={state.time}
              required
              variant="outlined"
              onChange={(e) =>
                setState({ ...state, time: e.target.value as string })
              }
            >
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="20">20</MenuItem>
              <MenuItem value="30">30</MenuItem>
              <MenuItem value="40">40</MenuItem>
              <MenuItem value="50">50</MenuItem>
              <MenuItem value="60">60</MenuItem>
              <MenuItem value="70">70</MenuItem>
              <MenuItem value="80">80</MenuItem>
              <MenuItem value="90">90</MenuItem>
              <MenuItem value="inf">Unlimited</MenuItem>
            </Select>
          </FormControl>
          <br />
          <br />
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </FormGroup>
      </form>
      {roomID && roomID !== "" && <Redirect to={`/${roomID}`} />}
    </div>
  );
}

export default Create;
