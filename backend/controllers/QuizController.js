// import third library
const { parse } = require("date-fns");
const randomstring = require("randomstring");
const { getTime } = require("date-fns");
// Models
const Quiz = require("../models/QuizModels");
const Report = require("../models/ReportModels");

// get all quiz
const getQuiz = async (req, res) => {
  const user_id = req.user._id;
  const quiz = await Quiz.find({ user_id }).sort({ createdAt: -1 });
  res.status(200).json(quiz);
};

// create new quiz
const createQuiz = async (req, res) => {
  try {
    const user_id = req.user._id;
    const quiz = await Quiz.create({ ...req.body, user_id });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update quiz
const updateQuiz = async (req, res) => {
  const id = req.params.id;

  try {
    const quiz = await Quiz.findByIdAndUpdate(id, req.body);
    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get quiz detail
const getQuizDetail = async (req, res) => {
  const id = req.params.id;
  const quiz = await Quiz.findById(id);
  res.status(200).json(quiz);
};

// assign quiz
const assignQuiz = async (req, res) => {
  const quiz_id = req.params.id;

  // create token for gameplay
  const token = randomstring.generate({ length: 7 });
  const deadline = req.body.deadline;

  // ubah deadline menjadi timestamp detik
  const date = parse(deadline, "yyyy-MM-dd", new Date());
  const newDeadline = Math.floor(getTime(date) / 1000);

  // get quiz and assign them in report
  const quiz = await Quiz.findById(quiz_id);
  let obj = quiz.toObject();
  delete obj._id;
  newReportData = {
    ...obj,
    quiz_id,
    token,
    deadline: newDeadline,
  };

  const newReport = await Report.create(newReportData);
  res.status(200).json(newReport);
};

module.exports = { getQuiz, createQuiz, getQuizDetail, updateQuiz, assignQuiz };
