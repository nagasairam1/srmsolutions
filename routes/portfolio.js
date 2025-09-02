// routes/portfolio.js
const express = require('express');
const router = express.Router();

// Sample portfolio data (in production, this would come from MongoDB)
const portfolioData = [
  {
    id: 1,
    title: "E-commerce Platform",
    category: "web",
    description: "A full-featured online store with payment integration and inventory management",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    image: "/images/portfolio/ecommerce.jpg",
    features: [
      "User authentication",
      "Shopping cart & checkout",
      "Payment gateway",
      "Admin dashboard"
    ],
    results: {
      "Conversion Rate": "+35%",
      "Page Speed": "2.1s"
    }
  },
  {
    id: 2,
    title: "AI Chatbot Solution",
    category: "ai",
    description: "Intelligent customer service bot with natural language processing",
    technologies: ["Python", "TensorFlow", "Dialogflow"],
    image: "/images/portfolio/chatbot.jpg",
    features: [
      "24/7 Support",
      "Multi-language",
      "
