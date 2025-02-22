import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/Layout";
import HomePage from './components/Home';
import ProfilePage from './components/Profile';
import ComplaintsPage from "./pages/complaint/ComplaintsPage";
import AdminPanel from "./pages/complaint/AdminPanel";
import AuthorityPage from "./pages/cheatcase/AuthorityPage";
import StudentPage from "./pages/cheatcase/StudentPage";
import AdminDashboard from "./pages/Facilities/AdminDashboard";
import StudentForm from "./pages/Facilities/StudentForm";
import AdminBudget from "./pages/Budget/AdminBudget";
import StudentBudget from "./pages/Budget/StudentBudget";
import AdminDashboardES from "./pages/Events&Spnosers/AdminDashboard";
import StudentDashboard from "./pages/Events&Spnosers/StudentDashboard";
import HealthForm from './pages/health/healthform';

const App = () => {
  const userRole = localStorage.getItem('role');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Layout userRole={userRole}><HomePage userRole={userRole} /></Layout>} />
        <Route path="/profile" element={<Layout userRole={userRole}><ProfilePage userRole={userRole} /></Layout>} />
        <Route path="/complaints" element={<Layout userRole={userRole}><ComplaintsPage /></Layout>} />
        <Route path="/admin" element={<Layout userRole={userRole}><AdminPanel /></Layout>} />
        <Route path="/authority" element={<Layout userRole={userRole}><AuthorityPage /></Layout>} />
        <Route path="/student" element={<Layout userRole={userRole}><StudentPage /></Layout>} />
        <Route path="/admin-dashboard" element={<Layout userRole={userRole}><AdminDashboard /></Layout>} />
        <Route path="/student-form" element={<Layout userRole={userRole}><StudentForm /></Layout>} />
        <Route path="/admin-budget" element={<Layout userRole={userRole}><AdminBudget /></Layout>} />
        <Route path="/student-budget" element={<Layout userRole={userRole}><StudentBudget /></Layout>} />
        <Route path="/admin-dashboard-es" element={<Layout userRole={userRole}><AdminDashboardES /></Layout>} />
        <Route path="/student-dashboard" element={<Layout userRole={userRole}><StudentDashboard /></Layout>} />
        <Route path="/health-form" element={<Layout userRole={userRole}><HealthForm /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;