const fs = require("fs");
const csv = require("csv-parser");
const nodemailer = require("nodemailer");
const transporter = require("../config/mailer");
const User = require("../models/User");

/**
 * Upload CSV and process the rows.
 * This function reads the CSV file, creates users (or processes data) based on CSV rows,
 * and then removes the file.
 */
exports.uploadCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        // Example processing: iterate through CSV rows and create users.
        // Adjust the fields based on your CSV structure.
        for (const row of results) {
          const { userid, password, role } = row;
          // If needed, hash the password before saving.
          const bcrypt = require("bcryptjs");
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new User({
            email: userid,
            password: hashedPassword,
            role: role || "user",
          });
          await newUser.save();
        }
        res.status(201).json({ message: "CSV processed successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to process CSV" });
      } finally {
        // Remove the file after processing.
        fs.unlinkSync(req.file.path);
      }
    })
    .on("error", (error) => {
      console.error("Error reading CSV:", error);
      res.status(500).json({ error: "Error processing CSV file" });
    });
};

/**
 * Send an email with an optional file attachment.
 * This controller expects fields for student name, UCID, sick days, feedback, and coordinator's email.
 */
exports.sendEmail = (req, res) => {
  const { studentName, ucid, sickDays, feedback, coordinatorId } = req.body;
  const file = req.file; // Optional uploaded file

  // Validate required fields.
  if (!studentName || !ucid || !sickDays || !feedback || !coordinatorId) {
    return res.status(400).json({ error: "Missing required fields" });
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
    attachments: file
      ? [
          {
            filename: file.originalname,
            path: file.path,
          },
        ]
      : [],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    // Remove the file after sending email if it exists.
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Error sending email" });
    }
    res.status(200).json({ message: "Email sent successfully", info: info.response });
  });
};
