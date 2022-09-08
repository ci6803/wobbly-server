const express = require("express");
const bcrypt = require('bcrypt');

const jwt = require("jsonwebtoken");

const User = require("../models/User.model");

const router = express.Router();

const { isAuthenticated } = require('../middleware/jwt.middleware');

const saltRounds = 10;

router.post('/signup', (req,res) => {
    const { email, password, username, name } = req.body;

    if (email === '' || password === '' || name === ''|| username === '') {
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


















})