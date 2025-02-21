import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Button, TextField, Box, Chip, Stack } from '@mui/material';

const BudgetPopup = ({ open, onClose, budget, isAdmin, onFeedbackSubmit }) => {
  const [feedback, setFeedback] = useState('');
  const [fileUrls, setFileUrls] = useState({ eventBudget: null, messBudget: null });

  // Generate file URLs from Base64 data
  useEffect(() => {
    if (budget && open) {
      setFileUrls({
        eventBudget: budget.eventBudgetProof,
        messBudget: budget.messBudgetProof,
      });
    }
  }, [budget, open]);

  const handleFeedbackSubmit = () => {
    onFeedbackSubmit(budget.id, feedback);
    setFeedback('');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
        Budget Details
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{budget.eventName}</Typography>
          <Stack direction="row" spacing={1}>
            <Chip label={`Student Email: ${budget.studentEmail}`} color="info" />
            <Chip label={`Event Budget: ₹${budget.eventBudget}`} color="success" />
            <Chip label={`Event Funds Expense: ₹${budget.eventFundsExpense}`} color="warning" />
          </Stack>

          {/* Event Budget Proof */}
          {fileUrls.eventBudget && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Event Budget Proof:</Typography>
              <Button
                variant="outlined"
                component="a"
                href={fileUrls.eventBudget}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Proof
              </Button>
            </Box>
          )}

          {/* Mess Budget Proof */}
          {fileUrls.messBudget && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Mess Budget Proof:</Typography>
              <Button
                variant="outlined"
                component="a"
                href={fileUrls.messBudget}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Proof
              </Button>
            </Box>
          )}

          {/* Admin Feedback Section */}
          {isAdmin && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                multiline
                rows={3}
              />
              <Button variant="contained" color="primary" onClick={handleFeedbackSubmit} sx={{ mt: 1 }}>
                Submit Feedback
              </Button>
            </Box>
          )}

          {/* Display Admin Feedback */}
          {budget.feedback && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Admin Feedback:</Typography>
              <Typography variant="body1">{budget.feedback}</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetPopup;