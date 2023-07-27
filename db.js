//* database connections
mongoose.connect(`${MONGO}/ChatApp`);
const db = mongoose.connection;
db.once("open", () => log(`Connected: ${MONGO}`));

