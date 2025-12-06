const asyncHandler = require('express-async-handler');
const Activity = require('../models/Activity');

exports.createActivity = asyncHandler(async (req, res) => {
  const data = { ...req.body, user: req.user.id };
  const act = await Activity.create(data);
  res.status(201).json({ success: true, activity: act });
});

exports.listActivities = asyncHandler(async (req, res) => {
  const activities = await Activity.find({ user: req.user.id }).sort({ date: -1 });
  res.json({ success: true, activities });
});
