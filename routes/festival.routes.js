const router = require("express").Router();
const mongoose = require("mongoose");
const Festival = require("../models/Festival.model");

// GET -festival-
router.get('/festival', (req, res) => {
    Festival.find()
            .then(festivals => res.json(festivals))
            .catch(err => res.json(err));
});

// POST -festival-
router.post('/festival', (req, res) => {
    const { name, image, description, type, startDate, endDate } = req.body;

    Festival.create({ name, image, description, type, startDate, endDate, comments: []})
            .then(festival => res.json(festival))
            .catch(err => res.json(err))
});

module.exports = router;
