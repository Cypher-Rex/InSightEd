const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Application Schema
const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNo: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: Date, required: true },
  budget: { type: Number, min: 0 }, // Ensure budget is a non-negative number
  description: { type: String, required: true },
  file: { type: String }, // Base64 string
  sickLeaveDays: { type: Number, min: 0 }, // Ensure sickLeaveDays is a non-negative number
  reason: { type: String },
  reasonProof: { type: String }, // Base64 string
  status: { type: String, default: 'Pending' },
  feedback: { type: String },
});

const Application = mongoose.model('Application', applicationSchema);

// Create a new application
router.post('/', async (req, res) => {
  try {
    console.log("Incoming payload:", req.body); // Debugging: Log the payload

    const {
      name,
      email,
      phoneNo,
      type,
      date,
      budget,
      description,
      file,
      sickLeaveDays,
      reason,
      reasonProof,
    } = req.body;

    const application = new Application({
      name,
      email,
      phoneNo,
      type,
      date: new Date(date), // Ensure date is a valid Date object
      budget: Number(budget), // Ensure budget is a number
      description,
      file,
      sickLeaveDays: Number(sickLeaveDays), // Ensure sickLeaveDays is a number
      reason,
      reasonProof,
    });

    await application.save();
    res.status(201).json(application);
  } catch (err) {
    console.error("Error creating application:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all applications
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update application status and feedback
router.put('/:id', async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, feedback },
      { new: true }
    );
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;