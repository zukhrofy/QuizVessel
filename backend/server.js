// process.env
require("dotenv").config();

// import module
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

// express instance
const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

// import api routes
const userRouter = require("./routes/user");
const quizRouter = require("./routes/quiz");
const playRouter = require("./routes/play");
const reportRouter = require("./routes/report");

app.use("/api/users", userRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/play", playRouter);
app.use("/api/report", reportRouter);

// connect db and server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("db connect and listening on port", process.env.PORT);
    });
  })
  .catch((err) => console.error(err));
