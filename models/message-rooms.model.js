const mongoose = require("mongoose");

const RoomsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  messages: {
    type: Array,
  },
  owner_Id: {
    type: String,
  },
});

module.exports = mongoose.model("Rooms", RoomsSchema);