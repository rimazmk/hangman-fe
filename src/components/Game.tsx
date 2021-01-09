import React, { useState, useEffect } from "react";
import { gameStateInterface } from "../hangman";
import { FormControl, Input, InputLabel } from "@material-ui/core";
import Letters from "./Letters";
import Timer from "./Timer";
import Chat from "./Chat";
import { socket } from "../modules";

function Game({
  gameState,
  setGameState,
  username,
  roomID,
}: {
  gameState: gameStateInterface;
  setGameState: React.Dispatch<
    React.SetStateAction<gameStateInterface | undefined>
  >;
  username: string;
  roomID: string;
}) {
  const [word, setWord] = useState("");
  const gameHandler = (newState: gameStateInterface) => {
    console.log(newState);
    setGameState(Object.assign({}, newState));
  };

  useEffect(() => {
    socket.on("update", gameHandler);
    return () => {
      socket.off("update", gameHandler);
    };
  }, []);

  const validateWord = () => {
    let userWord = document.getElementById("word") as HTMLInputElement;
    if (gameState.guessedWords.includes(userWord.value)) {
      userWord.setCustomValidity(`${userWord.value} has already been guessed`);
    } else {
      userWord.setCustomValidity("");
    }
  };

  const makeGuess = (guessedEntity: string) => {
    console.log(guessedEntity);
    let guessState = Object.assign(
      {},
      { ...gameState, curGuess: guessedEntity }
    );

    let guess = {
      roomID: roomID,
      gameState: guessState,
    };

    socket.emit("guess", guess);
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    makeGuess(word);
    setWord("");
  };

  const onLetterClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setWord("");
    let ev = e.currentTarget as HTMLButtonElement;
    makeGuess(ev.value);
  };

  const displayGuesses = () => {
    return gameState.guessedLetters.map((letter) => {
      return <>{letter} </>;
    });
  };

  const displayWords = () => {
    return gameState.guessedWords.map((word) => {
      return <div key={word}>{word}</div>;
    });
  };

  return (
    <>
      {username && username !== "" && (
        <div>
          <h1>Round: {gameState.round}</h1>
          <Letters
            onClick={onLetterClick}
            disabled={gameState.guesser !== username}
            guessedLetters={gameState.guessedLetters}
          />
          <br />
          <br />
          <form onSubmit={onFormSubmit}>
            <FormControl>
              <InputLabel htmlFor="word">Word</InputLabel>
              <Input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                id="word"
                name="word"
                inputProps={{
                  pattern: "^[-sa-zA-Z]+$",
                  maxLength: 50,
                  minLength: 2,
                }}
                title="Only alphabetic characters, spaces, and dashes allowed"
                onInput={(e) => validateWord()}
                disabled={gameState.guesser !== username}
              />
            </FormControl>
          </form>
          <br />
          {username === gameState.hanger && (
            <h1>{"Word(s): " + gameState.word}</h1>
          )}
          <h1>{"Guessed Word(s): " + gameState.guessedWord}</h1>
          <h2>{"Category: " + gameState.category}</h2>
          <h2>{"Guesser: " + gameState.guesser}</h2>
          <h2>{"Hanger: " + gameState.hanger}</h2>
          <h2>
            {"Guesses Remaining: " + (gameState.lives - gameState.numIncorrect)}
          </h2>
          <h2>{"Letters Guessed: "}</h2>
          {displayGuesses()}
          <h2>{"Words Guessed: "}</h2>
          {displayWords()}
          <h2>Player: {username}</h2>
          {/* TODO: Add Unique Key for Child in List */}
          <h2>
            Active Players:{" "}
            {gameState.players.map((player) => (
              <>{player} </>
            ))}
          </h2>
          <br />
          {username === gameState.guesser && gameState.time && (
            <Timer gameState={gameState} makeGuess={makeGuess} />
          )}
          <br />
          <br />
          <div>
            <Chat user={username} roomID={roomID} />
          </div>
        </div>
      )}
    </>
  );
}

export default Game;
