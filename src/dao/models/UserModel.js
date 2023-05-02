import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  rol: {
    type: String,
    required: false,
  },
});

const userModel = mongoose.model("users", usersSchema);

export default userModel;
