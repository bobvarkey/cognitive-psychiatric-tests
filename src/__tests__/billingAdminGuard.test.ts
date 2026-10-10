// Static guard for Task 7's three artifacts.
//
// The migration's admin-grant trigger and the two functions have no runnable
// verification: the trigger is exercised only by hand-run SQL in the operator's
// SQL editor, and the functions only by operator curls against a deployed
// function. This test reads their text and pins the properties those live checks
// name. It catches a later edit; it does not replace them.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const MIGRATION = path.resolve(
  process.cwd(),
  'supabase/migrations/20261009120200_entitlement_admin_guard.sql',
);
const CANCEL = path.resolve(process.cwd(), 'supabase/functions/billing-cancel/index.ts');
const RESTORE = path.resolve(process.cwd(), 'supabase/functions/billing-restore/index.ts');

// Read inside each test, not at module load: a missing file should fail a test
// with a clear message, not error the whole file at import time.
const readMigration = () => readFileSync(MIGRATION, 'utf8');
const readCancel = () => readFileSync(CANCEL, 'utf8');
const readRestore = () => readFileSync(RESTORE, 'utf8');

describe('entitlement admin guard migration', () => {
  it('fires on UPDATE, through the guard function', () => {
    const sql = readMigration();
    expect(sql).toMatch(/CREATE TRIGGER\s+entitlements_protect_admin/i);
    expect(sql).toMatch(/BEFORE\s+UPDATE\s+ON\s+(public\.)?entitlements/i);
    expect(sql).toMatch(
      /FOR\s+EACH\s+ROW\s+EXECUTE\s+FUNCTION\s+(public\.)?protect_admin_entitlement\s*\(\s*\)/i,
    );
    // A `BEFORE INSERT` trigger would never fire for the webhook: it reaches the
    // row through an upsert conflict, which takes the UPDATE path.
    expect(sql).not.toMatch(/BEFORE\s+INSERT/i);
  });

  it('discards the write silently, leaving an admin row exactly as it was', () => {
    const sql = readMigration();
    // Returning NEW instead of OLD would make the trigger a no-op and let every
    // webhook clobber the owner's developer grant.
    expect(sql).toMatch(/existing_source\s*=\s*'admin'[\s\S]{0,200}?RETURN\s+OLD/i);
    // Raising would surface as a 500 from the webhook, which must not 5xx on a
    // routine event — the row simply does not move.
    expect(sql).not.toMatch(/RAISE\s+EXCEPTION/i);
    // The protection is conditional: a non-admin row must still be written, or
    // the trigger would block the webhook's own grant and no one would ever get
    // access.
    expect(sql).toMatch(/END IF;\s*RETURN\s+NEW;/i);
  });
});

describe('billing-cancel edge function', () => {
  it('writes no entitlement, and keeps the period already paid for', () => {
    const src = readCancel();
    expect(src).not.toMatch(/\.from\(\s*['"]entitlements['"]\s*\)/);
    expect(src).not.toMatch(/\brpc\(/);
    // Cancelling at the cycle end, not immediately: the webhook records the
    // cancellation and access runs to the period the user paid for.
    expect(src).toMatch(/cancel_at_cycle_end:\s*1/);
    // The subscription is the caller's own: without this filter any signed-in
    // user could cancel a stranger's subscription.
    expect(src).toMatch(/\.eq\(\s*['"]user_id['"]\s*,\s*user\.id\s*\)/);
  });
});

describe('billing-restore edge function', () => {
  it('takes the email from the session and never from the body', () => {
    const src = readRestore();
    // Any body field is ignored, so this cannot be used to claim someone else's
    // purchase or to probe whether an address has ever paid.
    expect(src).not.toMatch(/req\.json\(/);
    expect(src).toMatch(/ilike\(\s*['"]email['"]\s*,\s*user\.email\s*\)/);
    // The grant comes only from a paid, unexpired row, and only for the
    // caller's own id.
    expect(src).toMatch(/\.eq\(\s*['"]status['"]\s*,\s*'paid'\s*\)/);
    expect(src).toMatch(/user\.email_confirmed_at/);
    expect(src).toMatch(/onConflict:\s*['"]user_id['"]/);
  });
});
