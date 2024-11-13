// Author(s): Calista, Xiu Jia, Xue Ling
const db = require("../config/firebase");
const matchCollection = db.collection("matches");

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
      createdAt: new Date().toLocaleString("en-SG"),
      status: "ongoing"
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

const getMatchById = async (id) => {
  try {
    const match = matchCollection.doc(id);
    const data = await match.get();

    if (!data.exists) {
      return { status: 404, error: "Match not found" };
    }

    return { status: 200, msg: "Match retrieved successfully", data: data.data() };
  } catch (error) {
    return { status: 500, error: error.message };
  }
}

const updateMatch = async (id) => {
  try {
    console.log("Updating match ID:", id);

    const response = await matchCollection.doc(id).set({ status: "completed" }, { merge: true });

    return { status: 200, msg: "Match updated successfully", response };
  } catch (error) {
    console.log(error.message)
    return { status: 500, error: error.message };
  }
}

module.exports = {
  createMatch,
  getMatchById,
  updateMatch
};