import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, StickyNote, Trash2, Search, Tag, X } from 'lucide-react';
import { useNoteStore } from '../stores/noteStore';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import type { Note } from '../types';

export default function Notes() {
  const { notes, isLoading, fetchNotes, createNote, updateNote, deleteNote } = useNoteStore();
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', tags: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => { fetchNotes({ search: searchQuery || undefined, tag: selectedTag || undefined }); }, [fetchNotes, searchQuery, selectedTag]);

  const allTags = [...new Set(notes.flatMap((n) => n.tags))];

  const resetForm = () => { setFormData({ title: '', content: '', tags: '' }); setEditingNote(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error('Note title is required'); return; }
    const tags = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
    try {
      if (editingNote) { await updateNote(editingNote._id, { title: formData.title, content: formData.content, tags }); toast.success('Note updated'); }
      else { await createNote({ title: formData.title, content: formData.content, tags }); toast.success('Note created'); }
      setShowForm(false); resetForm();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content, tags: note.tags.join(', ') });
    setShowForm(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Notes</h1>
          <p className="text-sm text-surface-400 mt-1">{notes.length} notes</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium transition-colors" id="add-note-button">
          <Plus className="w-4 h-4" /> New Note
        </button>
      </div>

      {/* Search & Tags */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-surface-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="flex-1 bg-transparent outline-none text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400"
          />
          {searchQuery && <button onClick={() => setSearchQuery('')}><X className="w-3 h-3 text-surface-400" /></button>}
        </div>
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-surface-400" />
            {allTags.map((tag) => (
              <button key={tag} onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)} className={`text-xs px-2 py-1 rounded-lg transition-colors ${selectedTag === tag ? 'bg-accent-500 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-500 hover:text-surface-700'}`}>
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-36 skeleton" />)}
        </div>
      ) : notes.length === 0 ? (
        <EmptyState icon={StickyNote} title="Nothing here yet" description="Capture an idea before it disappears." action={{ label: '+ New Note', onClick: () => { resetForm(); setShowForm(true); } }} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <motion.div key={note._id} layout className="glass-card p-5 group cursor-pointer" onClick={() => handleEdit(note)}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-surface-900 dark:text-surface-100 line-clamp-1">{note.title}</h3>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); deleteNote(note._id); toast.success('Note deleted'); }} className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-surface-400 line-clamp-3 mb-3 whitespace-pre-wrap">{note.content || 'No content...'}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {note.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-md bg-accent-500/10 text-accent-500">{tag}</span>
                  ))}
                </div>
                <span className="text-[10px] text-surface-400">{format(new Date(note.updatedAt), 'MMM d')}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); resetForm(); }} title={editingNote ? 'Edit Note' : 'New Note'} size="lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6">
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Note title" autoFocus required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">Content</label>
            <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="font-mono" rows={8} placeholder="Write your note..." />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">Tags (comma-separated)</label>
            <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="e.g., react, ideas, research" />
          </div>
          <div className="modal-footer-container">
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-medium-secondary">Cancel</button>
            <button type="submit" className="btn-medium-primary">{editingNote ? 'Update Note' : 'Create Note'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
