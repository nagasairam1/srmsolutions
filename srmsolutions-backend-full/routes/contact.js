const express = require('express');
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');
const { auth } = require('../middleware/auth');
const { validateContact } = require('../middleware/validation');

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/', validateContact, async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    const contact = new Contact({
      name, email, phone, service, message,
      ipAddress: req.ip, userAgent: req.get('User-Agent')
    });
    await contact.save();

    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact - ${service || 'General'}`,
      html: `<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
<p><strong>Service:</strong> ${service || 'Not specified'}</p>
<p><strong>Message:</strong><br/>${message}</p>
<p><em>Submitted: ${new Date().toLocaleString()}</em></p>`
    };

    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thanks for contacting SRMsolutions!',
      html: `<h2>Thank you, ${name}!</h2>
<p>We received your message and will respond within 24 hours.</p>
<p>Regards,<br/>SRMsolutions Team</p>`
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    res.status(201).json({
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
      contactId: contact._id
    });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ success: false, message: 'Error sending your message. Please try again.' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, service } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (service) filter.service = service;

    const results = await Contact.find(filter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Contact.countDocuments(filter);
    res.json({
      success: true,
      contacts: results,
      pagination: { current: Number(page), pages: Math.ceil(total / Number(limit)), total }
    });
  } catch (err) {
    console.error('Get contacts error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { status, priority, assignedTo, notes } = req.body;
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });

    if (status) contact.status = status;
    if (priority) contact.priority = priority;
    if (assignedTo) contact.assignedTo = assignedTo;
    if (notes) contact.notes.push({ content: notes, addedBy: req.user.userId });

    await contact.save();
    res.json({ success: true, message: 'Contact updated successfully', contact });
  } catch (err) {
    console.error('Update contact error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
