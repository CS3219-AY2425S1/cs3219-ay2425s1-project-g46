const express = require('express');
const {
  submitCode,
  getSubmissionResult,
} = require('../services/collaborationService');

const collaborationRouter = express.Router();

collaborationRouter.post("/submitCode", async (req, res) => {
  try {
    const response = await submitCode(req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.status).json({ error: error.response.data.error });
  }
});

collaborationRouter.get("/getSubmissionResult/:submissionId", async (req, res) => {
  try {
    const submissionId = req.params.submissionId;
    const response = await getSubmissionResult(submissionId);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.status).json({ error: error.response.data.error });
  }
});

module.exports = collaborationRouter;