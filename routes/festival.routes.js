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

// update
router.get("/festivals/:id", (req, res) => {
  const { id } = req.params;

  Festival.findById(id)
    .then((FestivalEdit) => {
      res.json("festivals/update-form", FestivalEdit);
    })
    .catch((err) => res.json(err));
});

router.post("/festivals/:id/edit", (req, res) => {
  const { id } = req.params;
  const { name, image, description, type, startDate, endDate } = req.body;

  Festival.findByIdAndUpdate(id, {
    name,
    image,
    description,
    type,
    startDate,
    endDate,
  })
    .then(() => res.redirect("/festivals"))
    .catch((err) => res.json(err));
});

// delete
router.post("/festivals/:id/delete", (req, res) => {
  const { id } = req.params;

  Festival.findByIdAndDelete(id)
    .then(() => res.redirect("/festivals"))
    .catch((err) => res.json(err));
});

module.exports = router;
