const asyncHandler = require('express-async-handler');
const Goal = require('../models/Goal');

exports.createGoal = asyncHandler(async (req, res) => {
  const data = { ...req.body, user: req.user.id };
  const goal = await Goal.create(data);
  res.status(201).json({ success: true, goal });
});

exports.listGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ success: true, goals });
});
