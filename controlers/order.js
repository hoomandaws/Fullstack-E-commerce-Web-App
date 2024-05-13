const Order = require("../models/Order");
const Joi = require("joi");
const Product = require("../models/product");
const orderCreatevalidate = Joi.object({
  product: Joi.array()
    .items({
      _id: Joi.required(),
      quantity: Joi.number().required().min(1),
    })
    .min(1)
    .required(),
});
const createOrder = async (req, res, next) => {
  //
  //server validation
  //
  try {
    await orderCreatevalidate.validateAsync(req.body, {
      allowUnknown: true,
      abortEarly: false,
    });
  } catch (err) {
    return res.status(400).send({ error: err.details.map((el) => el.message) });
  }
  //
  // logical side
  //
  try {
    //
    // validate that if (req.body.quantity<=req.body.product[index].quantity){
    //
    for (let index = 0; index < req.body.product.length; index++) {
      let el = req.body.product[index];
      let dbProduct = await Product.findById(el._id);
      if (!dbProduct) {
        return res.status(404).send({
          error: "Placed Product not found",
        });
      }
      if (req.body.product[index].quantity <= dbProduct.instock) {
        //
        //getting price and title from product Modle
        //
        let product = [];
        for (let index = 0; index < req.body.product.length; index++) {
          let el = req.body.product[index];
          let dbProduct = await Product.findById(el._id);
          product.push({
            _id: el._id,
            quantity: el.quantity,
            rate: dbProduct.price,
            title: dbProduct.title,
          });
          //
          // create order
          //
          let order = await Order.create({ product });
          //
          //function for decrease product instock after making Order
          //
          let orderProduct = order.product;
          orderProduct.forEach(async (el) => {
            await Product.findByIdAndUpdate(el._id, {
              $inc: { instock: -el.quantity },
            });
          });
          return res.status(200).send(order);
        }
      }
      return res.status(401).send({
        Error: `Insufficient quantity for product ${dbProduct.title}`,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = createOrder;
