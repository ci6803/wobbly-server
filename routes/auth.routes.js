const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const router = express.Router();
const { isAuthenticated } = require('../middleware/jwt.middleware');
const saltRounds = 10;


router.post('/signup', (req,res) => {
    const { email, password, username, name } = req.body;

    if (email === '' || password === '' || username === ''|| name === '') {
        res.status(400).json({ message: "Please provide email, name, username and password"});
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({message: 'Please provide a valid email address.'});
        return;
    }

        
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,12}$/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({message: 'Password must be a min length 8 characters, max length 12, must contain a minimum of 1 Digit,1 Symbol. One lower case and uppercase.'});
        return;
    }

        User.findOne({ email })
            .then((foundUser) => {

            if(foundUser) {
                res.status(400).json({message: "User already exists."});
                return;
            }

            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            return User.create({ email, username, password: hashedPassword, name });
            })
            .then((createdUser) => {

                const { email, username, name, _id } = createdUser;

                const user = { email, username, name, _id};

                res.status(201).json({ user: user});
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ message: "Internal Server Error, Please Investigate"
            });
        });

router.post('/login', (req, res) => {

const { username, email, password } = req.body;


if (email === '' || password === '' || username === '') {
    res.status(400).json({ message: "Provide an email, password and username"});
    return;

}

        User.findOne({ email })
            .then((foundUser) => {

            if(!foundUser) {
            res.status(400).json({message: "User not found."});
            return;

        }

        const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

        if (passwordCorrect) {

            const { _id, email, name} = foundUser;

            const payload = {_id, email, name};

            const authToken = jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                { algorithm: 'HS256', expiresIn: "2h"}

            );

            res.status(200).json({ authToken: authToken});

            }
            else {
                res.status(401).json({ message: "Cannot authenticate the user"});
            }


        })
        .catch(err => res.status(500).json({message: "Internal Server Error, Please Investigate"}));

});

router.get('/verify', (req,res) => {
    console.log(`req.payload`, req.payload);

    res.status(200).json(req.payload);
});
})
module.exports = router;
