const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Define Schema
const caseSchema = new mongoose.Schema({
  studentName: String,
  examName: String,
  description: String,
  invigilatorName: String,
  action: { type: String, default: null }, // Initially no action
});

const Case = mongoose.model('Case', caseSchema);

// Routes
router.post('/cases', async (req, res) => {
  try {
    const newCase = new Case(req.body);
    await newCase.save();
    res.status(201).json(newCase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const cases = await Case.find();
    res.status(200).json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/cases/:id', async (req, res) => {
  try {
    const updatedCase = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedCase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;