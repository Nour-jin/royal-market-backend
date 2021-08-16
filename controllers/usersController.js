const User = require("../models/User");
const createError = require("http-errors");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { Mongoose } = require("mongoose");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password -__v")
      .sort("lastName")
      .limit(5);
    res.status(200).send(users);
  } catch (e) {
    next(e);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password -__v");
    if (!user) throw new createError.NotFound();
    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};

exports.getWatchProducts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({ path: "likes", populate :{path: "likeCount"}})
    res.status(200).send(user.likes);
  } catch (e) {
    console.log(e)
    next(e);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new createError.NotFound();
    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) throw new createError.NotFound();
    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};
// register a new user
exports.addUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const user = new User(req.body);
    const token = user.generateAuthToken();
    await user.save();
    const data = user.getPublicFields();

    res
      .status(200)
      .header("x-auth", token)
      .send(data);
  } catch (e) {
    next(e);
  }
};

exports.loginUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    // const allUsers = await User.find();
    const user = await User.findOne({ email });
    if (!user) throw new createError.NotFound("User not found");
    const valid = await user.checkPassword(password);
    if (!valid) throw new createError(401, "Password incorrect");

    const data = user.getPublicFields();
    const token = user.generateAuthToken();

    res.status(200).header("x-auth", token).send(data);
  } catch (e) {
    next(e);
  }
};

exports.addLikeProduct = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    let like = user.likes.some(el => el == req.body.like)
    if (!like) {
      user.likes.push(req.body.like)
    } else {
      const like = user.likes.filter(el => el != req.body.like)
      user.likes = like
    }
    await user.save()
    const data = user.getLikesFields();
    if (!user) throw new createHttpError.NotFound();
      res.status(200).send(data);
  } catch (e) {
    next(e);
  }
};

