// import module
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

// import models
const User = require("../models/UserModels");

// create jwt token utils
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// form validation
const validate = (method) => {
  switch (method) {
    case "signupUser": {
      return [
        body("email", "Invalid email")
          .exists()
          .isEmail()
          .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) throw new Error("E-mail sudah digunakan");
          }),
        body("username")
          .exists()
          .custom(async (value) => {
            const user = await User.findOne({ username: value });
            if (user) throw new Error("Username sudah digunakan");
          }),
        body("password").exists().isLength({ min: 8 }),
      ];
    }
    case "loginUser": {
      return [
        body("email", "Invalid email")
          .exists()
          .isEmail()
          .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (!user) throw new Error("E-mail tidak ditemukan");
          }),
        body("password").exists(),
      ];
    }
  }
};

// signup a user
const signupUser = async (req, res) => {
  // catch validation error
  const errors = validationResult(req);
  // return error
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array(),
    });
  }

  // next process
  const { email, username, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // create user
    const user = await User.create({ email, username, password: hash });
    // create jwt token from registered user
    const token = createToken(user._id);
    res.status(200).json({ email, username, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
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

  // next process
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    // compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw Error("Incorrect password");
    // create token if success
    const token = createToken(user._id);
    res.status(200).json({ email, username: user.username, token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = { validate, signupUser, loginUser };
