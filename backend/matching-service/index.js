// Author(s): Andrew, Xiu Jia
require("dotenv").config();

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || "http://localhost:8000";

const { io } = require("socket.io-client");

// Import the socket handler
const { handleSocketIO } = require("./handler/socketHandler.js");

// Initialize the Socket.IO client
const apiGatewaySocket = io(API_GATEWAY_URL);

// Trigger handleSocketIO to start listening for Socket.IO events
handleSocketIO(apiGatewaySocket); // This calls the function to set up the socket listeners