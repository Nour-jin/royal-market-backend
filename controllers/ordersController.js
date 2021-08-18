const Order = require("../models/Order");
const User = require("../models/User");
const createError = require("http-errors");
const { path } = require("../models/Address");

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate({ path: "products", populate: { path: "product user" } })
    res.status(200).send(orders);
  } catch (e) {
    next(e);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate({path: "products", populate: {path:"product user"}})
    if (!order) throw new createError.NotFound();
    res.status(200).send(order);
  } catch (e) {
    next(e);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) throw new createError.NotFound();
    res.status(200).send(order);
  } catch (e) {
    next(e);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!order) throw new createError.NotFound();
    res.status(200).send(order);
  } catch (e) {
    next(e);
  }
};

exports.addOrder = async (req, res, next) => {
  try {
    const order = new Order(req.body);
    await order.save();
    const newOrder = await order.populate({path: "products", populate: {path:"product user"}})
    res.status(200).send(newOrder);
  } catch (e) {
    next(e);
  }
};