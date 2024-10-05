// Author(s): Calista, Xiu Jia, Xue Ling
const db = require("../db/firebase");
const questionCollection = db.collection("questions");

/**
 * POST /add
 *
 * Creates questions from form data and store in firebase
 *
 * Responses:
 * - 500: Server error if something goes wrong while fetching data.
 */
const createQuestion = async (req, res) => {
  try {
    console.log(req.body);
    const questionJson = {
      title: req.body.title.trim(),
      category: req.body.category,
      complexity: req.body.complexity,
      description: req.body.description,
    };

    const querySnap = await questionCollection.where('title', '==', req.body.title.trim()).get();
    if (!querySnap.empty) {
      return res.status(409).json({ message: 'Duplicate entry found' });
    }

    const response = questionCollection.doc().set(questionJson); // Added 'await'
    res.send({ message: "Question created successfully", response });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

/**
 * GET /question/
 *
 * Retrieves data from firebase from questions collection.
 *
 * Responses:
 * - 200: Returns an array of data matching the query parameters.
 * - 500: Server error if something goes wrong while fetching data.
 */
const getAllQuestions = async (req, res) => {
  try {
    const questions = await questionCollection.get();

    const questionArray = [];

    if (questions.empty) {
      res.status(400).send("No questions found.");
    }

    questions.forEach((doc) => {
      questionArray.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(questionArray);
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    res.status(500).json({ message: "Error fetching data from Firebase" });
  }
};

/**
 * GET /question/<questionId>
 * 
 * Retrieves specified question from questions collection in firebase.
 * 
 * Responses:
 * - 200: Returns data matching the questionId.
 * - 500: Server error if something goes wrong while fetching data.
 */
const getQuestionById = async (req, res) => {
  try {
    const id = req.params.questionId;
    const question = questionCollection.doc(id);
    const data = await question.get();

    if (!data.exists) {
      return res.status(404).send({ message: "Question not found" });
    }

    res.status(200).send(data.data());
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

/**
 * PUT /question/update/<questionId>
 * 
 * Updates specified question from questions collection in firebase.
 */
const updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    console.log("Updating question ID:", questionId);

    const updatedQuestion = {
      title: req.body.title.trim(),
      category: req.body.category,
      complexity: req.body.complexity,
      description: req.body.description,
    };
    const querySnap = await questionCollection.where('title', '==', req.body.title.trim()).get();
    if (!querySnap.empty) {
      for (const doc of querySnap.docs) {
        if (doc.id != questionId) {
          return res.status(409).json({ message: 'Duplicate entry found' });
        }
      }
    }
    const response = await questionCollection.doc(questionId).set(updatedQuestion, { merge: true });

    res.send({ message: "Question updated successfully", response });
  } catch (error) {
    console.log(error.message)
    res.status(500).send({ error: error.message });
  }
}

/**
 * DELETE /question/delete/<questionId>
 * 
 * Deletes specified question from questions collection in firebase.
 */
const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId; 
    console.log("Deleting question ID:", questionId);
    
    await questionCollection.doc(questionId).delete();

    res.send({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

module.exports = { createQuestion,
                    getAllQuestions,
                    getQuestionById,
                    updateQuestion,
                    deleteQuestion
                  };