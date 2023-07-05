const Participant = require("../models/ParticipantModels");
const Report = require("../models/ReportModels");

const getReport = async (req, res) => {
  const user_id = req.user._id;
  const report = await Report.find({ user_id }).sort({ createdAt: -1 });
  res.status(200).json(report);
};

const getReportDetail = async (req, res) => {
  const reportId = req.params.id;

  const report = await Report.findById({ _id: reportId }).populate({
    path: "participant",
    match: { finished: true },
    populate: {
      path: "user_id",
      select: "username",
    },
  });

  if (!report) {
    return res.status(404).json({ error: "Report not found" });
  }

  res.status(200).json(report);
};

module.exports = { getReport, getReportDetail };
