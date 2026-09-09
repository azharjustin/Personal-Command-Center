import api from '../lib/api';
import type { AuthResponse } from '../types';

export const authService = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  getMe: async (): Promise<{ user: AuthResponse['user'] }> => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};
