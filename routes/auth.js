const express = require("express");
const router = express.Router();

// Demo login route
router.post("/login", (req, res) => {
  const { empId, email, password, department } = req.body;

  const demoUsers = {
    EMP001: { email: "admin@srmsolutions.com", password: "admin123", department: "Management" },
    EMP002: { email: "dev@srmsolutions.com", password: "dev123", department: "Development" },
    EMP003: { email: "marketing@srmsolutions.com", password: "marketing123", department: "Marketing" },
    EMP004: { email: "content@srmsolutions.com", password: "content123", department: "Content" },
    EMP005: { email: "ai@srmsolutions.com", password: "ai123", department: "AI Solutions" },
    EMP006: { email: "hr@srmsolutions.com", password: "hr123", department: "HR" }
  };

  const user = demoUsers[empId];
  if (user && user.email === email && user.password === password && user.department === department) {
    return res.json({ success: true, message: `Welcome ${empId} to ${department}!` });
  }

  res.status(401).json({ success: false, message: "Invalid credentials" });
});

module.exports = router;
