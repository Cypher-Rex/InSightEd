import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Container, Typography } from "@mui/material";

const Invigilator = () => {
  const [studentName, setStudentName] = useState("");
  const [examName, setExamName] = useState("");
  const [description, setDescription] = useState("");
  const [invigilatorName, setInvigilatorName] = useState("");

  const handleSubmit = async () => {
    if (!studentName || !examName || !description || !invigilatorName) {
      alert("Please fill all fields.");
      return;
    }

    const newCase = { studentName, examName, description, invigilatorName, action: null };

    try {
      await axios.post("http://localhost:5000/api/cases", newCase);
      alert("Case submitted successfully!");
      setStudentName(""); setExamName(""); setDescription(""); setInvigilatorName("");
    } catch (err) {
      alert("Error submitting case!");
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4">Invigilator Panel</Typography>

      <TextField label="Invigilator Name" fullWidth value={invigilatorName} onChange={(e) => setInvigilatorName(e.target.value)} sx={{ mb: 2 }} />
      <TextField label="Student Name" fullWidth value={studentName} onChange={(e) => setStudentName(e.target.value)} sx={{ mb: 2 }} />
      <TextField label="Exam Name" fullWidth value={examName} onChange={(e) => setExamName(e.target.value)} sx={{ mb: 2 }} />
      <TextField label="Description" fullWidth multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mb: 2 }} />

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit Case
      </Button>
    </Container>
  );
};

export default Invigilator;
