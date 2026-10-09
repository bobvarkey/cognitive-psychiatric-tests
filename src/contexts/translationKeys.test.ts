import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// t() falls back to the raw key, so a key without a dictionary entry renders as
// e.g. "calculateResults" on a button. Every literal key used in the app must exist.
const ctx = readFileSync(join(process.cwd(), 'src/contexts/LanguageContext.tsx'), 'utf8');
const enStart = ctx.indexOf('  en: {');
const mlStart = ctx.indexOf('  ml: {');
const keysOf = (block: string) =>
  new Set([...block.matchAll(/^\s*(?:'([^']+)'|([A-Za-z_]\w*))\s*:/gm)].map((m) => m[1] || m[2]));
const en = keysOf(ctx.slice(enStart, mlStart));
const ml = keysOf(ctx.slice(mlStart, ctx.indexOf('\n};', mlStart)));

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return sourceFiles(p);
    return /\.tsx?$/.test(f) && !/\.test\./.test(f) ? [p] : [];
  });
}

const used = new Map<string, string>();
for (const file of sourceFiles(join(process.cwd(), 'src'))) {
  const src = readFileSync(file, 'utf8');
  if (!src.includes('useLanguage')) continue;
  for (const m of src.matchAll(/(?<![\w.])t\(\s*['"]([^'"]+)['"]\s*\)/g)) used.set(m[1], file);
}

describe('translation keys', () => {
  it('finds the dictionaries and the keys in use', () => {
    expect(en.size).toBeGreaterThan(100);
    expect(used.size).toBeGreaterThan(10);
  });

  it('every t() key used in the app has English and Malayalam text', () => {
    const missing = [...used.keys()].filter((k) => !en.has(k) || !ml.has(k));
    expect(missing).toEqual([]);
  });
});
