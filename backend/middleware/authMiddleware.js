const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token failed' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) next();
  else res.status(403).json({ message: 'Admin only' });
};

module.exports = { protect, admin };
