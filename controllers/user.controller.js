const router = require("express").Router();
const { response } = require("express");
const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT;
const log = console.log;

const testingBcrypt = (password) => {
  let encrypt = bcrypt.hashSync(password, 10);
  console.log("Encrypt:", encrypt);
};

router.post("/signup", async (req, res) => {

  try {
    // creating a new object based off the Users Model Schema
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 13),
    });
    const newUser = await user.save();

    const token = jwt.sign({ id: newUser._id }, SECRET, {
      expiresIn: "1 day",
    });
    res.status(200).json({
      user: newUser,
      message: "Success!",
      token,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!user || !passwordMatch) throw new Error("That combination of Email and Password does not match");
    const token = jwt.sign({ id: user._id }, SECRET, {
        expiresIn: "1 day",
      });
    res.status(200).json({
        message: `Success!`,
        user,
        token
    })
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
