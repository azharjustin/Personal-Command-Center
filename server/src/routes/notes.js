const express = require('express');
const { body } = require('express-validator');
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getNotes);

router.post(
  '/',
  [body('title').trim().notEmpty().withMessage('Note title is required')],
  createNote
);

router.put('/:id', updateNote);

router.delete('/:id', deleteNote);

module.exports = router;
