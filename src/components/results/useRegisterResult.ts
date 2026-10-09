import { createContext, useContext, useEffect, useId } from 'react';
import type { ReportData } from '@/utils/reportGenerator';
import { buildResultText } from '@/lib/copyResults';

export type Register = (id: string, text: string | null) => void;

/** Provided by ResultSummaryProvider (one per assessment page). */
export const ResultSummaryContext = createContext<Register | null>(null);

/**
 * Registers a completed result for the page-bottom summary. Pass null/undefined
 * (or data with nothing beyond the scale name) while the test is not yet done.
 * No-op outside a ResultSummaryProvider.
 */
export function useRegisterResult(input: ReportData | string | null | undefined | false) {
  const register = useContext(ResultSummaryContext);
  const id = useId();
  let text: string | null = null;
  if (input) {
    try {
      text = buildResultText(input);
    } catch {
      text = null;
    }
  }
  useEffect(() => {
    // '' = mounted but not ready yet; null is reserved for unmount.
    register?.(id, text ?? '');
  }, [register, id, text]);
  useEffect(() => () => register?.(id, null), [register, id]);
}

