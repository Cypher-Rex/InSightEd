import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Card, CardContent } from "@mui/material";

const Student = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await axios.get("http://localhost:5000/");
      // Filter cases where an action has been taken
      const resolvedCases = response.data.filter((c) => c.action);
      setCases(resolvedCases);
    } catch (err) {
      alert("Error fetching cases!");
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4">Student Panel</Typography>

      {cases.length === 0 ? (
        <Typography>No actions have been taken yet.</Typography>
      ) : (
        cases.map((c) => (
          <Card key={c._id} sx={{ mb: 2, backgroundColor: "#f3f3f3", borderLeft: "5px solid blue" }}>
            <CardContent>
              <Typography><b>Student:</b> {c.studentName}</Typography>
              <Typography><b>Exam:</b> {c.examName}</Typography>
              <Typography><b>Action Taken:</b> <span style={{ color: "red" }}>{c.action}</span></Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Student;
