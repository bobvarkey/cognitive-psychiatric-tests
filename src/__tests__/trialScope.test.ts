import { describe, it, expect } from 'vitest';
import { TRIAL_CATEGORIES, isVisibleInTrial } from '../config/trialScope';

describe('trial scope', () => {
  it('opens three of the eleven category tabs', () => {
    expect(TRIAL_CATEGORIES).toHaveLength(3);
  });

  it('never lists the all tab, which would expose the whole library', () => {
    expect(TRIAL_CATEGORIES).not.toContain('all');
  });

  it('shows an assessment that belongs to a trial category', () => {
    expect(isVisibleInTrial(['cognitive'])).toBe(true);
    expect(isVisibleInTrial(['all', 'cognitive'])).toBe(true);
    expect(isVisibleInTrial(['sleep'])).toBe(true);
  });

  it('hides an assessment outside the trial categories', () => {
    expect(isVisibleInTrial(['epilepsy'])).toBe(false);
    expect(isVisibleInTrial(['movement', 'adverse'])).toBe(false);
    expect(isVisibleInTrial(['personality'])).toBe(false);
  });

  it('hides the all-only triage flow, which belongs to no trial category', () => {
    expect(isVisibleInTrial(['all'])).toBe(false);
  });

  it('shows nothing for an assessment with no categories at all', () => {
    expect(isVisibleInTrial([])).toBe(false);
  });
});
