import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import { gameInitInterface, gameStateInterface } from "../hangman";
import { socket } from "../modules";

function Create({
  setUser,
}: {
  setUser: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [state, setState] = useState<gameInitInterface>({
    username: "",
    lives: "",
    numRounds: "",
    rotation: "robin",
    time: "30",
  });
  const [roomID, setRoomID] = useState("");

  const handleLink = (info: {
    gameState: gameStateInterface;
    roomID: string;
  }) => {
    console.log(info);
    setUser(info.gameState.players[0]); // why doesn't state.username itself work
    setRoomID(info.roomID);
  };

  useEffect(() => {
    socket.on("link", handleLink);
    return () => {
      socket.off("link", handleLink);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit("create", state);
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
          onInvalid={(e) => "Please fill out this field"}
          required
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
          onInvalid={(e) => "Please fill out this field"}
          required
        ></input>
        <br />
        <label htmlFor="numRounds">Enter Number of Rounds:</label>
        <input
          type="number"
          value={state.numRounds}
          onChange={(e) => setState({ ...state, numRounds: e.target.value })}
          id="numRounds"
          name="numRounds"
          min="1"
          onInvalid={(e) => "Please fill out this field"}
          required
        ></input>
        <br />
        <label htmlFor="rotation">Rotation Mode:</label>
        <select
          name="rotation"
          id="rotation"
          onChange={(e) => setState({ ...state, rotation: e.target.value })}
          onInvalid={(e) => "Please fill out this field"}
          required
        >
          <option value="robin">Round Robin</option>
          <option value="king">King of the Hill</option>
        </select>{" "}
        <label htmlFor="time">Enter Guess Time: </label>
        <select
          name="time"
          id="time"
          onInvalid={(e) => "Please fill out this field"}
          required
          onChange={(e) => setState({ ...state, time: e.target.value })}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
          <option value="60">60</option>
          <option value="70">70</option>
          <option value="80">80</option>
          <option value="90">90</option>
          <option value="inf">Unlimited</option>
        </select>
        <br />
        <br />
        <input type="submit" value="Get Game Link"></input>
      </form>
      {roomID && roomID !== "" && <Redirect to={`/${roomID}`} />}
    </div>
  );
}

export default Create;
