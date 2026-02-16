import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", ({ username, color }) => {
    users[socket.id] = { username, color };
    const sysMsg = {
      username: "System",
      color: "#9CA3AF",
      text: `${username} has joined the chat!`,
    };
    socket.broadcast.emit("receive_message", sysMsg);
  });

  socket.on("send_message", (msgData) => {
  io.emit("receive_message", msgData);
});

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      const sysMsg = {
        username: "System",
        color: "#9CA3AF",
        text: `${user.username} has left the chat.`,
      };
      socket.broadcast.emit("receive_message", sysMsg);
      delete users[socket.id];
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(4000, () => console.log("Server running on port 4000"));
