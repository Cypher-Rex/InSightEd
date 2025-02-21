import { useState } from 'react';
import { TextField, Button, Typography, Box, InputLabel, FormControl, Paper } from '@mui/material';

// Convert file to Base64 before submitting
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      resolve(null); // Return null if no file is uploaded
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const BudgetForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    studentEmail: '',
    eventName: '',
    eventBudget: '',
    eventFundsExpense: '',
    eventBudgetProof: null,
    messBudgetProof: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({ ...formData, [name]: files[0] }); // Temporarily store file object
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentEmail) newErrors.studentEmail = 'Student Email is required';
    if (!formData.eventName) newErrors.eventName = 'Event Name is required';
    if (!formData.eventBudget) newErrors.eventBudget = 'Event Budget is required';
    if (!formData.eventFundsExpense) newErrors.eventFundsExpense = 'Event Funds Expense is required';
    if (!formData.eventBudgetProof) newErrors.eventBudgetProof = 'Event Budget Proof is required';
    if (!formData.messBudgetProof) newErrors.messBudgetProof = 'Mess Budget Proof is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Convert files to Base64 before submitting
    const eventBudgetProofBase64 = await fileToBase64(formData.eventBudgetProof);
    const messBudgetProofBase64 = await fileToBase64(formData.messBudgetProof);

    onSubmit({
      ...formData,
      eventBudgetProof: eventBudgetProofBase64,
      messBudgetProof: messBudgetProofBase64,
      id: Date.now(),
    });

    // Reset form after submission
    setFormData({
      studentEmail: '',
      eventName: '',
      eventBudget: '',
      eventFundsExpense: '',
      eventBudgetProof: null,
      messBudgetProof: null,
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        Submit Budget Details
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Student Email"
          name="studentEmail"
          value={formData.studentEmail}
          onChange={handleChange}
          error={!!errors.studentEmail}
          helperText={errors.studentEmail}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Event Name"
          name="eventName"
          value={formData.eventName}
          onChange={handleChange}
          error={!!errors.eventName}
          helperText={errors.eventName}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Event Budget"
          name="eventBudget"
          type="number"
          value={formData.eventBudget}
          onChange={handleChange}
          error={!!errors.eventBudget}
          helperText={errors.eventBudget}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Event Funds Expense"
          name="eventFundsExpense"
          type="number"
          value={formData.eventFundsExpense}
          onChange={handleChange}
          error={!!errors.eventFundsExpense}
          helperText={errors.eventFundsExpense}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel shrink>Event Budget Proof (PDF/Image)</InputLabel>
          <input
            type="file"
            name="eventBudgetProof"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel shrink>Mess Budget Proof (PDF/Image)</InputLabel>
          <input
            type="file"
            name="messBudgetProof"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
            required
          />
        </FormControl>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, width: '100%' }}>
          Submit
        </Button>
      </Box>
    </Paper>
  );
};

export default BudgetForm;
