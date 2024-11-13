let socketMap = {};
let matchingService, collaborationService;

const handleSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log(`A user connected with socket ID: ${socket.id}`);

    socket.on("matchingService", () => {
      console.log(`matching service connected with socket ID: ${socket.id}`);
      matchingService = socket.id;
    });

    socket.on("collaborationService", () => {
      console.log(`collaboration service connected with socket ID: ${socket.id}`);
      collaborationService = socket.id;
    });

    // Listen for the join_matching_queue event from the client
    socket.on("join_matching_queue", async (data) => {
      console.log(`New request for matching:`, data);
      const { email } = data;

      // Store the socket ID for the user
      socketMap[email] = socket.id;

      io.to(matchingService).emit("join_matching_queue", data);
    });

    // Listen for cancel_matching event from client
    socket.on("cancel_matching", async (data) => {
      console.log(`Cancelling matching for user:`, data.email);
      const { email } = data;

      // Store the socket ID for the user
      socketMap[email] = socket.id;

      io.to(matchingService).emit("cancel_matching", data);
    });

    socket.on("match_found", (data) => {
      const { user1, user2, matchData, id } = data;

      console.log("data", matchData);

      // Notify both users about the match
      io.to(socketMap[user1]).emit("match_found", {
        data: matchData,
        id,
      });

      io.to(socketMap[user2]).emit("match_found", {
        data: matchData,
        id,
      });
    });

    socket.on("createSocketRoom", async ({ data, id, currentUser }) => {
      console.log("create socket room");
      // Store the socket id for the user
      socketMap[currentUser] = socket.id;
      socket.roomId = id;

      socket.join(id);
      console.log(`User with socket ID ${socket.id} joined room with ID ${id}`);

      const room = io.sockets.adapter.rooms.get(id);
      console.log("room", room.size);

      io.to(collaborationService).emit("createSocketRoom", { data: data, id: id, roomSize: room.size });
    });

    socket.on("readyForCollab", async (data) => {
      console.log("ready for collab");
      const { id, questionData } = data;

      io.in(id).emit("readyForCollab", data);

      console.log(
        `Room ${id} is ready. Collaboration question sent: ${questionData}`
      );
    });

    socket.on("reconnecting", ({ id, currentUser }) => {
      socketMap[currentUser] = socket.id;
      socket.join(id);
      console.log(
        `User with socket ID ${socket.id} reconnected to room with ID ${id}`
      );
    });

    socket.on("sendContent", (data) => {
      io.to(collaborationService).emit("sendContent", data);
    });

    socket.on("receiveContent", ({ id, content }) => {
      io.to(id).emit("receiveContent", { content: content });
    });

    socket.on("sendCode", (data) => {
      io.to(collaborationService).emit("sendCode", data);
    });

    socket.on("receiveCode", ({ id, code }) => {
      io.to(id).emit("receiveCode", { code: code });
    });

    socket.on("languageChange", (data) => {
      io.to(collaborationService).emit("sendLanguageChange", data);
    });

    socket.on("receivelanguageChange", ({ id, language }) => {
      io.to(id).emit("receivelanguageChange", { language: language });
    });

    socket.on("sendMessage", (data) => {
      console.log("send chat message", data);
      io.to(collaborationService).emit("sendMessage", data);
    });

    socket.on("receiveMessage", ({ id, message }) => {
      io.to(id).emit("receiveMessage", { message: message });
    });

    socket.on("endSession", ({ id }) => {
      console.log("endSession");
      io.to(collaborationService).emit("endSession", { id: id });
    });

    socket.on("sessionEnded", ({ user1Email, user2Email, roomId }) => {
      io.in(roomId).emit("sessionEnded", { user1Email: user1Email, user2Email: user2Email, roomId: roomId });

      const user1 = socketMap[user1Email];
      const user2 = socketMap[user2Email];
      const user1Socket = io.sockets.sockets.get(user1);
      const user2Socket = io.sockets.sockets.get(user2);
      if (user1Socket) {
        user1Socket.disconnect();
      }
      if (user2Socket) {
        user2Socket.disconnect();
      }
    });

    socket.on("submissionCount", ({ id, count, totalUsers }) => {
      io.in(id).emit("submissionCount", { count, totalUsers });
    });

    socket.on("cancelendSession", ({ id }) => {
      io.to(collaborationService).emit("cancelendSession", { id: id });
    });

    socket.on("userDisconnect", ({ id }) => {
      io.to(collaborationService).emit("userDisconnect", { id: id });
    });

    socket.on("sendUserDisconnect", ({ id }) => {
      io.in(id).emit("userDisconnect", { id: id });
    });

    socket.on("userReconnect", ({ id }) => {
      io.to(collaborationService).emit("userReconnect", { id: id });
    });

    socket.on("sendUserReconnect", ({ id }) => {
      io.in(id).emit("userReconnect", { id: id });
    });

    socket.on("reloadSession", ({ id }) => {
      socket.join(id);
      console.log(`Reloaded - User with socket ID ${socket.id} joined room with ID ${id}`);

      io.to(collaborationService).emit("reloadSession", { id: id });
    });

    socket.on("receiveCount", ({ id }) => {
      io.to(id).emit("receiveCount", { id: id });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User with socket ID ${socket.id} disconnected`);
      io.to(collaborationService).emit("socketDisconnect", { roomId: socket.roomId });

      socketMap = Object.fromEntries(
        Object.entries(socketMap).filter(([key]) => key !== socket.id)
      );

      if (socket.roomId) {
        socket.leave(socket.roomId);
        console.log(`User with socket ID ${socket.id} disconnected, leaving ${socket.roomId}`);
      } else {
        console.log(`User with socket ID ${socket.id} disconnected`);
      }
    });
  });
};

// Export user functions
module.exports = { handleSocketIO };
