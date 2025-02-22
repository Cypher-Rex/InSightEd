const Complaint = require("../models/Complaint");
const User = require("../models/User");

// Create Complaint
exports.createComplaint = async (req, res) => {
  const { title, description } = req.body;
  
  try {
    const complaint = new Complaint({
      title,
      description,
      createdBy: req.user.id,
    });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create complaint" });
  }
};

// Get All Complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("createdBy", "name email");
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
};

// Update Complaint Status (Admin Only)
exports.updateComplaintStatus = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }
  
  const { status } = req.body;
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    complaint.status = status;
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update complaint" });
  }
};

// Vote for Identity Reveal (Admin Only)
// This example assumes that you are tracking votes with `approveVotes` and `rejectVotes` arrays
exports.voteForReveal = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }
  
  const { vote } = req.body; // Expected values: "approve" or "reject"
  
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    // Ensure reveal has been requested (if using a flag like revealRequested)
    if (!complaint.revealRequested) {
      return res.status(400).json({ error: "Reveal not requested" });
    }

    // Record vote
    if (vote === "approve") {
      if (!complaint.approveVotes.includes(req.user.id)) {
        complaint.approveVotes.push(req.user.id);
      }
    } else if (vote === "reject") {
      if (!complaint.rejectVotes.includes(req.user.id)) {
        complaint.rejectVotes.push(req.user.id);
      }
    } else {
      return res.status(400).json({ error: "Invalid vote" });
    }

    await complaint.save();

    // Check if more than 50% of admins have approved
    const totalAdmins = await User.countDocuments({ role: "admin" });
    if (complaint.approveVotes.length >= Math.ceil(totalAdmins / 2)) {
      complaint.revealIdentity = true; // Flag for reveal
      await complaint.save();
      res.json({ message: "Identity reveal approved by majority!", revealIdentity: true });
    } else {
      res.json({ message: "Vote recorded.", revealIdentity: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process vote" });
  }
};
