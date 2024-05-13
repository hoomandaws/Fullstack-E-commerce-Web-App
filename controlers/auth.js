const User = require("../models/User");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { BUYER, SELLER } = require("../constant/role");

//server side validation
// const signupvalidate = Joi.object({
//   username: Joi.string().required(),
//   email: Joi.string().email().required(),
//   password: Joi.string().required(),
//   role: Joi.string().valid(BUYER, SELLER).required(),
// });
const signup = async (req, res, next) => {
  //   //server side validation
  //   try {
  //     await signupvalidate.validateAsync(req.body, {
  //       allowUnknown: true,
  //       abortEarly: false,
  //     });
  //   } catch (err) {
  //     return res.status(400).send({ error: err.details.map((el) => el.message) });
  //   }

  //logic side
  try {
    const { username, email, password, role, contact } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    
    const createUsers = await User.create({
      username,
      email,
      password: hashPassword,
      role,
      contact,
    });
    // createUsers.password = undefined;
    res.send(createUsers);
  } catch (err) {
    return next(err);
  }
};

//User login
//
//

const loginvalidate = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
const login = async (req, res, next) => {
  try {
    await loginvalidate.validateAsync(req.body, {
      abortEarly: false,
    });
  } catch (err) {
    return res.status(400).send({ Error: err.details.map((el) => el.message) });
  }

  try {
    const { email, password } = req.body;
    const matchEmail = await User.findOne({
      email,
    }).select("+password");
    if (matchEmail) {
      const matchPassword = await bcrypt.compare(password, matchEmail.password);
      if (matchPassword) {
        matchEmail.toObject();
        matchEmail.password = undefined;
        const token = jwt.sign(
          {
            matchEmail,
          },
          process.env.jwt_salt
        );
        return res.status(200).send({
          Message: "User Logged in",
          token,
          matchEmail,
        });
      }
    }
    return res.status(401).send({
      Error: "login invalid ",
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  signup,
  login,
};
