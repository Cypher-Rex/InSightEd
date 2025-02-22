const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Placeholder: Test endpoint for events
router.get("/", auth, (req, res) => {
  res.send("Events route works!");
});

module.exports = router;
