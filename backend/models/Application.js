const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNo: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: Date, required: true },
  budget: { type: Number, required: true },
  description: { type: String, required: true },
  filePath: { type: String }, // Store file path
  sickLeaveDays: { type: Number },
  reason: { type: String },
  reasonProofPath: { type: String }, // Store file path
  feedback: { type: String },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  budget: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' },
});

module.exports = mongoose.model('Application', ApplicationSchema);
