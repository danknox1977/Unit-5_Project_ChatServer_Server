const mongoose = require("mongoose");
const Message = require("../models/message.model");

const RoomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  messages: [{ id: String, text: String, date: Date }],
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  ownerName: {
    type: String,
  },
});

module.exports = mongoose.model("Room", RoomSchema);
