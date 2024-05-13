const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    instock: {
      type: Number,
      required: true,
      default: 0,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 10,
      required: true,
    },
    description: {
      type: String,
      maxLength: 1000,
      default: "",
    },
    user_info: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("product", productSchema);
module.exports = Product;
