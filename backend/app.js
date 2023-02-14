require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");

const app = express();

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));

app.use("/", indexRouter);
app.use("/auth", authRouter);

module.exports = app;
