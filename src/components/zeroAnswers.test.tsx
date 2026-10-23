import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

// A 0 / "Never" / "Not met" answer must count as answered: the scale has to
// complete, score 0 and print the item as "<Item>: 0" in the copied text.

vi.mock('@/contexts/LanguageContext', async (orig) => ({
  ...(await orig<typeof import('@/contexts/LanguageContext')>()),
  useLanguage: () => ({ t: (k: string) => k, language: 'en', setLanguage: vi.fn() }),
}));
vi.mock('@/contexts/PatientInfoContext', async (orig) => ({
  ...(await orig<typeof import('@/contexts/PatientInfoContext')>()),
  usePatientInfo: () => ({
    patientInfo: { name: '', id: '', age: '', mrNumber: '' },
    clearPatientInfo: vi.fn(),
    getPatientInfoForReport: () => ({}),
  }),
}));
vi.mock('@/components/PatientInfoForm', () => ({ PatientInfoForm: () => null }));

import { ResultSummaryContext } from '@/components/results/useRegisterResult';
import { PsychosisScaleAssessment } from './PsychosisScaleAssessment';
import { AdhdAssessment } from './AdhdAssessment';
import { ADHD_SCREENERS } from '@/data/adhdScreenerScales';
import { PSYCHOSIS_SCALE_LIST, type PsychosisScale } from '@/data/psychosisScales';
import { ADHD_CRITERIA } from '@/data/adhdScale';
import { FosqAssessment } from './FosqAssessment';
import { FOSQ_ITEMS } from '@/data/fosq';

window.scrollTo = vi.fn();
afterEach(cleanup);

const withCapture = (ui: ReactNode) => {
  const texts = new Map<string, string>();
  const register = (id: string, text: string | null) => {
    if (text == null) texts.delete(id); else texts.set(id, text);
  };
  render(<ResultSummaryContext.Provider value={register as never}>{ui}</ResultSummaryContext.Provider>);
  return () => [...texts.values()].filter(Boolean).join('\n');
};

const zeroScales: PsychosisScale[] = [
  ...Object.values(ADHD_SCREENERS),
  ...PSYCHOSIS_SCALE_LIST,
].filter((s) => s.items.every((it) => (it.anchors ?? s.anchors).some((a) => a.value === 0)));

describe('answering every item 0', () => {
  it('covers the ADHD screeners', () => {
    expect(zeroScales.map((s) => s.id)).toEqual(expect.arrayContaining(['asrs6', 'asrs18']));
  });

  it.each(zeroScales.map((s) => [s.id, s] as const))('%s completes with total 0', (_id, scale) => {
    const text = withCapture(<PsychosisScaleAssessment scale={scale} />);
    const view = () => screen.getByRole('button', { name: /View results|Answer all/ });
    expect((view() as HTMLButtonElement).disabled).toBe(true);

    for (const it of scale.items) fireEvent.click(document.getElementById(`${it.id}-0`)!);

    expect((view() as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(view());

    const out = text();
    const band = scale.severityBands?.total?.find((b) => 0 >= b.min && 0 <= b.max);
    expect(out).toMatch(/Total score: 0\b/);
    if (band) expect(out).toContain(band.label);
    for (const it of scale.items) expect(out).toMatch(new RegExp(`${it.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}: 0\\b`));
  });

  it('ASRS-6 all "Never" is a negative screen', () => {
    const text = withCapture(<PsychosisScaleAssessment scale={ADHD_SCREENERS.asrs6} />);
    for (const it of ADHD_SCREENERS.asrs6.items) fireEvent.click(document.getElementById(`${it.id}-0`)!);
    fireEvent.click(screen.getByRole('button', { name: 'View results' }));
    expect(text()).toContain('Negative screen');
  });
});

describe('DSM-5 ADHD criteria B-E', () => {
  it('lets every criterion be answered "Not met" and still calculates', () => {
    render(<AdhdAssessment />);
    const calc = screen.getByRole('button', { name: /calculateResults/ }) as HTMLButtonElement;
    expect(calc.disabled).toBe(true);

    const notMet = screen.getAllByRole('radio', { name: 'Not met' });
    expect(notMet).toHaveLength(ADHD_CRITERIA.length);
    notMet.forEach((b) => fireEvent.click(b));

    expect(calc.disabled).toBe(false);
    fireEvent.click(calc);
    expect(screen.getAllByText('Criterion Not Met').length).toBeGreaterThan(0);
  });

  it('does not show an unanswered criterion as "Not Met"', () => {
    render(<AdhdAssessment />);
    expect(screen.queryByText('Not Met')).toBeNull();
    fireEvent.click(screen.getAllByRole('radio', { name: 'Not met' })[0]);
    expect(screen.getAllByText('Not Met')).toHaveLength(1);
  });
});

describe('FOSQ "I don\'t do this activity" (0)', () => {
  it('is offered, counts as answered and is left out of the subscale mean', () => {
    render(<FosqAssessment />);
    fireEvent.click(screen.getByRole('button', { name: 'Start Assessment' }));
    // Item 7 (long-distance driving) answered 0 = not applicable; every other item 4.
    for (const it of FOSQ_ITEMS) {
      fireEvent.click(document.getElementById(`${it.id}-${it.id === 'fosq_07' ? 0 : 4}`)!);
    }
    const submit = screen.getAllByRole('button').find((b) => /calculate|results|score/i.test(b.textContent ?? '')) as HTMLButtonElement;
    expect(submit.disabled).toBe(false);
    fireEvent.click(submit);
    // With 0 excluded, every subscale mean is 4.00 and the total is the maximum 20.
    expect(screen.getByText('20.0')).toBeTruthy();
  });
});
