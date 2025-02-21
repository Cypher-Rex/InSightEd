import { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import Sidebar from '../../components/Sidebar';
import ComplaintForm from './ComplaintForm';

function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/"; // Redirect to login if no token
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/me', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setIsAdmin(data.role === "admin");
      } catch (err) {
        console.error(err);
        window.location.href = "/"; // Redirect to login on error
      }
    };

    const fetchComplaints = async () => {
      try {
        const response = await fetch('http://localhost:5000/complaints', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch complaints');
        }

        const data = await response.json();
        setComplaints(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchComplaints();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4">All Complaints</Typography>
          <Button variant="contained" onClick={() => setOpenForm(true)}>
            New Complaint
          </Button>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : (
          complaints.map(complaint => (
            <Card key={complaint._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{complaint.title}</Typography>
                <Typography>{complaint.description}</Typography>
                <Typography color="text.secondary">Status: {complaint.status}</Typography>
              </CardContent>
            </Card>
          ))
        )}

        <ComplaintForm open={openForm} onClose={() => setOpenForm(false)} />
      </Box>
    </Box>
  );
}

export default ComplaintsPage;