import { describe, it, expect } from 'vitest';
import {
  evaluateAimsThreshold,
  evaluateSchoolerKane,
  buildSchoolerKaneReport,
  createInitialSchoolerKaneState,
  SK_SUBTYPES,
  type SchoolerKaneState,
} from './schoolerKaneCriteria';
import { formatResultsForCopy } from '@/lib/copyResults';

const allMet = (aims: Record<string, number>): SchoolerKaneState => ({
  ...createInitialSchoolerKaneState(),
  exposure: true,
  aims,
  noAlternative: true,
});

describe('Schooler-Kane AIMS threshold', () => {
  it('one body area rated 3 meets the threshold', () => {
    const r = evaluateAimsThreshold({ tongue: 3 });
    expect(r.met).toBe(true);
    expect(r.qualifyingIds).toEqual(['tongue']);
  });

  it('two body areas rated 2 meet the threshold', () => {
    const r = evaluateAimsThreshold({ lips: 2, upper: 2, face: 1 });
    expect(r.met).toBe(true);
    expect(r.qualifyingIds.sort()).toEqual(['lips', 'upper']);
  });

  it('only one body area rated 2 does not meet the threshold', () => {
    const r = evaluateAimsThreshold({ jaw: 2, face: 1, lower: 1 });
    expect(r.met).toBe(false);
    expect(r.qualifyingIds).toEqual([]);
  });

  it('global items 8-10 do not count towards the threshold', () => {
    expect(evaluateAimsThreshold({ overall: 4, incapacitation: 4, awareness: 4 }).met).toBe(false);
  });
});

describe('Schooler-Kane overall criteria', () => {
  it('meets probable TD when all three criteria are met', () => {
    const r = evaluateSchoolerKane(allMet({ tongue: 3 }));
    expect(r.meetsProbable).toBe(true);
    expect(r.interpretation).toBe('Meets Schooler-Kane criteria for probable TD');
    expect(r.aimsTotal).toBe(3);
  });

  it('any rule-out ticked means criteria are not met', () => {
    for (const id of ['spontaneous', 'huntington', 'tics', 'acuteEps', 'other']) {
      const r = evaluateSchoolerKane({ ...allMet({ tongue: 3 }), ruleOuts: { [id]: true } });
      expect(r.exclusionMet).toBe(false);
      expect(r.meetsProbable).toBe(false);
    }
  });

  it('reports which criterion is missing', () => {
    const r = evaluateSchoolerKane({ ...allMet({ tongue: 3 }), exposure: false });
    expect(r.meetsProbable).toBe(false);
    expect(r.missing).toEqual(['neuroleptic exposure ≥3 months']);
  });

  it('AIMS total sums items 1-7 only (0-28)', () => {
    const r = evaluateSchoolerKane(allMet({ face: 4, lips: 4, jaw: 4, tongue: 4, upper: 4, lower: 4, trunk: 4, overall: 4, incapacitation: 4, awareness: 4 }));
    expect(r.aimsTotal).toBe(28);
  });

  it('uses the original 1982 subtype timings', () => {
    const text = SK_SUBTYPES.map((s) => s.definition).join(' ');
    expect(text).not.toMatch(/4 to 8 weeks/i);
    expect(SK_SUBTYPES.find((s) => s.id === 'probable')?.definition).toMatch(/3 months/);
    expect(SK_SUBTYPES.find((s) => s.id === 'persistent')?.definition).toMatch(/6 months/);
  });

  it('copied text is results-only', () => {
    const text = formatResultsForCopy(buildSchoolerKaneReport({ ...allMet({ tongue: 3, lips: 1 }), subtype: 'probable' }));
    const lines = text.split('\n');
    expect(lines[0]).toBe('Schooler-Kane Criteria for Tardive Dyskinesia (TD)');
    expect(lines).toContain('AIMS 4 Tongue: 3 (Moderate)');
    expect(lines).toContain('Total score: 4/28 (AIMS items 1-7)');
    expect(lines).toContain('Interpretation: Meets Schooler-Kane criteria for probable TD');
    expect(text).not.toMatch(/AIMS 1 Facial/); // unanswered items omitted
    expect(text).not.toMatch(/\n\s*\n/);
  });
});
