const axios = require("axios");

// Base URL for the Collaboration Service
const COLLABORATION_SERVICE_URL = process.env.COLLABORATION_SERVICE_URL || "http://localhost:5003/collaboration"
const submitCode = async (collaborationData) => {
  try {
    const response = await axios.post(`${COLLABORATION_SERVICE_URL}/submitCode`, collaborationData);
    return response;
  } catch (error) {
    throw error;
  }
};

const getSubmissionResult = async (submissionId) => {
  try {
    const response = await axios.get(`${COLLABORATION_SERVICE_URL}/getSubmissionResult/${submissionId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

module.exports = { submitCode, getSubmissionResult };
