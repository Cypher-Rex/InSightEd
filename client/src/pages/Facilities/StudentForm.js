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
        const response = await axios.get("http://localhost:5000/facility-requests", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
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
      const response = await axios.post("http://localhost:5000/facility-requests", request, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
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
    <div>
      <h2>Submit Activity Request</h2>
      <form onSubmit={handleSubmit} className="student-form">
        <label>
          Activity:
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            required
          >
            <option value="">Select Activity</option>
            <option value="Pool">Pool</option>
            <option value="Badminton Court">Badminton Court</option>
            <option value="Football Ground">Football Ground</option>
            <option value="Auditorium">Auditorium</option>
          </select>
        </label>
        <label>
          Number of Students:
          <input
            type="number"
            value={numStudents}
            onChange={(e) => setNumStudents(e.target.value)}
            required
          />
        </label>
        <label>
          Time:
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      <h3>Your Requests</h3>
      {requests.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Activity</th>
              <th>Number of Students</th>
              <th>Time</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.activity}</td>
                <td>{request.numStudents}</td>
                <td>{request.time}</td>
                <td>{request.date}</td>
                <td className={getStatusClass(request.status)}>
                  {request.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No requests submitted yet.</p>
      )}
    </div>
  );
};

export default StudentForm;
// src/components/AdminDashboard.js
