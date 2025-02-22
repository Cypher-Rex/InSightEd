require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/budgets", require("./routes/budgets"));

// Middleware
app.use(cors());
app.use(express.json());

// Debug: Check if environment variables are loaded
console.log("Email User:", process.env.EMAIL_USER);
console.log("Email Pass:", process.env.EMAIL_PASS);

// Ensure the "uploads" folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

// Configure Nodemailer using environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Use environment variable for email
    pass: process.env.EMAIL_PASS, // Use environment variable for password
  },
  debug: true, // Enable debugging for SMTP connection
});

// API endpoint to send email
app.post("/api/send-email", upload.single("file"), (req, res) => {
  const { studentName, ucid, sickDays, feedback, coordinatorId } = req.body;
  const file = req.file; // Uploaded file

  // Check if all required fields are present
  if (!studentName || !ucid || !sickDays || !feedback || !coordinatorId) {
    return res.status(400).send("Missing required fields.");
  }

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER, // Use environment variable for sender email
    to: coordinatorId, // Recipient email (use the provided coordinatorId)
    subject: `Health Report for ${studentName}`,
    text: `
      Student Name: ${studentName}
      UCID: ${ucid}
      Sick Days: ${sickDays}
      Feedback: ${feedback}
    `,
    attachments: file
      ? [
          {
            filename: file.originalname,
            path: file.path, // Attach the uploaded file
          },
        ]
      : [], // No attachments if no file is uploaded
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send(`Error sending email: ${error.message}`);
    }
    console.log("Email sent:", info.response);
    res.status(200).send("Email sent: " + info.response);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
