const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Get current user profile (excluding password)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update Profile
router.put("/", auth, async (req, res) => {
  const { dob, class: className, classCoordinatorName, classCoordinatorEmail, parentsEmail } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    user.dob = dob;
    user.class = className;
    user.classCoordinatorName = classCoordinatorName;
    user.classCoordinatorEmail = classCoordinatorEmail;
    user.parentsEmail = parentsEmail;
    
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Change Password
router.put("/change-password", auth, async (req, res) => {
  const { password, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    const bcrypt = require("bcryptjs");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid current password" });
    
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to change password" });
  }
});

module.exports = router;
