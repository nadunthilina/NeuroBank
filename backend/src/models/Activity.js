const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, enum: ['deep_work', 'meeting', 'social', 'admin', 'break', 'exercise', 'sleep', 'other'], default: 'other' },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  drainScore: { type: Number, min: 0, max: 10, required: true },
  notes: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);
