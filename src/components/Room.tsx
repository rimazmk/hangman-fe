import React, { useState, useEffect } from "react";
import { gameStateInterface } from "../hangman";
import Game from "./Game";
import Wait from "./Wait";
import axios from "axios";

function Room({ username, roomID }: { username: string; roomID: string }) {
  const [gameState, setGameState] = useState<gameStateInterface>();

  useEffect(() => {
    const getGameState = async () => {
      let res = await axios.get<gameStateInterface>(
        `http://localhost:5000/?roomID=${roomID}`
      );

      setGameState(res.data);
    };

    getGameState();
  }, []);

  return (
    <div>
      {gameState && gameState.gameStart ? (
        <Game username={username} gameID={roomID} gameState={gameState} />
      ) : (
        <Wait
          username={username}
          roomID={roomID}
          gameState={gameState!}
          setGameState={setGameState}
        />
      )}
    </div>
  );
}

export default Room;
