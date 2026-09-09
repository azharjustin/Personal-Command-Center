const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// @desc    Get all tasks for user
// @route   GET /api/tasks
exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, sort } = req.query;
    const filter = { user: req.user._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    let sortOption = { order: 1, createdAt: -1 };
    if (sort === 'priority') sortOption = { priority: -1, order: 1 };
    if (sort === 'dueDate') sortOption = { dueDate: 1, order: 1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const tasks = await Task.find(filter).sort(sortOption);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    // Get highest order for user's tasks
    const lastTask = await Task.findOne({ user: req.user._id }).sort({ order: -1 });
    const order = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      ...req.body,
      user: req.user._id,
      order,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    let task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If status is being changed to completed, set completedAt
    if (req.body.status === 'completed' && task.status !== 'completed') {
      req.body.completedAt = new Date();
    }
    // If status is being changed from completed, clear completedAt
    if (req.body.status && req.body.status !== 'completed' && task.status === 'completed') {
      req.body.completedAt = null;
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder tasks
// @route   PATCH /api/tasks/reorder
exports.reorderTasks = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;

    if (!orderedIds || !Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'orderedIds array is required' });
    }

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, user: req.user._id },
        update: { order: index },
      },
    }));

    await Task.bulkWrite(bulkOps);
    const tasks = await Task.find({ user: req.user._id }).sort({ order: 1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};
