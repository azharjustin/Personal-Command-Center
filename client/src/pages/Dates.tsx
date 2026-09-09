import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CalendarDays, Pencil, Trash2 } from 'lucide-react';
import { useDateStore } from '../stores/dateStore';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { formatDate, getUrgency } from '../utils/dateUtils';
import toast from 'react-hot-toast';
import type { ImportantDate } from '../types';

const dateTypes = ['deadline', 'event', 'personal', 'other'] as const;
const typeEmojis: Record<string, string> = { deadline: '⏰', event: '📅', personal: '🎂', other: '📌' };

export default function Dates() {
  const { dates, isLoading, fetchDates, createDate, updateDate, deleteDate } = useDateStore();
  const [showForm, setShowForm] = useState(false);
  const [editingDate, setEditingDate] = useState<ImportantDate | null>(null);
  const [formData, setFormData] = useState<{ title: string; date: string; type: 'deadline' | 'event' | 'personal' | 'other'; description: string; priority: 'low' | 'medium' | 'high' }>({ title: '', date: '', type: 'other', description: '', priority: 'medium' });

  useEffect(() => { fetchDates(); }, [fetchDates]);

  const resetForm = () => { setFormData({ title: '', date: '', type: 'other', description: '', priority: 'medium' }); setEditingDate(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error('Title is required'); return; }
    if (!formData.date) { toast.error('Date is required'); return; }
    try {
      if (editingDate) { await updateDate(editingDate._id, formData); toast.success('Date updated'); }
      else { await createDate(formData); toast.success('Date created'); }
      setShowForm(false); resetForm();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleEdit = (d: ImportantDate) => {
    setEditingDate(d);
    setFormData({ title: d.title, date: d.date.split('T')[0], type: d.type, description: d.description || '', priority: d.priority });
    setShowForm(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Important Dates</h1>
          <p className="text-sm text-surface-400 mt-1">{dates.length} dates tracked</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium transition-colors" id="add-date-button">
          <Plus className="w-4 h-4" /> Add Date
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-20 skeleton" />)}</div>
      ) : dates.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No important dates" description="Never miss a deadline. Start tracking your important dates." action={{ label: '+ Add Date', onClick: () => { resetForm(); setShowForm(true); } }} />
      ) : (
        <div className="space-y-2">
          {dates.map((d) => {
            const urgency = getUrgency(d.date);
            return (
              <motion.div key={d._id} layout className="glass-card p-4 flex items-center gap-4 group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shrink-0 ${urgency.level === 'today' ? 'bg-red-500/10' : urgency.level === 'tomorrow' ? 'bg-orange-500/10' : urgency.level === 'soon' ? 'bg-yellow-500/10' : 'bg-green-500/10'}`}>
                  {typeEmojis[d.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-surface-900 dark:text-surface-100 truncate">{d.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs font-medium ${urgency.color}`}>{urgency.label}</span>
                    <span className="text-xs text-surface-400">· {formatDate(d.date)}</span>
                    <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-md bg-surface-100 dark:bg-surface-800 text-surface-500">{d.type}</span>
                  </div>
                  {d.description && <p className="text-xs text-surface-400 mt-1 line-clamp-1">{d.description}</p>}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => handleEdit(d)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-accent-500 transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => { deleteDate(d._id); toast.success('Date deleted'); }} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); resetForm(); }} title={editingDate ? 'Edit Date' : 'Add Important Date'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6">
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Project deadline" autoFocus required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">Date *</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}>
                {dateTypes.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} placeholder="Add details..." />
          </div>
          <div className="modal-footer-container">
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-medium-secondary">Cancel</button>
            <button type="submit" className="btn-medium-primary">{editingDate ? 'Update Date' : 'Save Date'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
