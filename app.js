//! IMPORTS
require("dotenv").config(); // connects our .env file to our complete project.
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000; // points to our environment file and puts the value of PORT from that variable into this port variable.
const log = console.log;
const mongoose = require("mongoose"); // user from node_modules
const validateSession = require("./middleware/validate-session");
const MONGO = process.env.MONGODB; // connection variable from .env
const users = require("./controllers/user.controller");
const rooms = require("./controllers/room.controller");
const messages = require("./controllers/message.controller");

//! MIDDLEWARE
mongoose.connect(`${MONGO}/ChatApp`); // connection middleware. Est. route and defining our Collection we are targeting
//* Doesn't display until there is a document within the collection

const db = mongoose.connection; // event listener to check if connected
db.once("open", () => log(`Connected: ${MONGO}`));

//* data handling
app.use(express.json());

//! ROUTES
app.use("/user/", users);
app.use(validateSession);
// app.use("/room/", rooms);
app.use("/message/", messages);

app.listen(PORT, () => log(`ChatApp Server running on Port: ${PORT}`));
