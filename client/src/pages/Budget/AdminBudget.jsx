import { useState, useEffect } from 'react';
import { Box, Typography, Pagination, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Card, CardContent, Chip } from '@mui/material';
import Sidebar from "../../components/Sidebar";
import axios from 'axios';

const AdminBudget = () => {
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [openBudgetPopup, setOpenBudgetPopup] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');

  useEffect(() => {
    const fetchApprovedApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/applications', {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        // Filter applications with status "Approved"
        const approvedApps = response.data.filter(app => app.status === 'Approved');
        setApprovedApplications(approvedApps);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApprovedApplications();
  }, []);

  const handleCreateBudget = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/budgets', // Correct endpoint
        {
          applicationId: selectedApplication._id,
          budgetAmount: Number(budgetAmount),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log('Budget created:', response.data);
      setOpenBudgetPopup(false);
      setBudgetAmount('');
    } catch (err) {
      console.error('Error creating budget:', err.response ? err.response.data : err.message);
    }
  };

  const handleAddExpense = async (budgetId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/budgets/${budgetId}/expenses`,
        {
          amount: Number(expenseAmount),
          description: expenseDescription,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setExpenses((prev) => [...prev, response.data]);
      setExpenseAmount('');
      setExpenseDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedApplications = approvedApplications.slice((page - 1) * 10, page * 10);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>Admin Budget</Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Approved Applications</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {paginatedApplications.map((application) => (
            <Card key={application._id} sx={{ width: 300, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{application.name}</Typography>
                <Typography color="text.secondary">{application.email}</Typography>
                <Chip
                  label={application.status}
                  color="success"
                  sx={{ mt: 1 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>{application.description}</Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setSelectedApplication(application);
                    setOpenBudgetPopup(true);
                  }}
                >
                  Create Budget
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
        <Pagination count={Math.ceil(approvedApplications.length / 10)} page={page} onChange={handlePageChange} sx={{ mt: 2 }} />

        {/* Budget Popup */}
        <Dialog open={openBudgetPopup} onClose={() => setOpenBudgetPopup(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create Budget</DialogTitle>
          <DialogContent>
            {selectedApplication && (
              <>
                <Typography><strong>Name:</strong> {selectedApplication.name}</Typography>
                <Typography><strong>Email:</strong> {selectedApplication.email}</Typography>
                <Typography><strong>Description:</strong> {selectedApplication.description}</Typography>
                <TextField
                  fullWidth
                  label="Budget Amount"
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  sx={{ mt: 2 }}
                  required
                />
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={handleCreateBudget}
                  disabled={!budgetAmount}
                >
                  Create Budget
                </Button>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBudgetPopup(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Expense Tracking Popup */}
        {selectedApplication?.budgetId && (
          <Dialog open={!!selectedApplication.budgetId} onClose={() => setSelectedApplication(null)} maxWidth="md" fullWidth>
            <DialogTitle>Track Expenses</DialogTitle>
            <DialogContent>
              <Typography variant="h6">Budget ID: {selectedApplication.budgetId}</Typography>
              <Typography variant="body1">Budget Amount: ${budgetAmount}</Typography>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Expense Amount"
                  type="number"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  label="Expense Description"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  sx={{ mb: 2 }}
                  required
                />
                <Button
                  variant="contained"
                  onClick={() => handleAddExpense(selectedApplication.budgetId)}
                  disabled={!expenseAmount || !expenseDescription}
                >
                  Add Expense
                </Button>
              </Box>
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6">Expenses</Typography>
                {expenses.map((expense, index) => (
                  <Box key={index} sx={{ mt: 2 }}>
                    <Typography><strong>Amount:</strong> ${expense.amount}</Typography>
                    <Typography><strong>Description:</strong> {expense.description}</Typography>
                  </Box>
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedApplication(null)}>Close</Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Box>
  );
};

export default AdminBudget;