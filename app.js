if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

const groupmembersRouter = require("./routes/groupmembers");
const usersRouter = require("./routes/users");
const groupsRouter = require("./routes/groups");

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

const secret = process.env.SECRET;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret: secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("session store error", e);
});

const sessionConfig = {
  store,
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 100 * 60 * 60 * 24 * 7,
    maxAge: 100 * 60 * 60 * 24 * 7,
  },
};

app.use(cors());
app.use(session(sessionConfig));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use("/groupmembers", groupmembersRouter);
app.use("/users", usersRouter);
app.use("/groups", groupsRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use((err, req, res, next) => {
  let message = err.message;
  if (!err.message) err.message = "קרתה בעיה, נסה שוב מאוחר יותר.";
  res.send(message);
});

module.exports = app;
