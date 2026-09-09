import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Pencil, Trash2 } from 'lucide-react';
import { useGoalStore } from '../stores/goalStore';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';
import type { Goal } from '../types';

const goalColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#0ea5e9', '#6366f1'];

export default function Goals() {
  const { goals, isLoading, fetchGoals, createGoal, updateGoal, deleteGoal } = useGoalStore();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState<{ title: string; description: string; targetDate: string; progress: number; color: string; status: 'not-started' | 'in-progress' | 'completed' }>({ title: '', description: '', targetDate: '', progress: 0, color: '#6366f1', status: 'not-started' });

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const resetForm = () => {
    setFormData({ title: '', description: '', targetDate: '', progress: 0, color: '#6366f1', status: 'not-started' });
    setEditingGoal(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error('Goal title is required'); return; }
    try {
      if (editingGoal) {
        await updateGoal(editingGoal._id, formData);
        toast.success('Goal updated');
      } else {
        await createGoal(formData);
        toast.success('Goal created');
      }
      setShowForm(false);
      resetForm();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      targetDate: goal.targetDate ? goal.targetDate.split('T')[0] : '',
      progress: goal.progress,
      color: goal.color,
      status: goal.status,
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Goals</h1>
          <p className="text-sm text-surface-400 mt-1">
            {goals.filter((g) => g.status !== 'completed').length} active ·{' '}
            {goals.filter((g) => g.status === 'completed').length} completed
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium transition-colors"
          id="add-goal-button"
        >
          <Plus className="w-4 h-4" /> Add Goal
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-40 skeleton" />)}
        </div>
      ) : goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No active goals"
          description="Create something worth working toward."
          action={{ label: '+ Create Goal', onClick: () => { resetForm(); setShowForm(true); } }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <motion.div
              key={goal._id}
              layout
              className="glass-card p-5 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: goal.color }} />
                  <h3 className="font-semibold text-surface-900 dark:text-surface-100">{goal.title}</h3>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(goal)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-accent-500 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => { deleteGoal(goal._id); toast.success('Goal deleted'); }} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {goal.description && (
                <p className="text-xs text-surface-400 mb-3 line-clamp-2">{goal.description}</p>
              )}

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-surface-400">
                  {goal.status === 'completed' ? 'Completed' : goal.targetDate ? `Due ${formatDate(goal.targetDate)}` : 'No deadline'}
                </span>
                <span className="text-sm font-bold" style={{ color: goal.color }}>{goal.progress}%</span>
              </div>

              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${goal.progress}%`, background: goal.color }} />
              </div>

              {/* Quick progress slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={goal.progress}
                onChange={(e) => updateGoal(goal._id, { progress: parseInt(e.target.value) })}
                className="w-full mt-3 accent-accent-500 h-1 cursor-pointer"
                title="Adjust progress"
              />
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); resetForm(); }} title={editingGoal ? 'Edit Goal' : 'Create Goal'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6">
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="What do you want to achieve?" autoFocus required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="Describe your goal..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">Target Date</label>
              <input type="date" value={formData.targetDate} onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">Progress</label>
              <input type="number" min="0" max="100" value={formData.progress} onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">Color</label>
            <div className="flex gap-3.5 flex-wrap pt-1">
              {goalColors.map((c) => (
                <button key={c} type="button" onClick={() => setFormData({ ...formData, color: c })} className={`w-8 h-8 rounded-full transition-transform cursor-pointer ${formData.color === c ? 'scale-110 ring-2 ring-offset-2 ring-accent-500 dark:ring-offset-surface-900' : 'hover:scale-105'}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="modal-footer-container">
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-medium-secondary">Cancel</button>
            <button type="submit" className="btn-medium-primary">{editingGoal ? 'Update Goal' : 'Create Goal'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
