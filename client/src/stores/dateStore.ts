import { create } from 'zustand';
import type { ImportantDate } from '../types';
import { dateService } from '../services/dateService';

interface DateState {
  dates: ImportantDate[];
  isLoading: boolean;
  error: string | null;
  fetchDates: (params?: { type?: string; upcoming?: string }) => Promise<void>;
  createDate: (date: Partial<ImportantDate>) => Promise<void>;
  updateDate: (id: string, updates: Partial<ImportantDate>) => Promise<void>;
  deleteDate: (id: string) => Promise<void>;
}

export const useDateStore = create<DateState>((set) => ({
  dates: [],
  isLoading: false,
  error: null,

  fetchDates: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const dates = await dateService.getAll(params);
      set({ dates, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch dates', isLoading: false });
    }
  },

  createDate: async (date) => {
    try {
      const newDate = await dateService.create(date);
      set((state) => ({ dates: [...state.dates, newDate].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create date');
    }
  },

  updateDate: async (id, updates) => {
    try {
      const updated = await dateService.update(id, updates);
      set((state) => ({
        dates: state.dates.map((d) => (d._id === id ? updated : d)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update date');
    }
  },

  deleteDate: async (id) => {
    try {
      await dateService.delete(id);
      set((state) => ({ dates: state.dates.filter((d) => d._id !== id) }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete date');
    }
  },
}));
