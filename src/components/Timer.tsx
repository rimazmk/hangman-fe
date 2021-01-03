import React, { useState, useEffect, useRef } from "react";
import { gameStateInterface } from "../hangman";

function Timer({
  gameState,
  username,
  makeGuess,
}: {
  gameState: gameStateInterface;
  username: string;
  makeGuess: (guessedEntity: string) => void;
}) {
  const [time, setTime] = useState(gameState.time);
  const timerRef = useRef<number>();

  useEffect(() => {
    clearTimeout(timerRef.current);
    setTime(gameState.time);
  }, [gameState.guessedWord, gameState.numIncorrect, gameState.time]);

  useEffect(() => {
    if (time > 0) {
      timerRef.current = window.setTimeout(() => setTime(time - 1), 1000);
    } else {
      makeGuess("");
    }

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [time]);

  return <div>{time !== 0 && <h2>Time Remaining: {time}</h2>}</div>;
}

export default Timer;