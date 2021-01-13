import React, { useEffect, useState } from "react";
import { gameStateInterface, gameInitInterface } from "../hangman";
import { socket } from "../modules";

const NewRound = ({
  gameState,
  setGameState,
  roomID,
  user,
}: {
  gameState: gameStateInterface;
  setGameState: React.Dispatch<
    React.SetStateAction<gameStateInterface | undefined>
  >;
  roomID: string;
  user: string;
}) => {
  const [started, setStarted] = useState(false);

  let temp: string;
  if (gameState.time === null) {
    temp = "inf";
  } else {
    temp = gameState.time.toString();
  }

  const [state, setState] = useState<gameInitInterface>({
    username: user,
    lives: gameState.lives.toString(),
    numRounds: gameState.numRounds.toString(),
    rotation: gameState.rotation,
    time: temp,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let params = Object.assign({}, state);

    const info = { params: params, roomID: roomID, username: user };
    socket.emit("join_new", info);
  };

  const onClick = () => {
    socket.emit("new", roomID);
  };

  const handleNew = () => {
    setStarted(true);
  };

  const handleJoin = (newState: gameStateInterface) => {
    setGameState(Object.assign({}, newState));
  };

  useEffect(() => {
    socket.on("new", handleNew);
    socket.on("join_new", handleJoin);
    return () => {
      socket.off("join_new", handleJoin);
      socket.off("new", handleNew);
    };
  }, []);

  return (
    <div>
      {user !== gameState.players[0] && !started && (
        <p>Waiting for {gameState.players[0]} to start the next game...</p>
      )}

      {user !== gameState.players[0] && started && (
        <p>{gameState.players[0]} is choosing the settings...</p>
      )}

      {user === gameState.players[0] && !started && (
        <button onClick={onClick} value={"start new game"}>
          Start New Game
        </button>
      )}

      {user === gameState.players[0] && started && (
        <form onSubmit={handleSubmit}>
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
          <input type="submit" value="Create Game"></input>
        </form>
      )}
    </div>
  );
};

export default NewRound;
