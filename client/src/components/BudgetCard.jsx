import { Card, CardContent, Typography, Button } from '@mui/material';

const BudgetCard = ({ application, onClick }) => {
  return (
    <Card onClick={onClick} sx={{ cursor: 'pointer' }}>
      <CardContent>
        <Typography variant="h6">{application.name}</Typography>
        <Typography color="text.secondary">{application.type}</Typography>
        <Typography><strong>Budget:</strong> {application.budget?.budgetAmount || 'Not set'}</Typography>
        <Typography><strong>Expenses:</strong> {application.budget?.expenses || 0}</Typography>
        <Typography><strong>Remaining:</strong> {application.budget ? application.budget.budgetAmount - application.budget.expenses : 'N/A'}</Typography>
      </CardContent>
    </Card>
  );
};

export default BudgetCard;