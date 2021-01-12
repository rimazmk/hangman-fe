import React, { useState, useEffect, useRef } from "react";
import { gameStateInterface } from "../hangman";
import { FormControl, Input, InputLabel, Typography } from "@material-ui/core";
import Letters from "./Letters";
import Timer from "./Timer";
import Chat from "./Chat";
import "../css/Game.scss";
import { socket } from "../modules";

const figureMapping = [
  "none.png",
  "head.png",
  "body.png",
  "left_leg.png",
  "right_leg.png",
  "left_arm.png",
  "right_arm.png",
  "hair.png",
  "eyes.png",
  "nose.png",
  "mouth.png",
];

function Game({
  gameState,
  setGameState,
  username,
  roomID,
  mute,
}: {
  gameState: gameStateInterface;
  setGameState: React.Dispatch<React.SetStateAction<gameStateInterface>>;
  username: string;
  roomID: string;
  mute: boolean;
}) {
  const [word, setWord] = useState("");
  const [source, setSource] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const gameHandler = (newState: gameStateInterface) => {
    setGameState(Object.assign({}, newState));
  };

  const updateSong = (source: string) => {
    setSource(source);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  const handleStatus = (status: string) => {
    let newURL: string = "";
    if (status === "timer") {
      newURL = "http://localhost:5000/audio/timer.mp3";
    } else if (status === "correct") {
      newURL = "http://localhost:5000/audio/correct.mp3";
    } else if (status === "incorrect") {
      newURL = "http://localhost:5000/audio/wrong.mp3";
    }

    updateSong(newURL);
  };

  useEffect(() => {
    socket.on("update", gameHandler);
    socket.on("status", handleStatus);
    return () => {
      socket.off("update", gameHandler);
      socket.off("status", handleStatus);
    };
  }, []);

  const validateGuess = () => {
    let userGuess = document.getElementById("guess") as HTMLInputElement;
    if (gameState.guessedWords.includes(userGuess.value)) {
      userGuess.setCustomValidity(
        `${userGuess.value} has already been guessed`
      );
    } else if (!/^[^\s]+(\s+[^\s]+)*$/.test(userGuess.value)) {
      userGuess.setCustomValidity(
        "Guess cannot have leading or trailing spaces"
      );
    } else if (!/^[-\sa-zA-Z]+$/.test(userGuess.value)) {
      userGuess.setCustomValidity(
        "Only alphabetic characters, spaces, and dashes allowed"
      );
    } else if (userGuess.value.length < 2) {
      userGuess.setCustomValidity("Guess must have at least two characters");
    } else {
      userGuess.setCustomValidity("");
    }
  };

  const makeGuess = (guessedEntity: string) => {
    let guessState = Object.assign(
      {},
      { ...gameState, curGuess: guessedEntity }
    );

    let guess = {
      roomID: roomID,
      gameState: guessState,
    };

    socket.emit("guess", guess);

    let message = guessedEntity
      ? `${username} guessed ${guessedEntity}`
      : `${username} ran out of time`;

    let info = {
      roomID: roomID,
      user: "game",
      message: message,
    };
    socket.emit("chat", info);
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

  let guesser_pos: number = gameState.players.indexOf(gameState.guesser);
  let prevGuesser: number =
    (((guesser_pos - 1) % gameState.players.length) +
      gameState.players.length) %
    gameState.players.length;

  if (gameState.players[prevGuesser] === gameState.hanger) {
    prevGuesser =
      (((prevGuesser - 1) % gameState.players.length) +
        gameState.players.length) %
      gameState.players.length;
  }

  return (
    <>
      <div className="players">
        <h2>Active Players: </h2>
        {gameState.players.map((player) => (
          <Typography
            variant="h5"
            style={{ color: player === gameState.guesser ? "blue" : "black" }}
          >
            {player}
          </Typography>
        ))}
        <br />
        <Typography variant="h5">{"Hanger: " + gameState.hanger}</Typography>
        <Typography variant="h5">{"Mode: " + gameState.rotation}</Typography>
      </div>
      <div className="game-container">
        {username === gameState.players[prevGuesser] && source !== "" && (
          <audio
            id="guessAudio"
            autoPlay
            onEnded={() => setSource("")}
            muted={mute}
            ref={audioRef}
          >
            <source src={source} />
          </audio>
        )}
        {username && username !== "" && (
          <div>
            <div className="top-container">
              <h1>
                Round {gameState.round} of {gameState.numRounds}
              </h1>
              {username === gameState.guesser && gameState.time && (
                <div className="timer">
                  <Timer gameState={gameState} makeGuess={makeGuess} />
                </div>
              )}
            </div>
            <Typography variant="h6">
              {"Category: " + gameState.category} <br />
              {"Guesses Remaining: " +
                (gameState.lives - gameState.numIncorrect)}
            </Typography>
            <Typography variant="h3" style={{}} className="word">
              {gameState.guessedWord}
            </Typography>
            <br />
            <img
              className="drawing"
              src={`/images/${figureMapping[gameState.numIncorrect]}`}
            />
            {username === gameState.hanger && (
              <h1 style={{ wordWrap: "break-word" }}>
                {"Word(s): " + gameState.word}
              </h1>
            )}
            <Letters
              onClick={onLetterClick}
              disabled={gameState.guesser !== username}
              guessedLetters={gameState.guessedLetters}
            />
            <br />
            <br />
            <form onSubmit={onFormSubmit}>
              <FormControl>
                <InputLabel htmlFor="guess">Word</InputLabel>
                <Input
                  type="text"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  id="guess"
                  name="guess"
                  inputProps={{
                    maxLength: 50,
                    minLength: 2,
                  }}
                  onInput={(e) => validateGuess()}
                  disabled={gameState.guesser !== username}
                />
              </FormControl>
            </form>
            {/* TODO: Add Unique Key for Child in List */}
            <br />
          </div>
        )}
      </div>
    </>
  );
}

export default Game;
