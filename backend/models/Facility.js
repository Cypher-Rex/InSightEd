const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  maxCapacity: { type: Number, required: true },
});

module.exports = mongoose.model("Facility", facilitySchema);
