import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';

const Settings = () => {
  const [profile, setProfile] = useState({
    password: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
    setError(''); // Clear error on input change
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validation
    if (!profile.password || !profile.newPassword || !profile.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (profile.newPassword !== profile.confirmPassword) {
      setError('New password and confirmation password do not match');
      return;
    }

    if (profile.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:5000/change-password',
        {
          currentPassword: profile.password,
          newPassword: profile.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      if (response.status === 200) {
        setSuccess('Password changed successfully');
        setError('');
        setProfile({ password: '', newPassword: '', confirmPassword: '' }); // Clear form
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to change password');
      setSuccess('');
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Change Password
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handlePasswordChange}>
        <TextField
          label="Current Password"
          type="password"
          name="password"
          value={profile.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="New Password"
          type="password"
          name="newPassword"
          value={profile.newPassword}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          inputProps={{ minLength: 8 }}
        />

        <TextField
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          value={profile.confirmPassword}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          fullWidth
        >
          Change Password
        </Button>
      </form>
    </Paper>
  );
};

export default Settings;