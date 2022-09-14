const router = require("express").Router();
const User = require('../models/User.model');

router.get("/profile/:profileId", (req, res) => {
    const { profileId } = req.params;

    User.findById(profileId)
        .populate('festivals')
        .then(user => res.json(user))
        .catch(err => console.log(err));
});

router.post('/profile/:profileId/photo', (req, res) => {

    const { profileId } = req.params;

    console.log(profileId);

    const url = Object.keys(req.body);

    const image = url[0];

    console.log(image);

    User.findByIdAndUpdate(profileId, {image: image})
        .then((updatedProfile) => res.json(updatedProfile))
        .catch((err) => console.log(err));

});

module.exports = router;