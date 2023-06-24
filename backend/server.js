// process.env
require("dotenv").config();

// import module
const express = require("express");
const mongoose = require("mongoose");

// express instance
const app = express();

// import api routes
const userRouter = require("./routes/user");
const quizRouter = require("./routes/quiz");
const reportRouter = require("./routes/report");
const playRouter = require("./routes/play");

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// use api routes
app.use("/users", userRouter);
app.use("/quiz", quizRouter);
app.use("/report", reportRouter);
app.use("/play", playRouter);

// connect db and server
mongoose
  .connect("mongodb://0.0.0.0:27017/skripsi")
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("db connect and listening on port", process.env.PORT);
    });
  })
  .catch((err) => console.error(err));
