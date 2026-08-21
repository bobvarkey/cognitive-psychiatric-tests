import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useResultsHistory } from './useResultsHistory';
import * as db from '../lib/db';

// Mock the DB and Context
vi.mock('../lib/db', () => ({
  saveResultOffline: vi.fn(),
  getOfflineResults: vi.fn(() => Promise.resolve([])),
  deleteOfflineResult: vi.fn(),
  clearOfflineResults: vi.fn(),
}));

vi.mock('../contexts/OfflineContext', () => ({
  useOffline: () => ({ isOnline: true }),
}));

vi.mock('../lib/sync', () => ({
  syncResults: vi.fn(() => Promise.resolve()),
}));

describe('useResultsHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads results on mount', async () => {
    const mockResults = [
      { key: 'test', name: 'Test', completedAt: 1000 },
      { key: 'test2', name: 'Test 2', completedAt: 2000 },
    ];
    (db.getOfflineResults as any).mockResolvedValue(mockResults);

    const { result } = renderHook(() => useResultsHistory());

    // Wait for the useEffect/async load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.results).toHaveLength(2);
    // Should be sorted descending
    expect(result.current.results[0].completedAt).toBe(2000);
  });

  it('adds a result correctly', async () => {
    const { result } = renderHook(() => useResultsHistory());

    await act(async () => {
      await result.current.add({ key: 'new', name: 'New Assessment' });
    });

    expect(db.saveResultOffline).toHaveBeenCalled();
    expect(db.getOfflineResults).toHaveBeenCalled();
  });
});
