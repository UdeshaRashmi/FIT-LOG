const asyncHandler = require('express-async-handler');
const Sleep = require('../models/Sleep');

exports.createSleep = asyncHandler(async (req, res) => {
  const data = { ...req.body, user: req.user.id };
  const entry = await Sleep.create(data);
  res.status(201).json({ success: true, sleep: entry });
});

exports.listSleep = asyncHandler(async (req, res) => {
  const items = await Sleep.find({ user: req.user.id }).sort({ date: -1 });
  res.json({ success: true, items });
});
