const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/complaintcontroller");
const auth = require("../middleware/auth");

router.post("/", auth, complaintController.createComplaint);
router.get("/", auth, complaintController.getAllComplaints);
router.put("/:id", auth, complaintController.updateComplaintStatus);
router.post("/:id/vote", auth, complaintController.voteForReveal);

module.exports = router;
