import React, { useState, useEffect } from "react";
import { gameStateInterface } from "../hangman";
import { socket } from "../modules";

function Wait({
  user,
  roomID,
  gameState,
  handleState,
  setUser,
}: {
  user: string;
  roomID: string;
  gameState: gameStateInterface;
  handleState: React.Dispatch<
    React.SetStateAction<gameStateInterface | undefined>
  >;
  setUser: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [joined, setJoined] = useState(false);
  const [formUser, setFormUser] = useState("");
  const [copy, setCopy] = useState("Copy Link");
  const url = `http://localhost:3000/${roomID}`;

  const handleSubmitJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState.players.includes(formUser)) {
      console.warn("Username is already taken");
      setFormUser("");
    } else if (formUser && formUser !== "") {
      let credentials = {
        roomID: roomID,
        user: formUser,
      };
      setJoined(true);
      setUser(formUser);
      socket.emit("join", credentials);
    } else {
      console.warn("One or more field(s) missing");
    }
  };

  const onButtonClick = () => {
    socket.emit("start", roomID);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        setCopy("Copied!");
      },
      () => {
        setCopy("Failed to Copy");
      }
    );
  };

  useEffect(() => {
    socket.on("update", handleState);
    socket.emit("joinRoom", roomID);
    return () => {
      socket.off("update", handleState);
    };
  }, []);

  return (
    <>
      <p>Players: </p>
      {gameState.players.map((player) => (
        <p key={player}>{player}</p>
      ))}

      {user === gameState.hanger && (
        <>
          <p>Invite your friends: {url}</p>
          <p>
            <button onClick={copyLink}>{copy}</button>
          </p>
        </>
      )}

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
              value={formUser}
              onChange={(e) => setFormUser(e.target.value)}
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
