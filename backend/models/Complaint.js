const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["Pending", "Resolved", "Rejected"], default: "Pending" },
  revealRequested: { type: Boolean, default: false },
  approveVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  rejectVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  revealIdentity: { type: Boolean, default: false }
});

module.exports = mongoose.model("Complaint", complaintSchema);
