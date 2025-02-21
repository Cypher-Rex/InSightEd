import { styled } from '@mui/material/styles';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Home, Person, Report, Dashboard, Settings, Info,
  ContactMail, Feedback, Help, ExitToApp, AdminPanelSettings
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Styled Sidebar Container with Animation
const SidebarContainer = styled('div')(({ theme }) => ({
  width: '250px',
  height: '100vh',
  backgroundColor: '#1E1E2F', // Dark blue-gray shade
  color: '#fff',
  paddingTop: '20px',
  transition: 'transform 0.3s ease-in-out',
  boxShadow: '4px 0 10px rgba(0, 0, 0, 0.3)',
  position: 'fixed',
  left: 0,
  top: 0,
  overflowY: 'auto',
  '&:hover': {
    transform: 'scale(1.02)', // Slightly enlarges on hover
  }
}));

// Styled List Item with Hover Effects
const SidebarItem = styled(ListItem)(({ theme }) => ({
  transition: '0.3s ease',
  '&:hover': {
    backgroundColor: '#303050', // Darker shade on hover
    transform: 'translateX(5px)',
  }
}));

// Styled Icon with Animation
const SidebarIcon = styled(ListItemIcon)(({ theme }) => ({
  color: '#ffcc00', // Highlight color
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.2)', // Slight zoom effect
  }
}));

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('');

  const handleNavigation = (path) => {
    setActivePage(path);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/"); // Redirect to login after logout
  };

  return (
    <SidebarContainer>
      <List>
        <SidebarItem button onClick={() => handleNavigation("/profile")} selected={activePage === "/profile"}>
          <SidebarIcon><Person /></SidebarIcon>
          <ListItemText primary="Profile" />
        </SidebarItem>

        <SidebarItem button onClick={() => handleNavigation("/home")} selected={activePage === "/home"}>
          <SidebarIcon><Home /></SidebarIcon>
          <ListItemText primary="Home" />
        </SidebarItem>

        {userRole !== "admin" && (
          <>
            <SidebarItem button onClick={() => handleNavigation("/complaints")}>
              <SidebarIcon><Report /></SidebarIcon>
              <ListItemText primary="Complaints" />
            </SidebarItem>

            <SidebarItem button onClick={() => handleNavigation("/student-form")}>
              <SidebarIcon><Report /></SidebarIcon>
              <ListItemText primary="Facilities" />
            </SidebarItem>

            <SidebarItem button onClick={() => handleNavigation("/student")}>
              <SidebarIcon><Dashboard /></SidebarIcon>
              <ListItemText primary="Exam Violations" />
            </SidebarItem>

            <SidebarItem button onClick={() => handleNavigation("/student-budget")}>
              <SidebarIcon><Settings /></SidebarIcon>
              <ListItemText primary="Budget" />
            </SidebarItem>

            <SidebarItem button onClick={() => handleNavigation("/student-dashboard")}>
              <SidebarIcon><Info /></SidebarIcon>
              <ListItemText primary="Events & Sponsors" />
            </SidebarItem>

            <SidebarItem button onClick={() => handleNavigation("/contact")}>
              <SidebarIcon><ContactMail /></SidebarIcon>
              <ListItemText primary="Contact" />
            </SidebarItem>

            <SidebarItem button onClick={() => handleNavigation("/feedback")}>
              <SidebarIcon><Feedback /></SidebarIcon>
              <ListItemText primary="Feedback" />
            </SidebarItem>

            <SidebarItem button onClick={() => handleNavigation("/help")}>
              <SidebarIcon><Help /></SidebarIcon>
              <ListItemText primary="Help" />
            </SidebarItem>
          </>
        )}

        {userRole === "admin" && (
          <>
            <SidebarItem button onClick={() => handleNavigation("/admin")}>
              <SidebarIcon><AdminPanelSettings /></SidebarIcon>
              <ListItemText primary="Complaint Authority" />
            </SidebarItem>

            <SidebarItem button onClick={() => handleNavigation("/admin-dashboard")}>
              <SidebarIcon><AdminPanelSettings /></SidebarIcon>
              <ListItemText primary="Facility Authority" />
            </SidebarItem>

            <SidebarItem button onClick={() => handleNavigation("/authority")}>
              <SidebarIcon><Report /></SidebarIcon>
              <ListItemText primary="Exam Authority" />
            </SidebarItem>

            <SidebarItem button onClick={() => handleNavigation("/admin-budget")}>
              <SidebarIcon><Settings /></SidebarIcon>
              <ListItemText primary="Budget" />
            </SidebarItem>

            <SidebarItem button onClick={() => handleNavigation("/admin-dashboard-es")}>
              <SidebarIcon><ContactMail /></SidebarIcon>
              <ListItemText primary="Events & Sponsors" />
            </SidebarItem>

            <SidebarItem button onClick={() => handleNavigation("/admin-feedback")}>
              <SidebarIcon><Feedback /></SidebarIcon>
              <ListItemText primary="Feedback" />
            </SidebarItem>

            <SidebarItem button onClick={() => handleNavigation("/admin-help")}>
              <SidebarIcon><Help /></SidebarIcon>
              <ListItemText primary="Help" />
            </SidebarItem>
          </>
        )}

        <SidebarItem button onClick={handleLogout}>
          <SidebarIcon><ExitToApp /></SidebarIcon>
          <ListItemText primary="Logout" />
        </SidebarItem>
      </List>
    </SidebarContainer>
  );
};

export default Sidebar;
