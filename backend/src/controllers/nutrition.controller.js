const asyncHandler = require('express-async-handler');
const Nutrition = require('../models/Nutrition');

exports.createNutrition = asyncHandler(async (req, res) => {
  const data = { ...req.body, user: req.user.id };
  const entry = await Nutrition.create(data);
  res.status(201).json({ success: true, nutrition: entry });
});

exports.listNutrition = asyncHandler(async (req, res) => {
  const items = await Nutrition.find({ user: req.user.id }).sort({ date: -1 });
  res.json({ success: true, items });
});
