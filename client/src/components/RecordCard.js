import React, { useState } from "react";

const RecordCard = ({ record }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  // Function to toggle zoom view
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="record-card">
      <h3>{record.name}</h3>
      <p><strong>Reason:</strong> {record.reason}</p>

      {/* Display proof */}
      {record.proof && (
        <>
          {record.proof.endsWith(".pdf") ? (
            // If the proof is a PDF, show a download link
            <a href={record.proof} download="proof.pdf" className="download-link">
              📄 Download Proof
            </a>
          ) : (
            // If the proof is an image, allow zooming
            <img
              src={record.proof}
              alt="Proof"
              className={`proof-image ${isZoomed ? "zoomed" : ""}`}
              onClick={toggleZoom}
            />
          )}
        </>
      )}

      {/* Overlay for zoomed image */}
      {isZoomed && (
        <div className="overlay" onClick={toggleZoom}>
          <img src={record.proof} alt="Zoomed Proof" className="zoomed-image" />
        </div>
      )}
    </div>
  );
};

export default RecordCard;
