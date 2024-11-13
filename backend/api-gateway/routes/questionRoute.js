const express = require('express');
const {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getRandomQuestionsByCategory,
  getRandomQuestionsByCategoryAndComplexity
} = require('../services/questionService');

const questionRouter = express.Router();

// Route to get all questions
questionRouter.get('/', async (req, res) => {
  try {
    const response = await getQuestions();
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.status).send({ error: error.response.data.error });
  }
});

// Route to create a new question
questionRouter.post('/add', async (req, res) => {
  try {
    const response = await createQuestion(req.body);
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.status).send({ error: error.response.data.error });
  }
});

// Route to get question by id
questionRouter.get('/:questionId', async (req, res) => {
  try {
    const id = req.params.questionId;
    const response = await getQuestionById(id);
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.status).send({ error: error.response.data.error });
  }
});

// Route to update question by id
questionRouter.put("/update/:questionId", async (req, res) => {
  try {
    const id = req.params.questionId;
    const response = await updateQuestion(id, req.body);
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.status).send({ error: error.response.data.error });
  }
})

// Route to delete question by id
questionRouter.delete("/delete/:questionId", async (req, res) => {
  try {
    const id = req.params.questionId;
    const response = await deleteQuestion(id);
    res.status(response.status).send({ message: response.data.message });
  } catch (error) {
    res.status(error.status).send({ error: error.response.data.error });
  }
})

// Route to get a random question by category
questionRouter.get("/random/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const response = await getRandomQuestionsByCategory(category);
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.status).send({ error: error.response.data.error });
  }
})

// Route to get a random question by category and complexity
questionRouter.get("/random/:category/:complexity", async (req, res) => {
  try {
    const category = req.params.category;
    const complexity = req.params.complexity;
    const response = await getRandomQuestionsByCategoryAndComplexity(category, complexity);
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(error.status).send({ error: error.response.data.error });
  }
})

module.exports = questionRouter;