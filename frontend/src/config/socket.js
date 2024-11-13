import { io } from "socket.io-client";
import { API_GATEWAY_URL } from "./constant";

const apiGatewaySocket = io(API_GATEWAY_URL);


export { apiGatewaySocket };