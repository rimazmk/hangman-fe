import React, { useState, useEffect } from "react";
import { gameStateInterface } from "../hangman";
import { socket } from "../modules";
// import axios from "axios";

function Wait({
  username,
  roomID,
  gameState,
  setGameState,
}: {
  username: string;
  roomID: string;
  gameState: gameStateInterface;
  setGameState: React.Dispatch<
    React.SetStateAction<gameStateInterface | undefined>
  >;
}) {
  const [user, setUser] = useState(username);

  const handleSubmitJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && user !== "") {
      let credentials = {
        roomID: roomID,
        user: username,
      };
      socket.emit("join", credentials);
    } else {
      console.warn("One or more field(s) missing");
    }
  };

  const onButtonClick = () => {
    socket.emit("start", roomID);
  };

  const handleStart = (newState: gameStateInterface) => {
    setGameState({ ...gameState, gameStart: newState.gameStart });
  };

  const handleJoin = (newPlayers: string[]) => {
    setGameState({ ...gameState, players: newPlayers });
  };

  useEffect(() => {
    socket.on("start", handleStart);
    socket.on("join", handleJoin);
    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      <p>Players: {gameState.players}</p>

      {user === gameState.hanger && gameState.players.length >= 2 && (
        <button onClick={onButtonClick}>Start game!</button>
      )}

      {/* Add functionality for changing username */}
      {!gameState.players.includes(user) && (
        <div>
          <form onSubmit={handleSubmitJoin}>
            Enter Username:
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              id="username"
              name="username"
            ></input>
          </form>
        </div>
      )}
    </>
  );
}

export default Wait;
