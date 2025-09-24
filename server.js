// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/srmsolutions", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Models
const LeadSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  downloadedAt: { type: Date, default: Date.now }
});
const Lead = mongoose.model('Lead', LeadSchema);

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  service: String,
  message: String,
  submittedAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', ContactSchema);

const EmployeeSchema = new mongoose.Schema({
  employeeId: String,
  email: String,
  password: String,
  department: String,
  name: String,
  role: String
});
const Employee = mongoose.model('Employee', EmployeeSchema);

// Seed default employees (run once)
async function seedEmployees() {
  const count = await Employee.countDocuments();
  if (count === 0) {
    await Employee.insertMany([
      { employeeId: 'EMP001', email: 'admin@srmsolutions.com', password: 'admin123', department: 'management', name: 'Admin User', role: 'System Administrator' },
      { employeeId: 'EMP002', email: 'dev@srmsolutions.com', password: 'dev123', department: 'development', name: 'John Developer', role: 'Senior Developer' },
      { employeeId: 'EMP003', email: 'marketing@srmsolutions.com', password: 'marketing123', department: 'marketing', name: 'Sarah Marketing', role: 'Marketing Manager' },
      { employeeId: 'EMP004', email: 'content@srmsolutions.com', password: 'content123', department: 'content', name: 'Alex Content', role: 'Content Creator' },
      { employeeId: 'EMP005', email: 'ai@srmsolutions.com', password: 'ai123', department: 'ai', name: 'Maya AI', role: 'AI Specialist' },
      { employeeId: 'EMP006', email: 'hr@srmsolutions.com', password: 'hr123', department: 'hr', name: 'Lisa HR', role: 'HR Manager' }
    ]);
    console.log('✅ Default employees seeded');
  }
}
seedEmployees();

// API Routes

// Save lead from "Free Guide" form
app.post('/api/leads', async (req, res) => {
  try {
    const { email } = req.body;
    await Lead.findOneAndUpdate({ email }, { email }, { upsert: true });
    return res.json({ success: true, message: "Guide sent!" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Save contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    const contact = new Contact({ name, email, phone, service, message });
    await contact.save();
    return res.json({ success: true, message: 'Message saved!' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Employee Login
app.post('/api/login', async (req, res) => {
  const { employeeId, workEmail, password, department } = req.body;
  const emp = await Employee.findOne({ employeeId, department });

  if (!emp) return res.json({ success: false, message: 'Invalid credentials' });

  if (emp.email === workEmail && emp.password === password) {
    return res.json({
      success: true,
      user: { name: emp.name, role: emp.role, department: emp.department }
    });
  } else {
    return res.json({ success: false, message: 'Invalid credentials' });
  }
});

// Serve frontend HTML
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SRMsolutions Backend running on http://localhost:${PORT}`);
});
