const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { validateLogin, validateRegister } = require('../middleware/validation');

const router = express.Router();

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { employeeId, email, password, department } = req.body;
    const user = await User.findOne({
      employeeId: employeeId.toUpperCase(),
      email: email.toLowerCase(),
      department,
      isActive: true
    });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid password.' });
    }
    await user.updateLastLogin();
    const token = jwt.sign(
      { userId: user._id, employeeId: user.employeeId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Register (requires logged-in admin/management)
router.post('/register', auth, validateRegister, async (req, res) => {
  try {
    const adminUser = await User.findById(req.user.userId);
    if (!adminUser || !['admin', 'management'].includes(adminUser.role)) {
      return res.status(403).json({ success: false, message: 'Admin privileges required.' });
    }
    const { employeeId, name, email, password, department, role } = req.body;
    const exists = await User.findOne({
      $or: [{ employeeId: employeeId.toUpperCase() }, { email: email.toLowerCase() }]
    });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Employee ID or email already exists' });
    }
    const user = new User({
      employeeId: employeeId.toUpperCase(),
      name,
      email: email.toLowerCase(),
      password,
      department,
      role: role || 'employee'
    });
    await user.save();
    res.status(201).json({
      success: true,
      message: 'Employee registered successfully',
      user: {
        id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// Profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (name) user.name = name;
    if (phone) user.phone = phone;
    await user.save();
    res.json({ success: true, message: 'Profile updated successfully', user: user.toJSON() });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/logout', auth, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
