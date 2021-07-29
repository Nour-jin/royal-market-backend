const express = require("express");
const router = express.Router();
const { validateInputs } = require("../middleware/validator");
const { userValidationRules } = require("../lib/validation/userRules");
const auth = require("../middleware/authenticator");
const isAdmin = require("../middleware/rolesAuthenticator");
const { body } = require("express-validator");
const checkLogin = require("../middleware/checkLogin");

const {
  addLikeProduct,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addUser,
  loginUser,
} = require("../controllers/usersController");

router
  .route("/")
  .get(auth, getUsers)
  .post(validateInputs(userValidationRules), addUser);

router.route("/login").post(loginUser);
// router.route("/:id/like").put(addLikeProduct)
router
  .route("/:id")
  .get(auth, getUser)
  .delete(auth, deleteUser)
  .put(auth, updateUser);

module.exports = router;
