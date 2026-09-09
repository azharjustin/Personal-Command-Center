import { Sun, Moon, Monitor } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';
import type { Theme } from '../types';

const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export default function Settings() {
  const { theme, setTheme } = useSettingsStore();
  const { user } = useAuthStore();

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Settings</h1>
        <p className="text-sm text-surface-400 mt-1">Customize your Command Center</p>
      </div>

      {/* Profile */}
      <div className="glass-card p-5">
        <h2 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-surface-900 dark:text-surface-100">{user?.name}</p>
            <p className="text-sm text-surface-400">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="glass-card p-5">
        <h2 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Appearance</h2>
        <div className="grid grid-cols-3 gap-3">
          {themes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                theme === value
                  ? 'border-accent-500 bg-accent-500/5'
                  : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
              }`}
            >
              <Icon className={`w-6 h-6 ${theme === value ? 'text-accent-500' : 'text-surface-400'}`} />
              <span className={`text-sm font-medium ${theme === value ? 'text-accent-500' : 'text-surface-500'}`}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="glass-card p-5">
        <h2 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Keyboard Shortcuts</h2>
        <div className="space-y-3">
          {[
            { keys: 'Ctrl/⌘ + K', desc: 'Open command menu' },
            { keys: 'Escape', desc: 'Close modal / command menu' },
          ].map(({ keys, desc }) => (
            <div key={keys} className="flex items-center justify-between py-2">
              <span className="text-sm text-surface-600 dark:text-surface-300">{desc}</span>
              <kbd className="text-xs bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded-lg font-mono text-surface-500">{keys}</kbd>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="glass-card p-5">
        <h2 className="font-semibold text-surface-900 dark:text-surface-100 mb-2">About</h2>
        <p className="text-sm text-surface-400">
          Personal Command Center v1.0.0 — A personal productivity dashboard designed to answer: "What should I focus on today?"
        </p>
      </div>
    </div>
  );
}
