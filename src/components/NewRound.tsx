import React, { useEffect, useState } from "react";
import { gameStateInterface, gameInitInterface } from "../hangman";
import { Redirect } from "react-router";
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
  const [redirect, setRedirect] = useState(false);
  const [newID, setNewID] = useState("");
  const [newHanger, setNewHanger] = useState("");
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
    socket.emit("new", info);
  };

  const onClick = () => {
    console.log("newt");
    socket.emit("newt", roomID);
  };

  const handleNew = (info: string) => {
    setStarted(true);
  };

  const handleURL = (newState: gameStateInterface) => {
    setGameState(Object.assign({}, newState));
    // setRedirect(true);
  };

  useEffect(() => {
    socket.on("newt", handleNew);
    socket.on("url", handleURL);
    return () => {
      socket.off("url", handleURL);
      socket.off("newt", handleNew);
    };
  }, []);

  // const handleClick = () => {
  //   const info = { user: user, roomID: roomID, newID: newID };
  //   socket.emit("join_new", info);
  //   setRedirect(true);
  // };

  return (
    <div>
      {newID === "" && user === gameState.players[0] && !started && (
        <button onClick={onClick} value={"start new game"}>
          start new game
        </button>
      )}
      {newID === "" && user !== gameState.players[0] && !started && (
        <p>waiting for {gameState.players[0]} to start game...</p>
      )}
      {newID === "" && user !== gameState.players[0] && started && (
        <p>waiting for {gameState.players[0]} to choose settings...</p>
      )}
      {newID === "" && user === gameState.players[0] && started && (
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

      {redirect && <Redirect to={`/${roomID}`} />}

      {/* {newHanger !== user && newID && newID !== "" && (
        <button onClick={handleClick}>Go To Next Game</button>
      )} */}
    </div>
  );
};

export default NewRound;
