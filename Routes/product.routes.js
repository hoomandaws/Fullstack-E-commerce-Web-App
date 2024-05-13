const express = require("express");
const {
  getProduct,
  postProduct,
  updateProduct,
  deleteProduct,
} = require("../controlers/product");
const { authJWT, isSeller } = require("../middelwares/auth");
const productRouter = express.Router();

productRouter.get("", getProduct);
productRouter.post("", authJWT, isSeller, postProduct);
productRouter.put("/:_id", updateProduct);
productRouter.delete("/:_id", deleteProduct);
module.exports = productRouter;
