const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    product: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref:'product',
          required: true,
        },
        quantity: {
          type: String,
          required: true,
        },
        rate: {
          type: Number,
        },
        title: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
