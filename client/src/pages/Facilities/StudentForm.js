// src/components/StudentForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentForm = () => {
  const [activity, setActivity] = useState("");
  const [numStudents, setNumStudents] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/facility-requests",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRequests(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const request = {
      activity,
      numStudents,
      time,
      date,
      status: "Pending",
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/facility-requests",
        request,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setRequests([...requests, response.data]);
      alert("Request submitted successfully!");
      setActivity("");
      setNumStudents("");
      setTime("");
      setDate("");
    } catch (err) {
      console.error(err);
      alert("Failed to submit request");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "Approved":
        return "status-approved";
      case "Rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Submit Activity Request</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Activity:
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            required
            style={styles.select}
          >
            <option value="">Select Activity</option>
            <option value="Pool">Pool</option>
            <option value="Badminton Court">Badminton Court</option>
            <option value="Football Ground">Football Ground</option>
            <option value="Auditorium">Auditorium</option>
          </select>
        </label>
        <label style={styles.label}>
          Number of Students:
          <input
            type="number"
            value={numStudents}
            onChange={(e) => setNumStudents(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Time:
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>

      <h3 style={styles.subHeader}>Your Requests</h3>
      {requests.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Activity</th>
              <th style={styles.th}>Number of Students</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} style={styles.tr}>
                <td style={styles.td}>{request.activity}</td>
                <td style={styles.td}>{request.numStudents}</td>
                <td style={styles.td}>{request.time}</td>
                <td style={styles.td}>{request.date}</td>
                <td
                  className={getStatusClass(request.status)}
                  style={styles.td}
                >
                  {request.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={styles.noRequests}>No requests submitted yet.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  label: {
    marginBottom: "10px",
    width: "100%",
    maxWidth: "400px",
  },
  select: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  },
  subHeader: {
    textAlign: "center",
    marginBottom: "20px",
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
  noRequests: {
    textAlign: "center",
    marginTop: "20px",
  },
  statusPending: {
    color: "orange",
  },
  statusApproved: {
    color: "green",
  },
  statusRejected: {
    color: "red",
  },
};

export default StudentForm;
