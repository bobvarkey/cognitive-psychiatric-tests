import { describe, expect, it } from 'vitest';
import { isProSource } from './subscriptionService';

describe('isProSource', () => {
  it('counts every source that grants Pro', () => {
    expect(isProSource('store')).toBe(true);
    expect(isProSource('web')).toBe(true);
    expect(isProSource('developer')).toBe(true);
  });

  it('does not count the trial or the absence of access', () => {
    expect(isProSource('demo')).toBe(false);
    expect(isProSource('none')).toBe(false);
    expect(isProSource(null)).toBe(false);
    expect(isProSource(undefined)).toBe(false);
  });
});
