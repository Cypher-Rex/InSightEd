import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStoredCandidates, setStoredCandidates, getVotingStatus } from "../data";

const VoterPage = () => {
  const [candidates, setCandidates] = useState(getStoredCandidates);
  const [hasVoted, setHasVoted] = useState(false);
  const votingEnded = getVotingStatus();

  useEffect(() => {
    setCandidates(getStoredCandidates());
  }, []);

  const handleVote = (id) => {
    if (hasVoted) {
      alert("You have already voted!");
      return;
    }

    const updatedCandidates = candidates.map(candidate =>
      candidate.id === id ? { ...candidate, votes: candidate.votes + 1 } : candidate
    );

    setCandidates(updatedCandidates);
    setStoredCandidates(updatedCandidates);
    setHasVoted(true);
    alert("Thank you for voting!");
  };

  if (votingEnded) {
    return (
      <div className="container">
        <h1 className="title">Voting has ended. Here are the results:</h1>
        <Link to="/results" className="btn btn-outline">📊 View Results</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">🗳️ Voter Page</h1>
      {candidates.map((candidate) => (
        <div className="candidate-card" key={candidate.id} style={{ borderColor: candidate.color }}>
          <h2>{candidate.name}</h2>
          <p className="party">{candidate.party}</p>
          <p className="votes">Votes: {candidate.votes}</p>
          <button
            className="vote-btn"
            onClick={() => handleVote(candidate.id)}
            disabled={hasVoted}
            style={{ backgroundColor: candidate.color }}
          >
            {hasVoted ? "Already Voted" : "Vote"}
          </button>
        </div>
      ))}
      <Link to="/results" className="btn btn-outline">📊 View Results</Link>
    </div>
  );
};

export default VoterPage;
