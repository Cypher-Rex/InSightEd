const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get('/me', auth, authController.getProfile);
router.post('/refresh-token', authController.refreshToken);
router.put('/profilepage', auth, authController.updateProfile);

module.exports = router;