// Author(s): Calista, Xiu Jia, Xue Ling
const express = require("express");
const router = express.Router();

const {
  submitCode,
  getSubmissionResult,
} = require("../controller/collabController");

router.post("/submitCode", submitCode);
router.get("/getSubmissionResult/:submissionId", getSubmissionResult);

module.exports = router;
