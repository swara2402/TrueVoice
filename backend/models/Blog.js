const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'hidden'], default: 'pending' },
  likes: { type: Number, default: 0 },
  comments: [{ body: String, date: Date }]
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
