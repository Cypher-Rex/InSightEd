const express = require('express');
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

const router = express.Router();

// Create Budget
router.post("/", auth, async (req, res) => {
  const { studentEmail, eventName, eventBudget, eventFundsExpense, eventBudgetProof, messBudgetProof } = req.body;
  
  try {
    console.log("Received budget data:", req.body); // Debugging statement
    const budget = new Budget({ studentEmail, eventName, eventBudget, eventFundsExpense, eventBudgetProof, messBudgetProof });
    await budget.save();
    console.log("Budget saved:", budget); // Debugging statement
    res.status(201).json(budget);
  } catch (err) {
    console.error("Failed to create budget:", err); // Debugging statement
    res.status(500).json({ error: "Failed to create budget" });
  }
});

// Get All Budgets
router.get("/", auth, async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
});

// Update Budget Feedback (Admin Only)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Unauthorized" });

  const { feedback } = req.body;
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ error: "Budget not found" });

    budget.feedback = feedback;
    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: "Failed to update budget" });
  }
});

module.exports = router;