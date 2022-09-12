const router = require("express").Router();
const mongoose = require("mongoose");
const Festival = require("../models/Festival.model");

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
    .then((festival) => res.status(200).json(festival))
    .catch((err) => res.json(err));
});

router.put("/festival/:festivalId", (req, res) => {
  const { festivalId } = req.params;

  Festival.findByIdAndUpdate(festivalId, req.body, { new: true })
    .then((updatedFestival) => res.json(updatedFestival))
    .catch((err) => res.json(err));
});

// delete
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

// GET -festival/:id-

router.get('/festival/:festivalId', (req, res) => {
    const { festivalId } = req.params;

    Festival.findById(festivalId)
            .then(festival => res.status(200).json(festival))
            .catch(err => res.json(err));
})

const fileUploader = require('../config/cloudinary.config');

router.post("/upload", fileUploader.single("imageUrl"), (req,res,next) => {
  

  if(!req.file){
    next(new Error('No file uploaded!'));
    return;
  }

  res.json({ fileUrl: req.file.path});
});

module.exports = router;
