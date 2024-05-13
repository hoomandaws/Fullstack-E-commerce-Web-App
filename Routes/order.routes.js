const express = require("express");
const createOrder = require("../controlers/order");
const { isBuyer, authJWT } = require("../middelwares/auth");
const orderRouter = express.Router();

orderRouter.post("", authJWT, isBuyer, createOrder);
module.exports = orderRouter;
