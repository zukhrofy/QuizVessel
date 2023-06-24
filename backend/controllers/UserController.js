// import module
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

// import models
const User = require("../models/UserModels");

// create jwt token function
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// form validation
const validate = (method) => {
  switch (method) {
    case "signupUser": {
      return [
        body("email", "Invalid email").exists().isEmail(),
        body("username").exists(),
        body("password").exists().isLength({ min: 8 }),
      ];
    }
    case "loginUser": {
      return [
        body("email", "Invalid email").exists().isEmail(),
        body("password").exists(),
      ];
    }
  }
};

// signup a user
const signupUser = async (req, res) => {
  console.log("signup");
  // catch validation error
  const errors = validationResult(req);
  // return error
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array(),
    });
  }
  const { email, username, password } = req.body;
  try {
    // signup user
    const user = await User.signup(email, username, password);
    // create jwt token from registered user
    const token = createToken(user._id);
    res.status(200).json({ email, username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// login a user
const loginUser = async (req, res) => {
  // catch validation error
  const errors = validationResult(req);
  // if error return error
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array(),
    });
  }

  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    // create a token
    const token = createToken(user._id);
    res.status(200).json({ email, username: user.username, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { validate, signupUser, loginUser };
