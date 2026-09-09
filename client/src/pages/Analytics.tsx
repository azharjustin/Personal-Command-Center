import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CheckSquare, Repeat, Target, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { dashboardService } from '../services/dashboardService';
import type { WeeklyAnalytics } from '../types';
import toast from 'react-hot-toast';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function Analytics() {
  const [data, setData] = useState<WeeklyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const analytics = await dashboardService.getWeeklyAnalytics();
        setData(analytics);
      } catch {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 skeleton" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 skeleton" />
          <div className="h-64 skeleton" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="space-y-6 animate-fadeIn">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Analytics</h1>
        <p className="text-sm text-surface-400 mt-1">Your weekly productivity overview</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{data.totalTasksCompleted}</p>
              <p className="text-xs text-surface-400">Tasks Done</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Repeat className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{data.totalHabitCompletions}</p>
              <p className="text-xs text-surface-400">Habits Done</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{data.avgGoalProgress}%</p>
              <p className="text-xs text-surface-400">Goal Progress</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent-500" />
            </div>
            <div>
              <p className="text-2xl font-bold gradient-text">{data.productivityScore}%</p>
              <p className="text-xs text-surface-400">Productivity</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by Day */}
        <motion.div variants={fadeUp} className="glass-card p-5">
          <h2 className="font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" /> Tasks Completed
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.tasksByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: '12px', color: '#f1f5f9', fontSize: '13px' }}
                  cursor={{ fill: 'rgba(99,102,241,0.05)' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Habit Completion Rate */}
        <motion.div variants={fadeUp} className="glass-card p-5">
          <h2 className="font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
            <Repeat className="w-5 h-5 text-green-500" /> Habit Completion
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.habitsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{ background: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: '12px', color: '#f1f5f9', fontSize: '13px' }}
                  formatter={(value: any) => [`${value}%`, 'Completion']}
                />
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="rate" stroke="#22c55e" fill="url(#greenGradient)" strokeWidth={2} name="Rate" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Productivity Trend */}
      <motion.div variants={fadeUp} className="glass-card p-5">
        <h2 className="font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent-500" /> Weekly Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-surface-900 dark:text-surface-100">{data.totalTasksCompleted}</p>
            <p className="text-sm text-surface-400 mt-1">Tasks Completed</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-surface-900 dark:text-surface-100">{data.habitCompletionRate}%</p>
            <p className="text-sm text-surface-400 mt-1">Habit Rate</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-surface-900 dark:text-surface-100">{data.avgGoalProgress}%</p>
            <p className="text-sm text-surface-400 mt-1">Goal Progress</p>
          </div>
          <div>
            <p className="text-3xl font-bold gradient-text">{data.productivityScore}%</p>
            <p className="text-sm text-surface-400 mt-1">Productivity Score</p>
          </div>
        </div>
        <p className="text-xs text-surface-400 mt-4 text-center">
          Score = Tasks (40%) + Habits (30%) + Goals (30%)
        </p>
      </motion.div>
    </motion.div>
  );
}
