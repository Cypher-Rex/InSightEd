const mongoose = require('mongoose');

const FacilityRequestSchema = new mongoose.Schema({
  activity: { type: String, required: true },
  numStudents: { type: Number, required: true },
  time: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FacilityRequest", FacilityRequestSchema);