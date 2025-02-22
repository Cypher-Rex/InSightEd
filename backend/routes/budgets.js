const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");
const auth = require("../middleware/auth");

router.post("/", auth, budgetController.createBudget);
router.get("/", auth, budgetController.getBudgets);
router.put("/:id", auth, budgetController.updateBudgetFeedback);

module.exports = router;
