import { create } from 'zustand';
import type { Habit } from '../types';
import { habitService } from '../services/habitService';

interface HabitState {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
  fetchHabits: () => Promise<void>;
  createHabit: (habit: Partial<Habit>) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabit: (id: string, date: string) => Promise<void>;
}

export const useHabitStore = create<HabitState>((set) => ({
  habits: [],
  isLoading: false,
  error: null,

  fetchHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const habits = await habitService.getAll();
      set({ habits, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch habits', isLoading: false });
    }
  },

  createHabit: async (habit) => {
    try {
      const newHabit = await habitService.create(habit);
      set((state) => ({ habits: [newHabit, ...state.habits] }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create habit');
    }
  },

  updateHabit: async (id, updates) => {
    try {
      const updated = await habitService.update(id, updates);
      set((state) => ({
        habits: state.habits.map((h) => (h._id === id ? updated : h)),
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update habit');
    }
  },

  deleteHabit: async (id) => {
    try {
      await habitService.delete(id);
      set((state) => ({ habits: state.habits.filter((h) => h._id !== id) }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete habit');
    }
  },

  toggleHabit: async (id, date) => {
    try {
      const updated = await habitService.toggle(id, date);
      set((state) => ({
        habits: state.habits.map((h) => (h._id === id ? updated : h)),
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to toggle habit');
    }
  },
}));
