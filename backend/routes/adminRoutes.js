const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { getPendingBlogs, approveBlog, rejectBlog, hideBlog, deleteBlog } = require('../controllers/adminController');
const router = express.Router();

router.get('/blogs', protect, admin, getPendingBlogs);
router.patch('/blogs/:id/approve', protect, admin, approveBlog);
router.patch('/blogs/:id/reject', protect, admin, rejectBlog);
router.patch('/blogs/:id/hide', protect, admin, hideBlog);
router.delete('/blogs/:id', protect, admin, deleteBlog);

module.exports = router;
