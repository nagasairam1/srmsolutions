const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

app.use(express.json());
app.use(cors({
  origin: function(origin, cb){ return cb(null, true); }, // loosen for demo; set ALLOWED_ORIGIN in prod
  credentials: true
}));

// --- DB ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/srm_solutions';
mongoose.connect(MONGO_URI, { })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('Mongo error:', err));

// simple User model
const userSchema = new mongoose.Schema({ name: { type: String, required: true } }, { timestamps: true });
const User = mongoose.model('User', userSchema);

// --- Routes ---
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Hello from SRMsolutions backend!' });
});

app.post('/api/hello', async (req, res) => {
  try {
    const name = (req.body && req.body.name) ? String(req.body.name) : 'Anonymous';
    const u = await User.create({ name });
    res.json({ message: `Saved ${u.name} to DB!`, id: u._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save' });
  }
});

// healthcheck
app.get('/healthz', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
