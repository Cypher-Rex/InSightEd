import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Select, MenuItem, Container, Typography, Card, CardContent } from "@mui/material";

const Authority = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await axios.get("http://localhost:5000/cases");
      setCases(response.data);
    } catch (err) {
      alert("Error fetching cases!");
    }
  };

  const handleAction = async (id, action) => {
    try {
      await axios.put(`http://localhost:5000/cases/${id}`, { action });
      fetchCases(); // Refresh cases after update
    } catch (err) {
      alert("Error updating case!");
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4">Authority Panel</Typography>

      {cases.some(c => !c.action) && (
        <>
          <Typography variant="h5" sx={{ color: "red" }}>⚠️ New Cases</Typography>
          {cases.map((c) => (
            !c.action && (
              <Card key={c._id} sx={{ mb: 2, backgroundColor: "#ffebee", border: "2px solid red" }}>
                <CardContent>
                  <Typography><b>Student:</b> {c.studentName}</Typography>
                  <Typography><b>Exam:</b> {c.examName}</Typography>
                  <Typography><b>Invigilator:</b> {c.invigilatorName}</Typography>
                  <Typography><b>Description:</b> {c.description}</Typography>
                  <Select value={c.action || ""} onChange={(e) => handleAction(c._id, e.target.value)} fullWidth sx={{ mt: 2 }}>
                    <MenuItem value="Register Legal Case">Register Legal Case</MenuItem>
                    <MenuItem value="Suspend">Suspend</MenuItem>
                    <MenuItem value="Rusticate">Rusticate</MenuItem>
                  </Select>
                </CardContent>
              </Card>
            )
          ))}
        </>
      )}

      <Typography variant="h5" sx={{ mt: 3, color: "green" }}>✅ Resolved Cases</Typography>
      {cases.map((c) => (
        c.action && (
          <Card key={c._id} sx={{ mb: 2, backgroundColor: "#e8f5e9", border: "2px solid green" }}>
            <CardContent>
              <Typography><b>Student:</b> {c.studentName}</Typography>
              <Typography><b>Exam:</b> {c.examName}</Typography>
              <Typography><b>Invigilator:</b> {c.invigilatorName}</Typography>
              <Typography><b>Action Taken:</b> {c.action}</Typography>
            </CardContent>
          </Card>
        )
      ))}
    </Container>
  );
};

export default Authority;
