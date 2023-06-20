import mongoose from "mongoose";
//import { cartModel } from "./CartModel.js";

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
    //ref: cartModel,
  },
  rol: {
    type: String,
    required: true,
    enum:["Usuario","Admin","Premium"],
    default:"Usuario",
  },
});

const userModel = mongoose.model("users", usersSchema);

export default userModel;
