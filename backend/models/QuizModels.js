// import module
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QuizSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    quiz_type: {
      type: String,
      required: true,
    },
    time_limit: {
      type: Number,
    },
    questions: {
      type: Array,
      default: undefined,
    },
    sections: {
      type: Array,
      default: undefined,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", QuizSchema);
