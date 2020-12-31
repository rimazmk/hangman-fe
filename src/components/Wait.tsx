import React, { useState, useEffect } from "react";
import { gameStateInterface } from "../hangman";
import { socket } from "../modules";

function Wait({
  user,
  roomID,
  gameState,
  setGameState,
  setUser,
}: {
  user: string;
  roomID: string;
  gameState: gameStateInterface;
  setGameState: React.Dispatch<
    React.SetStateAction<gameStateInterface | undefined>
  >;
  setUser: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [joined, setJoined] = useState(false);
  const handleSubmitJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && user !== "") {
      let credentials = {
        roomID: roomID,
        user: user,
      };
      setJoined(true);
      setUser(user);
      socket.emit("join", credentials);
    } else {
      console.warn("One or more field(s) missing");
    }
  };

  const onButtonClick = () => {
    socket.emit("start", roomID);
  };

  const handleStart = (newState: gameStateInterface) => {
    // console.log(newState);
    setGameState(Object.assign({}, newState));
  };

  const handleJoin = (newState: gameStateInterface) => {
    setGameState(Object.assign({}, newState));
  };

  useEffect(() => {
    socket.on("start", handleStart);
    socket.on("join", handleJoin);
    return () => {
      socket.off("start", handleStart);
      socket.off("join", handleJoin);
    };
  }, []);

  const url = `http://localhost:3000/?roomID=${roomID}`;

  return (
    <>
      <p>Players: </p>
      {gameState.players.map((n) => (
        <p>{n}</p>
      ))}

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
