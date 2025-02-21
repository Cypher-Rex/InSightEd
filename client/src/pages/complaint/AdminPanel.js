import { useEffect, useState } from "react";
import { Box, Button, Typography, Card, CardContent } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import axios from "axios";

function AdminPanel() {
  const [complaints, setComplaints] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setIsAdmin(data.role === "admin");
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    const fetchComplaints = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/complaints", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setComplaints(data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      }
    };

    fetchUser();
    fetchComplaints();
  }, []);

  if (!isAdmin) {
    return <Typography variant="h6">Access Denied</Typography>;
  }

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/complaints/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      // Update state without a full reload
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === id ? { ...complaint, status } : complaint
        )
      );
    } catch (err) {
      console.error("Error updating complaint status:", err);
    }
  };

  const requestReveal = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/complaints/${id}/reveal`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Reveal request sent to admins.");
    } catch (err) {
      console.error("Error sending reveal request:", err);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar open={true} isAdmin={isAdmin} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Admin Panel
        </Typography>
        {complaints.map((c) => (
          <Card key={c._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{c.title}</Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Status: {c.status}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => updateStatus(c._id, "Resolved")}
                sx={{ mr: 2 }}
              >
                Mark as Resolved
              </Button>
              <Button
                variant="outlined"
                onClick={() => requestReveal(c._id)}
              >
                Request Identity Reveal
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default AdminPanel;
