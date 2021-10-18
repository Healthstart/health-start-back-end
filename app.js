const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const lutinRouter = require("./routes/lutin");

const con = require("./db/mysql");
con.connect((err) => {
  if (err) throw err;
  console.log("DB Connected");
  // con.query("CREATE TABLE lutins(lutin_id INT AUTO_INCREMENT PRIMARY KEY,view_count INT,lutin_name VARCHAR(35),lutin_index VARCHAR(255),lutin_content JSON,email VARCHAR(35),foreign key (email) references users(email))", (err, data) => {
  //   if (err) throw err;
  //   console.log("table created!");
  // })
});

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/lutin", lutinRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
