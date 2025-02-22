const Budget = require("../models/Budget");

// Create Budget
exports.createBudget = async (req, res) => {
  const { studentEmail, eventName, eventBudget, eventFundsExpense, eventBudgetProof, messBudgetProof } = req.body;
  
  try {
    const budget = new Budget({
      studentEmail,
      eventName,
      eventBudget,
      eventFundsExpense,
      eventBudgetProof,
      messBudgetProof,
    });
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create budget" });
  }
};

// Get All Budgets
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.json(budgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
};

// Update Budget Feedback (Admin Only)
exports.updateBudgetFeedback = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const { feedback } = req.body;
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    budget.feedback = feedback;
    await budget.save();
    res.json(budget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update budget" });
  }
};
