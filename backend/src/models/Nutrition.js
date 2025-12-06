const mongoose = require('mongoose');

const NutritionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mealType: { type: String },
  calories: { type: Number },
  protein: { type: Number },
  carbs: { type: Number },
  fats: { type: Number },
  notes: { type: String },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Nutrition', NutritionSchema);
