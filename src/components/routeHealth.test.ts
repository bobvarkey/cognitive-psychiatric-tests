import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

/**
 * Route / link health check.
 *
 * Every assessment card rendered on the home page (and in the sidebar) is keyed by
 * `key: '<assessmentKey>'`. Each key must be reachable by the routing logic in
 * AssessmentSelector, otherwise the card renders but clicking it opens nothing.
 *
 * This test statically analyses AssessmentSelector.tsx so that a missing routing
 * entry fails CI before deployment.
 */
const SOURCE = readFileSync(
  path.resolve(__dirname, 'AssessmentSelector.tsx'),
  'utf-8'
);

/** Keys routed outside the `withOnBack` map (special-cased branches). */
const SPECIAL_CASE_KEYS = [
  // psychosisKeys map
  'bprs', 'sapsSans', 'crdpss', 'sops', 'psyrats', 'vagus',
  // dedicated branches
  'adhdScreener', 'dpdr',
  // ADHD_SCREENERS branch
  'asrs6', 'asrs18', 'vanderbilt',
];

function getCardKeys(): string[] {
  return Array.from(SOURCE.matchAll(/\{ key: '([^']+)'/g)).map((m) => m[1]);
}

function getRoutedKeys(): Set<string> {
  const block = SOURCE.split('const withOnBack: Record<string, boolean> = {')[1]
    ?.split('};')[0];
  expect(block, 'withOnBack routing map not found').toBeTruthy();
  const routed = new Set(
    Array.from(block!.matchAll(/'?([\w-]+)'?\s*:\s*true/g)).map((m) => m[1])
  );
  SPECIAL_CASE_KEYS.forEach((k) => routed.add(k));
  return routed;
}

function getRenderableKeys(): Set<string> {
  const renderable = new Set<string>();
  const componentMap = SOURCE.split('const ComponentMap: Record<string, React.ComponentType<any>> = {')[1]?.split('\n      };')[0];
  const wrapMap = SOURCE.split('const wrapMap: Record<string, React.ReactNode> = {')[1]?.split('};')[0];
  [componentMap, wrapMap].forEach((block) => {
    if (!block) return;
    Array.from(block.matchAll(/^\s{8}'?([\w-]+)'?\s*:/gm)).forEach((m) =>
      renderable.add(m[1])
    );
  });
  // cognitiveSyndromes is rendered by its own branch
  renderable.add('cognitiveSyndromes');
  SPECIAL_CASE_KEYS.forEach((k) => renderable.add(k));
  return renderable;
}

describe('Home page route/link health', () => {
  const cardKeys = getCardKeys();

  it('finds assessment cards', () => {
    expect(cardKeys.length).toBeGreaterThan(50);
  });

  it('has no duplicate assessment keys', () => {
    const dupes = cardKeys.filter((k, i) => cardKeys.indexOf(k) !== i);
    expect(dupes, `duplicate assessment keys: ${dupes.join(', ')}`).toEqual([]);
  });

  it('routes every home page / sidebar card to a view', () => {
    const routed = getRoutedKeys();
    const missing = cardKeys.filter((k) => !routed.has(k));
    expect(
      missing,
      `These assessment cards have no routing entry (clicking them does nothing): ${missing.join(', ')}`
    ).toEqual([]);
  });

  it('maps every routed key to a renderable component', () => {
    const renderable = getRenderableKeys();
    const missing = cardKeys.filter((k) => !renderable.has(k));
    expect(
      missing,
      `These assessment keys route but render nothing: ${missing.join(', ')}`
    ).toEqual([]);
  });
});
