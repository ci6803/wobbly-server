const router = require("express").Router();
const mongoose = require("mongoose");
const Festival = require("../models/Festival.model");
const Comment = require('../models/Comment.model');
const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');

// GET -festival-
router.get("/festival", (req, res) => {
  Festival.find()
    .then((festivals) => res.json(festivals))
    .catch((err) => res.json(err));
});

// POST -festival-
router.post("/festival", isAuthenticated,  (req, res) => {
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

router.get("/festival/:festivalId", isAuthenticated,(req, res) => {
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

// POST -festival/:id/add

router.post('/festival/:festivalId/add', async (req, res) => {
  try {
    const { festivalId } = req.params;
    const userId = req.body._id;
    const festival = await Festival.findById(festivalId);
    const user = await User.findById(userId);
    if (!user.festivals.includes(festivalId)){
      user.festivals.push(festival);
    } 
    await user.save();
  }
  catch (err) {
    console.log(err);
  }
})

// PUT -festival/:id- 

router.put("/festival/:festivalId", isAuthenticated, (req, res) => {
  const { festivalId } = req.params;

  Festival.findByIdAndUpdate(festivalId, req.body, { new: true })
    .then((updatedFestival) => res.json(updatedFestival))
    .catch((err) => res.json(err));
});

// DELETE -festival/:id

router.delete("/festival/:festivalId", isAuthenticated, (req, res) => {
  const { festivalId } = req.params;

  Festival.findByIdAndRemove(festivalId)
    .then(() =>
      res.json({
        message: `Festival with ${festivalId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

const fileUploader = require('../config/cloudinary.config');

router.post("/upload", fileUploader.single("image"), (req,res,next) => {
  
  if(!req.file){
    next(new Error('No file uploaded!'));
    return;
  }

  res.json({ fileUrl: req.file.path});
});
module.exports = router;
