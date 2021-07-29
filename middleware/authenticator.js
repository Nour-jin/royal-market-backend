const User = require("../models/User");
const createError = require("http-errors");

const auth = async (req, res, next) => {
  const token = req.header("x-auth");
  try {
    if (!req.token) throw new createError.NotFound("Invalid token");

    next();
  } catch (e) {
    next(e);
  }
};

module.exports = auth;
