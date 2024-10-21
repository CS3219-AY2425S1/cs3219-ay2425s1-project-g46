import { io } from "socket.io-client";

const socket = io(process.env.API_GATEWAY_URL || "http://localhost:8000");

export default socket;