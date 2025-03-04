import { useState, useEffect } from 'react';
import { Box, Typography, Pagination } from '@mui/material';
import BudgetCard from '../../components/BudgetCard';
import BudgetPopup from '../../components/BudgetPopup';
import Sidebar from "../../components/Sidebar";
import axios from 'axios';

const AdminBudget = () => {
  const [budgets, setBudgets] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedBudget, setSelectedBudget] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/budgets', {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setBudgets(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBudgets();
  }, []);

  const handleFeedbackSubmit = async (id, feedback) => {
    try {
      const response = await axios.put(`http://localhost:5000/budgets/${id}`, { feedback }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const updatedBudgets = budgets.map((budget) =>
        budget._id === id ? response.data : budget
      );
      setBudgets(updatedBudgets);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedBudgets = budgets.slice((page - 1) * 10, page * 10);

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>Admin Budget</Typography>
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>All Budgets</Typography>
      {paginatedBudgets.map((budget) => (
        <BudgetCard key={budget._id} budget={budget} onClick={() => setSelectedBudget(budget)} />
      ))}
      <Pagination count={Math.ceil(budgets.length / 10)} page={page} onChange={handlePageChange} sx={{ mt: 2 }} />
      {selectedBudget && (
        <BudgetPopup
          open={!!selectedBudget}
          onClose={() => setSelectedBudget(null)}
          budget={selectedBudget}
          isAdmin={true}
          onFeedbackSubmit={handleFeedbackSubmit}
        />
      )}
    </Box>
  );
};

export default AdminBudget;