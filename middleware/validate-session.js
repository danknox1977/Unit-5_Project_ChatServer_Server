const jwt = require('jsonwebtoken');
const users = require('../models/user.model');

const validateSession = async(req,res,next) => {
    try {
        const token = req.headers.authorization;
        const decoded = await jwt.verify(token, process.env.JWT);
        // console.log(decoded);
        const user = await users.findById(decoded.id);
        req.user = user;
        return next(); 
    } catch (err) {
        res.json({message: err.message});
    }
}

module.exports = validateSession;