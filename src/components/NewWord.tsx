import React, { useState, useEffect } from "react";
import { TextField, Button, InputLabel, Typography } from "@material-ui/core";
import { gameStateInterface } from "../hangman";
import Standings from "./Standings";
import { socket } from "../modules";

const NewWord = ({
  gameState,
  setGameState,
  user,
  roomID,
}: {
  gameState: gameStateInterface;
  setGameState: React.Dispatch<
    React.SetStateAction<gameStateInterface | undefined>
  >;
  user: string;
  roomID: string;
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
    socket.emit("newRound", info);
  };

  const gameHandler = (newState: gameStateInterface) => {
    setGameState(Object.assign({}, newState));
  };

  const validateWord = () => {
    let userWord = document.getElementById("word") as HTMLInputElement;
    if (!/^[^\s]+(\s+[^\s]+)*$/.test(userWord.value)) {
      userWord.setCustomValidity("Word cannot have leading or trailing spaces");
    } else if (!/^[-\sa-zA-Z]+$/.test(userWord.value)) {
      userWord.setCustomValidity(
        "Only alphabetic characters, spaces, and dashes allowed"
      );
    } else {
      userWord.setCustomValidity("");
    }
  };

  useEffect(() => {
    socket.on("response", gameHandler);
    return () => {
      socket.off("response", gameHandler);
    };
  }, []);

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
            user === gameState.guesser && <p>YOU WIN! :)</p>}

          {gameState.word !== "" &&
            gameState.rotation === "robin" &&
            gameState.numIncorrect === gameState.lives &&
            user === gameState.hanger && <p>YOU WIN! :)</p>}

          {user === next_hanger ? (
            <div>
              {gameState.word !== "" && gameState.rotation === "king" && (
                <p>YOU WIN! :)</p>
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
      return <Standings gameState={gameState} />;
    }
  };

  return <div>{render()}</div>;
};

export default NewWord;
