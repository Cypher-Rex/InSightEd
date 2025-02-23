const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const complaintController = require("../controllers/complaintcontroller");
const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  revealIdentity: { type: Boolean, default: false },
  approveVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  rejectVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  revealRequested: { type: Boolean, default: false },
});

module.exports = mongoose.model("Complaint", ComplaintSchema);

// Create a new complaint
router.post("/", auth, complaintController.createComplaint);

// Get all complaints
router.get("/", auth, complaintController.getAllComplaints);

// Update complaint status
router.put("/:id/status", auth, complaintController.updateComplaintStatus);

// Vote for identity reveal
router.post("/:id/vote", auth, complaintController.voteForReveal);

// Request identity reveal
router.post("/:id/reveal", auth, complaintController.requestReveal);

module.exports = router;