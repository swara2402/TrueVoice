const Blog = require('../models/Blog');

// @desc Create blog (status=pending)
// @route POST /api/blogs
exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({
      title: req.body.title,
      content: req.body.content,
      author: req.user._id, // from authMiddleware
    });
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all published blogs
// @route GET /api/blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'approved' }).populate('author', 'username');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get user's own blogs
// @route GET /api/blogs/mine
exports.getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

