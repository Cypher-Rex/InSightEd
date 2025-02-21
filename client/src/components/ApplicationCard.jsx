import { Card, CardContent, Typography, LinearProgress, Chip, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Box } from '@mui/material';

const ApplicationCard = ({ application, onApprove, onReject, onPriorityChange, isAdmin }) => {
  const statusColor = {
    Pending: 'warning',
    Approved: 'success',
    Rejected: 'error',
  };

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{application.title}</Typography>
        <Typography variant="body1" gutterBottom>{application.description}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>Type: {application.type}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Status: <Chip label={application.status} color={statusColor[application.status]} size="small" />
        </Typography>
        {isAdmin && (
          <>
            <Typography variant="body2" color="textSecondary" gutterBottom>Priority: {application.priority}</Typography>
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={application.priority}
                onChange={(e) => onPriorityChange(application.id, e.target.value)}
                label="Priority"
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
        <LinearProgress variant="determinate" value={application.status === 'Approved' ? 100 : 50} sx={{ mt: 2 }} />
        {isAdmin && application.status === 'Pending' && (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="success" onClick={() => onApprove(application.id)} sx={{ mr: 1 }}>Approve</Button>
            <Button variant="contained" color="error" onClick={() => onReject(application.id)}>Reject</Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;