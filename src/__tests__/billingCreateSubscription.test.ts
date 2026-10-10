// Static guard for the create-subscription edge function.
//
// The function's real verification is an operator curl against a deployed
// function, which CI cannot reach. This test reads the function's text and
// pins the properties the spec names — that the price, the plan id and the
// user id come from the server rather than the request body, and that the
// missing-secret guard runs before anything reaches Razorpay. It catches a
// later edit; it does not replace the live check.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const FUNCTION = path.resolve(
  process.cwd(),
  'supabase/functions/billing-create-subscription/index.ts',
);

// Read inside each test, not at module load: a missing file should fail a test
// with a clear message, not error the whole file at import time.
const readFunction = () => readFileSync(FUNCTION, 'utf8');

describe('billing-create-subscription edge function', () => {
  it('reads the plan row from the billing_plans table', () => {
    expect(readFunction()).toMatch(/\.from\(['"]billing_plans['"]\)/);
  });

  it('sends the plan id that the table returned to Razorpay', () => {
    expect(readFunction()).toMatch(/plan_id:\s*plan\.razorpay_plan_id/);
  });

  it('takes nothing from the request body but the plan code and currency', () => {
    const src = readFunction();
    expect(src).toMatch(/parseCreateSubscriptionRequest\(/);
    // The parsed result carries only `plan` and `currency`, so reading anything
    // else out of it — or out of the raw body — is how a browser-supplied price
    // or user id would enter. `parsed.plan` does not contain any of these
    // strings, so each is a distinct check rather than a substring of another.
    for (const forbidden of [
      'parsed.amount',
      'parsed.price',
      'parsed.user_id',
      'parsed.plan_id',
      'parsed.razorpay_plan_id',
      'parsed.total_count',
    ]) {
      expect(src).not.toContain(forbidden);
    }
    // A second read of the body would be a new place for a browser-supplied
    // value to enter; the parser is the only intended reader.
    expect([...src.matchAll(/req\.json\(/g)]).toHaveLength(1);
    // The amount returned is the catalogue row's, not anything from the caller.
    expect(src).toMatch(/return json\(\{[\s\S]{0,200}?amount:\s*plan\.amount/);
  });

  it('takes the user id from the verified JWT', () => {
    const src = readFunction();
    expect(src).toMatch(/auth\.getUser\(/);
    expect(src).toMatch(/user_id:\s*user\.id/);
  });

  it('distinguishes a catalogue error from a plan that is simply absent', () => {
    const src = readFunction();
    // A schema drift, a missing grant, or a typo'd column must not surface as
    // the client-facing 404 "not available", which is indistinguishable from a
    // legitimately absent row and leaves no server-side trace.
    expect(src).toMatch(/if \(planError\)/);
    const err500 = src.search(/if \(planError\)[\s\S]{0,200}?500/);
    expect(err500).toBeGreaterThan(-1);
    expect(src).toMatch(/if \(!plan\)/);
    const notFound = src.search(/if \(!plan\)[\s\S]{0,120}?404/);
    expect(notFound).toBeGreaterThan(-1);
  });

  it('runs the missing-secret guard first', () => {
    const src = readFunction();
    // Bounded window: in the reference implementation the guard's `500` sits
    // ~90 characters after its test, and the outbound call ~1300 characters
    // further on, so 300 cannot span past the guard into the fetch.
    const guard = src.search(/!keyId\s*\|\|\s*!keySecret[\s\S]{0,300}?500/);
    const outbound = src.search(/api\.razorpay\.com/);
    const parse = src.search(/parseCreateSubscriptionRequest\(/);
    expect(guard).toBeGreaterThan(-1);
    expect(outbound).toBeGreaterThan(-1);
    expect(parse).toBeGreaterThan(-1);
    // Everything after the guard can answer with a different status: 400 from
    // the body parse, 404 from the catalogue lookup, 502 from Razorpay. The
    // guard must precede at least the body parse and the outbound call, or
    // Step 6's missing-secret curl returns the wrong code for a request that
    // also happens to carry a bad body.
    expect(guard).toBeLessThan(parse);
    expect(guard).toBeLessThan(outbound);
    expect(src).toMatch(/Payments are not configured\./);
  });
});
