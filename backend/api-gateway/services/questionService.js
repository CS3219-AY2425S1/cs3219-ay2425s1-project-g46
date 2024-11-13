const axios = require('axios');

// Base URL for the Question Service
const QUESTION_SERVICE_URL = process.env.QUESTION_SERVICE_URL || 'http://localhost:5000/question';

const createQuestion = async (questionData) => {
  try {
    const response = await axios.post(`${QUESTION_SERVICE_URL}/add`, questionData);
    return response;
  } catch (error) {
    throw new Error(`Question Service Error: ${error.message}`);
  }
}

const getQuestions = async () => {
  try {
    const response = await axios.get(`${QUESTION_SERVICE_URL}`);
    return response;
  } catch (error) {
    throw error;
  }
}

const getQuestionById = async (questionId) => {
  try {
    const response = await axios.get(`${QUESTION_SERVICE_URL}/${questionId}`);
    return response;
  } catch (error) {
    throw error;
  }
}

const updateQuestion = async (questionId, questionData) => {
  try {
    const response = await axios.put(`${QUESTION_SERVICE_URL}/update/${questionId}`, questionData);
    return response;
  } catch (error) {
    throw error;
  }
}

const deleteQuestion = async (questionId) => {
  try {
    const response = await axios.delete(`${QUESTION_SERVICE_URL}/delete/${questionId}`);
    return response;
  } catch (error) {
    throw error;
  }
}

const getRandomQuestionsByCategory = async (category) => {
  try {
    const response = await axios.get(`${QUESTION_SERVICE_URL}/random/${category}`);
    return response;
  } catch (error) {
    throw error;
  }
}

const getRandomQuestionsByCategoryAndComplexity = async (category, complexity) => {
  try {
    const response = await axios.get(`${QUESTION_SERVICE_URL}/random/${category}/${complexity}`);
    return response;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getRandomQuestionsByCategory,
  getRandomQuestionsByCategoryAndComplexity
};