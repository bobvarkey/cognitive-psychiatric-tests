import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildResultText,
  copyResultsToClipboard,
  downloadResultsText,
  formatResultsForCopy,
  resultFileName,
} from './copyResults';
import { downloadTextReport, type ReportData } from '@/utils/reportGenerator';

const hamd: ReportData = {
  assessmentName: 'Hamilton Depression Rating Scale (HAM-D)',
  date: '04/10/2026',
  totalScore: '12/52',
  severity: 'Mild Depression',
  interpretation: 'Mild depressive symptoms.',
  sections: [
    { title: 'Positive Findings', items: ['Depressed mood — Sad (Score: 2/4)'], type: 'positive' },
    { title: 'Negative Findings', items: ['Guilt (Score: 0)'], type: 'negative' },
    { title: 'Items Not Assessed', items: ['Insight'], type: 'not-assessed' },
    { title: 'Cutoffs', items: ['0–7 normal · 8–13 mild'], type: 'info' },
    { title: 'Recommendations', items: ['Follow up in 2 weeks.'], type: 'info' },
  ],
  disclaimer: 'Screening only. https://example.com tok_abc123',
};

let blobs: Blob[] = [];
let clicks: Array<{ href: string; download: string }> = [];
let clipboard = '';

beforeEach(() => {
  blobs = [];
  clicks = [];
  clipboard = '';
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  URL.createObjectURL = vi.fn((b: Blob) => {
    blobs.push(b);
    return 'blob:mock';
  }) as unknown as typeof URL.createObjectURL;
  URL.revokeObjectURL = vi.fn();
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
    clicks.push({ href: this.href, download: this.download });
  });
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn(async (t: string) => { clipboard = t; }) },
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const blobText = (b: Blob) =>
  new Promise<string>((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.readAsText(b);
  });

describe('result text for copy and .txt download', () => {
  it('download writes exactly the clipboard text', async () => {
    const text = buildResultText(hamd);
    await copyResultsToClipboard(text);
    downloadResultsText(hamd);
    expect(blobs).toHaveLength(1);
    expect(await blobText(blobs[0])).toBe(clipboard);
    expect(clipboard).toBe(text);
  });

  it('follows the results-only format', () => {
    expect(formatResultsForCopy(hamd).split('\n')).toEqual([
      'Hamilton Depression Rating Scale (HAM-D)',
      'Depressed mood: Sad (2/4)',
      'Guilt: 0',
      'Total score: 12/52',
      'Interpretation: Mild Depression',
    ]);
  });

  it('has no blank lines, disclaimers, URLs, dates or tokens', () => {
    const text = buildResultText(hamd);
    expect(text).not.toMatch(/\n\s*\n/);
    expect(text).not.toMatch(/Screening only|https?:|tok_|04\/10\/2026|Follow up|0–7/);
  });

  it('names the file <scale-slug>-result.txt and revokes the URL later', () => {
    downloadResultsText(hamd);
    expect(clicks[0].download).toBe('hamilton-depression-rating-scale-ham-d-result.txt');
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock');
  });

  it('legacy downloadTextReport now produces the same text and file name', async () => {
    downloadTextReport(hamd);
    expect(await blobText(blobs[0])).toBe(formatResultsForCopy(hamd));
    expect(clicks[0].download).toBe('hamilton-depression-rating-scale-ham-d-result.txt');
  });

  it('falls back to opening the text when Blob download fails', () => {
    URL.createObjectURL = vi.fn(() => {
      throw new Error('unsupported');
    }) as unknown as typeof URL.createObjectURL;
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const text = downloadResultsText(hamd);
    expect(open).toHaveBeenCalledWith(`data:text/plain;charset=utf-8,${encodeURIComponent(text)}`, '_blank', 'noopener');
  });

  it('uses the natural total label and merges bare answers under the section title', () => {
    const text = formatResultsForCopy({
      assessmentName: 'LAEP',
      date: '',
      totalLabel: 'Criteria present',
      totalScore: '2/8',
      sections: [{ title: 'Reported Side Effects', items: ['Hand Tremor', 'Fatigue'], type: 'info' }],
    });
    expect(text).toBe('LAEP\nReported Side Effects: Hand Tremor, Fatigue\nCriteria present: 2/8');
  });

  it('prefixes generic "Score:" items with their section', () => {
    const text = formatResultsForCopy({
      assessmentName: 'Fall Risk Assessment',
      date: '',
      sections: [
        { title: 'STEADI Score', items: ['Score: 4/14'], type: 'info' },
        { title: 'Morse Fall Score', items: ['Score: 25/125', 'Level: Low risk'], type: 'info' },
      ],
    });
    expect(text.split('\n')).toEqual([
      'Fall Risk Assessment',
      'STEADI Score: 4/14',
      'Morse Fall Score: 25/125',
      'Morse Fall Score level: Low risk',
    ]);
  });

  it('names the section when the same label appears in two sections', () => {
    const text = formatResultsForCopy({
      assessmentName: 'Consciousness',
      date: '',
      sections: [
        { title: 'Glasgow Coma Scale', items: ['Eye: E4', 'Verbal: V5'], type: 'info' },
        { title: 'FOUR Score', items: ['Eye: 4'], type: 'info' },
      ],
    });
    expect(text.split('\n')).toEqual(['Consciousness', 'Glasgow Coma Scale eye: E4', 'Verbal: V5', 'FOUR Score eye: 4']);
  });

  it('keeps only label: value lines from free-text reports', () => {
    expect(buildResultText('OPD Evaluation\nIDENTIFICATION\nIQ: 92\nDate: 2026-10-04\nSome prose here.')).toBe('OPD Evaluation\nIQ: 92');
  });

  it('copy falls back to execCommand when the Clipboard API is missing', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
    const exec = vi.fn(() => true);
    (document as unknown as { execCommand: typeof exec }).execCommand = exec;
    await expect(copyResultsToClipboard('Scale\nTotal score: 1')).resolves.toBe('Scale\nTotal score: 1');
    expect(exec).toHaveBeenCalledWith('copy');
  });

  it('slugifies odd names safely', () => {
    expect(resultFileName('FNQ-5 — Food Noise (Ü)')).toBe('fnq-5-food-noise-u-result.txt');
    expect(resultFileName('')).toBe('assessment-result.txt');
  });
});
