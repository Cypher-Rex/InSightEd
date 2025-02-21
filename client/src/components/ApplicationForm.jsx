import { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';

const ApplicationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ type: '', title: '', description: '' }); // Clear form after submission
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, margin: 'auto', mt: 4 }}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Application Type</InputLabel>
        <Select name="type" value={formData.type} onChange={handleChange} required>
          <MenuItem value="event">Event Organization</MenuItem>
          <MenuItem value="budget">Budget Approval</MenuItem>
          <MenuItem value="sponsorship">Sponsorship</MenuItem>
        </Select>
      </FormControl>
      <TextField fullWidth margin="normal" label="Title" name="title" value={formData.title} onChange={handleChange} required />
      <TextField fullWidth margin="normal" label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={4} required />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Submit</Button>
    </Box>
  );
};

export default ApplicationForm;