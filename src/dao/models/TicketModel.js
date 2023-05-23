import mongoose from "mongoose";

const ticketsSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique:true
  },
  purchase_datetime: {
    type: Date
  },
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
  amount: {
    type: Number
  },
  purchaser: {
    type:String,
    required:true
  },
});

const ticketModel = mongoose.model("tickets", ticketsSchema);

export default ticketModel;
