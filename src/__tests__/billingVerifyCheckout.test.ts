// Static guard for the verify-checkout edge function.
//
// The function's real verification is an operator curl against a deployed
// function, which CI cannot reach. This test reads the function's text and pins
// the property that separates the checkout callback from the grant: it records
// that a checkout was verified and writes no entitlement. It also pins the order
// that makes the callback safe — verify before writing — and the exact string
// Razorpay signs. It catches a later edit; it does not replace the live checks.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const FUNCTION = path.resolve(
  process.cwd(),
  'supabase/functions/billing-verify-checkout/index.ts',
);

// Read inside each test, not at module load: a missing file should fail a test
// with a clear message, not error the whole file at import time.
const readFunction = () => readFileSync(FUNCTION, 'utf8');

describe('billing-verify-checkout edge function', () => {
  it('never writes an entitlement, and calls no database function', () => {
    const src = readFunction();
    // The whole point of this function: a valid checkout signature is proof of
    // payment, not of a live mandate. Only the webhook grants. Any write here
    // to `entitlements` would let a valid signature grant lasting access, which
    // is exactly what the spec forbids. An `rpc(` could hide the same write
    // inside a database function.
    expect(src).not.toMatch(/\.from\(\s*['"]entitlements['"]\s*\)/);
    expect(src).not.toMatch(/\brpc\(/);
  });

  it('signs the exact string Razorpay signs', () => {
    // Razorpay's subscription checkout signs `payment_id|subscription_id`, in
    // that order. Reversing the operands, or changing the separator, would make
    // every signature fail verification.
    const src = readFunction();
    expect(src).toContain('${paymentId}|${subscriptionId}');
    expect(src).toMatch(/hmacSha256Hex\(/);
  });

  it('verifies the signature before it writes anything', () => {
    const src = readFunction();
    const hmac = src.indexOf('hmacSha256Hex(');
    const firstFrom = src.indexOf('.from(');
    expect(hmac).toBeGreaterThan(-1);
    expect(firstFrom).toBeGreaterThan(-1);
    expect(hmac).toBeLessThan(firstFrom);
    // The hmac call alone proves only that a signature was computed. The
    // rejection is what makes that computation verification: without it an edit
    // could compute `expected` and discard it, leaving every other assertion in
    // this file green. Both the comparison and its position are pinned.
    const compare = src.search(/constantTimeEqual\(/);
    expect(compare).toBeGreaterThan(-1);
    expect(compare).toBeLessThan(firstFrom);
    // A write is only safe if it is the intended one, to the intended column.
    expect(src).toMatch(/\.from\(\s*['"]subscriptions['"]\s*\)/);
    expect(src).toMatch(/checkout_verified_at/);
  });

  it('scopes the write to the caller, not only to the subscription id', () => {
    // A signature proves the payment is real. It does not prove this session is
    // the one that made it, so the update must also be keyed to the JWT user id;
    // without it, a valid signature for another user's subscription would mark
    // this caller's row verified.
    expect(readFunction()).toMatch(/\.eq\(\s*['"]user_id['"]\s*,\s*user\.id\s*\)/);
  });

  it('checks the missing secret before it reads the body or the database', () => {
    const src = readFunction();
    // Bounded window: in the reference implementation the guard's `500` sits
    // well under 200 characters after its test.
    const guard = src.search(/!keySecret[\s\S]{0,200}?500/);
    const body = src.search(/await req\.json\(/);
    const client = src.search(/createClient\(/);
    expect(guard).toBeGreaterThan(-1);
    expect(body).toBeGreaterThan(-1);
    expect(client).toBeGreaterThan(-1);
    // Moved after the body check, an unconfigured deployment would answer 400
    // for a request that also omitted a field, masking the misconfiguration as
    // a client error.
    expect(guard).toBeLessThan(body);
    expect(guard).toBeLessThan(client);
    expect(src).toMatch(/Payments are not configured\./);
  });
});
