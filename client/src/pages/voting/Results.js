import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getStoredCandidates } from "../data";

const Results = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      const storedCandidates = await getStoredCandidates();
      setCandidates(storedCandidates);
    };

    // Fetch candidates initially
    fetchCandidates();

    // Set up polling to fetch candidates every 5 seconds
    const intervalId = setInterval(fetchCandidates, 5000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to generate color based on votes
  const getColor = (votes) => {
    const maxVotes = Math.max(...candidates.map(candidate => candidate.votes));
    const hue = (1 - votes / maxVotes) * 120; // Green to red
    return `hsl(${hue}, 100%, 50%)`;
  };

  return (
    <div className="container">
      <h1 className="title">📊 Election Results</h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={candidates} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="votes" fill={candidates.length > 0 ? getColor(candidates[0].votes) : "#8884d8"} />
        </BarChart>
      </ResponsiveContainer>
      <Link to="/" className="btn">🏠 Home</Link>
    </div>
  );
};

export default Results;