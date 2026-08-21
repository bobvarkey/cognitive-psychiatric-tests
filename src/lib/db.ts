import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'cognito_db';
const DB_VERSION = 1;

export interface AssessmentResult {
  id: string;
  patientName?: string;
  patientAge?: string;
  patientSex?: string;
  assessmentType: string;
  score: number;
  totalScore: number;
  details: any;
  interpretation?: string;
  timestamp: string;
  synced?: boolean;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('results')) {
          const store = db.createObjectStore('results', { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp');
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
  return db.getAllFromIndex('results', 'timestamp');
};

export const deleteOfflineResult = async (id: string) => {
  const db = await getDB();
  await db.delete('results', id);
};

export const clearOfflineResults = async () => {
  const db = await getDB();
  await db.clear('results');
};
