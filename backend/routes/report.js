// import module
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");

// import controller
const {
  getReport,
  getReportDetail,
} = require("../controllers/ReportController");

// use auth middleware
router.use(requireAuth);

// get all report(assigned quiz)
router.get("/", getReport);
// get report detail
router.get("/:id", getReportDetail);

module.exports = router;
