// ─── Task ───────────────────────────────────────────
export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: string;
  category?: string;
  order: number;
  isPriority: boolean;
  completedAt?: string;
  createdAt: string;
}

export type TaskFormData = Omit<Task, '_id' | 'createdAt' | 'completedAt' | 'order'>;

// ─── Goal ───────────────────────────────────────────
export interface Goal {
  _id: string;
  title: string;
  description?: string;
  targetDate?: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  color: string;
  createdAt: string;
}

export type GoalFormData = Omit<Goal, '_id' | 'createdAt'>;

// ─── Habit ──────────────────────────────────────────
export interface Habit {
  _id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'custom';
  currentStreak: number;
  longestStreak: number;
  completionHistory: string[];
  color: string;
  createdAt: string;
  completedToday?: boolean;
}

export type HabitFormData = Omit<Habit, '_id' | 'createdAt' | 'currentStreak' | 'longestStreak' | 'completionHistory' | 'completedToday'>;

// ─── Note ───────────────────────────────────────────
export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type NoteFormData = Omit<Note, '_id' | 'createdAt' | 'updatedAt'>;

// ─── Important Date ─────────────────────────────────
export interface ImportantDate {
  _id: string;
  title: string;
  date: string;
  type: 'deadline' | 'event' | 'personal' | 'other';
  description?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export type DateFormData = Omit<ImportantDate, '_id' | 'createdAt'>;

// ─── User / Auth ────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ─── Dashboard ──────────────────────────────────────
export interface DashboardData {
  tasks: Task[];
  completedToday: number;
  totalTodayTasks: number;
  activeGoals: Goal[];
  habits: Habit[];
  completedHabits: number;
  totalHabits: number;
  upcomingDates: ImportantDate[];
  recentNotes: Note[];
  priorities: Task[];
  progress: {
    tasks: number;
    habits: number;
    priorities: number;
    overall: number;
  };
}

// ─── Analytics ──────────────────────────────────────
export interface WeeklyAnalytics {
  tasksByDay: { day: string; count: number; date: string }[];
  habitsByDay: { day: string; completed: number; total: number; rate: number }[];
  totalTasksCompleted: number;
  totalHabitCompletions: number;
  habitCompletionRate: number;
  avgGoalProgress: number;
  productivityScore: number;
  goalsCount: number;
}

// ─── Settings ───────────────────────────────────────
export type Theme = 'light' | 'dark' | 'system';

export interface Settings {
  theme: Theme;
  sidebarCollapsed: boolean;
}
