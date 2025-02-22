const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  const updates = (({ dob, phone, isHosteler, hostelEmail, class: userClass, 
    classCoordinatorName, classCoordinatorEmail, parentsEmail }) => 
    ({ dob, phone, isHosteler, hostelEmail, class: userClass, 
    classCoordinatorName, classCoordinatorEmail, parentsEmail }))(req.body);

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
};