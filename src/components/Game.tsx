import React, { useState, useEffect } from "react";
import { gameStateInterface } from "../hangman";
import Letters from "./Letters";
import { socket } from "../modules";
import Timer from "./Timer";

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
  const [error, setError] = useState("");
  const gameHandler = (newState: gameStateInterface) => {
    // console.log(newState);
    setGameState(Object.assign({}, newState));
  };

  useEffect(() => {
    socket.on("update", gameHandler);
    return () => {
      socket.off("update", gameHandler);
    };
  }, []);

  const makeGuess = (guessedEntity: string) => {
    let guessState = Object.assign(
      {},
      { ...gameState, curGuess: guessedEntity }
    );

    let guess = {
      user: username,
      roomID: roomID,
      gameState: guessState,
    };

    socket.emit("guess", guess);
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.length < 2) {
      setError("Word cannot be a single character");
      return;
    } else if (gameState.guessedWords.includes(word)) {
      setError(`${word} has already been guessed`);
      return;
    }
    setError("");
    makeGuess(word);
    setWord("");
  };

  const onLetterClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");
    setWord("");
    let ev = e.target as HTMLButtonElement;
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
          <Letters
            onClick={onLetterClick}
            disabled={gameState.guesser !== username}
            guessedLetters={gameState.guessedLetters}
          />
          <br />

          <form onSubmit={onFormSubmit}>
            <label htmlFor="word">Enter Guess: </label>
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              id="word"
              name="word"
              disabled={gameState.guesser !== username}
            ></input>
          </form>
          {error && <p>{error}</p>}
          <br />
          {username === gameState.hanger && (
            <h1>{"Word: " + gameState.word}</h1>
          )}
          <h1>{"Guessed Word: " + gameState.guessedWord}</h1>
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
          <h2>
            {" "}
            Active Players:{" "}
            {gameState.players.map((player) => (
              <>{player} </>
            ))}
          </h2>
          {username === gameState.guesser && (
            <Timer
              gameState={gameState}
              username={username}
              makeGuess={makeGuess}
            />
          )}
        </div>
      )}
      {!username && "game already started"}
    </>
  );
}

export default Game;
