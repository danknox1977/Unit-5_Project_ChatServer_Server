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
    ref: "User",
  },
  room_Id: {
    type: mongoose.Types.ObjectId,
    ref: "Room",
  },
  username: {
    type: String,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
