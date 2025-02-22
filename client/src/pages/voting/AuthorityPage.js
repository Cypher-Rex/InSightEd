
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStoredCandidates, setStoredCandidates, setVotingStatus } from "../data";

const AuthorityPage = () => {
  const [candidates, setCandidates] = useState(getStoredCandidates);
  const [name, setName] = useState("");
  const [party, setParty] = useState("");

  useEffect(() => {
    setCandidates(getStoredCandidates());
  }, []);

  const addCandidate = () => {
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

    const updatedCandidates = [...candidates, newCandidate];
    setCandidates(updatedCandidates);
    setStoredCandidates(updatedCandidates);
    setName("");
    setParty("");
  };

  const removeCandidate = (id) => {
    const updatedCandidates = candidates.filter(candidate => candidate.id !== id);
    setCandidates(updatedCandidates);
    setStoredCandidates(updatedCandidates);
  };

  const endVoting = () => {
    setVotingStatus(true);
    alert("Voting has been ended!");
    window.location.href = "/results";
  };

  return (
    <div className="container">
      <h1 className="title">🔐 Authority Page</h1>
      <div className="candidate-list">
        {candidates.map(candidate => (
          <div key={candidate.id} className="candidate-card" style={{ borderColor: candidate.color }}>
            <h2>{candidate.name}</h2>
            <p className="party">{candidate.party}</p>
            <button className="btn btn-danger" onClick={() => removeCandidate(candidate.id)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="add-candidate-form">
        <input type="text" placeholder="Candidate Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Party Name" value={party} onChange={(e) => setParty(e.target.value)} />
        <button className="btn" onClick={addCandidate}>Add Candidate</button>
      </div>
      <button className="btn btn-danger" onClick={endVoting}>End Voting</button>
      <Link to="/results" className="btn btn-outline">📊 View Results</Link>
    </div>
  );
};

export default AuthorityPage;