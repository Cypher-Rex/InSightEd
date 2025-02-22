import { useState, useEffect } from 'react';
import { Box, Typography, Pagination, Button } from '@mui/material';
import ApplicationForm from '../../components/ApplicationForm';
import ApplicationCard from '../../components/ApplicationCard';
import Sidebar from "../../components/Sidebar";
import axios from 'axios';

const StudentDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(1);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/events', {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        // If your API response is an array, this is fine.
        // Otherwise, if it's an object like { events: [...] }, then:
        // setApplications(response.data.events);
        setApplications(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApplications();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/events', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setApplications([...applications, response.data]);
      setOpenForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Safe check to ensure applications is always an array
  const safeApplications = Array.isArray(applications) ? applications : [];
  const paginatedApplications = safeApplications.slice((page - 1) * 10, page * 10);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>Student Dashboard</Typography>
        <Button variant="contained" onClick={() => setOpenForm(true)}>New Application</Button>
        <ApplicationForm open={openForm} onClose={() => setOpenForm(false)} onSubmit={handleSubmit} />
        <Pagination count={Math.ceil(safeApplications.length / 10)} page={page} onChange={handlePageChange} sx={{ mt: 2 }} />
        {paginatedApplications.map((application) => (
          <ApplicationCard key={application._id} application={application} />
        ))}
      </Box>
    </Box>
  );
};

export default StudentDashboard;
