import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Repeat,
  CalendarDays,
  StickyNote,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Logo from '../ui/Logo';
import { useSettingsStore } from '../../stores/settingsStore';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/habits', icon: Repeat, label: 'Habits' },
  { to: '/dates', icon: CalendarDays, label: 'Dates' },
  { to: '/notes', icon: StickyNote, label: 'Notes' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useSettingsStore();

  return (
    <aside
      className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen z-30 sidebar-container ${
        sidebarCollapsed ? 'collapsed' : ''
      } bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-r border-surface-200 dark:border-surface-800`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-18 border-b border-surface-200 dark:border-surface-800">
        <Logo size="sm" />
        {!sidebarCollapsed && (
          <div className="animate-fadeIn">
            <h1 className="text-sm font-bold tracking-tight gradient-text">COMMAND</h1>
            <p className="text-[10px] font-semibold text-surface-400 tracking-widest">CENTER</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${sidebarCollapsed ? 'justify-center px-3' : ''}`
            }
            title={sidebarCollapsed ? label : undefined}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!sidebarCollapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Settings + Collapse */}
      <div className="px-3 pb-4 space-y-1 border-t border-surface-200 dark:border-surface-800 pt-4">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''} ${sidebarCollapsed ? 'justify-center px-3' : ''}`
          }
          title={sidebarCollapsed ? 'Settings' : undefined}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!sidebarCollapsed && <span>Settings</span>}
        </NavLink>

        <button
          onClick={toggleSidebar}
          className={`sidebar-link w-full ${sidebarCollapsed ? 'justify-center px-3' : ''}`}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
