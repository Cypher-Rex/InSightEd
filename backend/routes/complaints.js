const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/complaintcontroller");
const authMiddleware = require("../middleware/authMiddleware"); // Ensure you have authentication

router.post("/complaint", authMiddleware, complaintController.createComplaint);
router.get("/complaints", authMiddleware, complaintController.getAllComplaints);
router.put("/complaint/:id/status", authMiddleware, complaintController.updateComplaintStatus);
router.put("/complaint/:id/vote", authMiddleware, complaintController.voteForReveal);

module.exports = router;
