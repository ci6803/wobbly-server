const router = require("express").Router();
const Festival = require("../models/Festival.model");
const Comment = require('../models/Comment.model');
const User = require('../models/User.model');

router.get("/profile/:profileId", (req, res) => {
    const { profileId } = req.params;

    User.findById(profileId)
        .populate('festivals')
        .then(user => res.json(user))
        .catch(err => console.log(err))
});

module.exports = router;