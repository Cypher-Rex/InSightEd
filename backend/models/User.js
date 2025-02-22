const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  dob: Date,
  class: String,
  classCoordinatorName: String,
  classCoordinatorEmail: String,
  parentsEmail: String,
});

module.exports = mongoose.model("User", UserSchema);