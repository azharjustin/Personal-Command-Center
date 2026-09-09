import { create } from 'zustand';
import type { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('pcc_user') || 'null'),
  token: localStorage.getItem('pcc_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('pcc_token', data.token);
      localStorage.setItem('pcc_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.register(name, email, password);
      localStorage.setItem('pcc_token', data.token);
      localStorage.setItem('pcc_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('pcc_token');
    localStorage.removeItem('pcc_user');
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('pcc_token');
    if (!token) {
      set({ user: null, token: null });
      return;
    }
    try {
      const data = await authService.getMe();
      set({ user: data.user, token });
    } catch {
      localStorage.removeItem('pcc_token');
      localStorage.removeItem('pcc_user');
      set({ user: null, token: null });
    }
  },

  clearError: () => set({ error: null }),
}));
