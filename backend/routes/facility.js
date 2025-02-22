const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

// For clarity, we define controller functions inline. 
// In a production app, you may want to extract these to controllers/facilityRequestController.js
const FacilityRequest = require("../models/Facility");

// Create Facility Request
router.post("/", auth, async (req, res) => {
  const { activity, numStudents, time, date } = req.body;
  try {
    const facilityRequest = new FacilityRequest({
      activity,
      numStudents,
      time,
      date,
      createdBy: req.user.id,
    });
    await facilityRequest.save();
    res.status(201).json(facilityRequest);
  } catch (err) {
    res.status(500).json({ error: "Failed to create facility request" });
  }
});

// Get All Facility Requests for current user
router.get("/", auth, async (req, res) => {
  try {
    const facilityRequests = await FacilityRequest.find({ createdBy: req.user.id });
    res.json(facilityRequests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch facility requests" });
  }
});

module.exports = router;
