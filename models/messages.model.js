const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema({
  // columns for our document
  date: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  owner_Id: {
    type: String, 
  },
  room_Id: {
    type: String,
  },
});

module.exports = mongoose.model("Messages", MessagesSchema);