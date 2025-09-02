// routes/newsletter.js
const express = require('express');
const router = express.Router();

// POST /api/newsletter - Handle email subscription
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    console.log('Newsletter signup:', email);

    return res.json({
      success: true,
      message: 'Thank you for subscribing!'
    });
  } catch (err) {
    console.error('Newsletter error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to subscribe'
    });
  }
});

module.exports = router;
