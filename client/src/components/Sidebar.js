import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Home, Person, Report, Dashboard, Settings, Info, ContactMail, Feedback, Help, ExitToApp, AdminPanelSettings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/"); // Redirect to login after logout
  };

  return (
    <div className="sidebar">
      <List>
        <ListItem button onClick={() => navigate("/profile")}>
          <ListItemIcon><Person /></ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button onClick={() => navigate("/home")}>
          <ListItemIcon><Home /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        {userRole === "admin" && (
          <div>
            <ListItem button onClick={() => navigate("/complaints")}>
              <ListItemIcon><Report /></ListItemIcon>
              <ListItemText primary="Complaints" />
            </ListItem>
            <ListItem button onClick={() => navigate("/student-form")}>
              <ListItemIcon><Report /></ListItemIcon>
              <ListItemText primary="Facilities" />
            </ListItem>
            <ListItem button onClick={() => navigate("/student")}>
              <ListItemIcon><Dashboard /></ListItemIcon>
              <ListItemText primary="Exam Violations" />
            </ListItem>
            <ListItem button onClick={() => navigate("/student-budget")}>
              <ListItemIcon><Settings /></ListItemIcon>
              <ListItemText primary="Budget" />
            </ListItem>
            <ListItem button onClick={() => navigate("/student-dashboard")}>
              <ListItemIcon><Info /></ListItemIcon>
              <ListItemText primary="Events & Sponsors" />
            </ListItem>
            <ListItem button onClick={() => navigate("/contact")}>
              <ListItemIcon><ContactMail /></ListItemIcon>
              <ListItemText primary="Contact" />
            </ListItem>
            <ListItem button onClick={() => navigate("/feedback")}>
              <ListItemIcon><Feedback /></ListItemIcon>
              <ListItemText primary="Feedback" />
            </ListItem>
            <ListItem button onClick={() => navigate("/help")}>
              <ListItemIcon><Help /></ListItemIcon>
              <ListItemText primary="Help" />
            </ListItem>
          </div>
        )}
        {userRole !== "admin" && (
          <div>
            <ListItem button onClick={() => navigate("/admin")}>
              <ListItemIcon><AdminPanelSettings /></ListItemIcon>
              <ListItemText primary="Complaint Authority" />
            </ListItem>
            <ListItem button onClick={() => navigate("/admin-dashboard")}>
              <ListItemIcon><AdminPanelSettings /></ListItemIcon>
              <ListItemText primary="Facility Authority" />
            </ListItem>
            <ListItem button onClick={() => navigate("/authority")}>
              <ListItemIcon><Report /></ListItemIcon>
              <ListItemText primary="Exam Authority" />
            </ListItem>
            <ListItem button onClick={() => navigate("/admin-budget")}>
              <ListItemIcon><Settings /></ListItemIcon>
              <ListItemText primary="Budget" />
            </ListItem>
            <ListItem button onClick={() => navigate("/admin-dashboard-es")}>
              <ListItemIcon><ContactMail /></ListItemIcon>
              <ListItemText primary="Events & Sponsors" />
            </ListItem>
            <ListItem button onClick={() => navigate("/admin-feedback")}>
              <ListItemIcon><Feedback /></ListItemIcon>
              <ListItemText primary="Feedback" />
            </ListItem>
            <ListItem button onClick={() => navigate("/admin-help")}>
              <ListItemIcon><Help /></ListItemIcon>
              <ListItemText primary="Help" />
            </ListItem>
          </div>
        )}
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><ExitToApp /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
