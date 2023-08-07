const router = require("express").Router();
const { Room, Message } = require("../models");
const validateSession = require("../middleware/validate-session");
// const { validate } = require('../models/user.model');
const { error, success, incomplete } = require("../helpers");
const log = console.log;

//TODO POST - create a message for a room
router.post("/:ROOMID/", validateSession, async (req, res) => {
  try {
    //1. Pull data from client (body)
    const { text } = req.body;
    const roomId = req.params.ROOMID;
    const ownerId = req.user._id;
    //2. Create a new object using the Model

    const message = new Message({
      date: new Date(),
      text: text,
      ownerId: ownerId,
      roomId: roomId,
    });

    //3. Use mongoose method to save to MongoDB
    const newMessage = await message.save();
    const roomMessage = {
      id: newMessage._id,
      text: newMessage.text,
      date: newMessage.date,
    };
    await Room.findOneAndUpdate(
      { _id: roomId },
      { $push: { messages: roomMessage } }
    );

    newMessage ? success(res, newMessage) : incomplete(res);
  } catch (err) {
    error(res, err);
  }
});

//TODO GET All of room's messgages

router.get("/:ROOMID/", async (req, res) => {
  try {
    const roomId = req.params.ROOMID;
    const getAllMessages = await Message.find({ roomId: roomId });

    getAllMessages ? success(res, getAllMessages) : incomplete(res);
  } catch (err) {
    error(res, err);
  }
});

//TODO PATCH One - update

router.patch("/:MESSAGEID", validateSession, async (req, res) => {
  try {
    //1. Pull value from paramter, body, req.user
    const messageId = req.params.MESSAGEID;
    const newText = req.body.text;
    const userId = req.user._id;
    const updatedInfoA = { text: newText, date: new Date() };

    // const roomIdString = roomToUpdate.toString();
    const messageIdString = messageId.toString();
    // const textString = newText.toString();

    //3. Use method to locate document based off ID and pass in new info.
  

    const updatedMessage = await Message.findOneAndUpdate(
      { _id: messageId, ownerId: userId },
      updatedInfoA,
      { new: true }
    );

    const roomToUpdate = await Room.findOneAndUpdate({ "messages._id": messageIdString, ownerId: userId }, { $set: {
      "messages.$.text": newText, // Using the positional operator $ to update the text field of the matched message
    }}, { new: true });

    
    log(userId)
    log(messageId);
    log(roomToUpdate);
    
    // log(roomIdString);
    log(messageIdString);
    // log(textString);

  
  

    if (!updatedMessage /* || !roomToUpdate */) {
      incomplete(res);
    }
    //4. Respond to client.
    success(res, updatedMessage, roomToUpdate);
  } catch (err) {
    console.error("Error in the catch block:", err.stack);
    error(res, err);
  }
});

//TODO DELETE One - delete
router.delete("/:MESSAGEID", validateSession, async (req, res) => {
  try {
    //1. Capture ID
    const { id } = req.params;

    //2. Use delete method to locate and remove based off ID
    const deleteMessage = await Message.deleteOne({
      _id: id,
      owner_id: req.user._id,
    });

    //3. Respond to client.
    deleteMovie.deletedCount
      ? res.status(200).json({ message: "Movie removed" })
      : res.status(404).json({ message: "No movie in collection" });

    // if(deleteMovie.deletedCount) {
    //     res.status(200).json({
    //         message: 'Movie removed'
    //     })
    // } else {
    //     res.status(404).json({
    //         message: "No movie in collection"
    //     })
    // }
  } catch (err) {
    error(res, err);
  }
});

module.exports = router;
