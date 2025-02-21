// src/components/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../CSS/facilities.css'; // Corrected path

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filterActivity, setFilterActivity] = useState("");
  const [filterTime, setFilterTime] = useState("");
  const navigate = useNavigate();

  // Load requests from local storage when the component mounts
  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem("requests")) || [];
    setRequests(storedRequests);
  }, []);

  // Handle approve action
  const handleApprove = (id) => {
    const updatedRequests = requests.map((request) =>
      request.id === id ? { ...request, status: "Approved" } : request
    );
    setRequests(updatedRequests);
    localStorage.setItem("requests", JSON.stringify(updatedRequests));
  };

  // Handle reject action
  const handleReject = (id) => {
    const updatedRequests = requests.map((request) =>
      request.id === id ? { ...request, status: "Rejected" } : request
    );
    setRequests(updatedRequests);
    localStorage.setItem("requests", JSON.stringify(updatedRequests));
  };

  // Filter requests based on activity and time
  const filteredRequests = requests.filter((request) => {
    const matchesActivity = filterActivity
      ? request.activity === filterActivity
      : true;
    const matchesTime = filterTime ? request.time === filterTime : true;
    return matchesActivity && matchesTime;
  });

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <button className="admin-button" onClick={() => navigate("/")}>
        Go to Student Page
      </button>

      {/* Filters */}
      <div className="filters">
        <label>
          Filter by Activity:
          <select
            value={filterActivity}
            onChange={(e) => setFilterActivity(e.target.value)}
          >
            <option value="">All Activities</option>
            <option value="Pool">Pool</option>
            <option value="Badminton Court">Badminton Court</option>
            <option value="Football Ground">Football Ground</option>
            <option value="Auditorium">Auditorium</option>
          </select>
        </label>

        <label>
          Filter by Time:
          <input
            type="time"
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
          />
        </label>
      </div>

      {/* Requests Table */}
      <table>
        <thead>
          <tr>
            <th>Activity</th>
            <th>Number of Students</th>
            <th>Time</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.activity}</td>
              <td>{request.numStudents}</td>
              <td>{request.time}</td>
              <td>{request.date}</td>
              <td className={`status-${request.status.toLowerCase()}`}>
                {request.status}
              </td>
              <td>
                {request.status === "Pending" && (
                  <>
                    <button onClick={() => handleApprove(request.id)}>
                      Approve
                    </button>
                    <button onClick={() => handleReject(request.id)}>
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
