import { useCallback, useEffect, useState } from 'react';

export interface AssessmentResult {
  key: string;          // assessment key
  name: string;         // display name
  score?: number | string;
  interpretation?: string;
  patient?: string;
  completedAt: number;  // epoch ms
}

const STORAGE_KEY = 'cognito.results.history.v1';
const MAX = 50;

const read = (): AssessmentResult[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const write = (list: AssessmentResult[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX)));
    window.dispatchEvent(new Event('cognito:results-updated'));
  } catch {
    /* ignore quota */
  }
};

export const useResultsHistory = () => {
  const [results, setResults] = useState<AssessmentResult[]>(() => read());

  useEffect(() => {
    const sync = () => setResults(read());
    window.addEventListener('cognito:results-updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('cognito:results-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const add = useCallback((result: Omit<AssessmentResult, 'completedAt'>) => {
    const next: AssessmentResult = { ...result, completedAt: Date.now() };
    write([next, ...read()]);
  }, []);

  const clear = useCallback(() => write([]), []);

  const remove = useCallback((completedAt: number) => {
    write(read().filter((r) => r.completedAt !== completedAt));
  }, []);

  return { results, add, clear, remove };
};
