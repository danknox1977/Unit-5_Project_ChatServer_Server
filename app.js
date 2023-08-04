//! Dependencies
require("dotenv").config(); // connects our .env file to our complete project.
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000; // points to our environment file and puts the value of PORT from that variable into this port variable.
const log = console.log;

//! IMPORTS
const { messageController, roomController, userController } = require("./controllers");
const { db } = require('./db');

//! MIDDLEWARE
//* data handling
app.use(express.json());

//! ROUTES
app.use("/user/", userController);
app.use("/room/", roomController);
app.use("/message/", messageController);

//! Connection
const server = async() => {

    db();
    app.listen(PORT, () => log(`ChatApp Server running on Port: ${PORT}`) )

}

server();