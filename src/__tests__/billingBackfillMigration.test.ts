// Static guard for Task 7's backfill migration.
//
// The migration runs once, by hand, in the operator's SQL editor against the
// real database. There is no runnable verification for it here, and a bad
// backfill is repaired by another hand-run SQL statement, not by re-running this
// file. This test reads its text and pins the two properties whose loss fails
// silently in production, and only for some buyers:
//
//   1. The entitlements insert must produce at most one row per buyer. Two paid
//      rows for one email (the column is not unique) otherwise address the same
//      `ON CONFLICT (user_id)` target twice, which Postgres rejects with SQLSTATE
//      21000 — aborting the whole statement, so nobody is granted.
//   2. The upsert must never move a buyer's expiry backwards, or a legacy row
//      with an older period end shortens a later razorpay/trial/demo grant.
//
// It catches a later edit. The live database check is the operator's read-back.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const BACKFILL = path.resolve(
  process.cwd(),
  'supabase/migrations/20261009120300_backfill_web_subscriptions.sql',
);

// Read inside each test, not at module load: a missing file should fail a test
// with a clear message, not error the whole file at import time.
const readBackfill = () => readFileSync(BACKFILL, 'utf8');

// Statement 1 (the entitlements insert) runs from its INSERT to the closing `;`.
//
// A `;` inside a `--` comment is not a statement terminator in Postgres, but a
// naive first-`;` split treats it as one. The fixed statement 1's own comment
// contains semicolons ("same `user_id` twice …"), so comments are stripped
// before slicing. This changes only what is scanned for the terminator; every
// assertion below still pins code, and the old (defective) statement 1 still
// fails them.
const stripSqlComments = (sql: string) => sql.replace(/--[^\n]*/g, '');

const entitlementsStatement = (sql: string) =>
  stripSqlComments(sql).match(/INSERT\s+INTO\s+public\.entitlements[\s\S]*?;/i)?.[0] ?? '';

// The upsert half of that statement: from ON CONFLICT to the same `;`.
const upsertClause = (stmt: string) =>
  stmt.match(/ON\s+CONFLICT[\s\S]*$/i)?.[0] ?? '';

describe('backfill migration — entitlements insert', () => {
  it('deduplicates the source so one buyer is never written twice', () => {
    const stmt = entitlementsStatement(readBackfill());
    expect(stmt).not.toBe('');
    // Without DISTINCT ON (u.id) two paid rows for one email address the same
    // conflict target twice and abort the statement (SQLSTATE 21000).
    expect(stmt).toMatch(/DISTINCT ON\s*\(\s*u\.id\s*\)/i);
  });

  it('never overwrites an admin grant, and never moves an expiry backwards', () => {
    const upsert = upsertClause(entitlementsStatement(readBackfill()));
    expect(upsert).toMatch(/DO\s+UPDATE/i);
    // Admin is preserved by this clause, and by the BEFORE UPDATE trigger.
    expect(upsert).toMatch(/source\s*<>\s*'admin'/i);
    // The expiry only ever moves forward: a permanent (NULL) or later grant is
    // left untouched, so a legacy row cannot shorten a paying customer's access.
    expect(upsert).toMatch(/expires_at\s+IS\s+NOT\s+NULL/i);
    expect(upsert).toMatch(/expires_at\s*<\s*EXCLUDED\.expires_at/i);
  });
});

describe('backfill migration — subscriptions insert', () => {
  it("keeps the buyer's own timestamp and the unique-key guard", () => {
    const sql = readBackfill();
    expect(sql).toMatch(/ws\.created_at/);
    expect(sql).toMatch(/NOT\s+EXISTS\s*\(/i);
  });
});
