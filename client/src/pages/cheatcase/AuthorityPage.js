import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import "../../CSS/cheat.css";

const AuthorityPage = () => {
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState(null);
  const [records, setRecords] = useState([]);
  const [showDialog, setShowDialog] = useState(false); // Dialog visibility

  // Clear records on app start
  useEffect(() => {
    if (sessionStorage.getItem("cleared") !== "true") {
      localStorage.removeItem("cheatingRecords");
      sessionStorage.setItem("cleared", "true");
    }

    const storedRecords = JSON.parse(localStorage.getItem("cheatingRecords")) || [];
    setRecords(storedRecords);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !reason || !proof) {
      alert("Please fill in all fields.");
      return;
    }

    const newRecord = { name, reason, proof };
    const updatedRecords = [...records, newRecord];

    setRecords(updatedRecords);
    localStorage.setItem("cheatingRecords", JSON.stringify(updatedRecords));

    // Show success dialog
    setShowDialog(true);

    // Hide dialog after 3 seconds
    setTimeout(() => setShowDialog(false), 3000);

    // Clear the form
    setName("");
    setReason("");
    setProof(null);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h2 className="page-title">Authority Panel - Register Cheating Case</h2>
        <form className="record-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Student Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="text" placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} required />
          <input type="file" accept="image/*,.pdf" onChange={(e) => setProof(URL.createObjectURL(e.target.files[0]))} required />
          <button type="submit">Register Complaint</button>
        </form>

        {/* Dialog Box */}
        {showDialog && (
          <div className="dialog-box">
            <p>Case has been successfully registered!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorityPage;
