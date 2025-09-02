const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const header = req.header('Authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided. Access denied.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Token invalid or user inactive.' });
    }
    req.user = { userId: decoded.userId, employeeId: decoded.employeeId, role: decoded.role };
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired.' });
    }
    console.error('Auth error:', err);
    res.status(500).json({ success: false, message: 'Server error in authentication' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || !['admin', 'management'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Admin privileges required.' });
  }
  next();
};

module.exports = { auth, adminOnly };
