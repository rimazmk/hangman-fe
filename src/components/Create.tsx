import React, { useState, useEffect } from "react";
import { gameInitInterface, gameStateInterface } from "../hangman";
import { socket } from "../modules";

function Create({
  setUser,
  setRoom,
}: {
  setUser: React.Dispatch<React.SetStateAction<string>>;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [state, setState] = useState<gameInitInterface>({
    username: "",
    lives: "",
    time: "30",
  });

  // const getUrlCode = (): string => {
  //   return gameURL.slice(-11, -1);
  // };

  const handleLink = (info: {
    gameState: gameStateInterface;
    roomID: string;
  }) => {
    // console.log(`this is my username:  ${state.username}`);
    setUser(info.gameState.players[0]); // why doesn't state.username itself work
    setRoom(info.roomID);
  };

  useEffect(() => {
    socket.on("link", handleLink);
    return () => {
      socket.off("link", handleLink);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.username && state.lives && state.time) {
      socket.emit("create", state);
    } else {
      console.warn("One or more fields are missing");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Enter Username: </label>
        <input
          type="text"
          value={state.username}
          onChange={(e) => setState({ ...state, username: e.target.value })}
          id="username"
          name="username"
        ></input>
        <br />
        <label htmlFor="lives">Enter Lives: </label>
        <input
          type="number"
          value={state.lives}
          onChange={(e) => setState({ ...state, lives: e.target.value })}
          id="lives"
          name="lives"
          min="6"
          max="10"
        ></input>
        <br />
        <label htmlFor="time">Enter Guess Time: </label>
        <select
          name="time"
          id="time"
          onChange={(e) => setState({ ...state, time: e.target.value })}
        >
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
          <option value="60">60</option>
          <option value="70">70</option>
          <option value="80">80</option>
          <option value="90">90</option>
        </select>
        <br />
        <br />
        <input type="submit" value="Get Game Link"></input>
      </form>
    </div>
  );
}

export default Create;
