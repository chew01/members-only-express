const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: 'created_at' } }
);

PostSchema.virtual('url').get(function () {
  return '/bulletin/' + this._id;
});

module.exports = mongoose.model('Post', PostSchema);
