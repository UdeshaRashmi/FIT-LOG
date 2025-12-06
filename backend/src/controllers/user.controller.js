const asyncHandler = require('express-async-handler');
const User = require('../models/User');

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ success: true, user });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  if (req.body.password) user.password = req.body.password;

  await user.save();
  res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
});
