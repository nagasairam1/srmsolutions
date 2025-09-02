const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  client: { type: String },
  status: { type: String, enum: ['draft', 'active', 'completed', 'archived'], default: 'draft' },
  budget: { type: Number },
  startDate: { type: Date },
  endDate: { type: Date },
  attachments: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
