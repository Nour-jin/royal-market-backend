const { validationResult } = require("express-validator");
//validator is need to get an array of validation errors

const validateInputs = (rules) => {
  return [
    ...rules,
    (req, res, next) => {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        return next();
      }

      const extractedErrors = [];
      errors
        .array()
        .map((err) => extractedErrors.push({ [err.param]: err.msg }));

      return res.status(422).json({
        errors: extractedErrors,
      });
    },
  ];
};

module.exports = { validateInputs };
