import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import axios from 'axios';

const Profile = ({ userRole }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    dob: '',
    class: '',
    classCoordinatorName: '',
    classCoordinatorEmail: '',
    parentsEmail: '',
    password: '',
    newPassword: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setProfile(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/profile', profile, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert('Profile updated successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/change-password', {
        password: profile.password,
        newPassword: profile.newPassword,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert('Password changed successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to change password');
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>Profile</Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={profile.name}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Email"
            name="email"
            value={profile.email}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Date of Birth"
            type="date"
            name="dob"
            value={profile.dob}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Class"
            name="class"
            value={profile.class}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Class Coordinator Name"
            name="classCoordinatorName"
            value={profile.classCoordinatorName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Class Coordinator Email"
            name="classCoordinatorEmail"
            value={profile.classCoordinatorEmail}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Parents Email"
            name="parentsEmail"
            value={profile.parentsEmail}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Update Profile</Button>
        </form>
      </Paper>
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>Change Password</Typography>
        <form onSubmit={handlePasswordChange}>
          <TextField
            label="Current Password"
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="New Password"
            type="password"
            name="newPassword"
            value={profile.newPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Change Password</Button>
        </form>
      </Paper>
      {userRole === 'admin' && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>Upload CSV</Typography>
          <input
            type="file"
            accept=".csv"
            onChange={async (e) => {
              const file = e.target.files[0];
              const formData = new FormData();
              formData.append('file', file);
              try {
                await axios.post('http://localhost:5000/upload-csv', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                  }
                });
                alert('CSV uploaded successfully');
              } catch (err) {
                console.error(err);
                alert('Failed to upload CSV');
              }
            }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default Profile;