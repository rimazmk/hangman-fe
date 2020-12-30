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
  const [joined, setJoined] = useState(false);
  const handleSubmitJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && user !== "") {
      let credentials = {
        roomID: roomID,
        user: user,
      };
      setJoined(true);
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

  const handleJoin = (newState: gameStateInterface) => {
    console.log(newState);
    setGameState({ ...gameState, players: newState.players });
  };

  useEffect(() => {
    socket.on("start", handleStart);
    socket.on("join", handleJoin);
    return () => {
      socket.close();
    };
  }, []);

  const url = `http://localhost:3000/?roomID=${roomID}`;

  return (
    <>
      <p>Players: {gameState.players.map((n) => `${n} `)}</p>

      {user === gameState.hanger && <p>Share this link with friends: {url}</p>}

      {user === gameState.hanger && gameState.players.length >= 2 && (
        <button onClick={onButtonClick}>Start game!</button>
      )}

      {/* Add functionality for changing username */}
      {user !== gameState.hanger && !joined && (
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
