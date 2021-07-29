const createError = require("http-errors");

const isAdmin = async (req, res, next) => {
  const role = req.user.role;
  if (role !== "Admin") next(new createError.NotFound("Not admin"));
  next();
};

module.exports = isAdmin;
