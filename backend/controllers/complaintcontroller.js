const Complaint = require("../models/Complaint"); // Ensure correct import
const User = require("../models/User");

// Create Complaint
exports.createComplaint = async (req, res) => {
  const { title, description } = req.body;

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: User ID missing" });
    }

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
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized: Admin access required" });
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
exports.voteForReveal = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized: Admin access required" });
  }

  const { vote } = req.body; // Expected values: "approve" or "reject"

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    // Ensure reveal has been requested
    if (!complaint.revealRequested) {
      return res.status(400).json({ error: "Reveal not requested" });
    }

    // Prevent duplicate votes
    if (vote === "approve" && !complaint.approveVotes.includes(req.user.id)) {
      complaint.approveVotes.push(req.user.id);
    } else if (vote === "reject" && !complaint.rejectVotes.includes(req.user.id)) {
      complaint.rejectVotes.push(req.user.id);
    } else {
      return res.status(400).json({ error: "Invalid or duplicate vote" });
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
