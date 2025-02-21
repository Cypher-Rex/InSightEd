import React, { useState } from "react";
import Modal from "react-modal";
import "./../styles.css";

const FileViewer = ({ fileUrl }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isImage = fileUrl.match(/\.(jpeg|jpg|png|gif)$/i);
  const isPDF = fileUrl.match(/\.pdf$/i);

  return (
    <div>
      {isImage ? (
        <img
          src={fileUrl}
          alt="Proof"
          className="preview-img"
          onClick={() => setIsOpen(true)}
        />
      ) : isPDF ? (
        <a href={fileUrl} download className="download-btn">
          Download Proof (PDF)
        </a>
      ) : null}

      {/* Modal for Zooming Image */}
      <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} className="modal">
        <img src={fileUrl} alt="Zoomed Proof" className="zoomed-img" />
        <button className="close-btn" onClick={() => setIsOpen(false)}>Close</button>
      </Modal>
    </div>
  );
};

export default FileViewer;
