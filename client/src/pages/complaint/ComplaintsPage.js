import { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import Sidebar from '../../components/Sidebar';
import ComplaintForm from './ComplaintForm';
import axios from 'axios';

function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found, redirecting to login...");
      window.location.href = "/";
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user data first
        const userResponse = await axios.get('http://localhost:5000/me', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (userResponse.status === 404) {
          console.warn("/me endpoint not found, skipping user data fetch.");
        } else {
          const userData = userResponse.data;
          console.log("User data fetched:", userData);
          setIsAdmin(userData.role === "admin");
        }

        // Proceed to fetch complaints
        const complaintsResponse = await axios.get('http://localhost:5000/complaints', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (complaintsResponse.status !== 200) {
          throw new Error('Failed to fetch complaints');
        }

        const complaintsData = complaintsResponse.data;
        console.log("Complaints fetched:", complaintsData);
        setComplaints(complaintsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
                {complaint.revealIdentity ? (
                  <Typography color="text.secondary">Created By: {complaint.createdBy.name}</Typography>
                ) : (
                  <Typography color="text.secondary">Created By: Anonymous</Typography>
                )}
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