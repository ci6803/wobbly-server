const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const nodemailer = require("nodemailer");

const router = express.Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const saltRounds = 10;

router.post("/signup", (req, res) => {
  const { email, password, username, name } = req.body;

  if (email === "" || password === "" || username === "" || name === "") {
    res
      .status(400)
      .json({ message: "Please provide email, name, username and password" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Please provide a valid email address." });
    return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      return User.create({ email, username, password: hashedPassword, name });
    })
    .then((createdUser) => {
      const { email, username, name, _id } = createdUser;

      const user = { email, username, name, _id };

      res.status(201).json({ user: user });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "Internal Server Error, Please Investigate" });
    })
    .then((user) => {
      //console.log('Newly created user is: ', userFromDB);
      req.session.currentUser = user;
      //res.render('auth/profile', {user})
      res.redirect("../recipes/list");
      //res.redirect('/auth/login');
    })
    .then(async () => {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USERNAME, // generated ethereal user
          pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
      });

      console.log(email);
      // send mail with defined transport object
      let info = await transporter
        .sendMail({
          from: '"Wobbly" <letthemroam.nl@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "Inscription completed ✔, welcome to Wobbly!", // Subject line
          html: `
        <h2>Welcome to Wobbly</h2>
        <p>You've been registered successfully!!<p>
        <a href="#">Login now</a>
        `, // html body
        })
        .then((info) => console.log(info))
        .catch((error) => console.log(error));
      transport.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });
    })
    .catch((error) => console.log(error));
});

router.post("/login", (req, res) => {
  const { username, email, password } = req.body;

  if (email === "" || password === "" || username === "") {
    res
      .status(400)
      .json({ message: "Provide an email, password and username" });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(400).json({ message: "User not found." });
        return;
      }

      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        const { _id, email, name } = foundUser;

        const payload = { _id, email, name };

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "2h",
        });

        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Cannot authenticate the user" });
      }
    })
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Internal Server Error, Please Investigate" })
    );
});

router.get("/verify", isAuthenticated, (req, res) => {
  console.log(`req.payload`, req.payload);

  res.status(200).json(req.payload);
});

module.exports = router;

//authentication
