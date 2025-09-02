// routes/services.js
const express = require('express');
const router = express.Router();

// GET /api/services - Return list of services
router.get('/', (req, res) => {
  const services = [
    {
      id: 'software',
      title: '💻 Software Development',
      description: 'Custom web and mobile applications using modern technologies.'
    },
    {
      id: 'ai',
      title: '🤖 AI Solutions',
      description: 'AI-powered automation, chatbots, and data analytics.'
    },
    {
      id: 'marketing',
      title: '📈 Digital Marketing',
      description: 'SEO, social media, and paid advertising strategies.'
    },
    {
      id: 'content',
      title: '🎥 Content Creation',
      description: 'Engaging videos, graphics, and brand storytelling.'
    }
  ];

  res.json({
    success: true,
    data: services
  });
});

// GET /api/services/:id - Get specific service
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const services = {
    software: {
      id: 'software',
      title: '💻 Software Development',
      description: 'We build scalable web and mobile apps with React, Node.js, Python, and more.',
      features: ['Web Apps', 'Mobile Apps', 'APIs', 'Cloud Integration']
    },
    ai: {
      id: 'ai',
      title: '🤖 AI Solutions',
      description: 'Implement AI for automation, insights, and customer engagement.',
      features: ['Chatbots', 'Predictive Analytics', 'NLP', 'Machine Learning']
    },
    marketing: {
      id: 'marketing',
      title: '📈 Digital Marketing',
      description: 'Data-driven marketing to grow your audience and conversions.',
      features: ['SEO', 'Social Media', 'Email Campaigns', 'Google Ads']
    },
    content: {
      id: 'content',
      title: '🎥 Content Creation',
      description: 'High-quality content that tells your brand story.',
      features: ['Video Production', 'Graphic Design', 'Copywriting', 'Social Media Content']
    }
  };

  const service = services[id];
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }

  res.json({
    success: true,
    data: service
  });
});

module.exports = router;
