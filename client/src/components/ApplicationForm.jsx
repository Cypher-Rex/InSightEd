import { useState } from 'react';
import { Box, TextField, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const ApplicationForm = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    eventType: '',
    date: '',
    budget: '',
    description: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Application</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Event/Sick Leave"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            label="Budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload File
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {formData.file ? formData.file.name : 'No file selected'}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationForm;