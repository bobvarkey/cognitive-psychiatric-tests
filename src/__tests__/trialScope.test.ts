import { describe, it, expect } from 'vitest';
import { TRIAL_KEYS, canOpenAssessment, isVisibleInTrial } from '../config/trialScope';
import { assessments } from '../components/AssessmentSelector';

/** The Triage & Core Flows section, which is the top of the registry. */
const SECTION_KEYS = assessments.slice(0, 20).map((a) => a.key);

describe('trial scope', () => {
  it('is the twenty-entry Triage & Core Flows section', () => {
    expect(TRIAL_KEYS).toHaveLength(20);
  });

  it('matches the top of the registry exactly, in order', () => {
    // The invariant that catches drift: renaming a key, deleting an assessment,
    // or inserting one into the section all fail here rather than silently
    // changing what a trial unlocks.
    expect([...TRIAL_KEYS]).toEqual(SECTION_KEYS);
  });

  it('lists no key twice', () => {
    expect(new Set(TRIAL_KEYS).size).toBe(TRIAL_KEYS.length);
  });

  it('names only keys that exist in the registry', () => {
    const known = new Set(assessments.map((a) => a.key));
    for (const key of TRIAL_KEYS) expect(known.has(key)).toBe(true);
  });

  it('includes triage, which the category rule had excluded', () => {
    expect(isVisibleInTrial('triage')).toBe(true);
    expect(canOpenAssessment('triage', 'trial')).toBe(true);
  });

  it('is a minority of the catalogue, near a quarter', () => {
    // 20 of 96. A band rather than a fixed ratio, so adding assessments does not
    // break it, while a change that made the trial most of the product still would.
    const share = TRIAL_KEYS.length / assessments.length;
    expect(share).toBeGreaterThan(0.15);
    expect(share).toBeLessThan(0.3);
  });

  it('hides the assessments immediately below the section', () => {
    expect(isVisibleInTrial('delusions')).toBe(false);
    expect(isVisibleInTrial('bprs')).toBe(false);
  });
});

describe('canOpenAssessment', () => {
  it('opens everything for a full tier', () => {
    expect(canOpenAssessment('hamd', 'full')).toBe(true);
    expect(canOpenAssessment('triage', 'full')).toBe(true);
  });

  it('opens only the section for a trial', () => {
    expect(canOpenAssessment('triage', 'trial')).toBe(true);
    expect(canOpenAssessment('hamd', 'trial')).toBe(false);
    expect(canOpenAssessment('delusions', 'trial')).toBe(false);
  });

  it('opens nothing for no tier', () => {
    expect(canOpenAssessment('triage', 'none')).toBe(false);
    expect(canOpenAssessment('hamd', 'none')).toBe(false);
  });
});
