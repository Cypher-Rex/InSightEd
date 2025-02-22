const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Resolved", "Rejected"], default: "Pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  revealRequested: { type: Boolean, default: false },
  revealApprovals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Complaint", ComplaintSchema);