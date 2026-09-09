const Habit = require('../models/Habit');
const { validationResult } = require('express-validator');

// @desc    Get all habits
// @route   GET /api/habits
exports.getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    next(error);
  }
};

// @desc    Create habit
// @route   POST /api/habits
exports.createHabit = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const habit = await Habit.create({ ...req.body, user: req.user._id });
    res.status(201).json(habit);
  } catch (error) {
    next(error);
  }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
exports.updateHabit = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    let habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    habit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(habit);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
exports.deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    await habit.deleteOne();
    res.json({ message: 'Habit deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle habit completion for a date
// @route   POST /api/habits/:id/toggle
exports.toggleHabit = async (req, res, next) => {
  try {
    const { date } = req.body; // Expected format: "YYYY-MM-DD"
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const dateIndex = habit.completionHistory.indexOf(date);

    if (dateIndex > -1) {
      // Remove date (uncomplete)
      habit.completionHistory.splice(dateIndex, 1);
    } else {
      // Add date (complete)
      habit.completionHistory.push(date);
    }

    // Recalculate streaks
    const sorted = [...habit.completionHistory].sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate longest streak
    for (let i = 0; i < sorted.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prev = new Date(sorted[i - 1]);
        const curr = new Date(sorted[i]);
        const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    }

    // Calculate current streak (from today backwards)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let checkDate = new Date(today);

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (habit.completionHistory.includes(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    habit.currentStreak = currentStreak;
    habit.longestStreak = longestStreak;

    await habit.save();
    res.json(habit);
  } catch (error) {
    next(error);
  }
};
