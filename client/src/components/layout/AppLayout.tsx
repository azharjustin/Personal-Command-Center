import { useState, useCallback, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import CommandPalette from '../command/CommandPalette';
import { useSettingsStore } from '../../stores/settingsStore';
import { Toaster } from 'react-hot-toast';

export default function AppLayout() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<string | null>(null);
  const { sidebarCollapsed, applyTheme } = useSettingsStore();
  const navigate = useNavigate();

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && commandOpen) {
        setCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandOpen]);

  const handleQuickAdd = useCallback(
    (type: 'task' | 'goal' | 'habit' | 'date' | 'note') => {
      setQuickAddType(type);
      // Navigate to the appropriate page with create mode
      const routes: Record<string, string> = {
        task: '/tasks',
        goal: '/goals',
        habit: '/habits',
        date: '/dates',
        note: '/notes',
      };
      navigate(routes[type], { state: { openCreate: true } });
    },
    [navigate]
  );

  return (
    <div className="min-h-screen">
      <Sidebar />

      <div
        className={`main-content-layout ${
          sidebarCollapsed ? 'collapsed' : ''
        }`}
      >
        <TopBar onOpenCommand={() => setCommandOpen(true)} />

        <main className="p-6 md:p-8 lg:p-10 pb-28 lg:pb-12 min-h-[calc(100vh-72px)]">
          <Outlet context={{ quickAddType, setQuickAddType }} />
        </main>
      </div>

      <MobileNav />

      <CommandPalette
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
        onQuickAdd={handleQuickAdd}
      />

      <Toaster
        position="bottom-right"
        toastOptions={{
          className: '!bg-white dark:!bg-surface-800 !text-surface-900 dark:!text-surface-100 !shadow-lg !border !border-surface-200 dark:!border-surface-700 !rounded-xl',
          duration: 3000,
        }}
      />
    </div>
  );
}
