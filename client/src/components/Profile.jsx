import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, TextField, Button, Divider, FormControl, InputLabel, Select, MenuItem, FormControlLabel, RadioGroup, Radio, FormLabel } from '@mui/material';

const Profile = ({ userRole }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    dob: '',
    gender: '',
    phone: '',
    isHosteler: false,
    hostelEmail: '',
    class: '',
    classCoordinatorName: '',
    classCoordinatorEmail: '',
    parentsEmail: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/auth/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const profileData = res.data;
        if (profileData.dob) {
          const date = new Date(profileData.dob);
          profileData.dob = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
        }
        setProfile(profileData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCollegeEmail = (email) => {
    const collegeEmailRegex = /^[^\s@]+@college\.edu$/;
    return collegeEmailRegex.test(email);
  };

  const validateDate = (date) => {
    return !isNaN(Date.parse(date));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });

    // Validate fields on change
    switch (name) {
      case 'classCoordinatorEmail':
        setErrors({ ...errors, classCoordinatorEmail: !validateCollegeEmail(value) });
        break;
      case 'parentsEmail':
        setErrors({ ...errors, parentsEmail: !validateEmail(value) });
        break;
      case 'hostelEmail':
        setErrors({ ...errors, hostelEmail: !validateEmail(value) });
        break;
      case 'phone':
        setErrors({ ...errors, phone: !validatePhone(value) });
        break;
      case 'dob':
        setErrors({ ...errors, dob: !validateDate(value) });
        break;
      default:
        break;
    }
  };

  const handleHostelChange = (e) => {
    setProfile({ ...profile, isHosteler: e.target.value === 'true' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for validation errors
    if (Object.values(errors).some((error) => error)) {
      alert('Please fix the validation errors before submitting.');
      return;
    }

    try {
      const { name, email, ...updateData } = profile;
      await axios.put('http://localhost:5000/auth/profilepage', updateData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert('Profile updated successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>Profile</Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <Typography variant="h6" gutterBottom>Personal Information</Typography>
          <TextField
            label="Name"
            name="name"
            value={profile.name}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Email"
            name="email"
            value={profile.email}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={profile.gender}
              label="Gender"
              onChange={handleChange}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Phone Number"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={errors.phone}
            helperText={errors.phone ? 'Phone number must be 10 digits' : ''}
          />
          <TextField
            label="Date of Birth"
            name="dob"
            type="text"
            value={profile.dob}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={errors.dob}
            helperText={errors.dob ? 'Invalid date' : ''}
          />

          <Divider sx={{ my: 3 }} />

          {/* Academic Information Section (Visible only to non-admin users) */}
          {userRole !== 'admin' && (
            <>
              <Typography variant="h6" gutterBottom>Academic Information</Typography>
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
                error={errors.classCoordinatorEmail}
                helperText={errors.classCoordinatorEmail ? 'Email must be in the format abc@college.edu' : ''}
              />

              <Divider sx={{ my: 3 }} />

              {/* Parent/Guardian Information Section (Visible only to non-admin users) */}
              <Typography variant="h6" gutterBottom>Parent/Guardian Information</Typography>
              <TextField
                label="Parents Email"
                name="parentsEmail"
                value={profile.parentsEmail}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={errors.parentsEmail}
                helperText={errors.parentsEmail ? 'Invalid email format' : ''}
              />
            </>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Accommodation Information Section */}
          <Typography variant="h6" gutterBottom>Accommodation Information</Typography>
          <FormControl component="fieldset" fullWidth margin="normal">
            <FormLabel component="legend">Accommodation Type</FormLabel>
            <RadioGroup
              name="isHosteler"
              value={profile.isHosteler.toString()}
              onChange={handleHostelChange}
              row
            >
              <FormControlLabel value="true" control={<Radio />} label="Hosteler" />
              <FormControlLabel value="false" control={<Radio />} label="Day Scholar" />
            </RadioGroup>
          </FormControl>
          {profile.isHosteler && (
            <TextField
              label="Hostel Email"
              name="hostelEmail"
              value={profile.hostelEmail}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={errors.hostelEmail}
              helperText={errors.hostelEmail ? 'Invalid email format' : ''}
            />
          )}

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
            Update Profile
          </Button>
        </form>
      </Paper>
      {userRole === 'admin' && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>Upload CSV</Typography>
          <input
            type="file"
            accept=".csv"
            onChange={async (e) => {
              try {
                const formData = new FormData();
                formData.append('file', e.target.files[0]);
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