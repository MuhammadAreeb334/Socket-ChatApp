import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const getRandomColor = () => {
  const colors = [
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const Home = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (!username.trim()) return;
    const color = getRandomColor();
    navigate("/chat", { state: { username, color } });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white px-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Real-Time Chat</h1>
      <p className="text-gray-400 mb-6 max-w-md text-center">
        Enter your name to join the chat.
      </p>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-4 p-2 rounded bg-gray-800 outline-none text-white w-64 text-center"
      />
      <button
        onClick={handleStart}
        className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        Join Chat
      </button>
    </div>
  );
};

export default Home;
