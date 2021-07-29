var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");
var { corsMiddleware } = require("./middleware/cors");
var userInfo = require("./middleware/userInfo");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productsRouter = require("./routes/products");
var orderRouter = require("./routes/order");

var app = express();
app.use(cors({exposedHeaders:"x-auth"}));
require("dotenv").config();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
/** ENV VARIABLES **/
const dBURL = process.env.DB_URL;
const dBPassword = process.env.DB_PASSWORD;
const dBUser = process.env.DB_USER;

/**CONNECT TO DB */
const localDbURI = "mongodb://localhost:27017/online-shop";
const atlasURI = `mongodb+srv://${dBUser}:${dBPassword}@${dBURL}`;
mongoose.connect(process.env.DB_URL ? atlasURI : localDbURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", console.error);
mongoose.connection.on("open", function () {
  console.log("Database connection established...");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(userInfo);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", orderRouter);

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
