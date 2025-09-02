const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  service: { type: String, enum: ['software', 'marketing', 'content', 'ai', 'multiple', 'other'], default: 'other' },
  message: { type: String, required: true, maxlength: 2000 },
  status: { type: String, enum: ['new', 'contacted', 'in-progress', 'completed', 'closed'], default: 'new' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  source: { type: String, default: 'website' },
  ipAddress: { type: String },
  userAgent: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: [{
    content: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now }
  }],
  followUpDate: { type: Date },
  estimatedValue: { type: Number }
}, { timestamps: true });

contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);
