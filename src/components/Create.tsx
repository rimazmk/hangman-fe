import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "react-router";
import {
  feedbackForm,
  gameInitInterface,
  gameStateInterface,
} from "../hangman";
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
import axios from "axios";

function Create({
  setUser,
}: {
  setUser: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [roomID, setRoomID] = useState("");
  const [status, setStatus] = useState("SEND");
  const timerRef = useRef<number>();
  const [state, setState] = useState<gameInitInterface>({
    username: "",
    lives: "6",
    numRounds: "3",
    rotation: "robin",
    time: "10",
  });
  const [form, setForm] = useState<feedbackForm>({
    first: "",
    last: "",
    email: "",
    feedback: "",
  });

  const handleLink = (info: {
    gameState: gameStateInterface;
    roomID: string;
  }) => {
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
    setState({ ...state, username: "" });
    socket.emit("create", state);
  };

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus("Sent!");
    const res = await axios.post("http://localhost:5000/feedback/", {
      data: form,
    });

    setForm({ first: "", last: "", email: "", feedback: "" });
    timerRef.current = window.setTimeout(() => setStatus("Send"), 5000);
  };

  return (
    <>
      <div className="create-container">
        <div className="info-container">
          <Typography variant="h5">
            About <br />
          </Typography>
          hangmanonline.io is a free online platform to play Hangman with your
          friends. A player can create a game by filling out the form above and
          can invite his/her friends by sharing the URL that they'll receive
          afterwards.
          <br />
          <br />
          <Typography variant="h5">
            How to Play <br />
          </Typography>
          When it's your turn to be the "hanger", choose a word and category you
          think could stump, or even get a laugh out of your friends.
          Alternatively, if you're a "guesser", try to either guess an
          individual letter to be in the word or, if you're feeling confident,
          the entire word itself. Make sure to keep an eye on the timer and the
          number of lives the guessers have at all times! If you run out of time
          or guess wrong you lose a life, and if you run out of lives, the
          "hanger" wins! Once you've finished, you can continue the fun by
          trying out the different rotation modes as well as varying the guess
          time and the number of lives!
          <br />
          <br />
          <Typography variant="h5">
            Feedback <br />
          </Typography>
          We appreciate your feedback! Please fill out the below form to convey
          any suggestions you have to improve this website.
          <br />
          <br />
          <form onSubmit={handleForm}>
            <InputLabel htmlFor="first">First Name:</InputLabel>
            <TextField
              type="text"
              value={form.first}
              onChange={(e) => setForm({ ...form, first: e.target.value })}
              id="first"
              name="first"
              disabled={status === "Sent!"}
              required
            />
            <br />
            <br />
            <InputLabel htmlFor="last">Last Name:</InputLabel>
            <TextField
              type="text"
              value={form.last}
              onChange={(e) => setForm({ ...form, last: e.target.value })}
              id="last"
              name="last"
              disabled={status === "Sent!"}
              required
            />
            <br />
            <br />
            <InputLabel htmlFor="email">E-mail:</InputLabel>
            <TextField
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              id="email"
              name="email"
              disabled={status === "Sent!"}
              required
            />
            <br />
            <br />
            <InputLabel htmlFor="comment">Feedback:</InputLabel>
            <TextField
              type="text"
              multiline
              rows={4}
              value={form.feedback}
              onChange={(e) => setForm({ ...form, feedback: e.target.value })}
              id="comment"
              name="comment"
              disabled={status === "Sent!"}
              required
            />
            <br />
            <br />
            <Button variant="contained" color="primary" type="submit">
              {status}
            </Button>
          </form>
        </div>
        <form
          onSubmit={handleSubmit}
          style={{ minWidth: "225px", maxWidth: "400px", margin: "auto 0" }}
        >
          <Typography variant="h4">Play</Typography>
          <br />
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
              onChange={(e) =>
                setState({ ...state, numRounds: e.target.value })
              }
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
      </div>
      {roomID && roomID !== "" && <Redirect to={`/${roomID}`} />}
    </>
  );
}

export default Create;
