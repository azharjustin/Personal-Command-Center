import { Search, Sun, Moon, Monitor, LogOut } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useAuthStore } from '../../stores/authStore';
import Logo from '../ui/Logo';
import type { Theme } from '../../types';

interface TopBarProps {
  onOpenCommand: () => void;
}

const themeIcons: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const themeOrder: Theme[] = ['dark', 'light', 'system'];

export default function TopBar({ onOpenCommand }: TopBarProps) {
  const { theme, setTheme } = useSettingsStore();
  const { user, logout } = useAuthStore();

  const cycleTheme = () => {
    const idx = themeOrder.indexOf(theme);
    setTheme(themeOrder[(idx + 1) % themeOrder.length]);
  };

  const ThemeIcon = themeIcons[theme];

  return (
    <header className="h-18 flex items-center justify-between px-6 md:px-8 lg:px-10 border-b border-surface-200 dark:border-surface-800 bg-white/70 dark:bg-surface-950/70 backdrop-blur-xl sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1 max-w-xs md:max-w-md">
        {/* Mobile Logo */}
        <div className="lg:hidden">
          <Logo size="sm" />
        </div>

        {/* Search / Command */}
        <button
          onClick={onOpenCommand}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors text-sm w-full"
          id="search-trigger"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search or create...</span>
          <kbd className="hidden sm:inline ml-auto text-xs bg-surface-200 dark:bg-surface-700 px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <button
          onClick={cycleTheme}
          className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
          title={`Theme: ${theme}`}
          id="theme-toggle"
        >
          <ThemeIcon className="w-5 h-5" />
        </button>

        {user && (
          <div className="flex items-center gap-3 ml-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 hover:text-danger-500 transition-colors"
              title="Logout"
              id="logout-button"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
