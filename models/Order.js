const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  products: [
    {
      product: {
        ref: "Product",
        type: mongoose.Schema.Types.ObjectId
      },
      user: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
      },
      amount: {
        type: Number
      }
    },
  ],
});

module.exports = mongoose.model("Order", OrderSchema);

