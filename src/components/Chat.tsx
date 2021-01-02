import React, { useState, useEffect } from "react";
import { socket } from "../modules";

function Chat({ user, roomID }: { user: string; roomID: string }) {
  const [messages, setMessages] = useState<[string, string][]>([]);
  const [message, setMessage] = useState("");

  const handleMessage = (info: [string, string]) => {
    setMessages([...messages, info]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message && message !== "") {
      setMessages([...messages, [user, message]]);
      let info = {
        roomID: roomID,
        user: user,
        message: message,
      };
      setMessage("");
      socket.emit("chat", info);
    }
  };

  useEffect(() => {
    socket.on("chat", handleMessage);
    return () => {
      socket.off("chat", handleMessage);
    };
  }, []);

  return (
    <div>
      <h2>Chat:</h2>
      {messages.map((user, msg) => (
        <p>
          {user}: {msg}
        </p>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="message"
          name="message"
        ></input>
        <input type="submit" value="Submit">
          Send
        </input>
      </form>
    </div>
  );
}

export default Chat;
