import { useEffect, useState } from "react";
import { Box, Button, Typography, Card, CardContent, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import axios from "axios";

function AdminPanel() {
  const [complaints, setComplaints] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [revealRequests, setRevealRequests] = useState({});

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
      setRevealRequests((prevRequests) => ({ ...prevRequests, [id]: true }));
      alert("Reveal request sent to admins.");
    } catch (err) {
      console.error("Error sending reveal request:", err);
    }
  };

  const voteForReveal = async (id, vote) => {
    try {
      await axios.post(
        `http://localhost:5000/complaints/${id}/vote`,
        { vote },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Vote recorded.");
    } catch (err) {
      console.error("Error voting for reveal:", err);
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

              {/* Dropdown for status */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id={`status-label-${c._id}`}>Status</InputLabel>
                <Select
                  labelId={`status-label-${c._id}`}
                  value={c.status}
                  label="Status"
                  onChange={(e) => updateStatus(c._id, e.target.value)}
                >
                  <MenuItem value="Filed">Filed</MenuItem>
                  <MenuItem value="Under Investigation">Under Investigation</MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                </Select>
              </FormControl>

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
                sx={{ mr: 2 }}
              >
                Request Identity Reveal
              </Button>
              {revealRequests[c._id] && (
                <>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => voteForReveal(c._id, "approve")}
                    sx={{ mr: 2 }}
                  >
                    Approve Reveal
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => voteForReveal(c._id, "reject")}
                  >
                    Reject Reveal
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default AdminPanel;