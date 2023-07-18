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
  documents: {
    type: [{
        name: {
          type:String, 
          required:true
        },
        reference: {
          type:String, 
          required:true
        }
      }],
    default:[],
  },
  last_connection:{
    type: Date,
    default: null
  },
  status:{
    type:String,
    required:true,
    enums:["Completo","Incompleto","Pendiente"],
    default:"Pendiente"
  },
  avatar:{
    type: String,
    default: ""
  }
});

const userModel = mongoose.model("users", usersSchema);

export default userModel;
