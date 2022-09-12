const router = require("express").Router();
const mongoose = require("mongoose");
const Festival = require("../models/Festival.model");
const Comment = require('../models/Comment.model');
const User = require('../models/User.model');

// GET -festival-
router.get("/festival", (req, res) => {
  Festival.find()
    .then((festivals) => res.json(festivals))
    .catch((err) => res.json(err));
});

// POST -festival-
router.post("/festival", (req, res) => {
  const { name, image, description, type, startDate, endDate } = req.body;

  Festival.create({
    name,
    image,
    description,
    type,
    startDate,
    endDate,
    comments: [],
  })
    .then((festival) => res.json(festival))
    .catch((err) => res.json(err));
});

// GET -festival/:id-

router.get("/festival/:festivalId", (req, res) => {
  const { festivalId } = req.params;

  Festival.findById(festivalId)
    .populate('comments')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        model: 'User'
      }
    })
    .then((festival) => res.status(200).json(festival))
    .catch((err) => res.json(err));
});

// POST -festival/:id-

router.post('/festival/:festivalId', async (req, res) => {
  const { festivalId } = req.params;
  const festival = await Festival.findOne({_id: festivalId});
  const { message } = req.body;
  const userId = req.body.user._id
  Comment.create({user: userId, message: message})
         .then(async(newComment) => {
            festival.comments.push(newComment._id);
            await festival.save();
         })
         .catch(err => res.json(err));
})

// PUT -festival/:id- 

router.put("/festival/:festivalId", (req, res) => {
  const { festivalId } = req.params;

  Festival.findByIdAndUpdate(festivalId, req.body, { new: true })
    .then((updatedFestival) => res.json(updatedFestival))
    .catch((err) => res.json(err));
});

// DELETE -festival/:id

router.delete("/festival/:festivalId", (req, res) => {
  const { festivalId } = req.params;

  Festival.findByIdAndRemove(festivalId)
    .then(() =>
      res.json({
        message: `Festival with ${festivalId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
