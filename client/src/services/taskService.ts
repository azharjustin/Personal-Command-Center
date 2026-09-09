import api from '../lib/api';
import type { Task } from '../types';

export const taskService = {
  getAll: async (params?: { status?: string; priority?: string; sort?: string }): Promise<Task[]> => {
    const { data } = await api.get('/tasks', { params });
    return data;
  },

  create: async (task: Partial<Task>): Promise<Task> => {
    const { data } = await api.post('/tasks', task);
    return data;
  },

  update: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const { data } = await api.put(`/tasks/${id}`, updates);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  reorder: async (orderedIds: string[]): Promise<Task[]> => {
    const { data } = await api.patch('/tasks/reorder', { orderedIds });
    return data;
  },
};
