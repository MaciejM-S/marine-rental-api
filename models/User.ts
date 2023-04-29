import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  info: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
    },
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: { type: String },
    },
  ],
  avatar: {
    date: {
      type: String,
    },
    data: {
      type: Buffer,
    },
    description: {
      type: String,
    },
  },
  vessels: [{ vesselId: { type: String, ref: "vessel" } }],
  favorites: [{ type: String }],
  firstVessel: { type: Boolean, default: true },
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
