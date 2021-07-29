exports.corsMiddleware = (req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type, x-requested-with");
  next();
};
