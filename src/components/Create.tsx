import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import { gameInitInterface, gameStateInterface } from "../hangman";
import {
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { socket } from "../modules";

function Create({
  setUser,
}: {
  setUser: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [state, setState] = useState<gameInitInterface>({
    username: "",
    lives: "",
    numRounds: "",
    rotation: "robin",
    time: "30",
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
        <FormControl>
          <InputLabel htmlFor="username">Enter Username: </InputLabel>
          <Input
            type="text"
            value={state.username}
            onChange={(e) => setState({ ...state, username: e.target.value })}
            id="username"
            name="username"
            inputProps={{ pattern: "^[^s]+(s+[^s]+)*$" }}
            title="Username cannot have leading or trailing spaces"
            onInvalid={(e) => "Please fill out this field"}
            required
          />
          <br />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="lives">Enter Lives: </InputLabel>
          <Input
            type="number"
            value={state.lives}
            onChange={(e) => setState({ ...state, lives: e.target.value })}
            id="lives"
            name="lives"
            inputProps={{ min: 6, max: 10 }}
            onInvalid={(e) => "Please fill out this field"}
            required
          />
          <br />
        </FormControl>
        <FormControl>
          <label htmlFor="numRounds">Enter Number of Rounds:</label>
          <Input
            type="number"
            value={state.numRounds}
            onChange={(e) => setState({ ...state, numRounds: e.target.value })}
            id="numRounds"
            name="numRounds"
            inputProps={{ min: 1 }}
            onInvalid={(e) => "Please fill out this field"}
            required
          />
          <br />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="rotation">Rotation Mode</InputLabel>
          <Select
            name="rotation"
            id="rotation"
            onChange={(e) => setState({ ...state, rotation: e.target.value })}
            onInvalid={(e) => "Please fill out this field"}
            required
          >
            <MenuItem value="robin">Round Robin</MenuItem>
            <MenuItem value="king">King of the Hill</MenuItem>
          </Select>{" "}
        </FormControl>
        <label htmlFor="time">Enter Guess Time: </label>
        <Select
          name="time"
          id="time"
          onInvalid={(e) => "Please fill out this field"}
          required
          onChange={(e) => setState({ ...state, time: e.target.value })}
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
          <option value="inf">Unlimited</option>
        </Select>
        <br />
        <br />
        <Input type="submit" value="Get Game Link"></Input>
      </form>
      {roomID && roomID !== "" && <Redirect to={`/${roomID}`} />}
    </div>
  );
}

export default Create;
