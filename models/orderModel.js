const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "user can not be empty!"],
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    required: [true, "tour can not be empty!"],
  },
  status: {
    type: String,
    default: "open",
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
