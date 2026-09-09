const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Habit name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom'],
    default: 'daily',
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  completionHistory: [{
    type: String, // ISO date strings "YYYY-MM-DD"
  }],
  color: {
    type: String,
    default: '#10b981',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

habitSchema.index({ user: 1 });

module.exports = mongoose.model('Habit', habitSchema);
