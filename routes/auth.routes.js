const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const nodemailer = require("nodemailer");
const path = require("path");

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
//.
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
    .then(async () => {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        sevice: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "wobbly.festival@gmail.com", // generated ethereal user
          pass: "mdntmqwhssplqosg", // generated ethereal password
        },
      });

      let details = {
        from: "wobbly.festival@gmail.com",
        to: email,
        subject: "Signup completed on Wobbly ✔",

        html: `
        <div style= "background-color: #D0C5E7; text-align: center; padding: 20px; border-radius: 20px">

        <h2>Wobbly Signup Confirmation Email</h2>
        <h3>Welcome!</h3>
        <h3>Thanks for joining our community, check out all the festivals now</h3>
        <button style="background-color: #DCCCBC; padding:10px; border-radius: 8px;"><a href='https://wobbly-festivals.netlify.app'  target="_blank" style="color:white; font-size:1.5rem; text-decoration:none;">Click me!</a></button>
        </div>`,
      };
      //this actually sends the email with all the details in the object that you created.
      transporter.sendMail(details, (err) => {
        if (err) {
          console.log("There was an error", err);
        } else {
          console.log("Email has been sent");
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
