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
      // socket.username = formUser;
      socket.emit("join", credentials);
    } else {
      console.warn("One or more field(s) missing");
    }
  };

  const onButtonClick = () => {
    socket.emit("start", roomID);
  };

  useEffect(() => {
    socket.on("update", handleState);
    socket.emit("joinRoom", roomID);
    return () => {
      socket.emit("leave", { user: user, roomID: roomID });
      socket.off("update", handleState);
    };
  }, []);

  const url = `http://localhost:3000/?roomID=${roomID}`;

  return (
    <>
      <p>Players: </p>
      {/* Change keys to be player usernames after ensuring unique usernames */}
      {gameState.players.map((player, index) => (
        <p key={index}>{player}</p>
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
