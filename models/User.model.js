const { Schema, model } = require("mongoose");

function arrayLimit(val){
  return val.length <= 4; 
}

const userSchema = new Schema(
  {
    name: {type: String, required: true, trim: true},
    image: {type: String, default: 'https://www.multisignaal.nl/wp-content/uploads/2021/08/blank-profile-picture-973460_1280.png'},
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    festivals: [{type: Schema.Types.ObjectId, ref: 'Festival'}],
    validate: [arrayLimit, 'Limit is 4.']
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
