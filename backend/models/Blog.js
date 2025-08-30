const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  body: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'hidden'], default: 'pending' },
  tags: [{ type: String }],
  views: { type: Number, default: 0 },
  reactions: {
    likes: { type: Number, default: 0 },
    claps: { type: Number, default: 0 },
    hearts: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    clappedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    heartedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  comments: [commentSchema]
}, { timestamps: true });

// Index for better search performance
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });
blogSchema.index({ status: 1, createdAt: -1 });
blogSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);
