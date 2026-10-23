import { ACB_DRUGS, type AcbDrug } from '@/data/acbDrugs';
import type { ReportData } from '@/utils/reportGenerator';
import { buildResultText } from '@/lib/copyResults';

export const ACB_SCALE_NAME = 'Anticholinergic Burden (ACB) Scale';

/** Total at or above which the burden is clinically relevant (Boustani 2008; Fox 2011). */
export const ACB_CLINICAL_THRESHOLD = 3;

export interface AcbSelection {
  id: string;
  name: string;
  score: number;
  custom?: boolean;
}

export type AcbLevel = 'none' | 'low' | 'high';

export function acbTotal(selected: Pick<AcbSelection, 'score'>[]): number {
  return selected.reduce((sum, d) => sum + (Number.isFinite(d.score) ? Math.max(0, Math.min(3, Math.round(d.score))) : 0), 0);
}

export function acbLevel(total: number): AcbLevel {
  if (total >= ACB_CLINICAL_THRESHOLD) return 'high';
  if (total >= 1) return 'low';
  return 'none';
}

export const ACB_INTERPRETATION: Record<AcbLevel, { en: string; ml: string }> = {
  none: { en: 'No anticholinergic burden', ml: 'ആന്റികോളിനെർജിക് ഭാരം ഇല്ല' },
  low: { en: 'Low anticholinergic burden', ml: 'കുറഞ്ഞ ആന്റികോളിനെർജിക് ഭാരം' },
  high: { en: 'Clinically relevant anticholinergic burden', ml: 'ക്ലിനിക്കലി പ്രാധാന്യമുള്ള ആന്റികോളിനെർജിക് ഭാരം' },
};

export const acbInterpretation = (total: number) => ACB_INTERPRETATION[acbLevel(total)].en;

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim();

export interface AcbSearchHit {
  drug: AcbDrug;
  /** Brand name that matched, when the match was on a brand rather than the generic. */
  viaBrand?: string;
}

/** Generic names first (prefix before substring), then brand matches. */
export function searchAcbDrugs(query: string, limit = 20, drugs: AcbDrug[] = ACB_DRUGS): AcbSearchHit[] {
  const q = norm(query);
  if (!q) return [];
  const prefix: AcbSearchHit[] = [];
  const contains: AcbSearchHit[] = [];
  const brand: AcbSearchHit[] = [];
  for (const drug of drugs) {
    const n = norm(drug.name);
    if (n.startsWith(q)) prefix.push({ drug });
    else if (n.includes(q)) contains.push({ drug });
    else {
      const b = drug.brands.find((x) => norm(x).includes(q));
      if (b) brand.push({ drug, viaBrand: b });
    }
  }
  return [...prefix, ...contains, ...brand].slice(0, limit);
}

export function buildAcbReport(selected: AcbSelection[]): ReportData {
  const total = acbTotal(selected);
  return {
    assessmentName: ACB_SCALE_NAME,
    date: new Date().toLocaleString(),
    totalScore: String(total),
    severity: acbInterpretation(total),
    sections: [
      {
        title: 'Medicines',
        items: selected.map((d) => `${d.name.replace(/[:\n\r]+/g, ' ').trim()}: ${Math.max(0, Math.min(3, Math.round(d.score)))}`),
        type: 'info',
      },
    ],
    disclaimer:
      'Supports medication review only. Medicines not listed are assumed to score 0. Clinical judgement is required.',
  };
}

/** Exact text used by Copy results and Download .txt. */
export const buildAcbText = (selected: AcbSelection[]) => buildResultText(buildAcbReport(selected));
