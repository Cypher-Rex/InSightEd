const Booking = require("../models/Booking");

// Store a new booking
exports.createBooking = async (req, res) => {
  try {
    const { bookingType, date, timeSlot, studentsCount, symptoms } = req.body;

    const newBooking = new Booking({
      bookingType,
      date,
      timeSlot,
      studentsCount: bookingType === "facility" ? studentsCount : undefined,
      symptoms: bookingType === "doctor" ? symptoms : undefined,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking confirmed", booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
