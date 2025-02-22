import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, TextField, Button } from '@mui/material';

const Settings = () => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validate confirm password
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "New password and confirm password do not match" });
      return;
    }

    try {
      const res = await axios.put('http://localhost:5000/user/change-password', { password, newPassword }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMessage(res.data.message);

      // Clear the text fields
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setErrors(err.response.data);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handlePasswordChange}>
          <TextField
            label="Current Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.newPassword}
            helperText={errors.newPassword}
          />
          <TextField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
            Change Password
          </Button>
        </form>
        {message && <Typography variant="body1" color="success.main">{message}</Typography>}
      </Paper>
    </Box>
  );
};

export default Settings;