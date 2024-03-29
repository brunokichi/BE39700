import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
  products: {
    type: Array,
    default: [],
  },
});

const cartModel = mongoose.model("carts", cartsSchema);
export default cartModel;
