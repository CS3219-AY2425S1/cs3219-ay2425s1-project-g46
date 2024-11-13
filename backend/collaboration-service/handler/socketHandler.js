// Author(s): Xue Ling, Xiu Jia, Calista, Andrew
const {
  getRandomQuestion,
  getComplexity,
} = require("../service/questionService");

const db = require("../config/firebase");
const { getCollabById } = require("../controller/collabController");

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

  apiGatewaySocket.on("createSocketRoom", async ({ data, id, roomSize, currentUser }) => {

    if (!activeUserInRoom[id]) {
      activeUserInRoom[id] = [];
      confirmedUsers[id] = 0;
    }
    activeUserInRoom[id].push(currentUser);

    console.log(`UactiveUserInRoom[id]: ${activeUserInRoom[id].length}`);

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

      console.log("userdata id ", usersData[id]);

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
        contextCode: null,
        contextText: null,
        roomId: id,
        reviewGiven: false,
      };
      createHistoryIndividual(user1, user2, historyData);

      // a timer to backup the current collab data
      const interval = setInterval(async () => {
        updateCollabData(id, apiGatewaySocket);
      }, 5000);

      intervalMap[id] = interval;
    }
  });

  // When they have reconnected and are now retrieving collab data
  apiGatewaySocket.on("retrieveCollab", async ({ roomId, socketId, currentUser }) => {
    // By default when it enters here, the match status is ongoing

    // If usersData found, means service still keeping track of collab data
    if (activeUserInRoom[roomId] && activeUserInRoom[roomId].length != 0) {
      confirmedUsers[roomId] = 0;

      if (activeUserInRoom[roomId] && activeUserInRoom[roomId].indexOf(currentUser) == -1) {
        activeUserInRoom[roomId].push(currentUser);
      } else if (activeUserInRoom[roomId]) {
        activeUserInRoom[roomId] = [];
        activeUserInRoom.push(currentUser);
      }

      apiGatewaySocket.emit("updateSubmissionCount", {
        id: roomId,
        count: confirmedUsers[roomId],
      });

      apiGatewaySocket.emit("userReconnected", {
        id: roomId,
        currentUser
      });

    } else {  // Only enters if both users had already left
      console.log("retrieve collab id - both users gone", roomId);
      const { status, error, data } = await getCollabById(roomId);

      if (status === 200) {
        const { user1,
          user2,
          questionData,
          currentLanguage,
          currentContentText,
          currentContentCode,
        } = data;

        console.log("usersData[roomId]", usersData[roomId]);

        usersData[roomId] = { user1, user2, questionData };

        console.log("usersData[roomId]", usersData[roomId]);


        confirmedUsers[roomId] = 0;
        activeUserInRoom[roomId] = [];
        activeUserInRoom[roomId].push(currentUser);

        latestLanguage[roomId] = currentLanguage;
        latestContentText[roomId] = currentContentText;
        latestContentCode[roomId] = currentContentCode;

        haveNewData[roomId] = false;

        apiGatewaySocket.emit("checkRoomResponse", {
          socketId: socketId,
          code: currentContentCode,
          content: currentContentText,
          language: currentLanguage,
        });

        apiGatewaySocket.emit("updateSubmissionCount", {
          id: roomId,
          count: confirmedUsers[roomId],
        });

        // a timer to backup the current collab data when there's 1 person in it
        if (activeUserInRoom[roomId].length == 1) {
          console.log("set interval for saving data");
          const interval = setInterval(async () => {
            updateCollabData(roomId, apiGatewaySocket);
          }, 5000);
          intervalMap[roomId] = interval;
        }
      } else {
        console.error("error in retrieve collab: ", error);
      }
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

  apiGatewaySocket.on("endSession", ({ id, roomSize }) => {
    console.log(id);

    if (confirmedUsers[id]) {
      confirmedUsers[id] = confirmedUsers[id] + 1;
    } else {
      confirmedUsers[id] = 1;
    }

    console.log("roomSize == confirmedUsers[id]", roomSize == confirmedUsers[id]);
    if (roomSize == confirmedUsers[id]) {
      updateCollabData(id);
      const { user1, user2, questionData } = usersData[id];
      updateCodeTextInHistoryIndividual(user1, user2, id);
      delete confirmedUsers[id];

      delete activeUserInRoom[id];

      clearInterval(intervalMap[id]);
      delete intervalMap[id];

      delete latestContentText[id];
      delete latestContentCode[id];
      delete latestLanguage[id];
      delete haveNewData[id];

      delete usersData[id];
      apiGatewaySocket.emit('sessionEnded', { user1Email: user1.email, user2Email: user2.email, roomId: id });
    } else {
      apiGatewaySocket.emit("updateSubmissionCount", {
        id: id,
        count: confirmedUsers[id],
        totalUsers: roomSize,
      });
    }
  });

  //cancel button
  apiGatewaySocket.on("cancelendSession", ({ id }) => {
    confirmedUsers[id] = Math.max(0, confirmedUsers[id] - 1);
    apiGatewaySocket.emit("updateSubmissionCount", {
      id: id,
      count: confirmedUsers[id],
    });
  });

  // Handle event when the user disconnects
  apiGatewaySocket.on("socketDisconnecting", ({ roomId, currentUser }) => {
    console.log("in collab, socket disconnecting");
    console.log("before activeUser in room", activeUserInRoom[roomId].length);

    if (!activeUserInRoom[roomId]) {
      console.log("enter here");
      activeUserInRoom[roomId] = [];
    } else {
      console.log("here", activeUserInRoom[roomId].filter((user) => user != currentUser));
      activeUserInRoom[roomId] = activeUserInRoom[roomId].filter((user) => user != currentUser);
    }

    if (roomId && activeUserInRoom[roomId].length == 0) {
      console.log("activeUser in room", activeUserInRoom[roomId].length);

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

      delete confirmedUsers[roomId];
      delete usersData[roomId];
    } else {
      apiGatewaySocket.emit("updateSubmissionCount", {
        id: roomId,
        count: confirmedUsers[roomId],
      });
      console.log("update submission count");
    }
  });
};

async function updateCollabData(id, apiGatewaySocket) {
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

      apiGatewaySocket.emit("saveData", { id: id });
    } catch (error) {
      console.error("Fail to save to database: ", error);
    }
  }
}

async function createHistoryIndividual(user1, user2, historyData) {
  const roomdId = historyData.roomId
  try {
    // Add entry to user1's history
    const user1HistoryRef = db
      .collection("historyIndividual")
      .doc(user1.email);
    const doc1 = await user1HistoryRef.get();
    if (!doc1.exists) {
      await user1HistoryRef.set({ [roomdId]: historyData });
    } else {
      await user1HistoryRef.update({ [roomdId]: historyData });
    }

    // Add entry to user2's history
    const user2HistoryRef = db
      .collection("historyIndividual")
      .doc(user2.email);
    const doc2 = await user2HistoryRef.get();
    if (!doc2.exists) {
      await user2HistoryRef.set({ [roomdId]: historyData });
    } else {
      await user2HistoryRef.update({ [roomdId]: historyData });
    }
    console.log("Collaboration history saved for both users.");
  } catch (error) {
    console.error("Failed to save collaboration history: ", error);
  }
}

async function updateCodeTextInHistoryIndividual(user1, user2, id) {
  const currentContentText = latestContentText[id];
  const currentContentCode = latestContentCode[id];

  console.log("contentText updated:", currentContentCode);

  try {
    // Update for user1
    const user1HistoryRef = db.collection("historyIndividual").doc(user1.email);
    const doc1 = await user1HistoryRef.get();
    if (doc1.exists) {
      const historyData = doc1.data();
      if (historyData[id]) {
        // Update ContextText and ContextCode for the specific roomId
        await user1HistoryRef.update({
          [`${id}.contextText`]: currentContentText,
          [`${id}.contextCode`]: currentContentCode,
        });
      }
    }

    // Update for user2
    const user2HistoryRef = db.collection("historyIndividual").doc(user2.email);
    const doc2 = await user2HistoryRef.get();
    if (doc2.exists) {
      const historyData = doc2.data();
      if (historyData[id]) {
        // Update ContextText and ContextCode for the specific roomId
        await user2HistoryRef.update({
          [`${id}.contextText`]: currentContentText,
          [`${id}.contextCode`]: currentContentCode,
        });
      }
    }

    console.log("Updated ContextText and ContextCode in history for both users.");
  } catch (error) {
    console.error("Failed to update ContextText and ContextCode in history: ", error);
  }
}

module.exports = { handleSocketIO };