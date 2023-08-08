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
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  roomId: {
    type: mongoose.Types.ObjectId,
    ref: "room",
  },
});

module.exports = mongoose.model("Message", MessageSchema);
