const router = require('express').Router();
const { Room, Message } = require("../models")
const validateSession = require('../middleware/validate-session');
const { validate } = require('../models/user.model');
const log = console.log

// Error Response function
const errorResponse = (res, error) => {
    return(
        res.status(500).json({
            error: error.message
        })
    )
}

//TODO POST - create a room
router.post('/createRoom/', validateSession, async (req, res) => {
    try {
        
        //1. Pull data from client (body)
        const { title, description } = req.body;
        const ownerId = req.user.id;
        //2. Create a new object using the Model
        const room = new Room({
            title, description, ownerId, 
            ownerName: req.user.username,
        });

        //3. Use mongoose method to save to MongoDB
        const newRoom = await room.save();

        //4. Client response
        res.status(200).json({
            newRoom,
            message: `${newRoom.title} added to ChatApp`
        })

    } catch (err) {
        errorResponse(res, err);
    }
});





module.exports = router;