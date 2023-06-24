// import module
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ParticipantSchema = new Schema({
  user_id: {
    type: String,
  },
  start_time: {
    type: String,
  },
  end_time: {
    type: String,
  },
  personalDeadline: {
    type: String,
  },
  finished: {
    type: Boolean,
    default: false,
  },
  result: {
    type: Object,
  },
  nilaiAkhir: {
    type: Schema.Types.Mixed,
  },
  report: { type: Schema.Types.ObjectId, ref: "Report" },
});

module.exports = mongoose.model("Participant", ParticipantSchema);
