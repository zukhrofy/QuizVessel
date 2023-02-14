var express = require("express");
var router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

router.post("/register", async (req, res) => {
  const user = req.body;

  const takenUsername = await User.findOne({ username: user.username });

  if (takenUsername) {
    res.json({ message: "Username or email has already been taken" });
  } else {
    user.password = await bcrypt.hash(user.password, 10);

    const dbUser = new User({
      username: user.username.toLowerCase(),
      email: user.email,
      password: user.password,
    });

    dbUser.save();
    res.json({ message: "Success" });
  }
});

router.post("/login", (req, res) => {
  const userLoggingIn = req.body;

  User.findOne({ username: userLoggingIn.username }).then((dbUser) => {
    if (!dbUser) {
      return res.json({ message: "invalid Username or Password" });
    }
    bcrypt
      .compare(userLoggingIn.password, dbUser.password)
      .then((isCorrect) => {
        if (isCorrect) {
          const payload = {
            id: dbUser._id,
            username: dbUser.username,
          };
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 86400 },
            (err, token) => {
              if (err) {
                return res.json({ message: err });
              }
              return res.json({ message: "success", token: "Bearer " + token });
            }
          );
        } else {
          return res.json({ message: "invalid username or password" });
        }
      });
  });
});

module.exports = router;
