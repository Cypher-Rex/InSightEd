import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "../../CSS/cheat.css";

const StudentPage = () => {
  const [records, setRecords] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null);

  // Load cheating records on page load
  useEffect(() => {
    const storedRecords = JSON.parse(localStorage.getItem("cheatingRecords")) || [];
    setRecords(storedRecords);
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h2 className="page-title">Student Panel - Cheating Records</h2>
        <div className="records-container">
          {records.length === 0 ? (
            <p className="no-records">No complaints registered yet.</p>
          ) : (
            records.map((record, index) => (
              <div key={index} className="record-card">
                <h3>{record.name}</h3>
                <p><strong>Reason:</strong> {record.reason}</p>

                {record.proof && (
                  <div className="proof-container">
                    <img
                      src={record.proof}
                      alt="Proof"
                      className="preview-img"
                      onClick={() => setZoomedImage(record.proof)}
                    />
                    <a href={record.proof} download={`proof-${record.name}.jpg`} className="download-btn">
                      Download Proof
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {zoomedImage && (
          <div className="modal" onClick={() => setZoomedImage(null)}>
            <img src={zoomedImage} alt="Zoomed Proof" className="zoomed-img" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPage;
