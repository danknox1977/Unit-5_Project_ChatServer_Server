const router = require("express").Router();
const { Room, Message } = require("../models");
const validateSession = require("../middleware/validate-session");
// const { validate } = require('../models/user.model');
const { error, success, incomplete } = require("../helpers");
const log = console.log;

//TODO POST - create a message for a room
router.post('/:room_Id', validateSession, async (req, res) => {

  try {
      //1. Pull data from client (body)
      const { text } = req.body;
      const room_Id = req.params.room_Id;
      const owner_Id = req.user.id;
      const username = req.user.username

      //2. Create new object using the Model
      const message = new Message({
          date: new Date(),
          text,
          owner_Id: owner_Id, // declared above
          room_Id: room_Id,
          username: username,
      });
      
      //3. Use mongoose method to save to MongoDB
      const newMessage = await message.save();
      const roomMessage = {
      id: newMessage._id,
      text: newMessage.text,
      date: newMessage.date,
      username: newMessage.username,
      };
      await Room.findOneAndUpdate(
      { _id: room_Id },
      { $push: { messages: roomMessage } }
      );

      newMessage ? success(res, newMessage) : incomplete(res);
  } catch (err) {
      error(res, err);
  }
});

//TODO GET All of room's messgages

router.get("/:room_Id/", async (req, res) => {
  try {

    const room_Id = req.params.room_Id
    const getAllMessages = await Message.find({ room_Id: room_Id });
    getAllMessages ? success(res, getAllMessages) : incomplete(res);
  } catch (err) {
    error(res, err);
  }
});

//TODO GET All of user's messgages

router.get("/:USERID/", async (req, res) => {
  try {
    const userId = req.params.USERID;
    const getAllMessages = await Message.find({ owner_Id: userId });

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
    const messageIdString = messageId.toString();

    //3. Use method to locate document based off ID and pass in new info.

    const updatedMessage = await Message.findOneAndUpdate(
      { _id: messageId, owner_Id: userId },
      updatedInfoA,
      { new: true }
    );
    if (!updatedMessage) {
      return res
        .status(404)
        .json({ message: "Invalid Message/Owner Combination" });
    }

    const roomIdString = updatedMessage.room_Id.toString();
    const roomToUpdate = await Room.findOneAndUpdate(
      { _id: roomIdString, "messages._id": messageIdString },
      {
        $set: {
          "messages.$.text": newText,
          "messages.$.date": new Date(),
        },
      },
      { new: true }
    );
    if (!roomToUpdate) {
      return res
        .status(404)
        .json({ message: "Invalid Message/Room Combination" });
    }

    // 4. Respond to client.
    res
      .status(200)
      .json({ message: "Message text has been updated", updatedMessage });
  } catch (err) {
    console.error("Error in the catch block:", err.stack);
    error(res, err);
  }
});

//TODO DELETE One - delete
router.delete("/:MESSAGEID", validateSession, async (req, res) => {
  try {
    //1. Capture ID
    const messageId = req.params.MESSAGEID;
    const userId = req.user._id;
    const messageIdString = messageId.toString();

    //2. Use delete method to locate and remove based off ID

    const roomFromMessage = await Message.findOne({
      _id: messageId,
      owner_Id: userId,
    });

    const deleteMessage = await Message.deleteOne({
      _id: messageId,
      owner_Id: userId,
    });

    if (!deleteMessage) {
      return res
        .status(404)
        .json({ message: "Invalid Message/Owner Combination" });
    }

    const roomIdString = roomFromMessage.room_Id.toString();
    log(roomIdString);

    const deleteRoomMessage = await Room.findOneAndUpdate(
      {
        _id: roomIdString,
      },
      { $pull: { messages: { id: messageIdString } } },
      { new: true }
    );

    if (!deleteRoomMessage) {
      return res
        .status(404)
        .json({ message: "Invalid Message/Room Combination" });
    }
    //3. Respond to client.
    res.status(200).json({ message: "Message has been deleted" });
  } catch (err) {
    error(res, err);
  }
});

module.exports = router;
