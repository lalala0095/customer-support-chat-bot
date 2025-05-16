import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

type Message = {
  text: string;
  sender: "user" | "bot";
};

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const session_id = sessionIdRef.current;

  useEffect(() => {
    // Default bot greeting on load
    const greeting: Message = {
      text: "Hi there! I'm your assistant. How can I help you today?",
      sender: "bot",
    };
    setMessages([greeting]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        message: input,
        session_id: session_id,
      }, {
        headers: { "Content-Type": "application/json" },
      }
      );

      const botReply: Message = {
        text: res.data.reply || "Sorry, I didn't get that.",
        sender: "bot",
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Error: Unable to connect to server.", sender: "bot" },
      ]);
    }

    setInput("");
  };

  return (
    <div className="w-full max-w-sm rounded-lg shadow p-4 bg-white flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto mb-2 space-y-2 flex flex-col">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 shadow rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
