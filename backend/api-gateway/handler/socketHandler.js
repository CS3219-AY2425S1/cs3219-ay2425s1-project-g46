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

      console.log("match found");
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

      io.to(collaborationService).emit("createSocketRoom", { data: data, id: id, roomSize: room.size, currentUser: currentUser });
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

      const beforeJoinRoom = io.sockets.adapter.rooms.get(id);
      const beforeJoinRoomSize = beforeJoinRoom ? beforeJoinRoom.size : 0;

      socket.join(id);
      socket.roomId = id;

      const afterJoinRoom = io.sockets.adapter.rooms.get(id);
      const afterJoinRoomSize = afterJoinRoom.size;

      // Means they disconnected and have now joined room
      if (beforeJoinRoomSize < afterJoinRoomSize) {
        console.log(
          `User with socket ID ${socket.id} reconnected to room with ID ${id}`
        );

        // Now going to check if match is ongoing by first getting 
        io.to(matchingService).emit("checkMatchOngoing", { roomId: id, socketId: socket.id, currentUser: currentUser });
      }
    });

    // Receive match get by id
    socket.on("checkMatchOngoing", ({ roomId, socketId, status, error, isMatchOngoing, currentUser }) => {
      // If match ongoing, check for collab data
      // else match not ongoing, send back to client
      console.log("checkMatchOngoing id", roomId);
      if (status === 200 && isMatchOngoing) {
        io.to(collaborationService).emit("retrieveCollab", { roomId: roomId, socketId: socketId, currentUser: currentUser });
      } else {
        io.to(socketId).emit("checkRoomResponse", { isRoomExisting: isMatchOngoing, error: error });
      }
    });


    socket.on("userReconnected", ({ id, currentUser }) => {
      io.in(id).emit("userReconnected", { currentUser: currentUser });
    });

    // From collaboration service
    socket.on("checkRoomResponse", ({ socketId, code, content, language }) => {
      io.to(socketId).emit("checkRoomResponse", {
        isRoomExisting: true,
        code: code,
        content: content,
        language: language
      });
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

    socket.on("saveData", ({ id }) => {
      io.in(id).emit("saveData");
    })

    socket.on("endSession", ({ id }) => {
      console.log("endSession");

      const room = io.sockets.adapter.rooms.get(id);
      console.log("endsession - room", room?.size);

      io.to(collaborationService).emit("endSession", { id: id, roomSize: room.size });
    });

    socket.on("sessionEnded", async ({ user1Email, user2Email, roomId }) => {
      const room = io.sockets.adapter.rooms.get(roomId);
      console.log("sessionEnded - room", room?.size);

      io.in(roomId).emit("sessionEnded", { user1Email: user1Email, user2Email: user2Email, roomId: roomId });
      console.log(`session ended ${roomId} - ${user1Email} and ${user2Email}`);

      const user1 = socketMap[user1Email];
      const user2 = socketMap[user2Email];
      const user1Socket = io.sockets.sockets.get(user1);
      const user2Socket = io.sockets.sockets.get(user2);
      if (user1Socket) {
        user1Socket.leave(roomId);
      }
      if (user2Socket) {
        user2Socket.leave(roomId);
      }

      io.to(matchingService).emit("matchEnd", { roomId });
    });

    socket.on("updateSubmissionCount", ({ id, count }) => {
      const room = io.sockets.adapter.rooms.get(id);

      if (room) {
        console.log("update submission count room, total count", count);
        console.log("update submission count room, total user", room.size);

        io.in(id).emit("updateSubmissionCount", { count, totalUsers: room.size });
      }
    });

    socket.on("cancelendSession", ({ id }) => {
      io.to(collaborationService).emit("cancelendSession", { id: id });
    });

    // Before socket actually disconnects
    socket.on("disconnecting", () => {
      if (socket.id != matchingService && socket.roomId) {
        socket.leave(socket.roomId);
        console.log(`User with socket ID ${socket.id} disconnecting, leaving ${socket.roomId}`);

        let currentUser = Object.keys(socketMap).find(currentUser => socketMap[currentUser] === socket.id);

        io.to(collaborationService).emit("socketDisconnecting", { roomId: socket.roomId, currentUser: currentUser });
      } else {
        console.log(`User with socket ID ${socket.id} disconnecting`);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User with socket ID ${socket.id} disconnected`);

      socketMap = Object.fromEntries(
        Object.entries(socketMap).filter(([key]) => key !== socket.id)
      );

    });
  });
};

// Export user functions
module.exports = { handleSocketIO };
