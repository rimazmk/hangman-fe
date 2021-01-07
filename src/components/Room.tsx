import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { gameStateInterface } from "../hangman";
import Game from "./Game";
import Wait from "./Wait";
import NewWord from "./NewWord";
import axios from "axios";

import { socket } from "../modules";

function Room({ username }: { username: string }) {
  const [gameState, setGameState] = useState<gameStateInterface>();
  const [user, setUser] = useState(username);
  const { roomID }: { roomID: string } = useParams();
  const [err, setErr] = useState(false);

  const handleLeave = (newState: gameStateInterface) => {
    console.log(newState!.players.length);
    if (newState!.players.length === 0) setErr(true);
    setGameState(Object.assign({}, newState));
  };

  useEffect(() => {
    const getGameState = async () => {
      let res = null;
      try {
        res = await axios.get<gameStateInterface>(
          `http://localhost:5000/?roomID=${roomID}`
        );
      } catch (err) {
        setErr(true);
      } finally {
        if (res && res.status === 200) {
          setGameState(res.data);
        }
      }
    };

    socket.on("leave", handleLeave);
    console.log();
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
    if (err) {
      return <p>Room does not exist</p>;
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
      return <p>Loading..</p>;
    }
  };

  return <div>{render()}</div>;
}

export default Room;
