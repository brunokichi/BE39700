import mongoose from "mongoose";

const chatsSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const chatModel = mongoose.model("messages", chatsSchema);
export default chatModel;
