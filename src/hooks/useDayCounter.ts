import { useState } from 'react';

const STORAGE_KEY = 'cognito.dayCounter.v1';

interface DayCounterState {
  count: number;
  lastActive: string; // YYYY-MM-DD
}

const todayKey = () => new Date().toISOString().slice(0, 10);

const read = (): DayCounterState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as DayCounterState;
  } catch {
    /* ignore */
  }
  return { count: 0, lastActive: '' };
};

/**
 * Tracks consecutive days of app use (a gentle, non-shaming streak).
 * Returns the current day count. Persists to localStorage.
 */
export function useDayCounter(): number {
  const [count] = useState<number>(() => {
    const today = todayKey();
    const state = read();

    if (state.lastActive === today) {
      // Already counted today — keep the streak.
      return state.count;
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const next = state.lastActive === yesterday ? state.count + 1 : 1;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: next, lastActive: today }));
    } catch {
      /* ignore */
    }
    return next;
  });

  return count;
}
