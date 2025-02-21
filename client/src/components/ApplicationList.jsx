import { List, ListItem, ListItemText, Typography, Paper, Chip } from '@mui/material';
import Button from '@mui/material/Button';

const ApplicationList = ({ applications, onApprove, onReject, isAdmin }) => {
  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>Applications</Typography>
      <List>
        {applications.map((app) => (
          <ListItem key={app.id}>
            <ListItemText
              primary={app.title}
              secondary={`Type: ${app.type} | Status: ${app.status} | Created: ${new Date(app.createdAt).toLocaleString()}`}
            />
            {isAdmin && (
              <div>
                <Chip label={`Priority: ${app.priority}`} color="info" sx={{ mr: 1 }} />
                <Button variant="contained" color="success" onClick={() => onApprove(app.id)}>Approve</Button>
                <Button variant="contained" color="error" onClick={() => onReject(app.id)} sx={{ ml: 1 }}>Reject</Button>
              </div>
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ApplicationList;