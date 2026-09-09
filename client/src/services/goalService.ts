import api from '../lib/api';
import type { Goal } from '../types';

export const goalService = {
  getAll: async (params?: { status?: string }): Promise<Goal[]> => {
    const { data } = await api.get('/goals', { params });
    return data;
  },

  create: async (goal: Partial<Goal>): Promise<Goal> => {
    const { data } = await api.post('/goals', goal);
    return data;
  },

  update: async (id: string, updates: Partial<Goal>): Promise<Goal> => {
    const { data } = await api.put(`/goals/${id}`, updates);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/goals/${id}`);
  },
};
