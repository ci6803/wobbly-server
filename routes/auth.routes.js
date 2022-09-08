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




















})