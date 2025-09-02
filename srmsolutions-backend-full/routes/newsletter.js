const express = require('express');
const nodemailer = require('nodemailer');
const Newsletter = require('../models/Newsletter');
const { auth } = require('../middleware/auth');
const { validateEmail, validateNewsletter } = require('../middleware/validation');

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/subscribe', validateEmail, async (req, res) => {
  try {
    const { email } = req.body;
    let subscriber = await Newsletter.findOne({ email: email.toLowerCase() });
    if (subscriber) {
      if (subscriber.status === 'active') {
        return res.status(400).json({ success: false, message: 'Already subscribed!' });
      }
      subscriber.status = 'active';
      await subscriber.save();
    } else {
      subscriber = await Newsletter.create({ email: email.toLowerCase() });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to SRMsolutions Newsletter!',
      html: `<h2>Welcome!</h2><p>You are now subscribed to SRMsolutions updates.</p>`
    });

    res.status(201).json({ success: true, message: 'Subscribed! Please check your email.' });
  } catch (err) {
    console.error('Newsletter subscribe error:', err);
    res.status(500).json({ success: false, message: 'Error subscribing. Please try again.' });
  }
});

router.post('/unsubscribe', async (req, res) => {
  try {
    const { email, token } = req.body;
    let subscriber = null;
    if (token) subscriber = await Newsletter.findOne({ unsubscribeToken: token });
    else if (email) subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (!subscriber) return res.status(404).json({ success: false, message: 'Subscription not found' });

    subscriber.status = 'unsubscribed';
    await subscriber.save();
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (err) {
    console.error('Newsletter unsubscribe error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/subscribers', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;
    const subs = await Newsletter.find({ status })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    const total = await Newsletter.countDocuments({ status });
    res.json({
      success: true,
      subscribers: subs,
      pagination: { current: Number(page), pages: Math.ceil(total / Number(limit)), total }
    });
  } catch (err) {
    console.error('Get subscribers error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/send', auth, validateNewsletter, async (req, res) => {
  try {
    const { subject, content, htmlContent } = req.body;
    const subs = await Newsletter.find({ status: 'active' });
    if (subs.length === 0) {
      return res.status(400).json({ success: false, message: 'No active subscribers' });
    }
    const batchSize = 50;
    let sent = 0, errors = 0;
    for (let i = 0; i < subs.length; i += batchSize) {
      const batch = subs.slice(i, i + batchSize);
      await Promise.all(batch.map(async (s) => {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: s.email,
            subject,
            text: content,
            html: htmlContent || `<pre>${content}</pre>`
          });
          s.lastEmailSent = new Date();
          await s.save();
          sent++;
        } catch (e) {
          console.error('Mail error to', s.email, e.message);
          errors++;
        }
      }));
      if (i + batchSize < subs.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    res.json({ success: true, message: 'Newsletter sent', stats: { sent, errors, total: subs.length } });
  } catch (err) {
    console.error('Send newsletter error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
