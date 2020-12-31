import React, { useState, useEffect } from "react";
import { gameStateInterface } from "../hangman";
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
  const [error, setError] = useState("");

  const checkInput = (): boolean => {
    let copy = Object.assign("", word);
    copy.replace(/[^a-z\s-]/gi, "");
    // console.log(copy);
    return word.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (category && word) {
      if (checkInput()) setError("Only alphabetic, spaces, and dashed allowed");
      const info = { category: category, word: word, roomID: roomID };
      socket.emit("newRound", info);
    } else {
      setError("One or more fields are missing");
    }
  };

  const gameHandler = (newState: gameStateInterface) => {
    setGameState(Object.assign({}, newState));
  };

  useEffect(() => {
    socket.on("response", gameHandler);
    return () => {
      socket.off("response", gameHandler);
    };
  }, []);

  return (
    <>
      {gameState.hanger === user ? (
        <div>
          <p>YOU WIN! :)</p>
          <form onSubmit={handleSubmit}>
            Enter New Word:
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              id="word"
              name="word"
            ></input>
            <br />
            Enter New Category:
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              id="category"
              name="category"
            ></input>
            <br />
            <input type="submit" value="Submit"></input>
          </form>
        </div>
      ) : (
        <div>
          <p>The word was {gameState.word}</p>
          <p>{gameState.hanger} is now the hanger</p>
          <p>Waiting for a new word...</p>
        </div>
      )}
      {error && error !== "" && <p>error</p>}
    </>
  );
};

export default NewWord;
