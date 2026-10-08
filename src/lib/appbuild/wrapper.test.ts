import { afterEach, describe, expect, it } from 'vitest';
import { isWrapperPresent } from './wrapper';

/**
 * The real predicate, unmocked.
 *
 * `revenuecat.test.ts` supplies its own `isWrapperPresent`, so without this file
 * the production implementation would ship unexercised — and it is the one
 * function whose failing open would honour an admin comp inside the App Store
 * build, which is the outcome the whole native rule exists to prevent.
 */
describe('isWrapperPresent', () => {
  afterEach(() => {
    delete (window as unknown as { AppbuildWrapper?: unknown }).AppbuildWrapper;
  });

  it('is true when the wrapper object is there, even before its ready settles', () => {
    (window as unknown as { AppbuildWrapper?: unknown }).AppbuildWrapper = {
      ready: new Promise(() => {}),
      plugin: () => null,
    };
    expect(isWrapperPresent()).toBe(true);
  });

  it('is false in a plain browser', () => {
    expect(isWrapperPresent()).toBe(false);
  });
});
