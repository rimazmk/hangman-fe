import React, { useState, useEffect } from "react";
import { gameStateInterface } from "../hangman";
import Game from "./Game";
import Wait from "./Wait";
import NewWord from "./NewWord";
import axios from "axios";

function Room({ username, roomID }: { username: string; roomID: string }) {
  const [gameState, setGameState] = useState<gameStateInterface>();
  const [user, setUser] = useState(username);
  console.log(`ROOM ID: ${roomID}`);

  useEffect(() => {
    const getGameState = async () => {
      let res = await axios.get<gameStateInterface>(
        `http://localhost:5000/?roomID=${roomID}`
      );

      if (res.status === 200) setGameState(res.data);
      console.log(`GAMESTATE:  ${res.data}`);
    };

    getGameState();
  }, []);

  const render = () => {
    if (gameState && gameState.gameStart && gameState.category !== "") {
      return (
        <Game
          username={user}
          roomID={roomID}
          gameState={gameState}
          setGameState={setGameState}
        />
      );
    } else if (gameState && !gameState.gameStart) {
      return (
        <Wait
          user={user}
          roomID={roomID}
          gameState={gameState!}
          setGameState={setGameState}
          setUser={setUser}
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
      return <p>An error occurred</p>;
    }
  };

  return <div>{render()}</div>;
}

export default Room;
