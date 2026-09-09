const Note = require('../models/Note');
const { validationResult } = require('express-validator');

// @desc    Get all notes
// @route   GET /api/notes
exports.getNotes = async (req, res, next) => {
  try {
    const { search, tag } = req.query;
    const filter = { user: req.user._id };

    if (tag) filter.tags = tag;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const notes = await Note.find(filter).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

// @desc    Create note
// @route   POST /api/notes
exports.createNote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const note = await Note.create({ ...req.body, user: req.user._id });
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
exports.updateNote = async (req, res, next) => {
  try {
    let note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json(note);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await note.deleteOne();
    res.json({ message: 'Note deleted' });
  } catch (error) {
    next(error);
  }
};
