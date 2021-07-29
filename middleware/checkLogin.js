const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["x-auth"];
  try {
    const tokenData = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = tokenData;
    next();
  } catch (error) {
    next(error);
  }
};
