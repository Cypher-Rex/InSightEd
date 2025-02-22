const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  dob: { type: String, default: '' },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  phone: { type: String, default: '' },
  isHosteler: { type: Boolean, default: false },
  hostelEmail: { type: String, default: '' },
  class: { type: String, default: '' },
  classCoordinatorName: { type: String, default: '' },
  classCoordinatorEmail: { type: String, default: '' },
  parentsEmail: { type: String, default: '' },
});

module.exports = mongoose.model("User", UserSchema);