// Static guard for the plan catalogue migration.
//
// This pins the two properties that would otherwise fail silently in
// production — the catalogue becoming client-writable, and a seeded price
// drifting. The live database check lives in the operator runbook; this
// catches a later edit.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const MIGRATION = path.resolve(
  process.cwd(),
  'supabase/migrations/20261009120000_billing_plans.sql',
);

// Read inside each test, not at module load: a missing file should fail a test
// with a clear message, not error the whole test file at import time.
const readMigration = () => readFileSync(MIGRATION, 'utf8');

describe('billing_plans migration', () => {
  it('enables row level security and never disables it', () => {
    const sql = readMigration();
    expect(sql).toMatch(
      /ALTER TABLE\s+public\.billing_plans\s+ENABLE ROW LEVEL SECURITY/i,
    );
    expect(sql).not.toMatch(/DISABLE ROW LEVEL SECURITY/i);
  });

  it('creates a SELECT policy and no write policy', () => {
    const sql = readMigration();
    expect(sql).toMatch(/ON\s+public\.billing_plans\s+FOR\s+SELECT/i);
    // `ALL` matters as much as INSERT/UPDATE/DELETE — a FOR ALL policy permits
    // inserts. And the anchor must be \s+, not a literal space: this very
    // migration already breaks `ON public.billing_plans` / `FOR EACH ROW`
    // across two lines, so a space-anchored regex silently skips that shape.
    expect(sql).not.toMatch(
      /ON\s+public\.billing_plans\s+FOR\s+(INSERT|UPDATE|DELETE|ALL)/i,
    );
  });

  it('grants only SELECT to anon and authenticated', () => {
    const sql = readMigration();
    expect(sql).toMatch(
      /GRANT\s+SELECT\s+ON\s+public\.billing_plans\s+TO\s+anon,\s*authenticated/i,
    );
    // TRUNCATE is in the alternation because RLS does not apply to it, so a
    // TRUNCATE grant would bypass "no client writes" without any write policy.
    expect(sql).not.toMatch(/GRANT\s+(INSERT|UPDATE|DELETE|ALL|TRUNCATE)/i);
  });

  it('seeds the four expected prices in minor units', () => {
    const seeds = [
      ...readMigration().matchAll(/\(\s*'(monthly|yearly)',\s*'(INR|USD)',\s*(\d+),/g),
    ]
      .map((m) => `${m[1]}-${m[2]}=${m[3]}`)
      .sort();
    expect(seeds).toEqual([
      'monthly-INR=29900',
      'monthly-USD=299',
      'yearly-INR=299900',
      'yearly-USD=2499',
    ]);
  });
});
