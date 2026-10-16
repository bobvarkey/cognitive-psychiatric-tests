import { openDB, IDBPDatabase } from 'idb';
import { encryptString, decryptString, isEncryptedField, deleteDeviceKey, EncryptedField } from './patientCrypto';

const DB_NAME = 'cognito_db';
const DB_VERSION = 2; // Incremented for schema change

export interface AssessmentResult {
  key: string;          // assessment key
  name: string;         // display name
  score?: number | string;
  interpretation?: string;
  patient?: string;
  completedAt: number;  // epoch ms
  synced?: boolean;
}

/** Shape actually written to IndexedDB: the patient identifier is only stored encrypted. */
type StoredResult = Omit<AssessmentResult, 'patient'> & { patient?: unknown; patientEnc?: EncryptedField };

/** Legacy localStorage keys that held in-progress drafts (DAPHNE-6 draft included patient name). */
export const LEGACY_DRAFT_KEYS = ['cognito.daphne6.draft.v1', 'cognito.iqcode.draft.v1'];

let dbPromise: Promise<IDBPDatabase> | null = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('results')) {
          const store = db.createObjectStore('results', { keyPath: 'completedAt' });
          store.createIndex('completedAt', 'completedAt');
          store.createIndex('synced', 'synced');
        }
      },
    });
  }
  return dbPromise;
};

const toStored = async (result: AssessmentResult): Promise<StoredResult> => {
  const { patient, ...rest } = result;
  const stored: StoredResult = { ...rest };
  if (patient) stored.patientEnc = await encryptString(patient);
  return stored;
};

const fromStored = async (stored: StoredResult): Promise<AssessmentResult> => {
  const { patient, patientEnc, ...rest } = stored;
  const result: AssessmentResult = { ...rest };
  if (patientEnc && isEncryptedField(patientEnc)) {
    try {
      result.patient = await decryptString(patientEnc);
    } catch {
      // Key missing/rotated: identifier is unrecoverable; keep the rest of the record.
    }
  } else if (typeof patient === 'string' && patient) {
    result.patient = patient; // legacy plaintext not yet migrated
  }
  return result;
};

export const saveResultOffline = async (result: AssessmentResult) => {
  const db = await getDB();
  await db.put('results', await toStored({ ...result, synced: false }));
};

export const getOfflineResults = async (): Promise<AssessmentResult[]> => {
  const db = await getDB();
  const rows = (await db.getAllFromIndex('results', 'completedAt')) as StoredResult[];
  return Promise.all(rows.map(fromStored));
};

export const deleteOfflineResult = async (completedAt: number) => {
  const db = await getDB();
  await db.delete('results', completedAt);
};

export const clearOfflineResults = async () => {
  const db = await getDB();
  await db.clear('results');
};

const removeKeys = (storage: Storage | undefined, keys: string[]) => {
  try { keys.forEach(k => storage?.removeItem(k)); } catch { /* storage unavailable */ }
};

/**
 * One-time (idempotent) migration run on app load: encrypts any plaintext
 * `patient` identifiers left in IndexedDB and wipes legacy localStorage drafts.
 * If encryption is unavailable, the plaintext identifier is stripped instead.
 */
export const migrateLegacyPatientData = async (): Promise<{ encrypted: number; stripped: number }> => {
  removeKeys(globalThis.localStorage, LEGACY_DRAFT_KEYS);
  let encrypted = 0;
  let stripped = 0;
  const db = await getDB();
  const rows = (await db.getAll('results')) as StoredResult[];
  for (const row of rows) {
    if (row.patient === undefined) continue;
    const { patient, ...rest } = row;
    const next: StoredResult = { ...rest };
    if (typeof patient === 'string' && patient) {
      try {
        next.patientEnc = await encryptString(patient);
        encrypted++;
      } catch {
        stripped++;
      }
    } else {
      stripped++;
    }
    await db.put('results', next);
  }
  return { encrypted, stripped };
};

/**
 * Removes all patient data held on this device: saved results, the device
 * encryption key, and any in-progress drafts. Called on sign-out.
 */
export const clearLocalPatientData = async (): Promise<void> => {
  removeKeys(globalThis.localStorage, LEGACY_DRAFT_KEYS);
  removeKeys(globalThis.sessionStorage, LEGACY_DRAFT_KEYS);
  const db = await getDB();
  await db.clear('results');
  await deleteDeviceKey();
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('cognito:results-updated'));
};
