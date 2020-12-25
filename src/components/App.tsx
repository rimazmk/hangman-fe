import React, { useState, useEffect } from "react";
import logo from "../logo.svg";
import "../css/App.css";
import { io } from "socket.io-client";

function App() {
  const [message, setMessage] = useState("");
  const [receviedMessage, setReceivedMessage] = useState("");
  const socket = io("http://localhost:5000", { transports: ["websocket"] });
  let counter = 0;

  useEffect(() => {
    socket.on("response", (msg: string) => {
      console.log("message: " + msg);
      console.log(counter++);
      setReceivedMessage(msg);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("message sent");
    socket.emit("message", message);
    setMessage("");
    // socket.onAny((msg: string) => setReceivedMessage(msg));
    // or with emit() and custom event names
    // socket.emit('salutations', 'Hello!', { 'mr': 'john' }, Uint8Array.from([1, 2, 3, 4]));
  };

  return (
    <div>
      <p>{receviedMessage}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="message"
          name="message"
        ></input>
      </form>
    </div>
  );
}

export default App;
