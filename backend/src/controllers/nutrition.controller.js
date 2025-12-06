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

exports.updateNutrition = asyncHandler(async (req, res) => {
  const entry = await Nutrition.findById(req.params.id);
  if (!entry) return res.status(404).json({ success: false, message: 'Nutrition entry not found' });
  if (entry.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
  
  Object.assign(entry, req.body);
  await entry.save();
  res.json({ success: true, nutrition: entry });
});

exports.deleteNutrition = asyncHandler(async (req, res) => {
  const entry = await Nutrition.findById(req.params.id);
  if (!entry) return res.status(404).json({ success: false, message: 'Nutrition entry not found' });
  if (entry.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
  
  await Nutrition.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Nutrition entry deleted' });
});
