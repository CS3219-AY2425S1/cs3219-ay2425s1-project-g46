// Author(s): Andrew, Xinyi
const {
  addUserToQueue,
  checkMatchingSameQueue,
  checkMatchingAnyQueue,
  clearQueue,
  removeUserFromQueue,
  removeUserFromPriorityQueue
} = require('../controller/queueController');
const { createMatch } = require("../controller/matchController");

let socketMap = {};

const handleSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log(`A user connected with socket ID: ${socket.id}`);

    // Listen for the join_matching_queue event from the client
    socket.on("join_matching_queue", async (data) => {
      console.log(`New request for matching:`, data);
      const { topic, difficultyLevel, email, token, username, isAny } = data;

      // Store the socket ID for the user
      socketMap[email] = socket.id;

      // Add user to RabbitMQ queue (assuming you have the logic for this)
      await addUserToQueue(topic, difficultyLevel, email, token, username, isAny);

      // Check for a match
      if (!isAny) {
        const userList = await checkMatchingSameQueue(topic, difficultyLevel, email, token, username, isAny);

        if (userList) {
          const [firstUser, secondUser] = userList;

          // Notify both users about the match
          io.to(socketMap[firstUser.email]).emit("match_found", { matchedData: secondUser });
          io.to(socketMap[secondUser.email]).emit("match_found", { matchedData: firstUser });
          console.log("A match is found");


        const { status, msg, error } = createMatch(firstUser, secondUser);
        if (status == 200 && msg) {
          console.log(msg);
        } else if (status == 500 && error) {
          console.error(error);
        }

        }
      
      } else {
        const mixUserList = await checkMatchingAnyQueue(topic, difficultyLevel, email, token, username, isAny);

        if (mixUserList) {
          const [firstMixUser, secondMixUser] = mixUserList;

          // Notify both users about the match
          io.to(socketMap[firstMixUser.email]).emit("match_found", { matchedData: secondMixUser });
          io.to(socketMap[secondMixUser.email]).emit("match_found", { matchedData: firstMixUser });
          console.log("A match is found");

          const { status, msg, error } = createMatch(firstMixUser, secondMixUser);
          if (status == 200 && msg) {
            console.log(msg);
          } else if (status == 500 && error) {
            console.error(error);
          }
        }


      }
    });

    // Listen for cancel_matching event from client
    socket.on("cancel_matching", async (data) => {
      console.log(`Cancelling matching for user:`, data);
      const { topic, difficultyLevel, email, token, username, isAny } = data;

      // Store the socket ID for the user
      socketMap[email] = socket.id;

      // Remove user from RabbitMQ queue (assuming you have the logic for this)
      await removeUserFromQueue(topic, difficultyLevel, email, token, username, isAny);
      await removeUserFromPriorityQueue(topic, difficultyLevel, email, token, username, isAny);
      

    })

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User with socket ID ${socket.id} disconnected`);
    });
  });
};

// Export user functions
module.exports = { handleSocketIO };
