// import module
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ParticipantSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  finished: {
    type: Boolean,
    default: false,
    required: true,
  },
  result: {
    type: Object,
  },
  nilaiAkhir: {
    type: Number,
  },
  report: { type: Schema.Types.ObjectId, ref: "Report", required: true },
});

module.exports = mongoose.model("Participant", ParticipantSchema);
