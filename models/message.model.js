const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  // columns for our document
  date: {
    type: Date,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  owner_Id: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  room_Id: {
    type: mongoose.Types.ObjectId,
    ref: "room",
  },
  username: {
    type: String,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
