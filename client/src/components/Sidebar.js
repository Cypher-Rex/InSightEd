import { styled } from '@mui/material/styles';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider 
} from '@mui/material';
import {
  Home,
  Person,
  Report,
  Dashboard,
  Settings,
  ContactMail,
  Feedback,
  Help,
  ExitToApp,
  AdminPanelSettings,
  Event,
  MedicalServices,
  School
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// Styled Components
const SidebarContainer = styled('div')(({ theme }) => ({
  width: '250px',
  height: '100vh',
  backgroundColor: '#1E1E2F',
  color: '#fff',
  paddingTop: '20px',
  transition: 'transform 0.3s ease-in-out',
  boxShadow: '4px 0 10px rgba(0, 0, 0, 0.3)',
  position: 'fixed',
  left: 0,
  top: 0,
  overflowY: 'auto',
  '&:hover': {
    transform: 'scale(1.02)',
  }
}));

const SidebarItem = styled(ListItem)(({ theme }) => ({
  transition: '0.3s ease',
  '&:hover': {
    backgroundColor: '#303050',
    transform: 'translateX(5px)',
  },
  '&.Mui-selected': {
    backgroundColor: '#404070',
    borderLeft: `4px solid ${theme.palette.primary.main}`
  }
}));

const SidebarIcon = styled(ListItemIcon)(({ theme }) => ({
  color: '#ffcc00',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.2)',
  }
}));

// Route Configuration
const roleRoutes = {
  admin: [
    { path: '/admin/complaints', label: 'Complaints', icon: <Report /> },
    { path: '/admin/facilities', label: 'Facilities', icon: <Dashboard /> },
    { path: '/admin/budget', label: 'Budget', icon: <Settings /> },
  ],
  student: [
    { path: '/student/complaints', label: 'File Complaint', icon: <Report /> },
    { path: '/student/health', label: 'Health Services', icon: <MedicalServices /> },
    { path: '/student/courses', label: 'Courses', icon: <School /> },
  ],
  authority: [
    { path: '/authority/exam', label: 'Exam Monitoring', icon: <AdminPanelSettings /> },
    { path: '/authority/events', label: 'Event Management', icon: <Event /> },
    { path: '/authority/feedback', label: 'Feedback', icon: <Feedback /> },
  ]
};

const commonRoutes = [
  { path: '/home', label: 'Home', icon: <Home /> },
  { path: '/profile', label: 'Profile', icon: <Person /> },
  { path: '/settings', label: 'Settings', icon: <Settings /> },
  { path: '/help', label: 'Help', icon: <Help /> },
];

const Sidebar = ({ userRole = 'student' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/");
  };

  return (
    <SidebarContainer>
      <List>
        {/* Common Routes */}
        {commonRoutes.map((route) => (
          <SidebarItem 
            key={route.path}
            button 
            onClick={() => handleNavigation(route.path)}
            selected={location.pathname === route.path}
          >
            <SidebarIcon>{route.icon}</SidebarIcon>
            <ListItemText primary={route.label} />
          </SidebarItem>
        ))}

        <Divider sx={{ backgroundColor: '#404060', my: 2 }} />

        {/* Role-Specific Routes */}
        {roleRoutes[userRole]?.map((route) => (
          <SidebarItem 
            key={route.path}
            button 
            onClick={() => handleNavigation(route.path)}
            selected={location.pathname.startsWith(route.path)}
          >
            <SidebarIcon>{route.icon}</SidebarIcon>
            <ListItemText primary={route.label} />
          </SidebarItem>
        ))}

        <Divider sx={{ backgroundColor: '#404060', my: 2 }} />

        {/* Logout */}
        <SidebarItem button onClick={handleLogout}>
          <SidebarIcon><ExitToApp /></SidebarIcon>
          <ListItemText primary="Logout" />
        </SidebarItem>
      </List>
    </SidebarContainer>
  );
};

export default Sidebar;