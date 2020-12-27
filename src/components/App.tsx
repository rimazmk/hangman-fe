import React, { useState, useEffect } from "react";
import { gameInitInterface } from "../hangman";
import logo from "../logo.svg";
import "../css/App.css";
import Letters from "./Letters";
import io from "socket.io-client";
import axios from "axios";

function App() {
  const [state, setState] = useState<gameInitInterface>({
    category: "",
    username: "",
    word: "",
  });

  const [gameURL, setGameURL] = useState("");
  const [message, setMessage] = useState("");

  const socket = io("http://localhost:5000");
  // let counter = 0;

  useEffect(() => {
    // socket.on("link", (url: string) => {
    //   console.log("url received");
    //   setGameURL(url);
    // });
    // socket.on("response", (msg: string) => {
    //   console.log(counter);
    //   counter++;
    //   setMessage(msg);
    // });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let room = await axios.post<{ url: string }>(
      "http://localhost:5000/create"
    );
    setGameURL(room.data.url);
    // console.log(state.username, state.word, state.category);
    // if (state.category && state.username && state.word) {
    //   socket.emit("create", JSON.stringify(state));
    //   setState({
    //     category: "",
    //     username: "",
    //     word: "",
    //   });
    // } else {
    //   console.warn("One or more field(s) missing");
    // }

    // console.log("message sent");
    // socket.emit("message", message);
    // setMessage("");
  };

  const onLetterClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let ev = e.target as HTMLButtonElement;
    console.log(ev.value);
    socket.emit("message", ev.value);
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
        Enter First Word:
        <input
          type="text"
          value={state.word}
          onChange={(e) => setState({ ...state, word: e.target.value })}
          id="word"
          name="word"
        ></input>
        <br />
        Enter Category:
        <input
          type="text"
          value={state.category}
          onChange={(e) => setState({ ...state, category: e.target.value })}
          id="category"
          name="category"
        ></input>
        <br />
        <br />
        <input type="submit" value="Get Game Link"></input>
      </form>

      <p>Share this link with friends :) {gameURL}</p>
      <Letters onClick={onLetterClick} />
      {/* <p>{message}</p> */}
    </div>
  );
}

export default App;
