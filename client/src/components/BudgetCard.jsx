import { Card, CardContent, Typography, Button } from '@mui/material';

const BudgetCard = ({ budget, onClick }) => {
  return (
    <Card sx={{ mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{budget.eventName}</Typography>
        <Typography variant="body2">Student Email: {budget.studentEmail}</Typography>
        <Typography variant="body2">Event Budget: ₹{budget.eventBudget}</Typography>
        <Typography variant="body2">Event Funds Expense: ₹{budget.eventFundsExpense}</Typography>
        <Button variant="contained" color="primary" onClick={onClick} sx={{ mt: 2 }}>View Details</Button>
      </CardContent>
    </Card>
  );
};

export default BudgetCard;