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

exports.updateActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
  if (activity.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
  
  Object.assign(activity, req.body);
  await activity.save();
  res.json({ success: true, activity });
});

exports.deleteActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
  if (activity.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
  
  await Activity.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Activity deleted' });
});
