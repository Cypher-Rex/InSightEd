import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import Sidebar from "../../components/Sidebar";
import axios from 'axios';

const AdminDash = () => {
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/applications', {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

  const handleStatusChange = async (id, status, feedback) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/applications/${id}`,
        { status, feedback },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const updatedApplications = applications.map((application) =>
        application._id === id ? response.data : application
      );
      setApplications(updatedApplications);
      setOpenDialog(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenDialog = (application) => {
    setSelectedApplication(application);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFeedback('');
    setStatus('');
  };

  const filteredApplications = (Array.isArray(applications) ? applications : []).filter(application => {
    return (filterType === 'all' || application.type === filterType) &&
           (filterStatus === 'all' || application.status === filterStatus) &&
           (!filterDate || new Date(application.date).toDateString() === new Date(filterDate).toDateString());
  });

  const paginatedApplications = filteredApplications.slice((page - 1) * 10, page * 10);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Sick Leave">Sick Leave</MenuItem>
              <MenuItem value="Event Organization">Event Organization</MenuItem>
              <MenuItem value="Budget Approvals">Budget Approvals</MenuItem>
              <MenuItem value="Sponsorships">Sponsorships</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Date"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Pagination count={Math.ceil(filteredApplications.length / 10)} page={page} onChange={handlePageChange} sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {paginatedApplications.map((application) => (
            <Card key={application._id} sx={{ width: 300, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{application.name}</Typography>
                <Typography color="text.secondary">{application.type}</Typography>
                <Chip
                  label={application.status}
                  color={
                    application.status === 'Approved' ? 'success' :
                    application.status === 'Rejected' ? 'error' : 'default'
                  }
                  sx={{ mt: 1 }}
                />
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => handleOpenDialog(application)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Pop-up Dialog for Application Details */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>Application Details</DialogTitle>
          <DialogContent>
            {selectedApplication && (
              <>
                <Typography><strong>Name:</strong> {selectedApplication.name}</Typography>
                <Typography><strong>Email:</strong> {selectedApplication.email}</Typography>
                <Typography><strong>Phone No:</strong> {selectedApplication.phoneNo}</Typography>
                <Typography><strong>Type:</strong> {selectedApplication.type}</Typography>
                {selectedApplication.type !== 'Sick Leave' && (
                  <>
                    <Typography><strong>Date:</strong> {new Date(selectedApplication.date).toLocaleDateString()}</Typography>
                    <Typography><strong>Budget:</strong> {selectedApplication.budget}</Typography>
                    <Typography><strong>Description:</strong> {selectedApplication.description}</Typography>
                    <Typography><strong>File:</strong></Typography>
                    {selectedApplication.file && (
                      <img
                        src={`data:image/png;base64,${selectedApplication.file}`}
                        alt="Budget Proof"
                        style={{ width: '100%', height: 'auto' }}
                      />
                    )}
                  </>
                )}
                {selectedApplication.type === 'Sick Leave' && (
                  <>
                    <Typography><strong>Sick Leave Days:</strong> {selectedApplication.sickLeaveDays}</Typography>
                    <Typography><strong>Reason:</strong> {selectedApplication.reason}</Typography>
                    <Typography><strong>Reason Proof:</strong></Typography>
                    {selectedApplication.reasonProof && (
                      <img
                        src={`data:image/png;base64,${selectedApplication.reasonProof}`}
                        alt="Reason Proof"
                        style={{ width: '100%', height: 'auto' }}
                      />
                    )}
                  </>
                )}
                <TextField
                  fullWidth
                  label="Feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  sx={{ mt: 2 }}
                />
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value="Approved">Approve</MenuItem>
                    <MenuItem value="Rejected">Reject</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={() => handleStatusChange(selectedApplication._id, status, feedback)}
              disabled={!status || !feedback}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminDash;