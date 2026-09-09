import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable) {
        // Allow Escape always
        if (e.key !== 'Escape') return;
      }

      const key = [
        e.ctrlKey || e.metaKey ? 'mod' : '',
        e.shiftKey ? 'shift' : '',
        e.key.toLowerCase(),
      ]
        .filter(Boolean)
        .join('+');

      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }

      // Also try without mod prefix for single-key shortcuts
      if (shortcuts[e.key.toLowerCase()] && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        shortcuts[e.key.toLowerCase()]();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
}
