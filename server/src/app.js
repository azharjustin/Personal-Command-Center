const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const goalRoutes = require('./routes/goals');
const habitRoutes = require('./routes/habits');
const noteRoutes = require('./routes/notes');
const dateRoutes = require('./routes/dates');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Body parser
app.use(express.json());

// CORS
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/dates', dateRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

module.exports = app;
