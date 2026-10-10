// Static guard for the plan catalogue migration.
//
// The properties this pins — the catalogue is client-writable, and the seeded
// price is wrong — are the two that would fail silently in production. The live
// database check lives in the operator runbook; this catches a later edit.
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
  it('enables row level security', () => {
    expect(readMigration()).toMatch(
      /ALTER TABLE public\.billing_plans ENABLE ROW LEVEL SECURITY/,
    );
  });

  it('creates a SELECT policy and no write policy', () => {
    const sql = readMigration();
    expect(sql).toMatch(/ON public\.billing_plans FOR SELECT/);
    expect(sql).not.toMatch(/ON public\.billing_plans FOR (INSERT|UPDATE|DELETE)/);
  });

  it('grants only SELECT to anon and authenticated', () => {
    const sql = readMigration();
    expect(sql).toMatch(/GRANT SELECT ON public\.billing_plans TO anon, authenticated/);
    expect(sql).not.toMatch(/GRANT\s+(INSERT|UPDATE|DELETE|ALL)/i);
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
