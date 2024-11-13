// Author(s): Andrew, Xinyi
const {
  addUserToQueue,
  checkMatchingSameQueue,
  checkMatchingAnyQueue,
  removeUserFromQueue,
  removeUserFromPriorityQueue,
} = require("../controller/queueController");
const {
  createMatch,
  getMatchById,
  updateMatch
} = require("../controller/matchController");

const handleSocketIO = (apiGatewaySocket) => {
  apiGatewaySocket.on("connect", () => {
    console.log("Connected to API Gateway with socket ID:", apiGatewaySocket.id);

    // Example of emitting an event to the API Gateway
    apiGatewaySocket.emit("matchingService");
  });

  // Notify matched users
  const notifyUsers = (firstUser, secondUser, matchData, id) => {
    apiGatewaySocket.emit("match_found", {
      user1: firstUser.email,
      user2: secondUser.email,
      matchData,
      id,
    });
    console.log(
      `Match found --> User1: ${firstUser.email}, User2: ${secondUser.email}`
    );
  };

  // Handle the matching logic based on the queue type
  const handleMatching = async (topic, difficultyLevel, email, token, username, isAny) => {
    try {
      // Add user to queue
      await addUserToQueue(topic, difficultyLevel, email, token, username, isAny);

      const userList = isAny
        ? await checkMatchingAnyQueue(topic, difficultyLevel, email, token, username, isAny)
        : await checkMatchingSameQueue(topic, difficultyLevel, email, token, username, isAny);

      if (userList && userList.length === 2) {
        const [firstUser, secondUser] = userList;
        const { status, msg, error, matchData, id } = await createMatch(firstUser, secondUser);

        if (status === 200) {
          console.log(msg);
          notifyUsers(firstUser, secondUser, matchData, id);
        } else {
          console.error(error || "Unknown error during match creation.");
        }
      }
    } catch (error) {
      console.error("Error in handleMatching:", error);
    }
  };

  // Handle join matching queue event
  apiGatewaySocket.on("join_matching_queue", async (data) => {
    console.log(`New request for matching:`, data);
    const { topic, difficultyLevel, email, token, username, isAny } = data;
    await handleMatching(topic, difficultyLevel, email, token, username, isAny);
  });

  // Handle cancel matching event
  apiGatewaySocket.on("cancel_matching", async (data) => {
    console.log(`Cancelling matching for user: ${data.email}`);
    const { topic, difficultyLevel, email, token, username, isAny } = data;

    try {
      // Remove user from RabbitMQ queue
      await removeUserFromQueue(topic, difficultyLevel, email, token, username, isAny);
      await removeUserFromPriorityQueue(topic, difficultyLevel, email, token, username, isAny);

      console.log(`User ${email} removed from the queue.`);
    } catch (error) {
      console.error("Error in cancel_matching:", error);
    }
  });

  apiGatewaySocket.on("checkMatchOngoing", async ({ roomId, socketId, currentUser }) => {
    try {
      const { status, msg, error, data } = await getMatchById(roomId);

      let isMatchOngoing = false;

      if (status === 200) {
        console.log(msg);
        if (data.status === "ongoing") {
          isMatchOngoing = true;
        }
      } else {
        console.error("error in check match ongoing", error || "Unknown error during match get by id.");
      }

      console.log("checkMatchOngoing id", roomId);
      apiGatewaySocket.emit("checkMatchOngoing", {
        roomId: roomId,
        socketId: socketId,
        status: status,
        error: error,
        isMatchOngoing: isMatchOngoing,
        currentUser: currentUser
      });
    } catch (error) {
      console.error("Error in getting match:", error);
    }
  });

  apiGatewaySocket.on("matchEnd", async ({ roomId }) => {
    try {
      const { status, msg, error, response } = await updateMatch(roomId);

      if (status === 200) {
        console.log(msg);
        console.log(response);
      } else {
        console.error(error || "Unknown error during match get by id.");
      }
    } catch (error) {
      console.error("Error in updating match:", error);
    }
  })
};

// Export user functions
module.exports = { handleSocketIO };
