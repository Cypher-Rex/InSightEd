import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getStoredCandidates } from "../data";

const CandidateRegister = () => {
  const [name, setName] = useState("");
  const [party, setParty] = useState("");

  const handleRegister = () => {
    if (!name || !party) {
      alert("Please fill all fields!");
      return;
    }

    const newCandidate = {
      id: Date.now(),
      name,
      party,
      votes: 0,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
    };

    const updatedCandidates = [...getStoredCandidates(), newCandidate];

    localStorage.setItem("candidates", JSON.stringify(updatedCandidates));
    alert("Candidate Registered Successfully!");
    window.location.href = "/voter";
  };

  return (
    <div className="container">
      <h1 className="title">📝 Register as Candidate</h1>
      <input type="text" placeholder="Candidate Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Party Name" value={party} onChange={(e) => setParty(e.target.value)} />
      <button className="btn" onClick={handleRegister}>Register</button>
      <Link to="/" className="btn btn-outline">🏠 Home</Link>
    </div>
  );
};

export default CandidateRegister;
