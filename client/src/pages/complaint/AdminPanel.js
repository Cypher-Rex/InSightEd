import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Avatar,
  Chip,
  Paper,
  Grid,
  LinearProgress,
} from "@mui/material";
import Sidebar from "../../components/Sidebar";
import axios from "axios";

function AdminPanel() {
  const [complaints, setComplaints] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [adminCount, setAdminCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: userData } = await axios.get("http://localhost:5000/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setIsAdmin(userData.role === "admin");

        const { data: complaintsData } = await axios.get("http://localhost:5000/complaints", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setComplaints(complaintsData);

        const { data: adminData } = await axios.get("http://localhost:5000/admins/count", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAdminCount(adminData.count);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === id ? { ...complaint, status } : complaint
        )
      );
    } catch (err) {
      console.error("Error updating complaint status:", err);
    }
  };

  const handleVote = async (id, vote) => {
    try {
      const { data } = await axios.post(
        `http://localhost:5000/complaints/${id}/vote`,
        { vote },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      // Refresh complaints to reflect changes
      const { data: updatedComplaints } = await axios.get("http://localhost:5000/complaints", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setComplaints(updatedComplaints);

      alert(data.message);
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  const handleViewMore = (complaint) => {
    setSelectedComplaint(complaint);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar open={true} isAdmin={isAdmin} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Admin Panel
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            {complaints.map((c) => (
              <Grid item xs={12} sm={6} md={4} key={c._id}>
                <Paper elevation={3} sx={{ p: 2 }}>
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
                  <Button variant="outlined" onClick={() => handleViewMore(c)}>
                    View More
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pop-up Dialog for View More */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Complaint Details</DialogTitle>
          <DialogContent>
            {selectedComplaint && (
              <>
                <Typography>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedComplaint.createdAt).toLocaleString()}
                </Typography>
                <Typography>
                  <strong>Created By:</strong>{" "}
                  {selectedComplaint.revealIdentity
                    ? `${selectedComplaint.createdBy.name} (${selectedComplaint.createdBy.email})`
                    : "Anonymous"}
                </Typography>
                <Typography>
                  <strong>Description:</strong> {selectedComplaint.description}
                </Typography>
                {!selectedComplaint.revealIdentity && (
                  <>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleVote(selectedComplaint._id, "approve")}
                      sx={{ mt: 2, mr: 2 }}
                    >
                      Approve ({selectedComplaint.approveVotes?.length || 0})
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleVote(selectedComplaint._id, "reject")}
                      sx={{ mt: 2 }}
                    >
                      Reject ({selectedComplaint.rejectVotes?.length || 0})
                    </Button>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Approvals: {selectedComplaint.approveVotes?.length || 0} / {adminCount}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(selectedComplaint.approveVotes?.length / adminCount) * 100 || 0}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                  </>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default AdminPanel;