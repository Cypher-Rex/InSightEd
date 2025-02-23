const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ["Filled", "Under Investitagation","Resolved"], default: "Filled" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  revealIdentity: { type: Boolean, default: false },
  approveVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rejectVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
