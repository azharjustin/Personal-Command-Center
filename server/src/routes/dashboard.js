const express = require('express');
const { getDashboard, getWeeklyAnalytics } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getDashboard);
router.get('/analytics/weekly', getWeeklyAnalytics);

module.exports = router;
