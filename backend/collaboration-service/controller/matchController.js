// Author(s): Xiu Jia
// const db = require("../config/firebase");
// const matchCollection = db.collection("matches");
// const uuidv4 = require("uuid").v4;

/**
 * POST /add
 *
 * Creates match and stores in firebase
 *
 * Responses:
 * - 500: Server error if something goes wrong while fetching data.
 */
const createMatch = async (user1, user2) => {
  try {
    // const roomId = uuidv4();
    // const matchJson = {
    //   user1: {
    //     email: user1.email,
    //     category: user1.category,
    //     complexity: user1.complexity,
    //     isAny: user1.isAny
    //   },
    //   user2: {
    //     email: user2.email,
    //     category: user2.category,
    //     complexity: user2.complexity,
    //     isAny: user2.isAny
    //   },
    //   datetime: new Date().toLocaleString("en-SG")
    // };

    // console.log("room ID", roomId);

    // const response = await matchCollection.doc(roomId).set(matchJson);
    const roomId = "2d445067-b4bf-4a70-b29e-49caf7e12300";
    const response = "";
    return { status: 200, msg: "Match created successfully", response, roomId };
  } catch (error) {
    return { status: 500, error: error.message };
  }
}

module.exports = {
  createMatch
};