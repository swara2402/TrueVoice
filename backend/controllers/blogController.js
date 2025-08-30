const Blog = require('../models/Blog');

// @desc Create blog (status=pending)
// @route POST /api/blogs
exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags || [],
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
    const blogs = await Blog.find({ status: 'approved' })
      .populate('author', 'username')
      .populate('comments.author', 'username');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get user's own blogs
// @route GET /api/blogs/mine
exports.getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .populate('comments.author', 'username');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get single blog by ID
// @route GET /api/blogs/:id
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username')
      .populate('comments.author', 'username');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Add reaction to blog
// @route POST /api/blogs/:id/reactions
exports.addReaction = async (req, res) => {
  try {
    const { reactionType } = req.body;
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const validReactions = ['like', 'clap', 'heart'];
    if (!validReactions.includes(reactionType)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }

    const userField = `${reactionType}dBy`;
    const countField = `${reactionType}s`;

    // Check if user already reacted
    if (blog.reactions[userField].includes(req.user._id)) {
      return res.status(400).json({ message: 'Already reacted' });
    }

    blog.reactions[userField].push(req.user._id);
    blog.reactions[countField] += 1;
    
    await blog.save();
    res.json(blog.reactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Remove reaction from blog
// @route DELETE /api/blogs/:id/reactions
exports.removeReaction = async (req, res) => {
  try {
    const { reactionType } = req.body;
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const validReactions = ['like', 'clap', 'heart'];
    if (!validReactions.includes(reactionType)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }

    const userField = `${reactionType}dBy`;
    const countField = `${reactionType}s`;

    // Check if user has reacted
    const userIndex = blog.reactions[userField].indexOf(req.user._id);
    if (userIndex === -1) {
      return res.status(400).json({ message: 'No reaction to remove' });
    }

    blog.reactions[userField].splice(userIndex, 1);
    blog.reactions[countField] = Math.max(0, blog.reactions[countField] - 1);
    
    await blog.save();
    res.json(blog.reactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Add comment to blog
// @route POST /api/blogs/:id/comments
exports.addComment = async (req, res) => {
  try {
    const { body } = req.body;
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (!body || body.trim() === '') {
      return res.status(400).json({ message: 'Comment body is required' });
    }

    const comment = {
      body: body.trim(),
      author: req.user._id
    };

    blog.comments.push(comment);
    await blog.save();

    // Populate author info for the response
    await blog.populate('comments.author', 'username');
    const newComment = blog.comments[blog.comments.length - 1];
    
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete comment from blog
// @route DELETE /api/blogs/:id/comments/:commentId
exports.deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const comment = blog.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author or admin
    if (comment.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    blog.comments.pull(req.params.commentId);
    await blog.save();
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

