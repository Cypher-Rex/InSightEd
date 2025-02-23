const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const complaintController = require("../controllers/complaintcontroller");

// Create a new complaint
router.post("/", auth, complaintController.createComplaint);

// Get all complaints
router.get("/", auth, complaintController.getAllComplaints);

// Update complaint status (Admin only)
router.put("/:id/status", auth, complaintController.updateComplaintStatus);

// Vote for identity reveal (Admin only)
router.post("/:id/vote", auth, complaintController.voteForReveal);

module.exports = router;