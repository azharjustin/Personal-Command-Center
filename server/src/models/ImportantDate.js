const mongoose = require('mongoose');

const importantDateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Date title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  type: {
    type: String,
    enum: ['deadline', 'event', 'personal', 'other'],
    default: 'other',
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

importantDateSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('ImportantDate', importantDateSchema);
