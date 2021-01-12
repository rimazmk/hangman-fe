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
  Typography,
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

  const validateUsername = () => {
    let username = document.getElementById("username") as HTMLInputElement;
    if (!/^[^\s]+(\s+[^\s]+)*$/.test(username.value)) {
      username.setCustomValidity(
        "Username cannot have leading or trailing spaces"
      );
    } else if (username.value.length > 20) {
      username.setCustomValidity(
        "Username must be between 1 and 20 characters"
      );
    } else {
      username.setCustomValidity("");
    }
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
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "300px", margin: "auto" }}
      >
        <FormGroup>
          <TextField
            type="text"
            value={state.username}
            onChange={(e) => setState({ ...state, username: e.target.value })}
            id="username"
            name="username"
            label="Username"
            onInput={() => validateUsername()}
            onInvalid={(e) => "Please fill out this field"}
            variant="filled"
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
            variant="filled"
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
            variant="filled"
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
              variant="filled"
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
              variant="filled"
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
            Create Game
          </Button>
          <br />
          <br />
        </FormGroup>
      </form>
      <Typography variant="h5">
        About <br />
      </Typography>
      hangmanonline.io is a free online platform to play Hangman with your
      friends. A player can create a game by filling out the form above and can
      invite his/her friends by sharing the URL that they'll receive afterwards.
      <br />
      <br />
      <Typography variant="h5">
        How to Play <br />
      </Typography>
      When it's your turn to be the "hanger", choose a word and category you
      think could stump, or even get a laugh out of your friends. Alternatively,
      if you're a "guesser", try to either guess an individual letter to be in
      the word or, if you're feeling confident, the entire word itself. Make
      sure to keep an eye on the timer and the number of lives the guessers have
      at all times! If you run out of time or guess wrong you lose a life, and
      if you run out of lives, the "hanger" wins! Once you've finished, you can
      continue the fun by trying out the different rotation modes as well as
      varying the guess time and the number of lives!
      <br />
      <br />
      <Typography variant="h5">
        Scoring <br />
      </Typography>
      If a guesser completes the word, he/she gets 30 points. All other correct
      guesses are worth 15 points. Though incorrect guesses cause a guesser to
      lose 5 points, running out of time does not change a guesser's score.
      <br />
      {roomID && roomID !== "" && <Redirect to={`/${roomID}`} />}
    </div>
  );
}

export default Create;
