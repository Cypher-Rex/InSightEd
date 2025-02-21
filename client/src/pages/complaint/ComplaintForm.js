import { useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

function ComplaintForm({ open, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ensure token is in Bearer format
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to create complaint");
      }

      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          New Complaint
        </Typography>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Modal>
  );
}

export default ComplaintForm;
