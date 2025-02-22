const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Resolved", "Rejected"], default: "Pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  revealRequested: { type: Boolean, default: false },
  revealApprovals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  // Optionally add vote fields if needed:
  approveVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  rejectVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  revealIdentity: { type: Boolean, default: false },
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
