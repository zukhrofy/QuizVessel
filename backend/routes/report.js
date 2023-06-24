// import module
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
// import controller
const {
  getReport,
  getReportDetail,
} = require("../controllers/ReportController");

router.use(requireAuth);

// get all quiz
router.get("/", getReport);
router.get("/:id", getReportDetail);

module.exports = router;
