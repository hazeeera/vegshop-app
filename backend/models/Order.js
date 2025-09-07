const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number,
      totalPrice: Number,
    },
  ],
  grandTotal: Number,
  orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
