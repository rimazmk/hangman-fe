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
    numrounds: "",
    rotation: "robin",
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
    if (state.username && state.lives && state.numrounds && state.rotation) {
      socket.emit("create", state);
    } else {
      console.warn("One or more fields are missing");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        Enter Username:
        <input
          type="text"
          value={state.username}
          onChange={(e) => setState({ ...state, username: e.target.value })}
          id="username"
          name="username"
        ></input>
        <br />
        Enter Lives:
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
        Enter number of rounds:
        <input
          type="number"
          value={state.numrounds}
          onChange={(e) => setState({ ...state, numrounds: e.target.value })}
          id="numrounds"
          name="numrounds"
        ></input>
        <br />
        <label htmlFor="rotation">Rotation Mode:</label>
        <select
          name="rotation"
          id="rotation"
          onChange={(e) => setState({ ...state, rotation: e.target.value })}
        >
          <option value="robin">Round Robin</option>
          <option value="king">King of the Hill</option>
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
