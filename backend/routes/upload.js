const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const auth = require("../middleware/authMiddleware");
const transporter = require("../config/mailer");

// Ensure the uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// API endpoint to send email with file attachment
router.post("/send-email", auth, upload.single("file"), (req, res) => {
  const { studentName, ucid, sickDays, feedback, coordinatorId } = req.body;
  const file = req.file; // Uploaded file
  
  if (!studentName || !ucid || !sickDays || !feedback || !coordinatorId) {
    return res.status(400).send("Missing required fields.");
  }
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: coordinatorId,
    subject: `Health Report for ${studentName}`,
    text: `
Student Name: ${studentName}
UCID: ${ucid}
Sick Days: ${sickDays}
Feedback: ${feedback}
    `,
    attachments: file ? [
      {
        filename: file.originalname,
        path: file.path,
      },
    ] : [],
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send(`Error sending email: ${error.message}`);
    }
    console.log("Email sent:", info.response);
    res.status(200).send("Email sent: " + info.response);
  });
});

module.exports = router;
