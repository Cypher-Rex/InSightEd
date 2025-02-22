const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontroller"); // Corrected path

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
