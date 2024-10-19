// socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

export default socket;
