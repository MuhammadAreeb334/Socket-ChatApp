import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, color } = location.state || {};
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!username) {
      navigate("/");
      return;
    }

    socketRef.current = io("http://localhost:4000");

    socketRef.current.emit("join", { username, color });

    socketRef.current.on("receive_message", (msgData) => {
      if (!msgData || typeof msgData !== "object") return;

      setMessages((prev) => {
        const updated = [...prev, msgData];
        localStorage.setItem("chatMessages", JSON.stringify(updated));
        return updated;
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    const msgData = { username, color, text: message };
    socketRef.current.emit("send_message", msgData);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex justify-between items-center p-4 bg-gray-800">
        <h1 className="text-lg font-semibold">💬 Chat Room</h1>
        <button
          onClick={() => {
            localStorage.removeItem("chatMessages");
            navigate("/");
          }}
          className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
        >
          Leave
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col">
            <span
              className="text-sm font-semibold"
              style={{ color: msg.color || "#fff" }}
            >
              {msg.username}
            </span>
            <div className="bg-gray-800 px-4 py-2 rounded-lg max-w-xs break-words">
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-800 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 rounded bg-gray-700 outline-none"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
