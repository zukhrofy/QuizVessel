// import module
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
// import controller
const {
  getPlayQuizPreview,
  playQuizStart,
  processSubmit,
  getQuizResult,
} = require("../controllers/playQuizController");

router.use(requireAuth);

router.get("/:quizToken/preview/", getPlayQuizPreview);
router.get("/:quizToken/start/", playQuizStart);
router.get("/:quizToken/result/", getQuizResult);
router.post("/:quizToken/processAnswer/", processSubmit);

module.exports = router;
