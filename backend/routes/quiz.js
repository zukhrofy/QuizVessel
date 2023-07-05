// import module
const express = require("express");
const router = express.Router();

// import middleware
const requireAuth = require("../middleware/requireAuth");

// import controller
const {
  getQuiz,
  createQuiz,
  getQuizDetail,
  updateQuiz,
  assignQuiz,
} = require("../controllers/QuizController");

// use middleware
router.use(requireAuth);

// get all quiz
router.get("/", getQuiz);
// get quiz detail
router.get("/:id", getQuizDetail);
// post quiz
router.post("/", createQuiz);
// update quiz
router.patch("/:id", updateQuiz);
// asign quiz
router.post("/assign/:id", assignQuiz);

module.exports = router;
