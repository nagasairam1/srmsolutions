// routes/contact.js
const express = require('express');
const router = express.Router();

// POST /api/contact - Handle form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    // Simulate saving to database
    console.log('Contact form received:', { name, email, phone, service, message });

    return res.json({
      success: true,
      message: 'Message received! We will contact you soon.'
    });
  } catch (err) {
    console.error('Contact error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
