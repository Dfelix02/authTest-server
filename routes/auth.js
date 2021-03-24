const router = require("express").Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

//register
router.post("/register", async (req, res) => {
  //validate data
  const err = registerValidation(req.body);
  if (err.error) return res.send({ error: err.error.details[0].message });

  //check if user is in the db
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.send({ error: "email already exist" });

  //hash paswords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: hashPassword,
  });
  try {
    const savedUser = await user.save();

    //create and assing a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).send(token);
  } catch (error) {
    res.send(error);
  }
});

//login
router.post("/login", async (req, res) => {
  //validate data
  const err = loginValidation(req.body);
  if (err.error) return ressend({ error: err.error.details[0].message });

  //check if user email is in the db
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.send({ error: "incorrect email, please try again" });

  //check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.send({ error: "incorrect password, please try again" });

  //create and assing a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
