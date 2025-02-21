import { useState, useEffect } from 'react';
import { Box, Typography, Pagination, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import ApplicationCard from '../../components/ApplicationCard';
import Sidebar from "../../components/Sidebar";
import axios from 'axios';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/events', {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setApplications(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApplications();
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:5000/events/${id}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const updatedApplications = applications.map((application) =>
        application._id === id ? response.data : application
      );
      setApplications(updatedApplications);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredApplications = applications.filter(application => {
    return (filterType === 'all' || application.type === filterType) &&
           (filterPriority === 'all' || application.priority === filterPriority) &&
           (!filterDate || new Date(application.date).toDateString() === new Date(filterDate).toDateString());
  });

  const paginatedApplications = filteredApplications.slice((page - 1) * 10, page * 10);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
        <FormControl sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel>Type</InputLabel>
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="event">Event</MenuItem>
            <MenuItem value="sponsorship">Sponsorship</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel>Priority</InputLabel>
          <Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Date"
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          sx={{ mr: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Pagination count={Math.ceil(filteredApplications.length / 10)} page={page} onChange={handlePageChange} sx={{ mt: 2 }} />
        {paginatedApplications.map((application) => (
          <ApplicationCard
            key={application._id}
            application={application}
            onStatusChange={handleStatusChange}
          />
        ))}
      </Box>
    </Box>
  );
};

export default AdminDashboard;