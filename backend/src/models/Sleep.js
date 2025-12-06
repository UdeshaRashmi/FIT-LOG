const mongoose = require('mongoose');

const SleepSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  durationHours: { type: Number },
  quality: { type: String },
  notes: { type: String },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Sleep', SleepSchema);
