import React, { useState, useEffect, useCallback } from "react";
import { TextField, Button, InputLabel, Typography } from "@mui/material";
import { gameStateInterface } from "../hangman";
import Standings from "./Standings";
import { socket } from "../modules";
import { SERVER_URL } from "../env";

const NewWord = ({
  gameState,
  setGameState,
  user,
  roomID,
  mute,
}: {
  gameState: gameStateInterface;
  setGameState: React.Dispatch<
    React.SetStateAction<gameStateInterface | undefined>
  >;
  user: string;
  roomID: string;
  mute: boolean;
}) => {
  const [word, setWord] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const info = {
      category: category,
      word: word,
      user: user,
      roomID: roomID,
    };
    setWord("");
    setCategory("");
    socket.emit("newRound", info);
  };

  const gameHandler = useCallback((newState: gameStateInterface) => {
    setGameState(Object.assign({}, newState));
    // eslint-disable-next-line
  }, []);

  const validateWord = () => {
    let userWord = document.getElementById("word") as HTMLInputElement;
    if (!/^[^\s]+(\s+[^\s]+)*$/.test(userWord.value)) {
      userWord.setCustomValidity("Word cannot have leading or trailing spaces");
    } else if (!/^[-\sa-zA-Z]+$/.test(userWord.value)) {
      userWord.setCustomValidity(
        "Only alphabetic characters, spaces, and dashes allowed"
      );
    } else if (userWord.value.length < 2) {
      userWord.setCustomValidity("Word must have at least two characters");
    } else {
      userWord.setCustomValidity("");
    }
  };

  useEffect(() => {
    socket.on("update", gameHandler);

    if (gameState.word !== "" && user === gameState.hanger) {
      let wordWin = {
        roomID: roomID,
        user: "word",
        message: `The word was ${gameState.word}`,
        effects: true,
      };

      socket.emit("chat", wordWin);
    }

    return () => {
      socket.off("update", gameHandler);
    };
    // eslint-disable-next-line
  }, [gameHandler]);

  const next =
    gameState.players[
      (gameState.players.indexOf(gameState.hanger) + 1) %
        gameState.players.length
    ];

  const render = () => {
    let next_hanger: string;
    if (gameState.round === 0) {
      next_hanger = gameState.hanger;
    } else if (gameState.rotation === "king") {
      if (gameState.numIncorrect === gameState.lives) {
        next_hanger = gameState.hanger;
      } else {
        next_hanger = gameState.guesser;
      }
    } else {
      next_hanger = next;
    }

    if (gameState.round !== gameState.numRounds) {
      return (
        <>
          {gameState.word !== "" &&
            gameState.rotation === "robin" &&
            gameState.numIncorrect !== gameState.lives &&
            user === gameState.guesser && (
              <>
                <h2>YOU WIN! :)</h2>
                <audio autoPlay muted={mute}>
                  <source src={`${SERVER_URL}/audio/win.mp3`} />
                </audio>
              </>
            )}

          {gameState.word !== "" &&
            gameState.rotation === "robin" &&
            gameState.numIncorrect === gameState.lives &&
            user === gameState.hanger && (
              <>
                <h2>YOU WIN! :)</h2>
                <audio autoPlay muted={mute}>
                  <source src={`${SERVER_URL}/audio/win.mp3`} />
                </audio>
              </>
            )}

          {user === next_hanger ? (
            <div>
              {gameState.word !== "" && gameState.rotation === "king" && (
                <>
                  <h2>YOU WIN! :)</h2>
                  <audio autoPlay muted={mute}>
                    <source src={`${SERVER_URL}/audio/win.mp3`} />
                  </audio>
                </>
              )}

              <form onSubmit={handleSubmit}>
                <InputLabel htmlFor="word">
                  Enter {gameState.word ? "New" : ""} Word(s):
                </InputLabel>
                <TextField
                  type="text"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  id="word"
                  name="word"
                  onInput={(e) => validateWord()}
                  inputProps={{ maxLength: 50, minLength: 2 }}
                  onInvalid={(e) => "Please fill out this field"}
                  required
                />
                <br />
                <br />
                <InputLabel htmlFor="category">
                  Enter {gameState.word ? "New" : ""} Category:
                </InputLabel>
                <TextField
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  id="category"
                  name="category"
                  onInvalid={(e) => "Please fill out this field"}
                  required
                />
                <br />
                <br />
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </form>
            </div>
          ) : (
            <div>
              {gameState.word !== "" && user !== gameState.hanger && (
                <Typography variant="h6">
                  The word(s) was {gameState.word}
                </Typography>
              )}
              <p>
                {next_hanger} is {gameState.word ? "now" : ""} the hanger
              </p>
              <p>Waiting for a {gameState.word ? "new" : ""} word(s)...</p>
            </div>
          )}
        </>
      );
    } else {
      return (
        <Standings
          gameState={gameState}
          setGameState={setGameState}
          roomID={roomID}
          user={user}
        />
      );
    }
  };

  return <div>{render()}</div>;
};

export default NewWord;
