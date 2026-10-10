// Static guard for the webhook edge function.
//
// The function's real verification is an operator curl against a deployed
// function, which CI cannot reach. This test reads the function's text and pins
// the security-relevant ordering the spec mandates: the raw body is read before
// anything parses it, the signature is verified before the body is parsed and
// before the first database call, the entitlement write's plan comes from the
// subscription row rather than the webhook body, and the webhook is registered
// without JWT verification. It catches a later edit; it does not replace the
// live checks.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const FUNCTION = path.resolve(process.cwd(), 'supabase/functions/billing-webhook/index.ts');
const CONFIG = path.resolve(process.cwd(), 'supabase/config.toml');

// Read inside each test, not at module load: a missing file should fail a test
// with a clear message, not error the whole file at import time.
const readFunction = () => readFileSync(FUNCTION, 'utf8');

describe('billing-webhook edge function', () => {
  it('reads the raw body before it parses anything', () => {
    const src = readFunction();
    const text = src.indexOf('await req.text()');
    const parsed = src.indexOf('JSON.parse(');
    expect(text).toBeGreaterThan(-1);
    expect(parsed).toBeGreaterThan(-1);
    expect(text).toBeLessThan(parsed);
    // `req.json()` would consume the stream and hand back a re-serialised
    // object; the signature is over the raw bytes, so it must never appear.
    expect(src).not.toContain('req.json()');
  });

  it('verifies the signature before it parses the body', () => {
    const src = readFunction();
    const text = src.indexOf('await req.text()');
    const hmac = src.indexOf('hmacSha256Hex(');
    const parsed = src.indexOf('JSON.parse(');
    expect(hmac).toBeGreaterThan(text);
    expect(hmac).toBeLessThan(parsed);
    // The comparison alone proves only that a signature was computed. The
    // rejection is what makes that computation verification: without it an edit
    // could compute `expected` and discard it, leaving every other assertion in
    // this file green. The negation, the rejection, and their position before
    // the parse are all pinned.
    const compare = src.search(/if\s*\(\s*!\s*constantTimeEqual\(/);
    expect(compare).toBeGreaterThan(hmac);
    expect(compare).toBeLessThan(parsed);
    const reject = src.search(/return json\(\{ error: 'Invalid signature\.' \}, 400\)/);
    expect(reject).toBeGreaterThan(compare);
    expect(reject).toBeLessThan(parsed);
    // The other two rejection paths are the same kind of gate: a missing or
    // malformed signature cannot reach the secret check, and a missing secret
    // is a configuration error (500), not a signature failure (400).
    expect(src).toMatch(/return json\(\{ error: 'Missing or malformed signature\.' \}, 400\)/);
    expect(src).toMatch(/return json\(\{ error: 'Payments are not configured\.' \}, 500\)/);
  });

  it('writes an absolute, self-sourced grant for the subscription owner', () => {
    const src = readFunction();
    // The owner comes from the subscription row the server wrote at checkout,
    // never from the webhook body.
    expect(src).toMatch(/user_id:\s*sub\.user_id/);
    expect(src).not.toMatch(/user_id:\s*payload/);
    // 'razorpay', never 'admin': an admin-sourced row is exactly the grant the
    // billing path must not be able to create, and Task 7's trigger protects
    // such a row from removal.
    expect(src).toMatch(/source:\s*'razorpay'/);
    expect(src).not.toMatch(/source:\s*'admin'/);
    // An absolute assignment of the period end, so a redelivery cannot
    // compound access.
    expect(src).toMatch(/expires_at:\s*periodEnd/);
  });

  it('records the event id after it processes the event', () => {
    const src = readFunction();
    const grant = src.indexOf(".from('entitlements')");
    const record = src.indexOf(".from('webhook_events')");
    expect(grant).toBeGreaterThan(-1);
    expect(record).toBeGreaterThan(-1);
    // Recording first would swallow a retry: the retry would see a duplicate
    // and return 200 while the grant was never written.
    expect(record).toBeGreaterThan(grant);
  });

  it('answers a routine event with 200, not 5xx', () => {
    const src = readFunction();
    // Razorpay disables a webhook that answers non-2xx for a day. An unknown
    // event type or subscription is routine, so the success path's status must
    // stay the default 200.
    expect(src).toMatch(/return json\(\{ received: true \}\)/);
  });

  it('verifies the signature before the first database call', () => {
    const src = readFunction();
    const hmac = src.indexOf('hmacSha256Hex(');
    const client = src.indexOf('createClient(');
    const firstFrom = src.indexOf(".from('");
    expect(client).toBeGreaterThan(-1);
    expect(firstFrom).toBeGreaterThan(-1);
    expect(hmac).toBeLessThan(client);
    expect(hmac).toBeLessThan(firstFrom);
  });

  it('takes the entitlement plan from the subscription row, not the body', () => {
    const src = readFunction();
    expect(src).toMatch(/plan:\s*sub\.plan/);
    expect(src).not.toMatch(/plan:\s*payload/);
    // The `source <> 'admin'` guard is Task 7's trigger, not an RPC here. A
    // stray rpc( would mean this function calls a database function that
    // neither plan defines, and the guard would silently not exist.
    expect(src).not.toMatch(/\brpc\(/);
  });

  it('writes the entitlement at exactly one place', () => {
    const hits = [...readFunction().matchAll(/\.from\('entitlements'\)/g)];
    expect(hits).toHaveLength(1);
  });

  it('registers the webhook without JWT verification', () => {
    const toml = readFileSync(CONFIG, 'utf8');
    const start = toml.search(/\[functions\.billing-webhook\]/);
    expect(start).toBeGreaterThan(-1);
    // Only this function's own block, so a `verify_jwt` elsewhere in the file
    // cannot satisfy it.
    expect(toml.slice(start)).toMatch(/verify_jwt\s*=\s*false/);
  });
});
