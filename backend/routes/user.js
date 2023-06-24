// import module
const express = require("express");
const router = express.Router();

// import controller
const {
  validate,
  loginUser,
  signupUser,
} = require("../controllers/UserController");

// // login route
router.post("/login", validate("loginUser"), loginUser);
// signup route
router.post("/signup", validate("signupUser"), signupUser);

module.exports = router;
