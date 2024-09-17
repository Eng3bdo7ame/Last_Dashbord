const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  transports: ["websocket"],
  cors: {
    origin: "*", // Adjust this based on your security needs
  },
});

let boardData = {
  lists: [],
};

io.on("connection", (socket) => {
  console.log("New client connected");

  // Join a specific board room
  const boardId = socket.handshake.query.boardId;
  socket.join(boardId);

  // Send initial board data
  socket.emit("board_data", boardData);

  // Handle update board action
  socket.on("update_board", (data) => {
    boardData = data.board;
    io.to(boardId).emit("board_data", boardData); // Broadcast to all clients in the room
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
