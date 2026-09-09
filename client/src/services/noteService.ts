import api from '../lib/api';
import type { Note } from '../types';

export const noteService = {
  getAll: async (params?: { search?: string; tag?: string }): Promise<Note[]> => {
    const { data } = await api.get('/notes', { params });
    return data;
  },

  create: async (note: Partial<Note>): Promise<Note> => {
    const { data } = await api.post('/notes', note);
    return data;
  },

  update: async (id: string, updates: Partial<Note>): Promise<Note> => {
    const { data } = await api.put(`/notes/${id}`, updates);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },
};
