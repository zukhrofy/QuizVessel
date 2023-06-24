// import third library
const { parse } = require("date-fns");
const randomstring = require("randomstring");
const { getTime } = require("date-fns");
// Models
const Quiz = require("../models/QuizModels");
const Report = require("../models/ReportModels");

// get all quiz
const getQuiz = async (req, res) => {
  console.log("get all quiz");
  const user_id = req.user._id;
  const quiz = await Quiz.find({ user_id }).sort({ createdAt: -1 });
  res.status(200).json(quiz);
};

// create new quiz
const createQuiz = async (req, res) => {
  console.log("create quiz");
  try {
    console.log(req.body);
    const user_id = req.user._id;
    const quiz = await Quiz.create({ ...req.body, user_id });
    console.log(quiz);
    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update quiz
const updateQuiz = async (req, res) => {
  console.log("update quiz");
  const id = req.params.id;

  try {
    const quiz = await Quiz.findByIdAndUpdate(id, req.body);
    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getQuizDetail = async (req, res) => {
  const id = req.params.id;

  const quiz = await Quiz.findById(id);
  res.status(200).json(quiz);
};

const assignQuiz = async (req, res) => {
  const quiz_id = req.params.id;

  // create token for gameplay
  const token = randomstring.generate({ length: 7 });
  const deadline = req.body.deadline;

  // parse deadline into timestamp
  const date = parse(deadline, "yyyy-MM-dd", new Date());
  // Divide by 1000 to convert from milliseconds to seconds
  const newDeadline = Math.floor(getTime(date) / 1000);

  // get quiz and assign them in report
  const quiz = await Quiz.findById(quiz_id);
  let obj = quiz.toObject();
  delete obj._id;
  newObj = {
    ...obj,
    quiz_id,
    token,
    deadline: newDeadline,
  };

  const newReport = await Report.create(newObj);

  res.status(200).json(newReport);
};

module.exports = { getQuiz, createQuiz, getQuizDetail, updateQuiz, assignQuiz };
