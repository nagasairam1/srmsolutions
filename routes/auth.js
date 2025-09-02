// routes/auth.js
const express = require("express");
const router = express.Router();

// Dummy login endpoint
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "password") {
    return res.json({ message: "Login successful 🚀" });
  }

  res.status(401).json({ message: "Invalid credentials ❌" });
});

// Dummy register endpoint
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  res.json({ message: "User registered successfully ✅", user: { username, email } });
});

module.exports = router;
