const router = require('express').Router();
const Rooms = require('../models/message-rooms.model');
const Messages = require('../models/messages.model')
const validateSession = require('../middleware/validate-session');
const { validate } = require('../models/users.model');
const log = console.log

// Error Response function
const errorResponse = (res, error) => {
    return(
        res.status(500).json({
            error: error.message
        })
    )
}

//TODO POST - create a message for a room
router.post('/:roomId/', validateSession, async (req, res) => {
    try {
        
        //1. Pull data from client (body)
        const { date, text, owner_Id, room_Id } = req.body;

        //2. Create a new object using the Model
        const message = new Messages({
            date, text, owner_Id, room_Id, 
            owner_Id: req.user.id,
            room_Id: req.Rooms.owner_Id
        });

        //3. Use mongoose method to save to MongoDB
        const newMessage = await Rooms.messages.save();

        //4. Client response
        res.status(200).json({
            newMessage,
            message: `${newMessage} added to ${Rooms.messages}`
        })

    } catch (err) {
        errorResponse(res, err);
    }
});

//TODO GET One - read

router.get('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const getMovie = await Movie.findOne({_id: id});
        
        // console.log(getMovie)

        getMovie ?
            res.status(200).json({
                getMovie
            }) :
            res.status(404).json({
                message: `No movie found`
            })
        
    } catch (err) {
        errorResponse(res, err)
    }
})

//TODO GET All of room's messgages

router.get('/:roomId/', validateSession, async(req, res) => {
    try {
        
        const getAllMessages = await Movie.find();

        getAllMessages ?
            res.status(200).json({
                getAllMessages
            }) :
            res.status(404).json({
                message: `There were no messages found in this room`
            });

    } catch (err) {
        errorResponse(res, err);
    }
})

//TODO GET All by Genre - read
router.get('/genre/:genre', async (req, res) => {
    try {
        
        const { genre } = req.params;
        let buildWord;

        if(genre) {
            for(let i = 0; i < genre.length; i++) {
                i === 0 ?
                    buildWord = genre[i].toUpperCase() :
                    buildWord += genre[i].toLowerCase();
            }
        }

        // const getMovies = await Movie.find({genre: genre})
        const getMovies = await Movie.find({genre: buildWord})
        // console.log(getMovies);

        getMovies.length > 0 ?
            res.status(200).json({
                getMovies
            }) :
            res.status(404).json({
                message: `No movies found`
            })

    } catch (err) {
        errorResponse(res, err);
    }
})

//TODO PATCH One - update
/* 
    Two ways:
        - PATCH
            - isn't meant to alter the complete document but individual values within it.
        - PUT
            - can work when updating one field within a document but may not be 100%. used mainly to alter the whole document.
*/
router.patch('/:id', validateSession, async(req, res) => {
    try {
        console.log('Hit')
        //1. Pull value from paramter
        const { id } = req.params;

        const filter = {_id: id, owner_id: req.user._id};
        console.log(filter);
        //2. Pull data from the body
        const info = req.body;
        // console.log(info);

        //3. Use method to locate document based off ID and pass in new info.
        const returnOption = {new: true};

        const updated = await Movie.findOneAndUpdate(filter, info, returnOption);
        // const updated = await Movie.findOneAndUpdate({_id: id}, info, returnOption);
        // const updated = await Movie.findOneAndUpdate({_id: id}, info);
        console.log(updated);
        if(!updated) throw new Error('Movie not owned by user')

        //4. Respond to client.
        res.status(200).json({
            message: `${updated.title} Updated!`,
            updated
        });

    } catch (err) {
        errorResponse(res,err);
    }
});

//TODO DELETE One - delete
router.delete('/:id', validateSession, async(req,res) => {
    try {
        //1. Capture ID
        const { id } = req.params;
        
        //2. Use delete method to locate and remove based off ID
        const deleteMovie = await Movie.deleteOne({_id: id, owner_id: req.user._id});

        //3. Respond to client.
        deleteMovie.deletedCount ?
            res.status(200).json({message: 'Movie removed'}) :
            res.status(404).json({message: "No movie in collection"});

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
        errorResponse(res, err);
    }
})

module.exports = router;