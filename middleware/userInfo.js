const User = require("../models/User");
const createError = require("http-errors");

const userInfo = async (req, res, next) => {
  const token = req.header("x-auth");
  try {
    const user = await User.findByToken(token);
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = userInfo;
