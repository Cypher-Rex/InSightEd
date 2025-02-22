const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  eventName: { type: String, required: true },
  eventBudget: { type: Number, required: true },
  eventFundsExpense: { type: Number, required: true },
  eventBudgetProof: { type: String, required: true },
  messBudgetProof: { type: String, required: true },
  feedback: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Budget", BudgetSchema);