// Author(s): Xue Ling, Xiu Jia
const { createMatch } = require("../controller/matchController");
const { getRandomQuestion, getComplexity } = require("../service/questionService");

const handleSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log(`A user connected with socket ID: ${socket.id}`);

    // Temporary in here because no match service right now
    socket.on("match_found", async (data) => {
      const { user1, user2 } = data;
      const { roomId } = await createMatch(user1, user2);

      const complexity = getComplexity(user1, user2);

      const questionData = await getRandomQuestion(user1.category, complexity);

      socket.join(roomId);

      socket.emit("readyForCollab", { 
        roomId,
        user1,
        user2,
        questionData
       });
      console.log(`User with socket ID ${socket.id} joined room with ID ${roomId}`);
    });

    socket.on("sendContent", ({ roomId, content }) => {
      socket.to(roomId).emit("receiveContent", { content });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User with socket ID ${socket.id} disconnected`);
    });
  });
};

// Export user functions
module.exports = { handleSocketIO };