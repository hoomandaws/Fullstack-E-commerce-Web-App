const Product = require("../models/product");
const path = require("path");
const Joi = require("joi");
const fs = require("fs");

/**
 * get routes
 */
const getProduct = async (req, res) => {
  try {
    let sort = req.query.sort || "dateDesc";
    let priceFrom = parseFloat(req.query.priceFrom) || 0;
    let priceTo = parseFloat(req.query.priceTo) || 99999999;
    let perPage = parseFloat(req.query.perPage) || 5;
    let sortBy = {
      createdAt: -1,
    };
    if (sort == "priceAsc") {
      sortBy = {
        price: 1,
      };
    } else if (sort == "priceDesc") {
      sortBy = {
        price: -1,
      };
    } else if (sort == "titleAsc") {
      sortBy = {
        price: 1,
      };
    } else if (sort == "titleDesc") {
      sortBy = {
        price: -1,
      };
    }

    /**
     * search facility
     * By price
     * By title
     */
    const readProducts = await Product.find({
      title: new RegExp(req.query.q, "i"),
      $and: [{ price: { $gte: priceFrom } }, { price: { $lte: priceTo } }],
    })
      .sort(sortBy)
      .limit(perPage);
    res.status(200).send(readProducts);
  } catch (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.message,
    });
  }
};
/**
 * server side validation using joi validator
 */
const validateCreateProducts = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number().required(),
  image: Joi.object({
    data: Joi.binary().encoding("base64").required(),
    mimetype: Joi.string()
      .valid("image/jpeg", "image/png", "image/gif")

      .required(),
    size: Joi.number()
      .max(2 * 1024 * 1024) // 2MB
      .message(`Image must be less than or equal to 2 MB`)
      .required(),
  }),
});
const postProduct = async (req, res) => {
  // console.log();
  // console.log(req.files.image);

  try {
    await validateCreateProducts.validateAsync(
      {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        image: {
          data: req.files?.image.data,
          mimetype: req.files?.image.mimetype,
          size: req.files?.image.size,
        },
      },
      {
        allowUnknown: true,
        abortEarly: false,
      }
    );
  } catch (err) {
    return res.status(400).send({ error: err.details.map((el) => el.message) });
  }
  /**
   * logical building
   */
  try {
    /**
     * working with file or image path
     *
     */
    let image = null;
    if (req.files?.image) {
      let uniqueTimeStamp = Date.now() + Math.floor(Math.random() * 10000) + 1;
      let folderDir = path.resolve();
      image = path
        .join("\\", "uploads", `${uniqueTimeStamp}-${req.files.image.name}`)
        .replaceAll("\\", "/");
      req.files.image.mv(path.join(folderDir, image));
    }
    /**
     * create new Products
     */
    const createProducts = await Product.create({
      ...req.body,
      user_info: req.user.matchEmail._id,
      image: image,
    });
    res.send(createProducts);
  } catch (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.message,
    });
  }
};

//upadete product
const updateProduct = async (req, res) => {
  try {
    const { title, price } = req.body;
    const match = await Product.findById(req.params._id);
    if (!match) {
      return res.status(404).send("Not found");
    }
    const updateProducts = await Product.findByIdAndUpdate(
      req.params._id,
      {
        title,
        price,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).send(updateProducts);
  } catch (error) {
    return res.status(400).send({
      status: "Failed",
      Error: error.message,
    });
  }
};

// delete product
const deleteProduct = async (req, res) => {
  try {
    const match = await Product.findById(req.params._id);
    // console.log(req.params._id);
    if (match) {
      const deleteProducts = await Product.findByIdAndDelete(req.params._id);
      fs.unlinkSync(path.join(path.resolve(), deleteProducts.image));
      return res.status(201).send("Product Deleted");
    }
    return res.status(404).send("Not found");
  } catch (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.message,
    });
  }
};
module.exports = {
  getProduct,
  postProduct,
  updateProduct,
  deleteProduct,
};
