const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} = require('../controllers/taskController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getTasks);

router.post(
  '/',
  [body('title').trim().notEmpty().withMessage('Task title is required')],
  createTask
);

router.put(
  '/:id',
  [body('title').optional().trim().notEmpty().withMessage('Task title cannot be empty')],
  updateTask
);

router.delete('/:id', deleteTask);

router.patch('/reorder', reorderTasks);

module.exports = router;
