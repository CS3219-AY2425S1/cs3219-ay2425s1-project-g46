// Author(s): Xue Ling, Xiu Jia
const { getRandomQuestion, getComplexity } = require("../service/questionService");
const db = require("../db/firebase");

let socketMap = {};
let intervalMap = {};

// let latestContent = ""; // current
// let haveNewData = false;
let latestContent = {}; 
let haveNewData = {};


const handleSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log(`A user connected with socket ID: ${socket.id}`);

    

    socket.on("createSocketRoom", async ({ data, id, currentUser }) => {
      // Store the socket id for the user
      socketMap[currentUser] = socket.id;
      

      const { user1, user2 } = data;

      const complexity = getComplexity(user1, user2);

      const questionData = await getRandomQuestion(user1.category, complexity);

      socket.join(id);

      console.log(`User with socket ID ${socket.id} joined room with ID ${id}`);

      socket.emit("readyForCollab", {
        id: id,
        user1,
        user2,
        questionData
      });

      // a timer to backup the current collab data
      const interval = setInterval(async () => {
        const currentTime = new Date().toISOString();
        const currentContent = latestContent[id];
        const periodicData = {
          user1,
          user2,
          questionData,
          currentContent,
          timestamp: currentTime
        };

        try {
          const collabRef = db.collection("collabs").doc(id); 
          const doc = await collabRef.get();

          if (doc.exists) {
            if (haveNewData[id]) {
              haveNewData[id] = false;
              await collabRef.update(periodicData);
              console.log(`Collab Data updated to Firebase at ${currentTime}`);
            }
          } else {
            
              await collabRef.set({
                roomId: id,
                ...periodicData
              });
              console.log(`New Collab page recorded to Firebase at ${currentTime}`);
            }
          
        } catch (error) {
          console.error("Fail to save to database: ", error);
        }
      }, 5000);
      
      
      intervalMap[socket.id] = interval;
    });
    
    socket.on("sendContent", ({ id, content }) => {
      haveNewData[id] = true;
      latestContent[id] = content;

      socket.to(id).emit("receiveContent", { content: content });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User with socket ID ${socket.id} disconnected`);
    });

    // Delete the 
    if (intervalMap[socket.id]) {
      clearInterval(intervalMap[socket.id]);
      delete intervalMap[socket.id];  
    }
    for (let user in socketMap) {
      if (socketMap[user] === socket.id) {
        delete socketMap[user];
        break;
      }
    }
  });
};

// Export user functions
module.exports = { handleSocketIO };