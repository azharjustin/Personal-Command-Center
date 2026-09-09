import { create } from 'zustand';
import type { Theme, Settings } from '../types';

interface SettingsState extends Settings {
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  applyTheme: () => void;
}

const getStoredSettings = (): Settings => {
  try {
    const stored = localStorage.getItem('pcc_settings');
    if (stored) return JSON.parse(stored);
  } catch {}
  return { theme: 'dark', sidebarCollapsed: false };
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...getStoredSettings(),

  setTheme: (theme) => {
    set({ theme });
    const settings = { theme, sidebarCollapsed: get().sidebarCollapsed };
    localStorage.setItem('pcc_settings', JSON.stringify(settings));
    get().applyTheme();
  },

  toggleSidebar: () => {
    const collapsed = !get().sidebarCollapsed;
    set({ sidebarCollapsed: collapsed });
    const settings = { theme: get().theme, sidebarCollapsed: collapsed };
    localStorage.setItem('pcc_settings', JSON.stringify(settings));
  },

  applyTheme: () => {
    const { theme } = get();
    const root = document.documentElement;

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  },
}));
