const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = express.Router();
router.use(cors());


// Budget Schema
const budgetSchema = new mongoose.Schema({
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    budgetAmount: { type: Number, required: true },
    expenses: { type: Number, default: 0 },
  });
  
  const Budget = mongoose.model('Budget', budgetSchema);

// Fetch Approved Applications
router.get('/budgets', async (req, res) => {
  try {
    // Corrected: Fetch budgets from Budget model
    const budgets = await Budget.find().populate('applicationId'); 
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Budget


  
  // Create Budget
  router.post('/budgets', async (req, res) => {
    try {
      const { applicationId, budgetAmount } = req.body;
  
      // Check if the application exists and is approved
      const application = await Application.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
      if (application.status !== 'Approved') {
        return res.status(400).json({ error: 'Application is not approved' });
      }
  
      // Create a new budget
      const budget = new Budget({ applicationId, budgetAmount, expenses: 0 });
      await budget.save();
  
      // Link the budget to the application
      application.budget = budget._id;
      await application.save();
  
      res.status(201).json(budget);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Update Expenses
router.put('/budgets/:id/expense', async (req, res) => {
  try {
    const { expenseAmount } = req.body;

    // Find the budget
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Update expenses
    budget.expenses += Number(expenseAmount);
    await budget.save();

    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
