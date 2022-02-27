var express = require("express");
var router = express.Router();
const Validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const User = require("../models/User");

/* Post listing. */
router.post("/register", function (req, res, next) {
  const data = req.body;
  if (!data.name || !data.email || !data.password) {
    return res.status(400).json({ message: "Data missing" });
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  const data = req.body;
  if (!data.email || !data.password) {
    return res.status(400).json({ message: "Data missing" });
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res
              .cookie("jwttoken", token)
              .cookie("email", email)
              .json({
                success: true,
                token: "Bearer " + token,
              });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.get("/preference/:id", (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Data missing" });
  }
  const email = req.params.id;
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    let { color } = user;
    res.status(200).json({
      color,
    });
  });
});

router.post("/preference/:id", (req, res) => {
  const {color} = req.body;
  console.log(color)
  const email = req.params.id;

  if (!req.params.id && color) {
    return res.status(400).json({ message: "Data missing" });
  }
  User.findOneAndUpdate({ email }, {color:color}).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    res.status(200).send();
  });
});

module.exports = router;
