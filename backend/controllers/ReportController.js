const Participant = require("../models/ParticipantModels");
const Report = require("../models/ReportModels");

const getReport = async (req, res) => {
  console.log("masuk ambil report");
  const user_id = req.user._id;

  const report = await Report.find({ user_id }).sort({ createdAt: -1 });

  res.status(200).json(report);
};

const getReportDetail = async (req, res) => {
  console.log("masuk ambil detail report");
  const user_id = req.user._id;
  const _id = req.params.id;

  const report = await Report.findById({ _id }).populate({
    path: "participant",
    match: { finished: true },
  });

  res.status(200).json(report);
};

module.exports = { getReport, getReportDetail };
