const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  target: { type: Number },
  progress: { type: Number, default: 0 },
  unit: { type: String },
  dueDate: { type: Date },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Goal', GoalSchema);
