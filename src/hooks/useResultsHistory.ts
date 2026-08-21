import { useCallback, useEffect, useState } from 'react';
import { AssessmentResult, saveResultOffline, getOfflineResults, deleteOfflineResult, clearOfflineResults } from '../lib/db';
import { syncResults } from '../lib/sync';
import { toast } from 'sonner';
import { useOffline } from '../contexts/OfflineContext';

export type { AssessmentResult };

export const useResultsHistory = () => {
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOnline } = useOffline();

  const loadResults = useCallback(async () => {
    try {
      const data = await getOfflineResults();
      // Sort by completedAt descending
      setResults([...data].sort((a, b) => b.completedAt - a.completedAt));
      window.dispatchEvent(new Event('cognito:results-updated'));
    } catch (error) {
      console.error('Failed to load results:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResults();
    
    const sync = () => loadResults();
    window.addEventListener('cognito:results-updated', sync);
    return () => {
      window.removeEventListener('cognito:results-updated', sync);
    };
  }, [loadResults]);
  
  useEffect(() => {
    if (isOnline && results.length > 0) {
      syncResults(results).catch(console.error);
    }
  }, [isOnline, results]);

  const add = useCallback(async (result: Omit<AssessmentResult, 'completedAt'>) => {
    const newResult: AssessmentResult = {
      ...result,
      completedAt: Date.now(),
      synced: false,
    };

    try {
      await saveResultOffline(newResult);
      await loadResults();
      toast.success('Result saved');
    } catch (error) {
      console.error('Failed to save result:', error);
      toast.error('Failed to save');
    }
  }, [loadResults]);

  const clear = useCallback(async () => {
    try {
      await clearOfflineResults();
      await loadResults();
      toast.success('History cleared');
    } catch (error) {
      console.error('Failed to clear history:', error);
      toast.error('Failed to clear');
    }
  }, [loadResults]);

  const remove = useCallback(async (completedAt: number) => {
    try {
      await deleteOfflineResult(completedAt);
      await loadResults();
      toast.success('Result removed');
    } catch (error) {
      console.error('Failed to delete result:', error);
      toast.error('Failed to remove');
    }
  }, [loadResults]);

  return { results, add, clear, remove, loading };
};
