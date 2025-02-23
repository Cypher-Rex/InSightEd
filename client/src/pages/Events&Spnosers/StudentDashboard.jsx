import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Sidebar from "../../components/Sidebar";
import axios from 'axios';

const StudentDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    type: '',
    date: '',
    budget: '',
    description: '',
    file: null,
    sickLeaveDays: '',
    reason: '',
    reasonProof: null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

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

  // Function to convert a file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Remove the data URL prefix
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert files to base64
      const fileBase64 = formData.file ? await fileToBase64(formData.file) : null;
      const reasonProofBase64 = formData.reasonProof ? await fileToBase64(formData.reasonProof) : null;

      // Ensure correct data types
      const data = {
        ...formData,
        budget: Number(formData.budget), // Convert to number
        sickLeaveDays: Number(formData.sickLeaveDays), // Convert to number
        date: new Date(formData.date).toISOString(), // Convert to ISO string
        file: fileBase64,
        reasonProof: reasonProofBase64,
      };

      console.log("Payload being sent:", data); // Debugging: Log the payload

      const response = await axios.post('http://localhost:5000/applications', data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setApplications([...applications, response.data]);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phoneNo: '',
        type: '',
        date: '',
        budget: '',
        description: '',
        file: null,
        sickLeaveDays: '',
        reason: '',
        reasonProof: null,
      });
    } catch (err) {
      console.error("Error submitting application:", err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleReasonProofChange = (e) => {
    setFormData({ ...formData, reasonProof: e.target.files[0] });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleOpenDialog = (application) => {
    setSelectedApplication(application);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const safeApplications = Array.isArray(applications) ? applications : [];
  const paginatedApplications = safeApplications.slice((page - 1) * 10, page * 10);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>Student Dashboard</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <MenuItem value="Sick Leave">Sick Leave</MenuItem>
              <MenuItem value="Event Organization">Event Organization</MenuItem>
              <MenuItem value="Budget Approvals">Budget Approvals</MenuItem>
              <MenuItem value="Sponsorships">Sponsorships</MenuItem>
            </Select>
          </FormControl>
          {formData.type !== 'Sick Leave' && (
            <>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                label="Budget"
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                sx={{ mb: 2 }}
                required
              />
              <label htmlFor="proof">Budget Proof</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*, application/pdf"
                required
              />
            </>
          )}
          {formData.type === 'Sick Leave' && (
            <>
              <TextField
                fullWidth
                label="Number of Days"
                name="sickLeaveDays"
                type="number"
                value={formData.sickLeaveDays}
                onChange={handleChange}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                sx={{ mb: 2 }}
                required
              />
              <label htmlFor="reasonProof">Reason Proof</label>
              <input
                id="reasonProof"
                type="file"
                onChange={handleReasonProofChange}
                accept="image/*, application/pdf"
                required
              />
            </>
          )}
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
        {success && <Typography color="success.main">Application submitted successfully!</Typography>}
        <Pagination count={Math.ceil(safeApplications.length / 10)} page={page} onChange={handlePageChange} sx={{ mt: 2 }} />
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
                {selectedApplication.feedback && (
                  <Typography><strong>Feedback:</strong> {selectedApplication.feedback}</Typography>
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
};

export default StudentDashboard;