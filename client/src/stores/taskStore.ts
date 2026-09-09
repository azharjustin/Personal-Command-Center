import { create } from 'zustand';
import type { Task } from '../types';
import { taskService } from '../services/taskService';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filter: { status?: string; priority?: string; sort?: string };
  fetchTasks: () => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (task: Task) => Promise<void>;
  reorderTasks: (orderedIds: string[]) => Promise<void>;
  setFilter: (filter: Partial<TaskState['filter']>) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  filter: {},

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskService.getAll(get().filter);
      set({ tasks, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch tasks', isLoading: false });
    }
  },

  createTask: async (task) => {
    try {
      const newTask = await taskService.create(task);
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create task');
    }
  },

  updateTask: async (id, updates) => {
    try {
      const updated = await taskService.update(id, updates);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? updated : t)),
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update task');
    }
  },

  toggleComplete: async (task) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    try {
      const updated = await taskService.update(task._id, { status: newStatus });
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === task._id ? updated : t)),
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update task');
    }
  },

  deleteTask: async (id) => {
    try {
      await taskService.delete(id);
      set((state) => ({ tasks: state.tasks.filter((t) => t._id !== id) }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
  },

  reorderTasks: async (orderedIds) => {
    try {
      const tasks = await taskService.reorder(orderedIds);
      set({ tasks });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reorder tasks');
    }
  },

  setFilter: (filter) => {
    set((state) => ({ filter: { ...state.filter, ...filter } }));
    get().fetchTasks();
  },
}));
