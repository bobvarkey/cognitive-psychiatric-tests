import "@testing-library/jest-dom";

// On Node 22+, the built-in `localStorage`/`sessionStorage` globals collide
// with jsdom's own implementation, leaving window.localStorage undefined.
// Install a minimal, version-independent Storage polyfill instead of relying
// on jsdom's, so tests behave the same on every Node version CI and
// contributors might run.
class MemoryStorage implements Storage {
  #store = new Map<string, string>();
  get length() {
    return this.#store.size;
  }
  clear() {
    this.#store.clear();
  }
  getItem(key: string) {
    return this.#store.has(key) ? this.#store.get(key)! : null;
  }
  key(index: number) {
    return Array.from(this.#store.keys())[index] ?? null;
  }
  removeItem(key: string) {
    this.#store.delete(key);
  }
  setItem(key: string, value: string) {
    this.#store.set(key, String(value));
  }
}

for (const prop of ["localStorage", "sessionStorage"] as const) {
  const storage = new MemoryStorage();
  Object.defineProperty(window, prop, { configurable: true, value: storage });
  Object.defineProperty(globalThis, prop, { configurable: true, value: storage });
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
