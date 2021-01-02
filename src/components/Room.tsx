import React, { useState, useEffect } from "react";
import { gameStateInterface } from "../hangman";
import Game from "./Game";
import Wait from "./Wait";
import NewWord from "./NewWord";
import axios from "axios";
import { socket } from "../modules";

function Room({ username, roomID }: { username: string; roomID: string }) {
  const [gameState, setGameState] = useState<gameStateInterface>();
  const [user, setUser] = useState(username);
  const [err, setErr] = useState(false);

  const handleLeave = (newState: gameStateInterface) => {
    setGameState(Object.assign({}, newState));
  };

  useEffect(() => {
    const getGameState = async () => {
      let res = await axios.get<gameStateInterface>(
        `http://localhost:5000/?roomID=${roomID}`
      );

      if (res.status === 200) {
        setGameState(res.data);
      } else {
        setErr(true);
      }
    };

    socket.on("leave", handleLeave);
    getGameState();
  }, [roomID]);

  useEffect(() => {
    const cleanup = (e: Event) => {
      e.preventDefault();
      socket.emit("leave", { user: user, roomID: roomID });
    };
    window.addEventListener("unload", cleanup);
    return () => window.removeEventListener("unload", cleanup);
  }, [user, roomID]);

  const render = () => {
    if (
      gameState &&
      gameState.players.length >= gameState!.cap &&
      user === ""
    ) {
      return <p>Sorry, Room is full :(</p>;
    } else if (
      (gameState && user === "") ||
      (gameState && !gameState.gameStart)
    ) {
      return (
        <Wait
          user={user}
          roomID={roomID}
          gameState={gameState!}
          handleState={setGameState}
          setUser={setUser}
        />
      );
    } else if (gameState && gameState.gameStart && gameState.category !== "") {
      return (
        <Game
          username={user}
          roomID={roomID}
          gameState={gameState}
          setGameState={setGameState}
        />
      );
    } else if (gameState && gameState.category === "") {
      return (
        <NewWord
          gameState={gameState}
          setGameState={setGameState}
          user={user}
          roomID={roomID}
        />
      );
    } else {
      // this should never be reached
      return err ? <p>An error occurred</p> : <p>Loading...</p>;
    }
  };

  return <div>{render()}</div>;
}

export default Room;
