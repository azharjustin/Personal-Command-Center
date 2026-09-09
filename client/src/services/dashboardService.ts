import api from '../lib/api';
import type { DashboardData, WeeklyAnalytics } from '../types';

export const dashboardService = {
  getDashboard: async (): Promise<DashboardData> => {
    const { data } = await api.get('/dashboard');
    return data;
  },

  getWeeklyAnalytics: async (): Promise<WeeklyAnalytics> => {
    const { data } = await api.get('/dashboard/analytics/weekly');
    return data;
  },
};
