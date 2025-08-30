const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  getBlogById,
  addReaction,
  removeReaction,
  addComment,
  deleteComment
} = require('../controllers/blogController');
const router = express.Router();

router.post('/', protect, createBlog);
router.get('/', getAllBlogs);
router.get('/mine', protect, getMyBlogs);
router.get('/:id', getBlogById);

router.post('/:id/reactions', protect, addReaction);
router.delete('/:id/reactions', protect, removeReaction);

router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router;
