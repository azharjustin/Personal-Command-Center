import api from '../lib/api';
import type { Habit } from '../types';

export const habitService = {
  getAll: async (): Promise<Habit[]> => {
    const { data } = await api.get('/habits');
    return data;
  },

  create: async (habit: Partial<Habit>): Promise<Habit> => {
    const { data } = await api.post('/habits', habit);
    return data;
  },

  update: async (id: string, updates: Partial<Habit>): Promise<Habit> => {
    const { data } = await api.put(`/habits/${id}`, updates);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/habits/${id}`);
  },

  toggle: async (id: string, date: string): Promise<Habit> => {
    const { data } = await api.post(`/habits/${id}/toggle`, { date });
    return data;
  },
};
