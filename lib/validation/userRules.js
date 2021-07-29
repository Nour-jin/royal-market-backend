const { body } = require("express-validator");

exports.userValidationRules = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Your email looks funky..."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Minimum password length is 8"),
  body("firstName")
    .exists()
    .trim()
    .escape()
    .withMessage("Please give us your first name."),
  body("userName")
    .exists()
    .trim()
    .escape()
    .withMessage("Please give us a username."),
];
