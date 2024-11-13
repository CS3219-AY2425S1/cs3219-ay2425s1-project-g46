// Author(s): Xue Ling, Xiu Jia
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { io } = require("socket.io-client");

// Import the socket handler
const { handleSocketIO } = require("./handler/socketHandler.js");

const port = process.env.PORT || 5003;
const API_GATEWAY_URL = process.env.API_GATEWAY_URL || "http://localhost:8000";


// Import route
const collaborationRoute = require("./routes/collaborationRoute");

// Create an instance of Express app
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Initialize the Socket.IO client
const apiGatewaySocket = io(API_GATEWAY_URL);

// Trigger handleSocketIO to start listening for Socket.IO events
handleSocketIO(apiGatewaySocket); // This calls the function to set up the socket listeners

// Routes
app.use("/collaboration", collaborationRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

