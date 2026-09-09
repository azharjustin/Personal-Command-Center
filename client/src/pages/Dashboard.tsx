import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  Target,
  Repeat,
  CalendarDays,
  TrendingUp,
  Flame,
  ArrowRight,
  Circle,
  CheckCircle2,
  Clock,
  Star,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useGreeting } from '../hooks/useGreeting';
import { dashboardService } from '../services/dashboardService';
import { taskService } from '../services/taskService';
import { habitService } from '../services/habitService';
import type { DashboardData } from '../types';
import { formatDateShort, getUrgency, getTodayString } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const { greeting, emoji, date } = useGreeting(user?.name || 'there');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const d = await dashboardService.getDashboard();
      setData(d);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    try {
      await taskService.update(taskId, {
        status: currentStatus === 'completed' ? 'todo' : 'completed',
      });
      fetchDashboard();
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleToggleHabit = async (habitId: string) => {
    try {
      await habitService.toggle(habitId, getTodayString());
      fetchDashboard();
    } catch {
      toast.error('Failed to toggle habit');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 skeleton" />
        <div className="h-4 w-40 skeleton" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 skeleton" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 skeleton" />
          <div className="h-64 skeleton" />
        </div>
      </div>
    );
  }

  const progress = data?.progress || { tasks: 0, habits: 0, priorities: 0, overall: 0 };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-6 md:gap-8">
      {/* Greeting */}
      <motion.div variants={fadeUp} className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100">
          {greeting} {emoji}
        </h1>
        <p className="text-surface-400 mt-1">{date}</p>
      </motion.div>

      {/* Today's Summary */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Link to="/tasks" className="glass-card p-5 md:p-6 group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <CheckSquare className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100">
                {data?.totalTodayTasks || 0}
              </p>
              <p className="text-xs md:text-sm text-surface-400 mt-0.5">Tasks Today</p>
            </div>
          </div>
        </Link>

        <Link to="/habits" className="glass-card p-5 md:p-6 group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center shrink-0">
              <Repeat className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100">
                {data?.completedHabits || 0}/{data?.totalHabits || 0}
              </p>
              <p className="text-xs md:text-sm text-surface-400 mt-0.5">Habits Done</p>
            </div>
          </div>
        </Link>

        <Link to="/dates" className="glass-card p-5 md:p-6 group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center shrink-0">
              <CalendarDays className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100">
                {data?.upcomingDates?.length || 0}
              </p>
              <p className="text-xs md:text-sm text-surface-400 mt-0.5">Upcoming</p>
            </div>
          </div>
        </Link>

        <Link to="/goals" className="glass-card p-5 md:p-6 group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0">
              <Target className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100">
                {data?.activeGoals?.length || 0}
              </p>
              <p className="text-xs md:text-sm text-surface-400 mt-0.5">Active Goals</p>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Daily Progress */}
      <motion.div variants={fadeUp} className="glass-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg text-surface-900 dark:text-surface-100 flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-accent-500" />
            Daily Progress
          </h2>
          <span className="text-2xl md:text-3xl font-bold gradient-text">{progress.overall}%</span>
        </div>
        <div className="progress-bar mb-6">
          <div className="progress-fill" style={{ width: `${progress.overall}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm font-medium text-surface-500">Tasks</p>
            <p className="text-xl font-bold text-surface-900 dark:text-surface-100 mt-1">{progress.tasks}%</p>
          </div>
          <div>
            <p className="text-sm font-medium text-surface-500">Habits</p>
            <p className="text-xl font-bold text-surface-900 dark:text-surface-100 mt-1">{progress.habits}%</p>
          </div>
          <div>
            <p className="text-sm font-medium text-surface-500">Priorities</p>
            <p className="text-xl font-bold text-surface-900 dark:text-surface-100 mt-1">{progress.priorities}%</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Priority Tasks */}
        <motion.div variants={fadeUp} className="glass-card p-6 md:p-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Today's Tasks
            </h2>
            <Link
              to="/tasks"
              className="text-xs text-accent-500 hover:text-accent-400 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {data?.tasks && data.tasks.length > 0 ? (
            <div className="space-y-2">
              {data.tasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors group"
                >
                  <button
                    onClick={() => handleToggleTask(task._id, task.status)}
                    className="mt-0.5 shrink-0"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-surface-300 dark:text-surface-600 group-hover:text-accent-400" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${task.status === 'completed'
                        ? 'line-through text-surface-400'
                        : 'text-surface-900 dark:text-surface-100'
                        }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md priority-${task.priority}`}
                      >
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="text-xs text-surface-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDateShort(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-surface-400 text-center py-8">
              No tasks for today. You're clear! 🎉
            </p>
          )}
        </motion.div>

        {/* Habits */}
        <motion.div variants={fadeUp} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Today's Habits
            </h2>
            <Link
              to="/habits"
              className="text-xs text-accent-500 hover:text-accent-400 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {data?.habits && data.habits.length > 0 ? (
            <div className="space-y-2">
              {data.habits.map((habit) => (
                <div
                  key={habit._id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors group"
                >
                  <button onClick={() => handleToggleHabit(habit._id)} className="shrink-0">
                    {habit.completedToday ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-surface-300 dark:text-surface-600 group-hover:text-green-400" />
                    )}
                  </button>
                  <span
                    className={`text-sm font-medium flex-1 ${habit.completedToday
                      ? 'line-through text-surface-400'
                      : 'text-surface-900 dark:text-surface-100'
                      }`}
                  >
                    {habit.name}
                  </span>
                  {habit.currentStreak > 0 && (
                    <span className="text-xs text-orange-500 flex items-center gap-1">
                      <Flame className="w-3 h-3" /> {habit.currentStreak}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-surface-400 text-center py-8">
              No habits yet. Start building consistency!
            </p>
          )}
        </motion.div>

        {/* Upcoming Dates */}
        <motion.div variants={fadeUp} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-500" />
              Upcoming
            </h2>
            <Link
              to="/dates"
              className="text-xs text-accent-500 hover:text-accent-400 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {data?.upcomingDates && data.upcomingDates.length > 0 ? (
            <div className="space-y-2">
              {data.upcomingDates.slice(0, 5).map((d) => {
                const urgency = getUrgency(d.date);
                return (
                  <div
                    key={d._id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${urgency.level === 'today'
                        ? 'bg-red-500'
                        : urgency.level === 'tomorrow'
                          ? 'bg-orange-500'
                          : urgency.level === 'soon'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                        {d.title}
                      </p>
                      <p className={`text-xs ${urgency.color}`}>{urgency.label}</p>
                    </div>
                    <span className="text-xs text-surface-400 shrink-0">
                      {formatDateShort(d.date)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-surface-400 text-center py-8">
              No upcoming events. All clear ahead!
            </p>
          )}
        </motion.div>

        {/* Active Goals */}
        <motion.div variants={fadeUp} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              Active Goals
            </h2>
            <Link
              to="/goals"
              className="text-xs text-accent-500 hover:text-accent-400 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {data?.activeGoals && data.activeGoals.length > 0 ? (
            <div className="space-y-3">
              {data.activeGoals.map((goal) => (
                <div key={goal._id} className="p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                      {goal.title}
                    </p>
                    <span className="text-xs font-semibold text-accent-500">{goal.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${goal.progress}%`,
                        background: goal.color || undefined,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-surface-400 text-center py-8">
              No active goals. Create something worth working toward!
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
