import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { openDB } from 'idb';
import { encryptString, decryptString, getDeviceKey } from './patientCrypto';
import {
  saveResultOffline, getOfflineResults, migrateLegacyPatientData,
  clearLocalPatientData, LEGACY_DRAFT_KEYS,
} from './db';

// `rpc` is stubbed because entitlement.ts binds it at module load; a mock
// without it makes that import throw before any test in this file can run.
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: { signOut: vi.fn(() => Promise.resolve({ error: null })) },
    rpc: vi.fn(),
  },
}));

const rawRows = async () => {
  const db = await openDB('cognito_db');
  const rows = await db.getAll('results');
  db.close();
  return rows;
};

describe('patient data encryption at rest', () => {
  beforeEach(async () => {
    await clearLocalPatientData();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('round-trips a string through AES-GCM with a non-extractable key', async () => {
    const enc = await encryptString('Jane Doe / MRN-123');
    expect(JSON.stringify(enc)).not.toContain('Jane');
    expect(await decryptString(enc)).toBe('Jane Doe / MRN-123');
    const key = await getDeviceKey();
    expect(key.extractable).toBe(false);
    expect(key.algorithm.name).toBe('AES-GCM');
  });

  it('uses a fresh IV per encryption', async () => {
    const a = await encryptString('same');
    const b = await encryptString('same');
    expect(a.iv).not.toBe(b.iv);
    expect(a.ct).not.toBe(b.ct);
  });

  it('stores the patient field encrypted and returns it decrypted', async () => {
    await saveResultOffline({ key: 'phq9', name: 'PHQ-9', score: 12, patient: 'John Smith', completedAt: 1 });
    const [row] = await rawRows();
    expect(row.patient).toBeUndefined();
    expect(JSON.stringify(row)).not.toContain('John Smith');
    expect(row.score).toBe(12);
    const [result] = await getOfflineResults();
    expect(result.patient).toBe('John Smith');
    expect(result.score).toBe(12);
  });

  it('migrates legacy plaintext identifiers and wipes legacy localStorage drafts', async () => {
    const db = await openDB('cognito_db');
    await db.put('results', { key: 'iqcode', name: 'IQCODE', score: 3.4, patient: 'Legacy Patient', completedAt: 5 });
    await db.put('results', { key: 'mmse', name: 'MMSE', score: 25, completedAt: 6 });
    db.close();
    LEGACY_DRAFT_KEYS.forEach(k => localStorage.setItem(k, JSON.stringify({ patientInfo: { name: 'X' } })));
    localStorage.setItem('unrelated', 'keep');

    expect(await migrateLegacyPatientData()).toEqual({ encrypted: 1, stripped: 0 });
    LEGACY_DRAFT_KEYS.forEach(k => expect(localStorage.getItem(k)).toBeNull());
    expect(localStorage.getItem('unrelated')).toBe('keep');
    const rows = await rawRows();
    expect(JSON.stringify(rows)).not.toContain('Legacy Patient');
    const results = await getOfflineResults();
    expect(results.find(r => r.completedAt === 5)?.patient).toBe('Legacy Patient');
    expect(results.find(r => r.completedAt === 6)?.score).toBe(25);
    // idempotent
    expect(await migrateLegacyPatientData()).toEqual({ encrypted: 0, stripped: 0 });
  });

  it('clears all local patient data on sign-out', async () => {
    const { signOut } = await import('./entitlement');
    await saveResultOffline({ key: 'phq9', name: 'PHQ-9', score: 5, patient: 'To Be Wiped', completedAt: 9 });
    const enc = await encryptString('old');
    sessionStorage.setItem(LEGACY_DRAFT_KEYS[0], '{}');
    await signOut();
    expect(await getOfflineResults()).toEqual([]);
    expect(sessionStorage.getItem(LEGACY_DRAFT_KEYS[0])).toBeNull();
    // device key was destroyed: old ciphertext is no longer decryptable
    await expect(decryptString(enc)).rejects.toBeTruthy();
  });
});
