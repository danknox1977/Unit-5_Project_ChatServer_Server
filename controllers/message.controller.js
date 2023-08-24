const router = require("express").Router();
const { Room, Message } = require("../models");
const validateSession = require("../middleware/validate-session");
// const { validate } = require('../models/user.model');
const { error, success, incomplete } = require("../helpers");
const log = console.log;

//TODO POST - create a message for a room
router.post('/', validateSession, async (req, res) => {

  try {
      //1. Pull data from client (body)
      const { text, room_id } = req.body;
      const ownerId = req.user.id;

      //2. Create new object using the Model
      const message = new Message({
          date: new Date(),
          text,
          owner_id: ownerId, // declared above
          room_id: room_id,
      });
      
      //3. Use mongoose method to save to MongoDB
      const newMessage = await message.save();
      const roomMessage = {
      id: newMessage._id,
      text: newMessage.text,
      date: newMessage.date,
      messageSender: req.user.username,
      };
      await Room.findOneAndUpdate(
      { _id: room_id },
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

//TODO GET All of user's messgages

router.get("/:USERID/", async (req, res) => {
  try {
    const userId = req.params.USERID;
    const getAllMessages = await Message.find({ userId: ownerId });

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
    // const textString = newText.toString();

    //3. Use method to locate document based off ID and pass in new info.

    const updatedMessage = await Message.findOneAndUpdate(
      { _id: messageId, ownerId: userId },
      updatedInfoA,
      { new: true }
    );
    if (!updatedMessage) {
      return res
        .status(404)
        .json({ message: "Invalid Message/Owner Combination" });
    }

    const roomIdString = updatedMessage.roomId.toString();

    const roomToUpdate = await Room.findOneAndUpdate(
      { _id: roomIdString, "messages.id": messageIdString },
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
      ownerId: userId,
    });

    const deleteMessage = await Message.deleteOne({
      _id: messageId,
      ownerId: userId,
    });

    if (!deleteMessage) {
      return res
        .status(404)
        .json({ message: "Invalid Message/Owner Combination" });
    }

    const roomIdString = roomFromMessage.roomId.toString();
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
