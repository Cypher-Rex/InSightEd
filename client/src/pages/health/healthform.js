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
    <div style={styles.container}>
      <h1 style={styles.header}>College Doctor Portal</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Student Name:</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>UCID:</label>
          <input
            type="text"
            name="ucid"
            value={formData.ucid}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Number of Sick Days:</label>
          <input
            type="number"
            name="sickDays"
            value={formData.sickDays}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Feedback:</label>
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            style={styles.textarea}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Class Coordinator ID:</label>
          <input
            type="text"
            name="coordinatorId"
            value={formData.coordinatorId}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Upload Report (PDF/Image):</label>
          <input type="file" onChange={handleFileChange} style={styles.input} />
        </div>
        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
    resize: "vertical",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default HealthForm;
