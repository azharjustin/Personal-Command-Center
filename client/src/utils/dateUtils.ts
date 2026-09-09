import {
  format,
  formatDistanceToNow,
  isToday,
  isTomorrow,
  differenceInDays,
  startOfDay,
} from 'date-fns';

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy');
}

export function formatDateShort(date: string | Date): string {
  return format(new Date(date), 'MMM d');
}

export function formatRelativeDate(date: string | Date): string {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return formatDistanceToNow(d, { addSuffix: true });
}

export function getUrgency(date: string | Date): {
  level: 'today' | 'tomorrow' | 'soon' | 'later';
  label: string;
  color: string;
} {
  const d = startOfDay(new Date(date));
  const today = startOfDay(new Date());
  const days = differenceInDays(d, today);

  if (days <= 0) return { level: 'today', label: 'Due today', color: 'text-red-500' };
  if (days === 1) return { level: 'tomorrow', label: 'Due tomorrow', color: 'text-orange-500' };
  if (days <= 3) return { level: 'soon', label: `Due in ${days} days`, color: 'text-yellow-500' };
  return { level: 'later', label: `Due in ${days} days`, color: 'text-green-500' };
}

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getWeekDates(): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return format(d, 'yyyy-MM-dd');
  });
}
