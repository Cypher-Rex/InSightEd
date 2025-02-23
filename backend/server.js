require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());


// Increase request payload limit
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Enable file upload middleware

// Ensure the uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration (can be reused in controllers if needed)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/budgets", require("./routes/budgets"));
app.use("/complaints", require("./routes/complaints")); // Corrected line
// app.use("/budgets", require("./routes/budgets"));
// Use the budget routes
app.use('/api', require("./routes/budgets")); // Mount the budget routes under /api
app.use("/complaints", require("./routes/complaints"));
app.use("/events", require("./routes/events"));
app.use("/sponsorships", require("./routes/sponsorships"));
app.use("/facility-requests", require("./routes/facility"));
app.use("/uploads", require("./routes/upload"));
app.use("/user", require("./routes/user")); // e.g., for profile, change password, etc.
app.use('/cases', require('./routes/cheat'));
app.use("/user", require("./routes/user")); 
app.use('/applications', require("./routes/applications"));// e.g., for profile, change password, etc.

// Other routes such as email sending can be similarly modularized into a dedicated controller and route.
// For instance:
app.post("/api/send-email", upload.single("file"), require("./controllers/uploadController").sendEmail);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
