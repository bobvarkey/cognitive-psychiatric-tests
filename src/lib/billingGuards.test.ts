import { describe, expect, it } from 'vitest';
import { hasPaidAccess } from '@/lib/billingGuards';

describe('hasPaidAccess (double-checkout guard)', () => {
  it('blocks a second checkout for paid or permanent access', () => {
    for (const s of ['web', 'store', 'developer']) expect(hasPaidAccess(s)).toBe(true);
  });
  it('lets trial/demo and free users check out', () => {
    for (const s of ['demo', 'none']) expect(hasPaidAccess(s)).toBe(false);
  });
});
