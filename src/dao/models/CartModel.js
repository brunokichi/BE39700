import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
  products: {
    //type: Array,
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
          required: true,
        }
      },
    ],
    default: [],
  },
});

const cartModel = mongoose.model("carts", cartsSchema);
export default cartModel;
