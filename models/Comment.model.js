const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    message: {type: String, trim: true, maxlength: 200} 
  },
  {
    timestamps: true
  }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
