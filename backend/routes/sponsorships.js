const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Sponsorship = require("../models/Sponsorship");

// Create Sponsorship
router.post("/", auth, async (req, res) => {
  const { title, description, amount } = req.body;
  try {
    const sponsorship = new Sponsorship({
      title,
      description,
      amount,
      createdBy: req.user.id,
    });
    await sponsorship.save();
    res.status(201).json(sponsorship);
  } catch (err) {
    res.status(500).json({ error: "Failed to create sponsorship" });
  }
});

// Get All Sponsorships
router.get("/", auth, async (req, res) => {
  try {
    const sponsorships = await Sponsorship.find().populate("createdBy", "name email");
    res.json(sponsorships);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sponsorships" });
  }
});

// Update Sponsorship Status (Admin Only)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }
  
  const { status } = req.body;
  try {
    const sponsorship = await Sponsorship.findById(req.params.id);
    if (!sponsorship) {
      return res.status(404).json({ error: "Sponsorship not found" });
    }
    
    sponsorship.status = status;
    await sponsorship.save();
    res.json(sponsorship);
  } catch (err) {
    res.status(500).json({ error: "Failed to update sponsorship" });
  }
});

module.exports = router;
