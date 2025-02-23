const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  bookingType: { type: String, enum: ["facility", "doctor"], required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  studentsCount: { type: Number },
  symptoms: { type: String },
});

module.exports = mongoose.model("Booking", BookingSchema);
