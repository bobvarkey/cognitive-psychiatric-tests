import { describe, expect, it } from 'vitest';
import { canOpenAssessment } from '@/config/trialScope';
import { assessments } from './AssessmentSelector';

const byKey = (key: string) => assessments.find((a) => a.key === key)!;

describe('assessment lock', () => {
  it('gives a full tier everything', () => {
    expect(canOpenAssessment(byKey('hamd').key, 'full')).toBe(true);
    expect(canOpenAssessment(byKey('triage').key, 'full')).toBe(true);
  });

  it('gives a trial only the section', () => {
    expect(canOpenAssessment(byKey('triage').key, 'trial')).toBe(true);
    expect(canOpenAssessment(byKey('moca').key, 'trial')).toBe(true);
    expect(canOpenAssessment(byKey('hamd').key, 'trial')).toBe(false);
    expect(canOpenAssessment(byKey('delusions').key, 'trial')).toBe(false);
  });

  it('covers every registry key without throwing', () => {
    for (const a of assessments) {
      expect(typeof canOpenAssessment(a.key, 'trial')).toBe('boolean');
    }
  });
});
