// Author(s): Xiu Jia
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require('express-rate-limit');
const http = require("http");
const { Server } = require("socket.io");
const { handleSocketIO } = require("./handler/socketHandler.js");
const apiRoute = require("./routes/apiGatewayRoute.js");

const port = process.env.PORT || 8000;

// Create an instance of Express app
const app = express();
const server = http.createServer(app);

// Initialize the Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins, adjust as needed
    methods: ["GET", "POST"],
  },
});

handleSocketIO(io);

app.use(express.json());
app.use(cors());

// Define a rate limiter with options
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',

  // Custom handler function for rate limit errors
  handler: (req, res) => {
    res.status(429).send({
      error: 'You have exceeded the maximum allowed requests. Please wait a while and try again.',
    });
  },
});

app.use(apiLimiter);

// default API from expressJS
app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});

// Route
app.use("/api", apiRoute);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});