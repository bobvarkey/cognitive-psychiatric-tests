import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ReportData } from '@/utils/reportGenerator';
import { hasResultContent } from '@/lib/copyResults';
import { ResultSummaryContext, useRegisterResult, type Register } from './useRegisterResult';
import { ResultSummaryFooter } from './ResultSummaryFooter';


// Controls that count as "the user is doing the test". Tabs and links only navigate.
const INPUT_SELECTOR =
  'input, select, textarea, button, [role="radio"], [role="checkbox"], [role="switch"], [role="slider"], [role="option"], [role="combobox"], [contenteditable="true"]';

function isTestInput(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  const el = target.closest(INPUT_SELECTOR);
  if (!el) return false;
  if (el.closest('[role="tab"], a[href]')) return false;
  return true;
}

/**
 * Wraps one assessment page. Any result registered by a descendant (via the shared
 * ExportButtons / CopyTextButton, or useRegisterResult) is shown in a single
 * "Result summary" card rendered after the page content, i.e. at the bottom.
 */
export function ResultSummaryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Array<{ id: string; text: string }>>([]);
  // Live calculators register a default "0" result on mount; the summary only
  // appears once the user has actually operated a control on this test.
  const [touched, setTouched] = useState(false);
  const markTouched = useCallback(
    (e: { target: EventTarget | null }) => {
      if (!touched && isTestInput(e.target)) setTouched(true);
    },
    [touched],
  );

  // A result whose text changes after it first registered was produced by the user
  // (including pages that answer via clickable cards rather than form controls).
  const firstSeen = useRef(new Map<string, string>());

  const register = useCallback<Register>((id, text) => {
    if (text !== null) {
      const content = hasResultContent(text) ? text : '';
      const first = firstSeen.current.get(id);
      if (first === undefined) firstSeen.current.set(id, content);
      else if (first !== content) setTouched(true);
    }
    setEntries((prev) => {
      const idx = prev.findIndex((e) => e.id === id);
      if (text === null || !hasResultContent(text)) {
        return idx === -1 ? prev : prev.filter((e) => e.id !== id);
      }
      if (idx === -1) return [...prev, { id, text }];
      if (prev[idx].text === text) return prev;
      const next = prev.slice();
      next[idx] = { id, text };
      return next;
    });
  }, []);

  // Several buttons on one page often carry the same result; show each distinct result once.
  const texts = useMemo(() => Array.from(new Set(entries.map((e) => e.text))), [entries]);

  return (
    <ResultSummaryContext.Provider value={register}>
      <div className="contents" onClickCapture={markTouched} onPointerDownCapture={markTouched} onKeyDownCapture={markTouched} onChangeCapture={markTouched}>
        {children}
      </div>
      {touched && texts.length > 0 && <ResultSummaryFooter texts={texts} />}
    </ResultSummaryContext.Provider>
  );
}

/**
 * Render-only helper for pages that build their report inline: registers the
 * result for the page-bottom summary without changing hook order. Renders nothing.
 */
export function RegisterResult({ data }: { data: ReportData | string | null | undefined | (() => ReportData | string | null | undefined) }) {
  let value: ReportData | string | null | undefined = null;
  try {
    value = typeof data === 'function' ? data() : data;
  } catch {
    value = null;
  }
  useRegisterResult(value);
  return null;
}
