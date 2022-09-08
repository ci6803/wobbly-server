const { Schema, model } = require("mongoose");

const festivalSchema = new Schema(
  {
    name: {type: String, required: true},
    image: {type: String, required: true},
    description: {type: String, maxlength: 500},
    type: {type: String},
    startDate: {type: String, required: true},
    endDate: {type: String, required: true},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
  },
  {
    timestamps: true
  }
);

const Festival = model("Festival", festivalSchema);

module.exports = Festival;
