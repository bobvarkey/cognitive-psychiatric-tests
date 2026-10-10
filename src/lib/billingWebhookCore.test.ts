import { describe, expect, it } from 'vitest';
import {
  constantTimeEqual,
  effectForEvent,
  eventIdFor,
  hmacSha256Hex,
  parseCreateSubscriptionRequest,
  sha256Hex,
} from './billingWebhookCore';

describe('hmacSha256Hex', () => {
  // RFC 4231 test case 2: key = "Jefe", data = "what do ya want for nothing?".
  it('matches the RFC 4231 vector', async () => {
    await expect(hmacSha256Hex('Jefe', 'what do ya want for nothing?')).resolves.toBe(
      '5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843',
    );
  });

  it('is lowercase hex of the right length', async () => {
    const digest = await hmacSha256Hex('secret', 'message');
    expect(digest).toMatch(/^[0-9a-f]{64}$/);
  });

  it('changes when the signed bytes change', async () => {
    const a = await hmacSha256Hex('secret', '{"a":1}');
    const b = await hmacSha256Hex('secret', '{"a": 1}');
    // Whitespace matters: this is exactly why the raw body must be signed and
    // not a re-serialisation of the parsed object.
    expect(a).not.toBe(b);
  });
});

describe('sha256Hex', () => {
  it('matches the empty-string vector', async () => {
    await expect(sha256Hex('')).resolves.toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  });
});

describe('constantTimeEqual', () => {
  it('accepts an identical pair', () => {
    expect(constantTimeEqual('abc123', 'abc123')).toBe(true);
  });

  it('rejects a one-character difference', () => {
    expect(constantTimeEqual('abc123', 'abc124')).toBe(false);
  });

  it('rejects a length difference without throwing', () => {
    expect(constantTimeEqual('abc', 'abcd')).toBe(false);
    expect(constantTimeEqual('', 'a')).toBe(false);
  });
});

describe('effectForEvent', () => {
  it('activates on activated, and may extend access', () => {
    expect(effectForEvent('subscription.activated')).toEqual({
      status: 'active',
      writesEntitlement: true,
    });
  });

  it('activates on charged, and may extend access', () => {
    expect(effectForEvent('subscription.charged')).toEqual({
      status: 'active',
      writesEntitlement: true,
    });
  });

  it('records a cancellation but does not extend access', () => {
    // Access runs to the end of the period already paid for.
    expect(effectForEvent('subscription.cancelled')).toEqual({
      status: 'cancelled',
      writesEntitlement: false,
    });
  });

  it('records a halt but does not extend access', () => {
    // halted means the last payment failed. Extending here would sell another
    // period on a charge that never succeeded.
    expect(effectForEvent('subscription.halted')).toEqual({
      status: 'halted',
      writesEntitlement: false,
    });
  });

  it('records completion but does not extend access', () => {
    expect(effectForEvent('subscription.completed')).toEqual({
      status: 'completed',
      writesEntitlement: false,
    });
  });

  it('returns null for an unknown event, so the caller answers 200', () => {
    expect(effectForEvent('payment.failed')).toBeNull();
    expect(effectForEvent('')).toBeNull();
    expect(effectForEvent('subscription.activated ')).toBeNull();
  });

  it('returns null for an inherited Object.prototype key, not a function', () => {
    // A lookup on a plain object literal inherits from Object.prototype, so
    // `EFFECTS['constructor']` is `Object` — truthy, so `?? null` never fires
    // and the caller receives a function where the contract promises
    // `EventEffect | null`. A Map has no prototype keys. The three names below
    // are the ones a caller could plausibly see arrive in an event field.
    expect(effectForEvent('constructor')).toBeNull();
    expect(effectForEvent('toString')).toBeNull();
    expect(effectForEvent('hasOwnProperty')).toBeNull();
  });

  it('never moves access forward for anything but activated and charged', () => {
    const extending = ['subscription.activated', 'subscription.charged'];
    for (const type of [
      'subscription.activated',
      'subscription.charged',
      'subscription.cancelled',
      'subscription.halted',
      'subscription.completed',
    ]) {
      expect(effectForEvent(type)!.writesEntitlement).toBe(extending.includes(type));
    }
  });
});

describe('eventIdFor', () => {
  it('prefers the header when present', async () => {
    await expect(eventIdFor('evt_123', '{"a":1}')).resolves.toBe('evt_123');
  });

  it('ignores surrounding whitespace in the header', async () => {
    await expect(eventIdFor('  evt_123  ', '{"a":1}')).resolves.toBe('evt_123');
  });

  it('falls back to a body digest when the header is missing', async () => {
    // A missing header must not defeat deduplication.
    const id = await eventIdFor(null, '{"a":1}');
    expect(id).toBe(`body:${await sha256Hex('{"a":1}')}`);
  });

  it('falls back when the header is present but empty', async () => {
    await expect(eventIdFor('', '{"a":1}')).resolves.toBe(`body:${await sha256Hex('{"a":1}')}`);
  });

  it('gives different ids to different bodies', async () => {
    expect(await eventIdFor(null, '{"a":1}')).not.toBe(await eventIdFor(null, '{"a":2}'));
  });
});

describe('parseCreateSubscriptionRequest', () => {
  it('accepts a well-formed request', () => {
    expect(parseCreateSubscriptionRequest({ plan: 'monthly', currency: 'INR' })).toEqual({
      ok: true,
      plan: 'monthly',
      currency: 'INR',
    });
  });

  it('accepts the other three combinations', () => {
    expect(parseCreateSubscriptionRequest({ plan: 'yearly', currency: 'INR' })).toMatchObject({ ok: true });
    expect(parseCreateSubscriptionRequest({ plan: 'monthly', currency: 'USD' })).toMatchObject({ ok: true });
    expect(parseCreateSubscriptionRequest({ plan: 'yearly', currency: 'USD' })).toMatchObject({ ok: true });
  });

  it('rejects a missing plan or currency', () => {
    expect(parseCreateSubscriptionRequest({ plan: 'monthly' })).toMatchObject({ ok: false });
    expect(parseCreateSubscriptionRequest({ currency: 'INR' })).toMatchObject({ ok: false });
    expect(parseCreateSubscriptionRequest({})).toMatchObject({ ok: false });
    expect(parseCreateSubscriptionRequest(null)).toMatchObject({ ok: false });
  });

  it('rejects a plan or currency that is not in the catalogue', () => {
    expect(parseCreateSubscriptionRequest({ plan: 'weekly', currency: 'INR' })).toMatchObject({ ok: false });
    expect(parseCreateSubscriptionRequest({ plan: 'monthly', currency: 'EUR' })).toMatchObject({ ok: false });
    expect(parseCreateSubscriptionRequest({ plan: 'MONTHLY', currency: 'INR' })).toMatchObject({ ok: false });
  });

  it('ignores — never honours — a price, amount or plan id in the body', () => {
    const result = parseCreateSubscriptionRequest({
      plan: 'monthly',
      currency: 'INR',
      amount: 1,
      price: 1,
      razorpay_plan_id: 'plan_attacker',
      user_id: '00000000-0000-0000-0000-000000000000',
    });
    // The result carries only the two catalogue keys, so nothing else can be
    // read out of it even by accident.
    expect(result).toEqual({ ok: true, plan: 'monthly', currency: 'INR' });
    expect(Object.keys(result).sort()).toEqual(['currency', 'ok', 'plan']);
  });
});
