import React, { useState, useEffect, useRef } from "react";
import { socket } from "../modules";
import { FormControl, Input, Button } from "@material-ui/core";
import ScrollableFeed from "react-scrollable-feed";
import { gameStateInterface } from "../hangman";

function Chat({
  user,
  roomID,
  messages,
  setMessages,
}: {
  user: string;
  roomID: string;
  messages: [string, string][];
  setMessages: React.Dispatch<React.SetStateAction<[string, string][]>>;
}) {
  const [message, setMessage] = useState("");

  const handleMessage = (info: [string, string]) => {
    setMessages((messages) => [...messages, info]);
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
    console.log(messages[messages.length - 1]);
    socket.on("chat", handleMessage);
    return () => {
      socket.off("chat", handleMessage);
    };
  }, [messages]);

  return (
    <div className="messages">
      <h2>Chat:</h2>
      <ScrollableFeed className="messagesWrapper" forceScroll={true}>
        {messages.map((info, idx) => (
          <p key={idx}>
            {info[0]}: {info[1]}
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
