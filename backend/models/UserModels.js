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
  console.log(email);
  console.log(username);
  console.log(password);
  console.log("static method signup");
  // check if email exists
  const emailExists = await this.findOne({ email });
  if (emailExists) {
    console.log("email exist");
    throw Error("Email already in use");
  }

  const usernameExists = await this.findOne({ username });
  if (usernameExists) {
    console.log("username exist");
    throw Error("username already in use");
  }
  // salt and hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  // create user
  console.log("create user");
  const user = await this.create({ email, username, password: hash });
  console.log(user);
  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  // check if user exist
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Invalid email");
  }
  // compare password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }
  return user;
};

module.exports = mongoose.model("User", userSchema);