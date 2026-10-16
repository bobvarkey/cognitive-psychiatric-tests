/**
 * At-rest encryption for patient-identifying fields stored on the device.
 *
 * Threat model (be honest about it):
 * - A random AES-GCM-256 key is generated once per device/browser profile with
 *   WebCrypto as NON-EXTRACTABLE and stored as a CryptoKey object in IndexedDB.
 *   Its raw bytes cannot be read out by JavaScript, exported, or copied into a
 *   backup/export of the results store.
 * - This protects against casual inspection (DevTools, IndexedDB viewers,
 *   copied/exported browser storage, data dumps of the results store alone).
 * - It does NOT protect against a fully compromised device or browser profile:
 *   anyone (or any script, e.g. via XSS) able to run code in this origin can ask
 *   WebCrypto to decrypt with the stored key.
 */
import { openDB, IDBPDatabase } from 'idb';

const KEY_DB_NAME = 'cognito_keys';
const KEY_STORE = 'keys';
const KEY_ID = 'patient-data-v1';

export interface EncryptedField {
  v: 1;
  iv: string; // base64
  ct: string; // base64
}

let keyDbPromise: Promise<IDBPDatabase> | null = null;
let keyPromise: Promise<CryptoKey> | null = null;

const getKeyDB = () => {
  if (!keyDbPromise) {
    keyDbPromise = openDB(KEY_DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(KEY_STORE)) db.createObjectStore(KEY_STORE);
      },
    });
  }
  return keyDbPromise;
};

const toB64 = (buf: ArrayBuffer | Uint8Array) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  bytes.forEach(b => { s += String.fromCharCode(b); });
  return btoa(s);
};
const fromB64 = (b64: string) => Uint8Array.from(atob(b64), c => c.charCodeAt(0));

/** Returns this device's non-extractable patient-data key, creating it on first use. */
export const getDeviceKey = (): Promise<CryptoKey> => {
  if (!keyPromise) {
    keyPromise = (async () => {
      const db = await getKeyDB();
      const existing = (await db.get(KEY_STORE, KEY_ID)) as CryptoKey | undefined;
      if (existing) return existing;
      const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        false, // non-extractable
        ['encrypt', 'decrypt'],
      );
      await db.put(KEY_STORE, key, KEY_ID);
      return key;
    })().catch(err => {
      keyPromise = null;
      throw err;
    });
  }
  return keyPromise;
};

export const isEncryptedField = (value: unknown): value is EncryptedField =>
  !!value && typeof value === 'object' && (value as EncryptedField).v === 1 &&
  typeof (value as EncryptedField).iv === 'string' && typeof (value as EncryptedField).ct === 'string';

export const encryptString = async (plaintext: string): Promise<EncryptedField> => {
  const key = await getDeviceKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plaintext));
  return { v: 1, iv: toB64(iv), ct: toB64(ct) };
};

export const decryptString = async (field: EncryptedField): Promise<string> => {
  const key = await getDeviceKey();
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(field.iv) }, key, fromB64(field.ct));
  return new TextDecoder().decode(pt);
};

/** Destroys the device key. Anything encrypted with it becomes unreadable. */
export const deleteDeviceKey = async (): Promise<void> => {
  const db = await getKeyDB();
  await db.delete(KEY_STORE, KEY_ID);
  keyPromise = null;
};
