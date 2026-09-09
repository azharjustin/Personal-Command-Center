import { create } from 'zustand';
import type { Goal } from '../types';
import { goalService } from '../services/goalService';

interface GoalState {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  createGoal: (goal: Partial<Goal>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const goals = await goalService.getAll();
      set({ goals, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch goals', isLoading: false });
    }
  },

  createGoal: async (goal) => {
    try {
      const newGoal = await goalService.create(goal);
      set((state) => ({ goals: [newGoal, ...state.goals] }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create goal');
    }
  },

  updateGoal: async (id, updates) => {
    try {
      const updated = await goalService.update(id, updates);
      set((state) => ({
        goals: state.goals.map((g) => (g._id === id ? updated : g)),
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update goal');
    }
  },

  deleteGoal: async (id) => {
    try {
      await goalService.delete(id);
      set((state) => ({ goals: state.goals.filter((g) => g._id !== id) }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete goal');
    }
  },
}));
