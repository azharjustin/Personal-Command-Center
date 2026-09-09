import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Repeat, Flame, CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react';
import { useHabitStore } from '../stores/habitStore';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { getTodayString, getWeekDates } from '../utils/dateUtils';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import type { Habit } from '../types';

export default function Habits() {
  const { habits, isLoading, fetchHabits, createHabit, updateHabit, deleteHabit, toggleHabit } = useHabitStore();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [formData, setFormData] = useState<{ name: string; frequency: 'daily' | 'weekly' | 'custom'; color: string }>({ name: '', frequency: 'daily', color: '#10b981' });
  const todayStr = getTodayString();
  const weekDates = getWeekDates();
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  useEffect(() => { fetchHabits(); }, [fetchHabits]);

  const resetForm = () => { setFormData({ name: '', frequency: 'daily', color: '#10b981' }); setEditingHabit(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error('Habit name is required'); return; }
    try {
      if (editingHabit) { await updateHabit(editingHabit._id, formData); toast.success('Habit updated'); }
      else { await createHabit(formData); toast.success('Habit created'); }
      setShowForm(false); resetForm();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleToggle = async (id: string) => {
    try { await toggleHabit(id, todayStr); } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Habits</h1>
          <p className="text-sm text-surface-400 mt-1">
            {habits.filter((h) => h.completionHistory.includes(todayStr)).length}/{habits.length} completed today
          </p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium transition-colors" id="add-habit-button">
          <Plus className="w-4 h-4" /> Add Habit
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton" />)}</div>
      ) : habits.length === 0 ? (
        <EmptyState icon={Repeat} title="No habits yet" description="Start building consistency. Create your first habit." action={{ label: '+ New Habit', onClick: () => { resetForm(); setShowForm(true); } }} />
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => {
            const completedToday = habit.completionHistory.includes(todayStr);
            const completionRate = habit.completionHistory.length > 0
              ? Math.round((habit.completionHistory.length / Math.max(1, Math.ceil((Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)))) * 100)
              : 0;

            return (
              <motion.div key={habit._id} layout className="glass-card p-5 group">
                <div className="flex items-center gap-4">
                  <button onClick={() => handleToggle(habit._id)} className="shrink-0">
                    {completedToday ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-surface-300 dark:text-surface-600 group-hover:text-green-400 transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${completedToday ? 'line-through text-surface-400' : 'text-surface-900 dark:text-surface-100'}`}>
                        {habit.name}
                      </h3>
                      {habit.currentStreak > 0 && (
                        <span className="flex items-center gap-1 text-xs text-orange-500 font-medium">
                          <Flame className="w-3.5 h-3.5" /> {habit.currentStreak} day streak
                        </span>
                      )}
                    </div>

                    {/* Weekly calendar */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {weekDates.map((date, i) => {
                        const isCompleted = habit.completionHistory.includes(date);
                        const isToday = date === todayStr;
                        return (
                          <div key={date} className="flex flex-col items-center gap-0.5">
                            <span className="text-[9px] text-surface-400">{dayLabels[i]}</span>
                            <button
                              onClick={() => toggleHabit(habit._id, date)}
                              className={`w-7 h-7 rounded-lg text-xs font-medium flex items-center justify-center transition-all ${
                                isCompleted
                                  ? 'bg-green-500/20 text-green-500'
                                  : isToday
                                  ? 'bg-accent-500/10 text-accent-500 ring-1 ring-accent-500/30'
                                  : 'bg-surface-100 dark:bg-surface-800 text-surface-400'
                              }`}
                            >
                              {isCompleted ? '✓' : format(new Date(date), 'd')}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-surface-400">
                      <span>Best: {habit.longestStreak} days</span>
                      <span>Rate: {Math.min(completionRate, 100)}%</span>
                      <span className="capitalize">{habit.frequency}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => { setEditingHabit(habit); setFormData({ name: habit.name, frequency: habit.frequency, color: habit.color }); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-accent-500 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => { deleteHabit(habit._id); toast.success('Habit deleted'); }} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); resetForm(); }} title={editingHabit ? 'Edit Habit' : 'Create Habit'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6">
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">Name *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Exercise, Read, Meditate" autoFocus required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">Frequency</label>
            <select value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="modal-footer-container">
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-medium-secondary">Cancel</button>
            <button type="submit" className="btn-medium-primary">{editingHabit ? 'Update Habit' : 'Create Habit'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
