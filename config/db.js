const mongoose = require("mongoose");
require("dotenv").config();
module.exports = mongoose
  .connect(process.env.mongo_connect, {})
  .then(() => console.log("Connected!"))
  .catch((e) => {
    console.log("error in Database connection", e);
  });
