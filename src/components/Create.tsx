import React, { useState, useEffect } from "react";
import { gameInitInterface, gameStateInterface } from "../hangman";
import axios from "axios";

import { socket } from "../modules";

function Create({
  setUser,
  setRoom,
}: {
  setUser: React.Dispatch<React.SetStateAction<string>>;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [state, setState] = useState<gameInitInterface>({
    category: "",
    username: "",
    word: "",
    lives: "",
  });

  const [gameState, setGameState] = useState<gameStateInterface>();
  const [gameURL, setGameURL] = useState("");

  const getUrlCode = (): string => {
    return gameURL.slice(-11, -1);
  };

  const handleLink = (info: {
    gameState: gameStateInterface;
    roomID: string;
  }) => {
    setGameURL(info.roomID);
    setGameState(Object.assign({}, info.gameState));
    console.log(`this is my username:  ${state.username}`);
    setUser(info.gameState.players[0]); // why doesn't state.username itself work
    setRoom(info.roomID);
  };

  const gameHandler = (newState: gameStateInterface) => {
    console.log("run");
    console.log(newState);
    setGameState(Object.assign({}, newState));
  };

  useEffect(() => {
    socket.on("link", handleLink);
    socket.on("guess", gameHandler);
    return () => {
      socket.off("link", handleLink);
      socket.off("guess", gameHandler);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.category && state.username && state.word) {
      socket.emit("create", state);
    } else {
      console.warn("One or more field(s) missing");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        Enter Username:
        <input
          type="text"
          value={state.username}
          onChange={(e) => setState({ ...state, username: e.target.value })}
          id="username"
          name="username"
        ></input>
        <br />
        Enter First Word:
        <input
          type="text"
          value={state.word}
          onChange={(e) => setState({ ...state, word: e.target.value })}
          id="word"
          name="word"
        ></input>
        <br />
        Enter Category:
        <input
          type="text"
          value={state.category}
          onChange={(e) => setState({ ...state, category: e.target.value })}
          id="category"
          name="category"
        ></input>
        <br />
        Enter Lives:
        <input
          type="number"
          value={state.lives}
          onChange={(e) => setState({ ...state, lives: e.target.value })}
          id="lives"
          name="lives"
          min="6"
          max="10"
        ></input>
        <br />
        <br />
        <input type="submit" value="Get Game Link"></input>
      </form>
      <p>
        Share this link with friends :) <a href={gameURL}>{gameURL}</a>
      </p>
    </div>
  );
}

export default Create;
