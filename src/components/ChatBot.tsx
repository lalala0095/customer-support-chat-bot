// components/ChatBot.tsx
import React, { useEffect, useState } from "react";

type Message = {
  text: string;
  sender: "user" | "bot";
};

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage: Message = { text: input, sender: "user" };
    const botReply: Message = { text: `You said: "${input}"`, sender: "bot" };
    setMessages([...messages, userMessage, botReply]);
    setInput("");
  };

  useEffect(() => {
    setMessages([
      {text: "Hi there! How can I assist you today?", sender: "bot"},
    ])
  })

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
