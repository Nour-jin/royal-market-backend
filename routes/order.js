const express = require("express");
const router = express.Router();
const auth = require("../middleware/authenticator");
const {
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  addOrder
} = require("../controllers/ordersController");

router
  .route("/")
  .get(auth, getOrders)
  .post(auth, addOrder);

router
  .route("/:id")
  .get(auth, getOrder)
  .delete(auth, deleteOrder)
  .put(auth, updateOrder);

module.exports = router;