const express = require('express');
const { body } = require('express-validator');
const {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} = require('../controllers/goalController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getGoals);

router.post(
  '/',
  [body('title').trim().notEmpty().withMessage('Goal title is required')],
  createGoal
);

router.put(
  '/:id',
  [body('title').optional().trim().notEmpty().withMessage('Goal title cannot be empty')],
  updateGoal
);

router.delete('/:id', deleteGoal);

module.exports = router;
