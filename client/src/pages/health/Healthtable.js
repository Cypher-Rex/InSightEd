import React from "react";

const HealthTable = () => {
  const records = JSON.parse(localStorage.getItem("healthRecords")) || [];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Health Records</h2>
      <table className="table table-bordered table-striped shadow">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>UCID</th>
            <th>Sick Days</th>
            <th>Feedback</th>
            <th>Coordinator ID</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.studentName}</td>
              <td>{record.ucid}</td>
              <td>{record.sickDays}</td>
              <td>{record.feedback}</td>
              <td>{record.coordinatorId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HealthTable;
