const { Schema, model } = require("mongoose");

const festivalSchema = new Schema(
  {
    name: {type: String, required: true},
    image: {type: String, default: "../../Reading-and-Leeds-Festival-2022-Everything-you-need-to-know.jpeg"},
    description: {type: String, maxlength: 500},
    type: {type: String},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
  },
  {
    timestamps: true
  }
);

const Festival = model("Festival", festivalSchema);

module.exports = Festival;
