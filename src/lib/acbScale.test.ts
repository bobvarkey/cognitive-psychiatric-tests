import { describe, it, expect } from 'vitest';
import { ACB_DRUGS } from '@/data/acbDrugs';
import {
  ACB_CLINICAL_THRESHOLD,
  acbInterpretation,
  acbLevel,
  acbTotal,
  buildAcbText,
  searchAcbDrugs,
} from '@/lib/acbScale';
import { downloadResultsText } from '@/lib/copyResults';
import { buildAcbReport } from '@/lib/acbScale';

const find = (name: string) => ACB_DRUGS.find((d) => d.name === name)!;

describe('ACB drug list', () => {
  it('is bundled with valid 0–3 scores and unique names', () => {
    expect(ACB_DRUGS.length).toBeGreaterThan(1000);
    expect(ACB_DRUGS.every((d) => [0, 1, 2, 3].includes(d.score))).toBe(true);
    expect(new Set(ACB_DRUGS.map((d) => d.name.toLowerCase())).size).toBe(ACB_DRUGS.length);
  });

  it('carries the expected reference scores', () => {
    expect(find('Amitriptyline').score).toBe(3);
    expect(find('Oxybutynin').score).toBe(3);
    expect(find('Alprazolam').score).toBe(1);
    expect(find('Amlodipine').score).toBe(0);
  });
});

describe('ACB scoring', () => {
  it('sums per-drug scores', () => {
    expect(acbTotal([])).toBe(0);
    expect(acbTotal([{ score: 3 }, { score: 1 }, { score: 2 }])).toBe(6);
  });

  it('clamps out-of-range manual scores to 0–3', () => {
    expect(acbTotal([{ score: 7 }, { score: -2 }, { score: Number.NaN }])).toBe(3);
  });

  it('applies the clinically relevant threshold at 3', () => {
    expect(ACB_CLINICAL_THRESHOLD).toBe(3);
    expect(acbLevel(0)).toBe('none');
    expect(acbLevel(1)).toBe('low');
    expect(acbLevel(2)).toBe('low');
    expect(acbLevel(3)).toBe('high');
    expect(acbLevel(9)).toBe('high');
    expect(acbInterpretation(2)).toBe('Low anticholinergic burden');
    expect(acbInterpretation(3)).toBe('Clinically relevant anticholinergic burden');
  });
});

describe('ACB search', () => {
  it('finds generics by prefix first and brands too', () => {
    expect(searchAcbDrugs('amitr')[0].drug.name).toBe('Amitriptyline');
    const brand = searchAcbDrugs('xanax');
    expect(brand[0].drug.name).toBe('Alprazolam');
    expect(brand[0].viaBrand).toBe('Xanax');
    expect(searchAcbDrugs('  ')).toEqual([]);
  });
});

describe('ACB copy / .txt format', () => {
  const selected = [
    { id: 'a', name: 'Amitriptyline', score: 3 },
    { id: 'b', name: 'Alprazolam', score: 1 },
    { id: 'c', name: 'Custom med', score: 2, custom: true },
  ];

  it('is exactly name, one line per drug, total, interpretation', () => {
    expect(buildAcbText(selected)).toBe(
      [
        'Anticholinergic Burden (ACB) Scale',
        'Amitriptyline: 3',
        'Alprazolam: 1',
        'Custom med: 2',
        'Total score: 6',
        'Interpretation: Clinically relevant anticholinergic burden',
      ].join('\n'),
    );
  });

  it('has no blank lines, markdown, URLs, timestamps or disclaimers', () => {
    const text = buildAcbText(selected);
    expect(text).not.toMatch(/\n\s*\n|[*#`]|https?:|www\.|tok_|\d{4}-\d{2}-\d{2}|N\/A|judgement|Cognito/i);
  });

  it('keeps zero-score drugs and the "None" interpretation for a zero total', () => {
    expect(buildAcbText([{ id: 'x', name: 'Amlodipine', score: 0 }])).toBe(
      'Anticholinergic Burden (ACB) Scale\nAmlodipine: 0\nTotal score: 0\nInterpretation: No anticholinergic burden',
    );
  });

  it('download text matches the copy text', () => {
    const origCreate = URL.createObjectURL;
    URL.createObjectURL = () => 'blob:x';
    URL.revokeObjectURL = () => {};
    try {
      expect(downloadResultsText(buildAcbReport(selected))).toBe(buildAcbText(selected));
    } finally {
      URL.createObjectURL = origCreate;
    }
  });
});
