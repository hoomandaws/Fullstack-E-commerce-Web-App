const { SELLER, BUYER } = require("../constant/role");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const authJWT = (req, res, next) => {
  let token = req.headers.authorization?.replaceAll("Bearer ", "");

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.jwt_salt);
      req.user = decoded;
      //   console.log(decoded);
      return next();
    } catch (error) {
      // leave it
    }
  }
  return res.status(401).send({
    message: "unauthenticate",
  });
};
const isSeller = (req, res, next) => {
  if (req.user?.matchEmail.role === SELLER) {
    return next();
  }
  return res.status(403).send({
    error: "Only for seller",
  });
};
const isBuyer = (req, res, next) => {
  if (req.user?.matchEmail.role === BUYER) {
    return next();
  }
  return res.status(403).send({
    error: "Order can only placed by Buyer",
  });
};
module.exports = { authJWT, isSeller, isBuyer };
git 