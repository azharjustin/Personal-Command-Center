import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  CheckSquare,
  Circle,
  CheckCircle2,
  GripVertical,
  Pencil,
  Trash2,
  Clock,
  Filter,
  X,
} from 'lucide-react';
import { useTaskStore } from '../stores/taskStore';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { formatDateShort } from '../utils/dateUtils';
import toast from 'react-hot-toast';
import type { Task } from '../types';

function SortableTaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass-card p-4 flex items-start gap-3 group"
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-1 cursor-grab active:cursor-grabbing text-surface-300 dark:text-surface-600 hover:text-surface-500 shrink-0"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <button onClick={onToggle} className="mt-0.5 shrink-0">
        {task.status === 'completed' ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <Circle className="w-5 h-5 text-surface-300 dark:text-surface-600 group-hover:text-accent-400 transition-colors" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            task.status === 'completed'
              ? 'line-through text-surface-400'
              : 'text-surface-900 dark:text-surface-100'
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-surface-400 mt-0.5 line-clamp-1">{task.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span
            className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md priority-${task.priority}`}
          >
            {task.priority}
          </span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-surface-100 dark:bg-surface-800 text-surface-500">
            {task.status.replace('-', ' ')}
          </span>
          {task.dueDate && (
            <span className="text-xs text-surface-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDateShort(task.dueDate)}
            </span>
          )}
          {task.category && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-accent-500/10 text-accent-500">
              {task.category}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-accent-500 transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function Tasks() {
  const { tasks, isLoading, fetchTasks, createTask, updateTask, deleteTask, toggleComplete, reorderTasks, setFilter, filter } = useTaskStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in-progress' | 'completed';
    dueDate: string;
    category: string;
    isPriority: boolean;
  }>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    category: '',
    isPriority: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const resetForm = () => {
    setFormData({ title: '', description: '', priority: 'medium', status: 'todo', dueDate: '', category: '', isPriority: false });
    setEditingTask(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
        toast.success('Task updated');
      } else {
        await createTask(formData);
        toast.success('Task created');
      }
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      category: task.category || '',
      isPriority: task.isPriority,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      toast.success('Task deleted');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t._id === active.id);
    const newIndex = tasks.findIndex((t) => t._id === over.id);

    const reordered = [...tasks];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    reorderTasks(reordered.map((t) => t._id));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Tasks</h1>
          <p className="text-sm text-surface-400 mt-1">
            {tasks.filter((t) => t.status !== 'completed').length} remaining ·{' '}
            {tasks.filter((t) => t.status === 'completed').length} completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl border transition-colors ${
              showFilters
                ? 'border-accent-500 text-accent-500 bg-accent-500/5'
                : 'border-surface-200 dark:border-surface-700 text-surface-500 hover:text-surface-700'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium transition-colors"
            id="add-task-button"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card p-4 flex flex-wrap gap-3"
        >
          <select
            value={filter.status || ''}
            onChange={(e) => setFilter({ status: e.target.value || undefined })}
            className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-sm text-surface-700 dark:text-surface-300 border-0 outline-none"
          >
            <option value="">All Status</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filter.priority || ''}
            onChange={(e) => setFilter({ priority: e.target.value || undefined })}
            className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-sm text-surface-700 dark:text-surface-300 border-0 outline-none"
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filter.sort || ''}
            onChange={(e) => setFilter({ sort: e.target.value || undefined })}
            className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-sm text-surface-700 dark:text-surface-300 border-0 outline-none"
          >
            <option value="">Default Sort</option>
            <option value="priority">By Priority</option>
            <option value="dueDate">By Due Date</option>
            <option value="newest">Newest First</option>
          </select>

          {(filter.status || filter.priority || filter.sort) && (
            <button
              onClick={() => setFilter({ status: undefined, priority: undefined, sort: undefined })}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-500/5 transition-colors"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </motion.div>
      )}

      {/* Task List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 skeleton" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks for today"
          description="You're clear. Add a task to get started."
          action={{ label: '+ Add Task', onClick: () => { resetForm(); setShowForm(true); } }}
        />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {tasks.map((task) => (
                <SortableTaskCard
                  key={task._id}
                  task={task}
                  onToggle={() => toggleComplete(task)}
                  onEdit={() => handleEdit(task)}
                  onDelete={() => handleDelete(task._id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); resetForm(); }}
        title={editingTask ? 'Edit Task' : 'Create Task'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-4.5">
          <div className="flex flex-col gap-1.5">
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What needs to be done?"
              autoFocus
              id="task-title-input"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              style={{ minHeight: '80px' }}
              placeholder="Add details..."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Work, Personal"
              />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer py-1.5 my-0.5 select-none">
            <input
              type="checkbox"
              checked={formData.isPriority}
              onChange={(e) => setFormData({ ...formData, isPriority: e.target.checked })}
              className="w-4.5 h-4.5 accent-accent-500 rounded cursor-pointer shrink-0"
            />
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Mark as daily priority</span>
          </label>
          <div className="modal-footer-container">
            <button
              type="button"
              onClick={() => { setShowForm(false); resetForm(); }}
              className="btn-medium-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-medium-primary"
            >
              {editingTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
