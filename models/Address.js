const mongoose = require("mongoose");
const { Schema } = mongoose;

const AddressSchema = new Schema({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  PostalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  housNum: {
    type: String,
    require: true,
  },
});

module.exports = AddressSchema;
