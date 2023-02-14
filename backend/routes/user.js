const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/VerifyTokens");

router.get("/", verifyJWT, (req, res) => {
  res.json({ isLoggedIn: true, userame: req.user.userame });
});

module.exports = router;
