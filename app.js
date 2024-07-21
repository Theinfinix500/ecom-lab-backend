const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const usersRouter = require("./routes/users");
const homeRouter = require("./routes/home");
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", homeRouter);
app.use("/users", usersRouter);

app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((error, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = error.message;
  res.locals.error = req.app.get("env") === "development" ? error : {};

  // render the error page
  res.status(error.status || 500);
  res.json({ error });
});

module.exports = app;
