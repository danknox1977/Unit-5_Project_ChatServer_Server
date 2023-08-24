const mongoose = require("mongoose");
const MONGODB = process.env.MONGO;
const COLL = process.env.COLL;

const log = console.log;

const db = async () => {
  try {
    await mongoose.connect(`${MONGODB}/${COLL}`);
    log(`Database connected: ${MONGODB}/${COLL}`);
  } catch ( err ) {
    throw new Error(`Error ${err.message}`);
  }
};

module.exports = { db, mongoose };
