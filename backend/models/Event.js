const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", EventSchema);