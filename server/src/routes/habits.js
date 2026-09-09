const express = require('express');
const { body } = require('express-validator');
const {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabit,
} = require('../controllers/habitController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getHabits);

router.post(
  '/',
  [body('name').trim().notEmpty().withMessage('Habit name is required')],
  createHabit
);

router.put(
  '/:id',
  [body('name').optional().trim().notEmpty().withMessage('Habit name cannot be empty')],
  updateHabit
);

router.delete('/:id', deleteHabit);

router.post('/:id/toggle', toggleHabit);

module.exports = router;
