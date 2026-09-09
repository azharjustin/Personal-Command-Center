const express = require('express');
const { body } = require('express-validator');
const {
  getDates,
  createDate,
  updateDate,
  deleteDate,
} = require('../controllers/dateController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getDates);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Date title is required'),
    body('date').notEmpty().withMessage('Date is required'),
  ],
  createDate
);

router.put('/:id', updateDate);

router.delete('/:id', deleteDate);

module.exports = router;
