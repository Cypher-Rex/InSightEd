import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import ComplaintsPage from "./pages/complaint/ComplaintsPage";
import AdminPanel from "./pages/complaint/AdminPanel";
import AuthorityPage from "./pages/cheatcase/AuthorityPage";
import StudentPage from "./pages/cheatcase/StudentPage";
import AdminDashboard from "./pages/Facilities/AdminDashboard";
import StudentForm from "./pages/Facilities/StudentForm";
import AdminBudget from "./pages/Budget/AdminBudget";
import StudentBudget from "./pages/Budget/StudentBudget";
import AdminDashboardES from  "./pages/Events&Spnosers/AdminDashboard";
import StudentDashboard from "./pages/Events&Spnosers/StudentDashboard";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/authority" element={<AuthorityPage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/student-form" element={<StudentForm />} />
        <Route path="/admin-budget" element={<AdminBudget />} />
        <Route path="/student-budget" element={<StudentBudget />} />
        <Route path="/admin-dashboard-es" element={<AdminDashboardES />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;