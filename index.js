const express = require("express");
const fileUpload = require("express-fileupload");
const errorhandels = require("./middelwares/errorhandels");
const app = express();

require("./models/product");
require("./models/User");
require("./config/db");

/**
 * router middlerWare
 */
app.use(express.json());
app.use(fileUpload());
app.use("/uploads", express.static("uploads"));
app.use("/api/products", require("./Routes/product.routes"));
app.use("/api/auth", require("./Routes/auth.routes"));
app.use("/api/order", require("./Routes/order.routes"));
app.use(errorhandels);
//listen
let PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
