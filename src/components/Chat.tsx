import React, { useState, useEffect, useRef } from "react";
import { socket } from "../modules";
import { FormControl, Input, Button } from "@material-ui/core";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const didMountRef = useRef(false);
  const scrollToBottom = () => {
    // window.scroll({top: messagesEndRef.current!.offsetTop, behavior: 'smooth'});
    messagesEndRef.current!.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  useEffect(() => {
    if (didMountRef.current) {
      scrollToBottom();
    } else {
      didMountRef.current = true;
    }
  }, [messages]);

  // useEffect(scrollToBottom, [messages]);

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

  useEffect(() => {
    socket.on("chat", handleMessage);
    return () => {
      socket.off("chat", handleMessage);
    };
  }, [messages]);

  return (
    <div className="messages">
      <h2>Chat:</h2>
      <div className="messagesWrapper">
        {messages.map((info, idx) => (
          <p key={idx}>
            {info[0]}: {info[1]}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit}>
        <FormControl>
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            inputProps={{
              pattern: "(?! )([^*?]| )+(?<! )",
              title: "Message cannot have leading or trailing spaces",
            }}
            id="message"
            name="message"
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
