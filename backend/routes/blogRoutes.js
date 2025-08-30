const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createBlog, getAllBlogs, getMyBlogs } = require('../controllers/blogController');
const router = express.Router();

router.post('/', protect, createBlog);
router.get('/', getAllBlogs);
router.get('/mine', protect, getMyBlogs);

module.exports = router;
