import React, { useState, useEffect, useRef } from "react";
import { gameStateInterface } from "../hangman";
import { socket } from "../modules";
import { InputLabel, TextField, Button } from "@material-ui/core";

function Wait({
  user,
  roomID,
  gameState,
  handleState,
  setUser,
}: {
  user: string;
  roomID: string;
  gameState: gameStateInterface;
  handleState: React.Dispatch<
    React.SetStateAction<gameStateInterface | undefined>
  >;
  setUser: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [joined, setJoined] = useState(false);
  const [formUser, setFormUser] = useState("");
  const [copy, setCopy] = useState("Copy Link");
  const timerRef = useRef<number>();
  const url = `http://localhost:3000/${roomID}`;

  const handleSubmitJoin = (e: React.FormEvent) => {
    e.preventDefault();
    let credentials = {
      roomID: roomID,
      user: formUser,
    };
    setJoined(true);
    setUser(formUser);
    socket.emit("join", credentials);
  };

  const validateUsername = () => {
    let username = document.getElementById("username") as HTMLInputElement;
    if (gameState.players.includes(username.value)) {
      username.setCustomValidity("Username is already taken");
    } else {
      username.setCustomValidity("");
    }
  };

  const onButtonClick = () => {
    socket.emit("start", roomID);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        clearTimeout(timerRef.current);
        setCopy("Copied!");
        timerRef.current = window.setTimeout(() => setCopy("Copy"), 5000);
      },
      () => {
        clearTimeout(timerRef.current);
        setCopy("Failed to Copy");
        timerRef.current = window.setTimeout(() => setCopy("Copy"), 5000);
      }
    );
  };

  useEffect(() => {
    socket.on("update", handleState);
    socket.emit("joinRoom", roomID);
    return () => {
      socket.off("update", handleState);
    };
  }, []);

  const render = () => {
    if (
      gameState &&
      gameState.players.length >= gameState!.cap &&
      user === ""
    ) {
      return <p>Sorry, Room is full </p>;
    } else {
      return (
        <>
          <p>Players: </p>
          {gameState.players.map((player) => (
            <p key={player}>{player}</p>
          ))}

          {user === gameState.hanger && (
            <>
              Share this link with your friends:
              <p>
                {url}{" "}
                <Button variant="contained" onClick={copyLink}>
                  {copy}
                </Button>
              </p>
            </>
          )}

          {user === gameState.hanger && gameState.players.length >= 2 && (
            <Button variant="contained" onClick={onButtonClick}>
              Start game!
            </Button>
          )}
          {/* Add functionality for changing username */}
          {user !== gameState.hanger && !joined && (
            <div>
              <form onSubmit={handleSubmitJoin}>
                <InputLabel htmlFor="username">Username</InputLabel>
                <TextField
                  type="text"
                  value={formUser}
                  inputProps={{ pattern: "^[^s]+(s+[^s]+)*$" }}
                  title="Username cannot have leading or trailing spaces"
                  onChange={(e) => setFormUser(e.target.value)}
                  onInput={(e) => validateUsername()}
                  id="username"
                  name="username"
                />
              </form>
            </div>
          )}
        </>
      );
    }
  };

  return <div>{render()}</div>;
}

export default Wait;
