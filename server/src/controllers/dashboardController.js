const Task = require('../models/Task');
const Goal = require('../models/Goal');
const Habit = require('../models/Habit');
const ImportantDate = require('../models/ImportantDate');
const Note = require('../models/Note');

// @desc    Get dashboard summary
// @route   GET /api/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayStr = today.toISOString().split('T')[0];

    // Today's tasks (due today or high priority incomplete)
    const tasks = await Task.find({
      user: userId,
      status: { $ne: 'completed' },
    }).sort({ order: 1 });

    const todayTasks = tasks.filter(
      (t) =>
        t.priority === 'high' ||
        (t.dueDate && t.dueDate >= today && t.dueDate < tomorrow)
    );

    // Completed today
    const completedToday = await Task.countDocuments({
      user: userId,
      status: 'completed',
      completedAt: { $gte: today, $lt: tomorrow },
    });

    const totalTodayTasks = todayTasks.length + completedToday;

    // Active goals
    const activeGoals = await Goal.find({
      user: userId,
      status: { $ne: 'completed' },
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Today's habits
    const habits = await Habit.find({ user: userId });
    const completedHabits = habits.filter((h) =>
      h.completionHistory.includes(todayStr)
    ).length;

    // Upcoming dates (next 7 days)
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    const upcomingDates = await ImportantDate.find({
      user: userId,
      date: { $gte: today, $lte: weekFromNow },
    }).sort({ date: 1 });

    // Recent notes
    const recentNotes = await Note.find({ user: userId })
      .sort({ updatedAt: -1 })
      .limit(3);

    // Priority tasks (isPriority = true)
    const priorities = await Task.find({
      user: userId,
      isPriority: true,
      status: { $ne: 'completed' },
    }).sort({ order: 1 });

    // Calculate daily progress
    const taskCompletion =
      totalTodayTasks > 0
        ? Math.round((completedToday / totalTodayTasks) * 100)
        : 100;
    const habitCompletion =
      habits.length > 0
        ? Math.round((completedHabits / habits.length) * 100)
        : 100;
    const priorityCompleted = await Task.countDocuments({
      user: userId,
      isPriority: true,
      status: 'completed',
      completedAt: { $gte: today },
    });
    const totalPriorities = priorities.length + priorityCompleted;
    const priorityCompletion =
      totalPriorities > 0
        ? Math.round((priorityCompleted / totalPriorities) * 100)
        : 100;

    const dailyProgress = Math.round(
      (taskCompletion + habitCompletion + priorityCompletion) / 3
    );

    res.json({
      tasks: todayTasks.slice(0, 5),
      completedToday,
      totalTodayTasks,
      activeGoals,
      habits: habits.map((h) => ({
        ...h.toObject(),
        completedToday: h.completionHistory.includes(todayStr),
      })),
      completedHabits,
      totalHabits: habits.length,
      upcomingDates,
      recentNotes,
      priorities,
      progress: {
        tasks: taskCompletion,
        habits: habitCompletion,
        priorities: priorityCompletion,
        overall: dailyProgress,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weekly analytics
// @route   GET /api/analytics/weekly
exports.getWeeklyAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get start of week (Monday)
    const startOfWeek = new Date(today);
    const dayOfWeek = startOfWeek.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(startOfWeek.getDate() - diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    // Tasks completed per day this week
    const completedTasks = await Task.find({
      user: userId,
      status: 'completed',
      completedAt: { $gte: startOfWeek, $lt: endOfWeek },
    });

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const tasksByDay = daysOfWeek.map((day, i) => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = completedTasks.filter(
        (t) => t.completedAt >= date && t.completedAt < nextDate
      ).length;

      return { day, count, date: date.toISOString().split('T')[0] };
    });

    // Habit completion this week
    const habits = await Habit.find({ user: userId });
    const habitsByDay = daysOfWeek.map((day, i) => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const completed = habits.filter((h) =>
        h.completionHistory.includes(dateStr)
      ).length;

      return {
        day,
        completed,
        total: habits.length,
        rate: habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0,
      };
    });

    // Goals progress
    const goals = await Goal.find({ user: userId });
    const avgGoalProgress =
      goals.length > 0
        ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
        : 0;

    // Weekly summary
    const totalTasksCompleted = completedTasks.length;
    const totalHabitCompletions = habitsByDay.reduce((sum, d) => sum + d.completed, 0);
    const expectedHabitCompletions = habits.length * 7;
    const habitCompletionRate =
      expectedHabitCompletions > 0
        ? Math.round((totalHabitCompletions / expectedHabitCompletions) * 100)
        : 0;

    // Productivity score: tasks(40%) + habits(30%) + goals(30%)
    const maxTasksPerWeek = Math.max(totalTasksCompleted, 7); // baseline of 7
    const taskScore = Math.min(
      Math.round((totalTasksCompleted / maxTasksPerWeek) * 100),
      100
    );
    const productivityScore = Math.round(
      taskScore * 0.4 + habitCompletionRate * 0.3 + avgGoalProgress * 0.3
    );

    res.json({
      tasksByDay,
      habitsByDay,
      totalTasksCompleted,
      totalHabitCompletions,
      habitCompletionRate,
      avgGoalProgress,
      productivityScore,
      goalsCount: goals.length,
    });
  } catch (error) {
    next(error);
  }
};
