const mongoose = require("mongoose");
const { BUYER, SELLER } = require("../constant/role");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      validate: {
        validator: async (value) => {
          let matched = await mongoose.models.user.findOne({
            email: value,
          });
          if (matched) {
            return false;
          }
        },
        message: " Used email",
      },
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [BUYER, SELLER],
      required: true,
      set: (value) => {
        return value.toLowerCase();
      },
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("user", userSchema);
module.exports = User;
