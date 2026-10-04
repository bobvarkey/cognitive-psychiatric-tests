import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { ExportButtons } from './ExportButtons';
import { CopyTextButton } from './CopyTextButton';

const DISCLAIMER_RE = /(for clinical use only|not a substitute|professional judg|consult a healthcare provider|informational purposes|disclaimer|tok_)/i;

describe('Copy buttons write results-only text', () => {
  let writeText: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  });

  it('ExportButtons "Copy all"', async () => {
    const { getByText } = render(
      <ExportButtons
        data={{
          assessmentName: 'Epworth Sleepiness Scale',
          date: '04/10/2026',
          totalScore: '12/24',
          severity: 'Mild excessive daytime sleepiness',
          sections: [{ title: 'Item Scores', items: ['Sitting and reading: 2', 'Watching TV: 1'], type: 'info' }],
          disclaimer: 'For clinical use only. Not a substitute for professional judgment. tok_abc123',
        }}
      />,
    );
    fireEvent.click(getByText('Copy all'));
    await waitFor(() => expect(writeText).toHaveBeenCalled());
    const text = writeText.mock.calls[0][0] as string;
    expect(text).toBe(
      ['Epworth Sleepiness Scale', 'Sitting and reading: 2', 'Watching TV: 1', 'Total score: 12/24', 'Interpretation: Mild excessive daytime sleepiness'].join('\n'),
    );
    expect(text).not.toMatch(DISCLAIMER_RE);
  });

  it('CopyTextButton', async () => {
    const { getByText } = render(
      <CopyTextButton text={'OPD Evaluation\n\nIQ: 92\nGenerated: 2026-10-04T10:00:00Z\nThis report is for informational purposes only. tok_9z'} />,
    );
    fireEvent.click(getByText('Copy'));
    await waitFor(() => expect(writeText).toHaveBeenCalled());
    const text = writeText.mock.calls[0][0] as string;
    expect(text).toBe('OPD Evaluation\nIQ: 92');
    expect(text).not.toMatch(DISCLAIMER_RE);
  });
});
