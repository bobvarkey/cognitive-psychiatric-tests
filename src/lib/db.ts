import { openDB, IDBPDatabase } from 'idb';

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

export const saveResultOffline = async (result: AssessmentResult) => {
  const db = await getDB();
  await db.put('results', { ...result, synced: false });
};

export const getOfflineResults = async (): Promise<AssessmentResult[]> => {
  const db = await getDB();
  return db.getAllFromIndex('results', 'completedAt');
};

export const deleteOfflineResult = async (completedAt: number) => {
  const db = await getDB();
  await db.delete('results', completedAt);
};

export const clearOfflineResults = async () => {
  const db = await getDB();
  await db.clear('results');
};
