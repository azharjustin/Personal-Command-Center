const Goal = require('../models/Goal');
const { validationResult } = require('express-validator');

// @desc    Get all goals
// @route   GET /api/goals
exports.getGoals = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const goals = await Goal.find(filter).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    next(error);
  }
};

// @desc    Create goal
// @route   POST /api/goals
exports.createGoal = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const goal = await Goal.create({ ...req.body, user: req.user._id });
    res.status(201).json(goal);
  } catch (error) {
    next(error);
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
exports.updateGoal = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    let goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Auto-set status based on progress
    if (req.body.progress !== undefined) {
      if (req.body.progress >= 100) {
        req.body.status = 'completed';
      } else if (req.body.progress > 0) {
        req.body.status = 'in-progress';
      }
    }

    goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(goal);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
exports.deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await goal.deleteOne();
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    next(error);
  }
};
