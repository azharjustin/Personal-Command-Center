import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  CheckSquare,
  Target,
  Repeat,
  CalendarDays,
  StickyNote,
  LayoutDashboard,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickAdd: (type: 'task' | 'goal' | 'habit' | 'date' | 'note') => void;
}

const quickActions = [
  { type: 'task' as const, icon: CheckSquare, label: 'New Task', shortcut: 'T' },
  { type: 'goal' as const, icon: Target, label: 'New Goal', shortcut: 'G' },
  { type: 'habit' as const, icon: Repeat, label: 'New Habit', shortcut: 'H' },
  { type: 'date' as const, icon: CalendarDays, label: 'New Date', shortcut: 'D' },
  { type: 'note' as const, icon: StickyNote, label: 'New Note', shortcut: 'N' },
];

const navActions = [
  { path: '/', icon: LayoutDashboard, label: 'Go to Dashboard' },
  { path: '/tasks', icon: CheckSquare, label: 'Go to Tasks' },
  { path: '/goals', icon: Target, label: 'Go to Goals' },
  { path: '/habits', icon: Repeat, label: 'Go to Habits' },
  { path: '/dates', icon: CalendarDays, label: 'Go to Dates' },
  { path: '/notes', icon: StickyNote, label: 'Go to Notes' },
  { path: '/analytics', icon: BarChart3, label: 'Go to Analytics' },
  { path: '/settings', icon: Settings, label: 'Go to Settings' },
];

export default function CommandPalette({ isOpen, onClose, onQuickAdd }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const filteredQuick = quickActions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );
  const filteredNav = navActions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleAction = (action: (typeof quickActions)[0]) => {
    onQuickAdd(action.type);
    onClose();
  };

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-lg mx-4 bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3.5 px-5 border-b border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50">
              <Search className="w-5 h-5 text-surface-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search or create..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 command-palette-input text-base font-medium text-surface-900 dark:text-surface-100 placeholder:text-surface-400"
                id="command-palette-input"
              />
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-200/60 dark:hover:bg-surface-800 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-3">
              {/* Quick Add */}
              {filteredQuick.length > 0 && (
                <div className="mb-3">
                  <p className="text-[11px] font-bold text-surface-400 uppercase tracking-wider px-3 py-1.5">
                    Quick Add
                  </p>
                  {filteredQuick.map((action) => (
                    <button
                      key={action.type}
                      onClick={() => handleAction(action)}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800/80 transition-colors cursor-pointer group"
                    >
                      <Plus className="w-4 h-4 text-accent-500 group-hover:scale-110 transition-transform shrink-0" />
                      <action.icon className="w-4 h-4 text-surface-400 group-hover:text-surface-600 dark:group-hover:text-surface-200 shrink-0" />
                      <span className="flex-1 text-left">{action.label}</span>
                      <kbd className="text-[11px] font-semibold bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded-md font-mono text-surface-400 border border-surface-200/60 dark:border-surface-700/60">
                        {action.shortcut}
                      </kbd>
                    </button>
                  ))}
                </div>
              )}

              {/* Navigation */}
              {filteredNav.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-surface-400 uppercase tracking-wider px-3 py-1.5">
                    Navigate
                  </p>
                  {filteredNav.map((action) => (
                    <button
                      key={action.path}
                      onClick={() => handleNav(action.path)}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800/80 transition-colors cursor-pointer group"
                    >
                      <action.icon className="w-4 h-4 text-surface-400 group-hover:text-accent-500 shrink-0 transition-colors" />
                      <span className="flex-1 text-left">{action.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {filteredQuick.length === 0 && filteredNav.length === 0 && (
                <p className="text-center text-sm text-surface-400 py-8">
                  No results found for "{query}"
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-5 px-5 py-3 border-t border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50 text-xs font-medium text-surface-400">
              <span className="flex items-center gap-1.5"><kbd className="bg-surface-200/60 dark:bg-surface-800 px-1.5 py-0.5 rounded font-mono">↑↓</kbd> Navigate</span>
              <span className="flex items-center gap-1.5"><kbd className="bg-surface-200/60 dark:bg-surface-800 px-1.5 py-0.5 rounded font-mono">↵</kbd> Select</span>
              <span className="flex items-center gap-1.5 ml-auto"><kbd className="bg-surface-200/60 dark:bg-surface-800 px-1.5 py-0.5 rounded font-mono">ESC</kbd> Close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
