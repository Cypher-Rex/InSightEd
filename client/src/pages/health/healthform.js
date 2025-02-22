import React, { useState } from "react";
import axios from "axios";

const HealthForm = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    ucid: "",
    sickDays: "",
    feedback: "",
    coordinatorId: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object to send both form data and file
    const formDataToSend = new FormData();
    formDataToSend.append("studentName", formData.studentName);
    formDataToSend.append("ucid", formData.ucid);
    formDataToSend.append("sickDays", formData.sickDays);
    formDataToSend.append("feedback", formData.feedback);
    formDataToSend.append("coordinatorId", formData.coordinatorId);
    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }

    try {
      // Send data to the backend
      const response = await axios.post(
        "http://localhost:5000/api/send-email", // Ensure this matches the backend server's port
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Email sent:", response.data);

      // Save the form data to localStorage
      const records = JSON.parse(localStorage.getItem("healthRecords")) || [];
      const newRecord = { ...formData, id: Date.now() }; // Add a unique ID
      records.push(newRecord);
      localStorage.setItem("healthRecords", JSON.stringify(records));

      alert("Email sent successfully!");
    } catch (error) {
      console.error(
        "Error sending email:",
        error.response?.data || error.message
      );
      alert(`Failed to send email: ${error.response?.data || error.message}`);
    }

    // Reset form
    setFormData({
      studentName: "",
      ucid: "",
      sickDays: "",
      feedback: "",
      coordinatorId: "",
      file: null,
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">College Doctor Portal</h1>
      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <div className="mb-3">
          <label className="form-label">Student Name:</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">UCID:</label>
          <input
            type="text"
            name="ucid"
            value={formData.ucid}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Number of Sick Days:</label>
          <input
            type="number"
            name="sickDays"
            value={formData.sickDays}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Feedback:</label>
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Class Coordinator ID:</label>
          <input
            type="text"
            name="coordinatorId"
            value={formData.coordinatorId}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Upload Report (PDF/Image):</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </form>
    </div>
  );
};

export default HealthForm;
