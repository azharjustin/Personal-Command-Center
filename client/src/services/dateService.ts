import api from '../lib/api';
import type { ImportantDate } from '../types';

export const dateService = {
  getAll: async (params?: { type?: string; upcoming?: string }): Promise<ImportantDate[]> => {
    const { data } = await api.get('/dates', { params });
    return data;
  },

  create: async (date: Partial<ImportantDate>): Promise<ImportantDate> => {
    const { data } = await api.post('/dates', date);
    return data;
  },

  update: async (id: string, updates: Partial<ImportantDate>): Promise<ImportantDate> => {
    const { data } = await api.put(`/dates/${id}`, updates);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/dates/${id}`);
  },
};
