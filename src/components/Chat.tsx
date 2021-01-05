import React, { useState, useEffect, useRef } from "react";
import { socket } from "../modules";

function Chat({ user, roomID }: { user: string; roomID: string }) {
  const [messages, setMessages] = useState<[string, string][]>([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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
    scrollToBottom();
    return () => {
      socket.off("chat", handleMessage);
    };
  }, [messages]);

  return (
    <div className="messagesWrapper">
      <h2>Chat:</h2>

      {/* Add scroll functionality through CSS */}
      {messages.map((info) => (
        <p>
          {info[0]}: {info[1]}
        </p>
      ))}
      <div ref={messagesEndRef} />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="message"
          name="message"
        ></input>
        <input type="submit" value="Send" />
      </form>
    </div>
  );
}

export default Chat;
