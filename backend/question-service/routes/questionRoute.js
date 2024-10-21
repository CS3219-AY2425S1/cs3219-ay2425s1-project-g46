// Author(s): Calista, Xiu Jia, Xue Ling
const express = require("express");
const router = express.Router();

const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getRandomQuestionsByCategory,
  getRandomQuestionsByCategoryAndComplexity
} = require("../controller/questionController");

router.get("/", getAllQuestions);
router.get("/:questionId", getQuestionById);
router.post("/add", createQuestion);
router.put("/update/:questionId", updateQuestion);
router.delete("/delete/:questionId", deleteQuestion);
router.get("/random/:category", getRandomQuestionsByCategory);
router.get("/random/:category/:complexity", getRandomQuestionsByCategoryAndComplexity);

module.exports = router;