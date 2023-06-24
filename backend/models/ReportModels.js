// import module
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReportSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    quiz_id: {
      type: String,
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
      type: String,
    },
    questions: {
      type: Array,
      default: undefined,
    },
    sections: {
      type: Array,
      default: undefined,
    },
    token: {
      type: String,
    },
    finished: {
      type: Boolean,
      default: false,
    },
    deadline: {
      type: String,
    },
    participant: [{ type: Schema.Types.ObjectId, ref: "Participant" }],
  },
  { timestamps: true }
);

ReportSchema.post("findOne", function (doc) {
  if (!doc) {
    return;
  }
  // to make sure the quiz cant access after deadline
  deadline = doc.deadline;
  currentTime = Date.now() / 1000;
  if (currentTime > deadline) {
    doc.finished = true;
    return doc.save();
  }
});

module.exports = mongoose.model("Report", ReportSchema);
