import { Button, TextField, MenuItem, Select, InputLabel, FormControl, Box } from '@mui/material';
import { useState } from 'react';

const AdminControls = ({ applications, onApprove, onReject, onFilter }) => {
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const handleFilter = () => {
    onFilter(filterCategory, filterDate);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Filter by Category</InputLabel>
        <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <MenuItem value="event">Event Organization</MenuItem>
          <MenuItem value="budget">Budget Approval</MenuItem>
          <MenuItem value="sponsorship">Sponsorship</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        margin="normal"
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleFilter}>Apply Filter</Button>
      {applications.map((app) => (
        app.status === 'Pending' && (
          <div key={app.id} style={{ marginTop: '10px' }}>
            <Button variant="contained" color="success" onClick={() => onApprove(app.id)}>Approve</Button>
            <Button variant="contained" color="error" onClick={() => onReject(app.id)}>Reject</Button>
          </div>
        )
      ))}
    </Box>
  );
};

export default AdminControls;