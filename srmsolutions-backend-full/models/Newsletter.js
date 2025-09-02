const mongoose = require('mongoose');
const crypto = require('crypto');

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  status: { type: String, enum: ['active', 'unsubscribed', 'bounced'], default: 'active' },
  source: { type: String, default: 'website' },
  tags: [{ type: String }],
  preferences: {
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'weekly' },
    topics: [{ type: String, enum: ['technology', 'marketing', 'ai', 'business', 'tutorials'] }]
  },
  unsubscribeToken: { type: String, unique: true },
  lastEmailSent: { type: Date },
  clickCount: { type: Number, default: 0 },
  openCount: { type: Number, default: 0 }
}, { timestamps: true });

newsletterSchema.pre('save', function(next) {
  if (!this.unsubscribeToken) {
    this.unsubscribeToken = crypto.randomBytes(32).toString('hex');
  }
  next();
});

module.exports = mongoose.model('Newsletter', newsletterSchema);
