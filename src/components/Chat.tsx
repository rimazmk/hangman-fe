import React, { useState, useEffect, useCallback } from "react";
import { socket } from "../modules";
import { FormControl, Input, Button } from "@mui/material";
import ScrollableFeed from "react-scrollable-feed";

function Chat({ user, roomID }: { user: string; roomID: string }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<[string, string, boolean][]>([]);

  const handleMessage = useCallback((info: [string, string, boolean]) => {
    setMessages((messages) => [...messages, info]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message && message !== "") {
      let info = {
        roomID: roomID,
        user: user,
        message: message,
        effects: false,
      };
      setMessage("");
      socket.emit("chat", info);
    }
  };

  const validateMessage = () => {
    let userMsg = document.getElementById("message") as HTMLInputElement;
    if (!/^[^\s]+(\s+[^\s]+)*$/.test(userMsg.value)) {
      userMsg.setCustomValidity(
        "Message cannot have leading or trailing spaces"
      );
    } else {
      userMsg.setCustomValidity("");
    }
  };

  useEffect(() => {
    socket.on("chat", handleMessage);
    return () => {
      socket.off("chat", handleMessage);
    };
    // eslint-disable-next-line
  }, [messages]);

  const color: { [key: string]: string } = {
    word: "SlateBlue",
    win: "green",
    correct: "green",
    incorrect: "red",
    timer: "red",
    join: "gray",
    leave: "gray",
  };
  const font: { [key: string]: string } = { join: "italic", leave: "italic" };

  return (
    <div className="messages">
      <h2>Chat:</h2>
      <ScrollableFeed className="messagesWrapper" forceScroll={true}>
        {messages.map((info, idx) => (
          <p
            key={idx}
            style={{
              color: info[2] ? color[info[0]] : "black",
              fontStyle: info[2] ? font[info[0]] : "normal",
            }}
          >
            {info[2] ? "" : `${info[0]}:`} {info[1]}
          </p>
        ))}
      </ScrollableFeed>

      <form onSubmit={handleSubmit}>
        <FormControl>
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={() => validateMessage()}
            id="message"
            name="message"
            required
          />
          <br />
          <Button variant="contained" color="primary" type="submit">
            Send
          </Button>
        </FormControl>
      </form>
    </div>
  );
}

export default Chat;
