const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetcontroller");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, budgetController.createBudget);
router.get("/", auth, budgetController.getBudgets);
router.put("/:id", auth, budgetController.updateBudgetFeedback);

module.exports = router;
