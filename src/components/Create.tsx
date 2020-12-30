import React, { useState, useEffect } from "react";
import { gameInitInterface, gameStateInterface } from "../hangman";
import logo from "../logo.svg";
import Letters from "./Letters";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

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
      socket.close();
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

  const onLetterClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let ev = e.target as HTMLButtonElement;

    let guessState = Object.assign({}, gameState);
    guessState.curGuess = ev.value;

    let guess = {
      user: state.username,
      roomID: getUrlCode(),
      gameState: guessState,
    };
    console.log(guess);
    socket.emit("guess", guess);
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
        <br />
        <input type="submit" value="Get Game Link"></input>
      </form>
      <button
        onClick={async () => {
          let code = getUrlCode();
          let res = await axios.get<gameInitInterface>(
            `http://localhost:5000/room/${code}`
          );
          console.log(res.data);
        }}
      >
        Get state
      </button>
      <p>
        Share this link with friends :) <a href={gameURL}>{gameURL}</a>
      </p>
      <Letters onClick={onLetterClick} />
      <br />
      {JSON.stringify(gameState)}
    </div>
  );
}

export default Create;
