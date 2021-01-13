import React, { useState, useEffect, useRef } from "react";
import { gameStateInterface } from "../hangman";

function Timer({
  gameState,
  makeGuess,
}: {
  gameState: gameStateInterface;
  makeGuess: (guessedEntity: string) => void;
}) {
  const [time, setTime] = useState(gameState.time);
  const [change, setChange] = useState(false);
  const timerRef = useRef<number>();

  useEffect(() => {
    clearTimeout(timerRef.current);
    setTime(gameState.time);
    setChange((c) => !c);
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
  }, [time, change, makeGuess]);

  return <>{time !== 0 && <h2>Time Remaining: {time}</h2>}</>;
}

export default Timer;
