var express = require("express");
const passport = require("passport");
const user = require("../models/user");
var router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const generateToken = require("../utils/generateToken");

router.post(
  "/register",
  catchAsync(async (req, res) => {
    const { email, username, password } = req.body;
    const existUsername = await User.findOne({ username });
    if (existUsername) {
      res.status(400);
      throw new Error("שם משתמש תפוס");
    }
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      res.status(400);
      throw new Error("האימייל תפוס");
    }
    const user = new User({ email, username, password });
    await user.save();
    if (user) {
      res.status(201).send({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("נתוני משתמש לא חוקיים");
    }

    // const {_id} = await User.register(user, password);
    // return res.json({_id, email, username});
  })
);

router.post(
  "/login",
  catchAsync(async (req, res, next) => {
    // passport.authenticate("local", (err, user, info) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   if (!user) {
    //     return res.status(500).end();
    //   }
    //   req.logIn(user, (err) => {
    //     if (err) {
    //       return next(err);
    //     }
    //     const { _id, email, username } = req.user;
    //     const connectedUserData={_id,email,username}
    //     return res.json(connectedUserData);
    //   });
    // })(req, res, next);
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      res.send({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("שם המשתמש או הסיסמה אינם נכונים!");
    }
  })
);

module.exports = router;
