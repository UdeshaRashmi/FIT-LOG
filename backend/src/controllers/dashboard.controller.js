const asyncHandler = require('express-async-handler');
const Activity = require('../models/Activity');

exports.getDashboard = asyncHandler(async (req, res) => {
  // simple example: return latest activities and counts
  const activities = await Activity.find({ user: req.user.id }).sort({ date: -1 }).limit(10);
  const totalActivities = await Activity.countDocuments({ user: req.user.id });

  res.json({ success: true, data: { activities, totalActivities } });
});
