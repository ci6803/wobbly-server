const router = require("express").Router();
const Festival = require("../models/Festival.model");
const User = require('../models/User.model');

router.get("/profile/:profileId", (req, res) => {
    const { profileId } = req.params;

    User.findById(profileId)
        .populate('festivals')
        .then(user => res.json(user))
        .catch(err => console.log(err));
});
//profile
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

router.post('/profile/:profileId/remove', async (req, res) => {
    try{
        const { profileId } = req.params;
        const festivalIdObj = Object.keys(req.body);
        const festivalId = festivalIdObj[0];
        const festival = await Festival.findById(festivalId);
        const user = await User.findById(profileId);
        const specific = user.festivals.indexOf(festivalId)
        user.festivals.splice(specific, 1);
        await user.save();
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;