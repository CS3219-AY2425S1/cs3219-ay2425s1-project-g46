// Author(s): Andrew
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const port = process.env.PORT || 5002;

// Import the socket handler
const { handleSocketIO } = require("./handler/socketHandler.js");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create an HTTP server that works with both Express and Socket.IO
const server = http.createServer(app);

// Initialize the Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins, adjust as needed
    methods: ["GET", "POST"],
  },
});

// Trigger handleSocketIO to start listening for Socket.IO events
handleSocketIO(io); // This calls the function to set up the socket listeners

// Start the server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});