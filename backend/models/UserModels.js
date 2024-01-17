// import module
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// static signup method
userSchema.statics.signup = async function (email, username, password) {
  // check if email exists
  const emailExists = await this.findOne({ email });
  if (emailExists) {
    throw Error("Email already in use");
  }

  const usernameExists = await this.findOne({ username });
  if (usernameExists) {
    throw Error("username already in use");
  }
  // salt and hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  // create user
  const user = await this.create({ email, username, password: hash });
  return user;
};

module.exports = mongoose.model("User", userSchema);
