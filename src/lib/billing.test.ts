import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const functionsInvoke = vi.hoisted(() => vi.fn());
const currentEntitlement = vi.hoisted(() => vi.fn());

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { functions: { invoke: functionsInvoke } },
}));
vi.mock('@/lib/entitlement', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/entitlement')>()),
  currentEntitlement,
}));

import { fallbackBillingPlans, startSubscription, waitForEntitlement } from './billing';

describe('fallbackBillingPlans', () => {
  it('agrees with the migration that seeds the server catalogue', () => {
    // The paywall shows an amount before the user authorizes a charge. If this
    // fallback disagreed with the server, the app would quote one price and
    // bill another — the precise promise spec §9 exists to make.
    //
    // `process.cwd()` rather than `__dirname`: Vitest loads test files as ESM,
    // where `__dirname` is not defined, and it runs with the project root as the
    // working directory.
    const sql = readFileSync(
      path.resolve(process.cwd(), 'supabase/migrations/20261009120000_billing_plans.sql'),
      'utf8',
    );
    const seeded = [...sql.matchAll(
      /\(\s*'(monthly|yearly)',\s*'(INR|USD)',\s*(\d+),\s*'(month|year)',/g,
    )].map(([, code, currency, amount, intervalUnit]) => ({
      code: code as 'monthly' | 'yearly',
      currency: currency as 'INR' | 'USD',
      amount: Number(amount),
      intervalUnit: intervalUnit as 'month' | 'year',
    }));

    expect(seeded).toHaveLength(4);
    const byKey = (a: { currency: string; code: string }, b: { currency: string; code: string }) =>
      `${a.currency}${a.code}`.localeCompare(`${b.currency}${b.code}`);

    expect(
      fallbackBillingPlans()
        .map(({ code, currency, amount, intervalUnit }) => ({ code, currency, amount, intervalUnit }))
        .sort(byKey),
    ).toEqual(seeded.sort(byKey));
  });

  it('quotes the ₹299 / ₹2,999 prices the spec decided on', () => {
    expect(fallbackBillingPlans().find((p) => p.code === 'monthly' && p.currency === 'INR')?.amount).toBe(29900);
    expect(fallbackBillingPlans().find((p) => p.code === 'yearly' && p.currency === 'INR')?.amount).toBe(299900);
  });

  it('has a row for every plan and currency pair', () => {
    const plans = fallbackBillingPlans();
    expect(plans).toHaveLength(4);
    for (const currency of ['INR', 'USD'] as const) {
      for (const code of ['monthly', 'yearly'] as const) {
        expect(plans.some((p) => p.code === code && p.currency === currency)).toBe(true);
      }
    }
  });
});

describe('startSubscription', () => {
  beforeEach(() => {
    functionsInvoke.mockReset();
  });

  it('sends only the plan and the currency to the server', async () => {
    // The Global Constraint, pinned by assertion rather than by inspection: the
    // browser may name a plan and a currency, and nothing else. No email, no
    // user id, no price — the server reads the amount from its own catalogue and
    // the payer from the caller's JWT.
    functionsInvoke.mockResolvedValue({
      data: {
        subscriptionId: 'sub_1',
        keyId: 'rzp_test_key',
        amount: 299900,
        currency: 'INR',
        label: 'PsyCognito Premium — Yearly',
      },
      error: null,
    });

    await startSubscription('yearly', 'INR');

    expect(functionsInvoke).toHaveBeenCalledWith('billing-create-subscription', {
      body: { plan: 'yearly', currency: 'INR' },
    });
  });
});

describe('waitForEntitlement', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    currentEntitlement.mockReset();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the grant as soon as the server has one', async () => {
    const grant = { plan: 'monthly', source: 'razorpay', expiresAt: '2030-01-01T00:00:00.000Z', permanent: false };
    currentEntitlement.mockResolvedValue(grant);

    const pending = waitForEntitlement({ timeoutMs: 30000, intervalMs: 2000 });
    await vi.advanceTimersByTimeAsync(2000);
    await expect(pending).resolves.toEqual(grant);
    expect(currentEntitlement).toHaveBeenCalledTimes(1);
  });

  it('keeps polling while the server has nothing, then resolves', async () => {
    currentEntitlement
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ plan: 'yearly', source: 'razorpay', expiresAt: null, permanent: false });

    const pending = waitForEntitlement({ timeoutMs: 30000, intervalMs: 2000 });
    await vi.advanceTimersByTimeAsync(2000);
    await vi.advanceTimersByTimeAsync(2000);
    await vi.advanceTimersByTimeAsync(2000);
    await expect(pending).resolves.toMatchObject({ plan: 'yearly' });
    expect(currentEntitlement).toHaveBeenCalledTimes(3);
  });

  it('resolves null at the deadline rather than rejecting', async () => {
    // A slow webhook is not a failed payment. Rejecting here would turn a
    // successful charge into an error message.
    currentEntitlement.mockResolvedValue(null);

    const pending = waitForEntitlement({ timeoutMs: 30000, intervalMs: 2000 });
    await vi.advanceTimersByTimeAsync(30000);
    await expect(pending).resolves.toBeNull();
  });

  it('treats a throwing poll as "not yet", not as a failure', async () => {
    currentEntitlement.mockRejectedValue(new Error('network'));

    const pending = waitForEntitlement({ timeoutMs: 4000, intervalMs: 2000 });
    await vi.advanceTimersByTimeAsync(4000);
    await expect(pending).resolves.toBeNull();
  });

  it('never polls more often than the interval', async () => {
    currentEntitlement.mockResolvedValue(null);

    const pending = waitForEntitlement({ timeoutMs: 10000, intervalMs: 2000 });
    await vi.advanceTimersByTimeAsync(999);
    expect(currentEntitlement).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(10000);
    await pending;
    expect(currentEntitlement.mock.calls.length).toBeLessThanOrEqual(6);
  });
});
