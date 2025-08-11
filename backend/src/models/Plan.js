const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  targetDate: { type: Date, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'high' },
  expectedDrain: { type: Number, min: 0, max: 10, required: true },
  notes: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Plan', PlanSchema);
