const ImportantDate = require('../models/ImportantDate');
const { validationResult } = require('express-validator');

// @desc    Get all dates
// @route   GET /api/dates
exports.getDates = async (req, res, next) => {
  try {
    const { type, upcoming } = req.query;
    const filter = { user: req.user._id };

    if (type) filter.type = type;

    // Only future dates
    if (upcoming === 'true') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filter.date = { $gte: today };
    }

    const dates = await ImportantDate.find(filter).sort({ date: 1 });
    res.json(dates);
  } catch (error) {
    next(error);
  }
};

// @desc    Create date
// @route   POST /api/dates
exports.createDate = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const date = await ImportantDate.create({ ...req.body, user: req.user._id });
    res.status(201).json(date);
  } catch (error) {
    next(error);
  }
};

// @desc    Update date
// @route   PUT /api/dates/:id
exports.updateDate = async (req, res, next) => {
  try {
    let date = await ImportantDate.findOne({ _id: req.params.id, user: req.user._id });
    if (!date) {
      return res.status(404).json({ message: 'Date not found' });
    }

    date = await ImportantDate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(date);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete date
// @route   DELETE /api/dates/:id
exports.deleteDate = async (req, res, next) => {
  try {
    const date = await ImportantDate.findOne({ _id: req.params.id, user: req.user._id });
    if (!date) {
      return res.status(404).json({ message: 'Date not found' });
    }

    await date.deleteOne();
    res.json({ message: 'Date deleted' });
  } catch (error) {
    next(error);
  }
};
