import React from 'react';
import { Box, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

function AuthoritySidebar({ open }) {
  return (
    <Box sx={{ width: open ? 240 : 0, transition: 'width 0.3s' }}>
      <List>
        <ListItem button component={Link} to="/admin-dashboard">
          <ListItemText primary="Admin Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/manage-complaints">
          <ListItemText primary="Manage Complaints" />
        </ListItem>
        <ListItem button component={Link} to="/manage-events">
          <ListItemText primary="Manage Events" />
        </ListItem>
        <ListItem button component={Link} to="/manage-users">
          <ListItemText primary="Manage Users" />
        </ListItem>
      </List>
    </Box>
  );
}

export default AuthoritySidebar;