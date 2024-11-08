// Author(s): Xue Ling, Xiu Jia, Calista
const {
  getRandomQuestion,
  getComplexity,
} = require("../service/questionService");

const db = require("../config/firebase");

let intervalMap = {};

let latestContentText = {};
let latestContentCode = {};
let latestLanguage = {};
let haveNewData = {};
let activeUserInRoom = {}; // track user details in rooms
let confirmedUsers = {};
let usersData = {};

const handleSocketIO = (apiGatewaySocket) => {
  apiGatewaySocket.on("connect", () => {
    console.log("Connected to API Gateway with socket ID:", apiGatewaySocket.id);
  
    // Example of emitting an event to the API Gateway
    apiGatewaySocket.emit("collaborationService");
  });

  apiGatewaySocket.on("createSocketRoom", async ({ data, id, roomSize }) => {
    // Store the socket id for the user
    // socketMap[currentUser] = socket.id;
    // socket.roomId = id;

    // socket.join(id);
    // console.log(`User with socket ID ${socket.id} joined room with ID ${id}`);
    if (activeUserInRoom[id]) {
      activeUserInRoom[id] = activeUserInRoom[id] + 1;
    } else {
      activeUserInRoom[id] = 1;
      confirmedUsers[id] = 0;
    }
    console.log(`UactiveUserInRoom[id]: ${activeUserInRoom[id]}`);

    console.log("room", roomSize);
    if (roomSize === 2) {
      const { user1, user2 } = data;

      const complexity = getComplexity(user1, user2);

      const questionData = await getRandomQuestion(
        user1.category,
        complexity
      );

      console.log("questionData", questionData);

      usersData[id] = { user1, user2, questionData };

      apiGatewaySocket.emit("readyForCollab", {
        id: id,
        user1,
        user2,
        questionData,
      });

      console.log(
        `Room ${id} is ready. Collaboration question sent: ${questionData}`
      );

      // Save collaboration history for both users in "historyIndividual" collection
      const now = new Date();
      now.setHours(now.getHours() + 8); // Adjust to UTC+8

      const historyData = {
        questionData,
        timestamp: now.toISOString(),
        collaborators: {
          user1: user1,
          user2: user2,
        },
        roomId: id,
        reviewGiven: false,
      };

      try {
        // Add entry to user1's history
        const user1HistoryRef = db
          .collection("historyIndividual")
          .doc(user1.email);
        const doc1 = await user1HistoryRef.get();
        if (!doc1.exists) {
          await user1HistoryRef.set({ 1: historyData });
        } else {
          const history = doc1.data();
          const historyKeys = Object.keys(history).map(Number);
          let maxKey = Math.max(...historyKeys);
          if (maxKey === -Infinity) {
            maxKey = 0;
          }
          await user1HistoryRef.update({ [maxKey + 1]: historyData });
        }

        // Add entry to user2's history
        const user2HistoryRef = db
          .collection("historyIndividual")
          .doc(user2.email);
        const doc2 = await user2HistoryRef.get();
        if (!doc2.exists) {
          await user2HistoryRef.set({ 1: historyData });
        } else {
          const history = doc1.data();
          const historyKeys = Object.keys(history).map(Number);
          let maxKey = Math.max(...historyKeys);
          if (maxKey === -Infinity) {
            maxKey = 0;
          }
          await user2HistoryRef.update({ [maxKey + 1]: historyData });
        }
        console.log("Collaboration history saved for both users.");
      } catch (error) {
        console.error("Failed to save collaboration history: ", error);
      }

      // a timer to backup the current collab data
      const interval = setInterval(async () => {
        updateCollabData(id);
      }, 5000);

      intervalMap[id] = interval;
    }
  });

  apiGatewaySocket.on("sendContent", ({ id, content }) => {
    haveNewData[id] = true;
    latestContentText[id] = content;

    apiGatewaySocket.emit("receiveContent", { id: id, content: content });
  });

  apiGatewaySocket.on("sendCode", ({ id, code }) => {
    haveNewData[id] = true;
    latestContentCode[id] = code;
    apiGatewaySocket.emit("receiveCode", { id: id, code: code });
  });

  apiGatewaySocket.on("sendLanguageChange", ({ id, language }) => {
    haveNewData[id] = true;
    latestLanguage[id] = language;
    apiGatewaySocket.emit("receivelanguageChange", { id: id, language: language });
  });

  apiGatewaySocket.on("sendMessage", ({ id, message }) => {
    apiGatewaySocket.emit("receiveMessage", { id: id, message: message });
  });

  // Handle submission

  apiGatewaySocket.on("endSession", ({ id }) => {
    console.log(id);
    confirmedUsers[id] = confirmedUsers[id] + 1;

    if (confirmedUsers[id] == activeUserInRoom[id]) {
      console.log("Both users have submitted in room:", id);
      updateCollabData(id);
      activeUserInRoom[id] == 0;
      const { user1, user2, questionData } = usersData[id];
      apiGatewaySocket.emit('sessionEnded', { user1Email: user1.email, user2Email: user2.email, roomId: id });

      // socket.disconnect();
    } else {
      apiGatewaySocket.emit("submissionCount", {
        id: id,
        count: confirmedUsers[id],
        totalUsers: activeUserInRoom[id],
      });
    }
  });

  //cancel button
  apiGatewaySocket.on("cancelendSession", ({ id }) => {
    confirmedUsers[id] = Math.max(0, confirmedUsers[id] - 1);
    apiGatewaySocket.emit("submissionCount", {
      id: id,
      count: confirmedUsers[id],
      totalUsers: activeUserInRoom[id],
    });
  });

  apiGatewaySocket.on("userDisconnect", ({ id }) => {
    confirmedUsers[id] = 0;
    apiGatewaySocket.emit("sendUserDisconnect", { id: id });
  });

  apiGatewaySocket.on("userReconnect", ({ id }) => {
    apiGatewaySocket.emit("sendUserReconnect", { id: id });
  });

  apiGatewaySocket.on("reloadSession", ({ id }) => {
    confirmedUsers[id] = Math.max(0, confirmedUsers[id] - 1);
    // socket.roomId = id;

    // socket.join(id);
    // console.log(
    //   `Reloaded - User with socket ID ${socket.id} joined room with ID ${id}`
    // );
    if (activeUserInRoom[id]) {
      activeUserInRoom[id] = activeUserInRoom[id] + 1;
    }
    apiGatewaySocket.emit("submissionCount", {
      id: id,
      count: confirmedUsers[id],
      totalUsers: activeUserInRoom[id],
    });
  });

  apiGatewaySocket.on("receiveCount", ({ id }) => {
    apiGatewaySocket.emit("submissionCount", {
      id: id,
      count: confirmedUsers[id],
      totalUsers: activeUserInRoom[id],
    });
  });

  apiGatewaySocket.on("socketDisconnect", ({ roomId }) => {
    activeUserInRoom[roomId] = Math.max(
      0,
      activeUserInRoom[roomId] - 1
    );

    console.log(activeUserInRoom[roomId]);
    if (activeUserInRoom[roomId] == 0) {
      console.log(
        `All users in roomId ${roomId} disconnected, deleting room data`
      );
      delete activeUserInRoom[roomId];

      clearInterval(intervalMap[roomId]);
      delete intervalMap[roomId];
      delete latestContentText[roomId];
      delete latestContentCode[roomId];
      delete latestLanguage[roomId];
      delete haveNewData[roomId];
    }

    // for (let user in socketMap) {
    //   if (socketMap[user] === socket.id) {
    //     delete socketMap[user];
    //     break;
    //   }
    // }

    // if (socket.roomId) {
    //   socket.leave(socket.roomId);
    //   console.log(`User with socket ID ${socket.id} disconnected, leaving ${socket.roomId}`);
    // } else {
    //   console.log(`User with socket ID ${socket.id} disconnected`);
    // }
  });
};

async function updateCollabData(id) {
  const currentTime = new Date().toISOString();
  const currentContentText = latestContentText[id];
  const currentContentCode = latestContentCode[id];
  const currentLanguage = latestLanguage[id] || null;
  const { user1, user2, questionData } = usersData[id];
  const periodicData = {
    user1,
    user2,
    questionData,
    currentLanguage,
    currentContentText,
    currentContentCode,
    timestamp: currentTime,
  };

  if (haveNewData[id]) {
    try {
      const collabRef = db.collection("collabs").doc(id);
      const doc = await collabRef.get();

      if (doc.exists) {
        haveNewData[id] = false;
        await collabRef.update(periodicData);
        console.log(
          `Collab Data for roomid ${id} updated to Firebase at ${currentTime}`
        );
      } else {
        await collabRef.set({
          roomId: id,
          ...periodicData,
        });
        console.log(
          `New Collab page for roomid ${id} recorded to Firebase at ${currentTime}`
        );
      }
    } catch (error) {
      console.error("Fail to save to database: ", error);
    }
  }
}
// Export user functions
module.exports = { handleSocketIO };
