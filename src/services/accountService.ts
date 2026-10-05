export const deleteLocalAccount = async (): Promise<void> => {
  try {
    localStorage.clear();
  } catch (e) {
    console.error('Failed to clear localStorage', e);
  }

  try {
    sessionStorage.clear();
  } catch (e) {
    console.error('Failed to clear sessionStorage', e);
  }

  try {
    if ('indexedDB' in window && typeof (indexedDB as any).databases === 'function') {
      const dbs = await (indexedDB as any).databases();
      await Promise.all(
        dbs.map((db: { name?: string }) =>
          db.name
            ? new Promise<void>((resolve) => {
                const req = indexedDB.deleteDatabase(db.name!);
                req.onsuccess = req.onerror = req.onblocked = () => resolve();
              })
            : Promise.resolve()
        )
      );
    }
  } catch (e) {
    console.error('Failed to clear IndexedDB', e);
  }

  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch (e) {
    console.error('Failed to clear Cache API', e);
  }

  try {
    document.cookie.split(';').forEach((c) => {
      const eq = c.indexOf('=');
      const name = (eq > -1 ? c.substr(0, eq) : c).trim();
      if (name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });
  } catch (e) {
    console.error('Failed to clear cookies', e);
  }
};
