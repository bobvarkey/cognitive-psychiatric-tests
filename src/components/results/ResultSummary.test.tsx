import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useState, type ReactNode } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { PatientInfoProvider } from '@/contexts/PatientInfoContext';
import { ResultSummaryProvider } from './ResultSummaryContext';
import { CageAssessment } from '@/components/CageAssessment';
import { SmdsSfAssessment } from '@/components/SmdsSfAssessment';
import { LaepAssessment } from '@/components/LaepAssessment';
import { ChsAssessment } from '@/components/ChsAssessment';
import { CataplexyAssessment } from '@/components/CataplexyAssessment';
import { HamdResults } from '@/components/HamdResults';
import type { HamdResult } from '@/types/hamd';

let blobs: Blob[] = [];
let downloads: string[] = [];
let clipboard = '';

beforeEach(() => {
  blobs = [];
  downloads = [];
  clipboard = '';
  URL.createObjectURL = vi.fn((b: Blob) => {
    blobs.push(b);
    return 'blob:mock';
  }) as unknown as typeof URL.createObjectURL;
  URL.revokeObjectURL = vi.fn();
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
    downloads.push(this.download);
  });
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn(async (t: string) => { clipboard = t; }) },
  });
});

afterEach(() => vi.restoreAllMocks());

const blobText = (b: Blob) =>
  new Promise<string>((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.readAsText(b);
  });

function renderPage(ui: ReactNode) {
  return render(
    <LanguageProvider>
      <PatientInfoProvider>
        <div data-testid="page">
          <ResultSummaryProvider>{ui}</ResultSummaryProvider>
        </div>
      </PatientInfoProvider>
    </LanguageProvider>,
  );
}

/** The summary must be the last thing on the page, after every assessment element. */
function expectFooterAtBottom() {
  const page = screen.getByTestId('page');
  const footer = screen.getByTestId('result-summary');
  expect(page.lastElementChild).toBe(footer);
  const all = page.querySelectorAll('button, [role="radio"], h1, h2, h3');
  const lastContent = [...all].filter((el) => !footer.contains(el)).pop()!;
  expect(lastContent.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  return footer;
}

async function expectCopyEqualsDownload(footer: HTMLElement) {
  const shown = within(footer).getByTestId('result-summary-text').textContent ?? '';
  await act(async () => {
    fireEvent.click(within(footer).getByTestId('result-summary-copy'));
  });
  fireEvent.click(within(footer).getByTestId('result-summary-download'));
  expect(clipboard).toBe(shown);
  expect(await blobText(blobs[blobs.length - 1])).toBe(clipboard);
  expect(downloads[downloads.length - 1]).toMatch(/^[a-z0-9-]+-result\.txt$/);
  return shown;
}

describe('page-bottom result summary', () => {
  it('CAGE (shared ExportButtons) shows the summary after completion', async () => {
    renderPage(<CageAssessment onBack={() => {}} />);
    expect(screen.queryByTestId('result-summary')).toBeNull();
    const yes = screen.getAllByRole('button', { name: 'Yes' });
    const no = screen.getAllByRole('button', { name: 'No' });
    fireEvent.click(yes[0]);
    fireEvent.click(yes[1]);
    fireEvent.click(no[2]);
    fireEvent.click(no[3]);
    fireEvent.click(screen.getByRole('button', { name: /see result/i }));
    const footer = expectFooterAtBottom();
    const text = await expectCopyEqualsDownload(footer);
    const lines = text.split('\n');
    expect(lines[0]).toMatch(/CAGE/);
    expect(text).toMatch(/\nTotal score: 2\/4/);
    expect(text).toMatch(/\nInterpretation: /);
    expect(text).not.toMatch(/\n\s*\n|sensitivity|https?:/);
  });

  it('SMDS-SF (useRegisterResult) shows the summary with every answered item', async () => {
    renderPage(<SmdsSfAssessment onBack={() => {}} />);
    const groups = screen.getAllByRole('radiogroup');
    expect(groups).toHaveLength(9);
    groups.forEach((g, i) => fireEvent.click(g.querySelector(`[role="radio"][value="${i < 5 ? 'yes' : 'no'}"]`)!));
    const footer = expectFooterAtBottom();
    const text = await expectCopyEqualsDownload(footer);
    const lines = text.split('\n');
    expect(lines[0]).toBe('Social Media Disorder Scale, Short Form (SMDS-SF)');
    expect(lines).toHaveLength(1 + 9 + 2);
    expect(lines.at(-2)).toBe('Positive criteria: 5/9 (cutoff 5 or more)');
    expect(lines.at(-1)).toBe('Interpretation: Probable disordered social media use');
  });

  it('HAM-D results (hand-rolled report) register the same text as their Copy button', async () => {
    const result: HamdResult = {
      responses: [
        { itemId: 1, score: 2 },
        { itemId: 2, score: 0 },
      ] as HamdResult['responses'],
      totalScore: 2,
      interpretation: 'No depression',
      severity: 'normal',
    };
    const Flow = () => {
      const [done, setDone] = useState(false);
      return done ? <HamdResults result={result} onReset={() => {}} onBack={() => {}} /> : <button onClick={() => setDone(true)}>Finish</button>;
    };
    renderPage(<Flow />);
    fireEvent.click(screen.getByRole('button', { name: 'Finish' }));
    const footer = expectFooterAtBottom();
    const text = await expectCopyEqualsDownload(footer);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /copy text/i }));
    });
    expect(clipboard).toBe(text);
    expect(text.split('\n')[0]).toBe('Hamilton Depression Rating Scale (HAM-D)');
    expect(text).toMatch(/\nTotal score: 2\/52\nInterpretation: Normal$/);
  });

  it('live calculators (LAEP) wait for the user before showing a summary', async () => {
    renderPage(<LaepAssessment onBack={() => {}} />);
    expect(screen.queryByTestId('result-summary')).toBeNull();
    fireEvent.click(screen.getByText('Hand Tremor'));
    const footer = expectFooterAtBottom();
    const text = await expectCopyEqualsDownload(footer);
    expect(text).toMatch(/\nReported Side Effects: Hand Tremor\n/);
  });

  it('CHS: ticking a criterion checkbox itself (not just its row) selects it once', async () => {
    renderPage(<ChsAssessment onBack={() => {}} />);
    const boxes = screen.getAllByRole('checkbox');
    fireEvent.click(boxes[0]);
    expect(boxes[0]).toHaveAttribute('aria-checked', 'true');
    const footer = expectFooterAtBottom();
    const text = await expectCopyEqualsDownload(footer);
    expect(text).toMatch(/\nCriteria met: 1\/\d\n/);
  });

  it('Cataplexy: Calculate enables without the optional body-parts list', async () => {
    renderPage(<CataplexyAssessment onBack={() => {}} />);
    const calc = screen.getByRole('button', { name: /calculate results/i });
    expect(calc).toBeDisabled();
    screen.getAllByRole('radiogroup').forEach((g) => fireEvent.click(g.querySelectorAll('[role="radio"]')[0]));
    expect(calc).toBeEnabled();
    fireEvent.click(calc);
    const footer = expectFooterAtBottom();
    const text = await expectCopyEqualsDownload(footer);
    expect(text.split('\n')[0]).toMatch(/Cataplexy/);
    expect(text).toMatch(/\nInterpretation: /);
  });
});
