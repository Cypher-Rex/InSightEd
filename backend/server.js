require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Middleware to handle file uploads
const upload = multer({ dest: 'uploads/' });

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ** User Schema **
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  dob: Date,
  class: String,
  classCoordinatorName: String,
  classCoordinatorEmail: String,
  parentsEmail: String,
});
const User = mongoose.model("User", UserSchema);

// ** Complaint Schema **
const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Resolved", "Rejected"], default: "Pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  revealRequested: { type: Boolean, default: false },
  revealApprovals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
const Complaint = mongoose.model("Complaint", ComplaintSchema);

// ** Budget Schema **
const BudgetSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  eventName: { type: String, required: true },
  eventBudget: { type: Number, required: true },
  eventFundsExpense: { type: Number, required: true },
  eventBudgetProof: { type: String, required: true },
  messBudgetProof: { type: String, required: true },
  feedback: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});
const Budget = mongoose.model("Budget", BudgetSchema);

// ** Event Schema **
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});
const Event = mongoose.model("Event", EventSchema);

// ** Sponsorship Schema **
const SponsorshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});
const Sponsorship = mongoose.model("Sponsorship", SponsorshipSchema);

// ** Facility Request Schema **
const FacilityRequestSchema = new mongoose.Schema({
  activity: { type: String, required: true },
  numStudents: { type: Number, required: true },
  time: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const FacilityRequest = mongoose.model("FacilityRequest", FacilityRequestSchema);

// ** Register User **
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// ** Login User (Fixed) **
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });  // ✅ Sending `role` to frontend
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// ** Middleware to Verify JWT (Fixed) **
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // ✅ Fixed header format

  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// Add this route before /complaints routes
app.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ** Update Profile **
app.put('/profile', auth, async (req, res) => {
  const { dob, class: className, classCoordinatorName, classCoordinatorEmail, parentsEmail } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.dob = dob;
    user.class = className;
    user.classCoordinatorName = classCoordinatorName;
    user.classCoordinatorEmail = classCoordinatorEmail;
    user.parentsEmail = parentsEmail;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ** Change Password **
app.put('/change-password', auth, async (req, res) => {
  const { password, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid current password' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// ** Upload CSV (Admin Only) **
app.post('/upload-csv', auth, upload.single('file'), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const row of results) {
          const { userid, password, role } = row;
          const hashedPassword = await bcrypt.hash(password, 10);
          const user = new User({ email: userid, password: hashedPassword, role });
          await user.save();
        }
        res.json({ message: 'CSV uploaded successfully' });
      } catch (err) {
        res.status(500).json({ error: 'Failed to upload CSV' });
      } finally {
        fs.unlinkSync(req.file.path); // Remove the uploaded file
      }
    });
});

// ** Create Complaint**
app.post("/complaints", auth, async (req, res) => {
  const { title, description } = req.body;
  
  try {
    const complaint = new Complaint({ title, description, createdBy: req.user.id });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ error: "Failed to create complaint" });
  }
});

// ** Get All Complaints **
app.get("/complaints", auth, async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("createdBy", "name email");
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
});

// ** Update Complaint Status (Admin Only) **
app.put("/complaints/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Unauthorized" });

  const { status } = req.body;
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    complaint.status = status;
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: "Failed to update complaint" });
  }
});

// ** Request Identity Reveal **
app.post("/complaints/:id/reveal", auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    // Add the user to the reveal request list if not already present
    if (!complaint.revealApprovals.includes(req.user.id)) {
      complaint.revealApprovals.push(req.user.id);
    }

    // Save the updated complaint
    await complaint.save();

    res.status(200).json({ message: "Reveal request sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send reveal request" });
  }
});

// ** Approve Identity Reveal (Majority Needed) **
app.post("/complaints/:id/approve", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Unauthorized" });

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    if (!complaint.revealRequested) return res.status(400).json({ error: "Reveal not requested" });

    if (!complaint.revealApprovals.includes(req.user.id)) {
      complaint.revealApprovals.push(req.user.id);
      await complaint.save();
    }

    // ** If More than 50% of Admins Approve, Reveal Identity **
    const totalAdmins = await User.countDocuments({ role: "admin" });
    if (complaint.revealApprovals.length >= Math.ceil(totalAdmins / 2)) {
      res.json({ message: "Identity reveal approved by majority!" });
    } else {
      res.json({ message: "Identity reveal in progress, waiting for more approvals." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to approve reveal" });
  }
});

// ** Create Budget **
app.post("/budgets", auth, async (req, res) => {
  const { studentEmail, eventName, eventBudget, eventFundsExpense, eventBudgetProof, messBudgetProof } = req.body;
  
  try {
    const budget = new Budget({ studentEmail, eventName, eventBudget, eventFundsExpense, eventBudgetProof, messBudgetProof });
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ error: "Failed to create budget" });
  }
});

// ** Get All Budgets **
app.get("/budgets", auth, async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
});

// ** Update Budget Feedback (Admin Only) **
app.put("/budgets/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Unauthorized" });

  const { feedback } = req.body;
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ error: "Budget not found" });

    budget.feedback = feedback;
    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: "Failed to update budget" });
  }
});

// ** Create Event **
app.post("/events", auth, async (req, res) => {
  const { title, description, date, priority } = req.body;
  
  try {
    const event = new Event({ title, description, date, priority, createdBy: req.user.id });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to create event" });
  }
});

// ** Get All Events **
app.get("/events", auth, async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// ** Update Event Status (Admin Only) **
app.put("/events/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Unauthorized" });

  const { status } = req.body;
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    event.status = status;
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to update event" });
  }
});

// ** Create Sponsorship **
app.post("/sponsorships", auth, async (req, res) => {
  const { title, description, amount } = req.body;
  
  try {
    const sponsorship = new Sponsorship({ title, description, amount, createdBy: req.user.id });
    await sponsorship.save();
    res.status(201).json(sponsorship);
  } catch (err) {
    res.status(500).json({ error: "Failed to create sponsorship" });
  }
});

// ** Get All Sponsorships **
app.get("/sponsorships", auth, async (req, res) => {
  try {
    const sponsorships = await Sponsorship.find().populate("createdBy", "name email");
    res.json(sponsorships);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sponsorships" });
  }
});

// ** Update Sponsorship Status (Admin Only) **
app.put("/sponsorships/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Unauthorized" });

  const { status } = req.body;
  try {
    const sponsorship = await Sponsorship.findById(req.params.id);
    if (!sponsorship) return res.status(404).json({ error: "Sponsorship not found" });

    sponsorship.status = status;
    await sponsorship.save();
    res.json(sponsorship);
  } catch (err) {
    res.status(500).json({ error: "Failed to update sponsorship" });
  }
});

// ** Create Facility Request **
app.post("/facility-requests", auth, async (req, res) => {
  const { activity, numStudents, time, date } = req.body;
  try {
    const facilityRequest = new FacilityRequest({
      activity,
      numStudents,
      time,
      date,
      createdBy: req.user.id,
    });
    await facilityRequest.save();
    res.status(201).json(facilityRequest);
  } catch (err) {
    res.status(500).json({ error: "Failed to create facility request" });
  }
});

// ** Get All Facility Requests **
app.get("/facility-requests", auth, async (req, res) => {
  try {
    const facilityRequests = await FacilityRequest.find({ createdBy: req.user.id });
    res.json(facilityRequests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch facility requests" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
