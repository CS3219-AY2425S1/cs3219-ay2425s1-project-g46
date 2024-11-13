// Author(s): Calista, Xiu Jia, Xue Ling
const db = require("../config/firebase");
const matchCollection = db.collection("matches");

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
    const matchJson = {
      user1: {
        email: user1.email,
        category: user1.topic,
        complexity: user1.difficultyLevel,
        isAny: user1.isAny
      },
      user2: {
        email: user2.email,
        category: user2.topic,
        complexity: user2.difficultyLevel,
        isAny: user2.isAny
      },
      createdAt: new Date().toLocaleString("en-SG")
    };

    const matchRef = await matchCollection.doc();

    await matchRef.set(matchJson);

    // Get match id
    const id = matchRef.id;

    return { status: 200, msg: "Match created successfully", matchData: matchJson, id };
  } catch (error) {
    return { status: 500, error: error.message };
  }
}

module.exports = {
  createMatch
};