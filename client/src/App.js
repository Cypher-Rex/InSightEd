import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from "./components/Login";
import Layout from "./components/Layout";
import Home from './components/Home';
import Profile from './components/Profile';
import ComplaintsPage from "./pages/complaint/ComplaintsPage";
import AdminPanel from "./pages/complaint/AdminPanel";
import Authority from "./pages/cheat/Authority";
import Student from "./pages/cheat/Student";
import Invigilator from './pages/cheat/Invigilator';
import AdminDashboard from "./pages/Facilities/AdminDashboard";
import StudentForm from "./pages/Facilities/StudentForm";
import AdminBudget from "./pages/Budget/AdminBudget";
import StudentBudget from "./pages/Budget/StudentBudget";
import AdminDashboardES from "./pages/Events&Spnosers/AdminDashboard";
import StudentDashboard from "./pages/Events&Spnosers/StudentDashboard";
import HealthForm from './pages/health/healthform';
import Settings from './components/settings';

const App = () => {
  const userRole = localStorage.getItem('role');

  return (
    <Router>
      <div style={{ display: 'flex' }}>
       
        <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Layout userRole={userRole}><Home userRole={userRole} /></Layout>} />
            <Route path="/profile" element={<Layout userRole={userRole}><Profile userRole={userRole} /></Layout>} />
            <Route path="/complaints" element={<Layout userRole={userRole}><ComplaintsPage /></Layout>} />
            <Route path="/admin" element={<Layout userRole={userRole}><AdminPanel /></Layout>} />
            <Route path="/authority" element={<Layout userRole={userRole}><Authority /></Layout>} />
            <Route path="/student" element={<Layout userRole={userRole}><Student /></Layout>} />
            <Route path="/invigilator" element={<Layout userRole={userRole}><Invigilator /></Layout>} />
            <Route path="/admin-dashboard" element={<Layout userRole={userRole}><AdminDashboard /></Layout>} />
            <Route path="/student-form" element={<Layout userRole={userRole}><StudentForm /></Layout>} />
            <Route path="/admin-budget" element={<Layout userRole={userRole}><AdminBudget /></Layout>} />
            <Route path="/student-budget" element={<Layout userRole={userRole}><StudentBudget /></Layout>} />
            <Route path="/admin-dashboard-es" element={<Layout userRole={userRole}><AdminDashboardES /></Layout>} />
            <Route path="/student-dashboard" element={<Layout userRole={userRole}><StudentDashboard /></Layout>} />
            <Route path="/health-form" element={<Layout userRole={userRole}><HealthForm /></Layout>} />
            <Route path="/settings" element={<Layout userRole={userRole}><Settings /></Layout>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;