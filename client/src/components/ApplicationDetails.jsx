import { Typography, Paper, LinearProgress, Chip } from '@mui/material';

const ApplicationDetails = ({ application }) => {
  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6">{application.title}</Typography>
      <Typography variant="body1">{application.description}</Typography>
      <Typography variant="body2" color="textSecondary">Type: {application.type}</Typography>
      <Typography variant="body2" color="textSecondary">Status: {application.status}</Typography>
      <Typography variant="body2" color="textSecondary">Priority: {application.priority}</Typography>
      <LinearProgress variant="determinate" value={application.status === 'Approved' ? 100 : 50} />
      {application.status === 'Pending' && (
        <Chip label="Pending Approval" color="warning" sx={{ mt: 1 }} />
      )}
    </Paper>
  );
};

export default ApplicationDetails;