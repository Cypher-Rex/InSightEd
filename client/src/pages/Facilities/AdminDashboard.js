// src/components/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../CSS/facilities.css"; // Corrected path

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
    <div className="admin-dashboard" style={styles.dashboard}>
      <h2 style={styles.header}>Admin Dashboard</h2>

      {/* Filters */}
      <div className="filters" style={styles.filters}>
        <label style={styles.label}>
          Filter by Activity:
          <select
            value={filterActivity}
            onChange={(e) => setFilterActivity(e.target.value)}
            style={styles.select}
          >
            <option value="">All Activities</option>
            <option value="Pool">Pool</option>
            <option value="Badminton Court">Badminton Court</option>
            <option value="Football Ground">Football Ground</option>
            <option value="Auditorium">Auditorium</option>
          </select>
        </label>

        <label style={styles.label}>
          Filter by Time:
          <input
            type="time"
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
            style={styles.input}
          />
        </label>
      </div>

      {/* Requests Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Activity</th>
            <th style={styles.th}>Number of Students</th>
            <th style={styles.th}>Time</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request) => (
            <tr key={request.id} style={styles.tr}>
              <td style={styles.td}>{request.activity}</td>
              <td style={styles.td}>{request.numStudents}</td>
              <td style={styles.td}>{request.time}</td>
              <td style={styles.td}>{request.date}</td>
              <td
                style={{ ...styles.td, ...styles[`status${request.status}`] }}
              >
                {request.status}
              </td>
              <td style={styles.td}>
                {request.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(request.id)}
                      style={styles.buttonApprove}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      style={styles.buttonReject}
                    >
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

const styles = {
  dashboard: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  filters: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  select: {
    padding: "5px",
    marginTop: "5px",
  },
  input: {
    padding: "5px",
    marginTop: "5px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    backgroundColor: "#f2f2f2",
  },
  tr: {
    borderBottom: "1px solid #ddd",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "center",
  },
  statusApproved: {
    color: "green",
  },
  statusRejected: {
    color: "red",
  },
  statusPending: {
    color: "orange",
  },
  buttonApprove: {
    backgroundColor: "green",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    marginRight: "5px",
  },
  buttonReject: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default AdminDashboard;
