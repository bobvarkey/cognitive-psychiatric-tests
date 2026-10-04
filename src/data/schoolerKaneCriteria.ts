import type { ReportData } from '@/utils/reportGenerator';

/**
 * Schooler-Kane Research Diagnostic Criteria for Tardive Dyskinesia (RD-TD).
 * Schooler NR, Kane JM. Arch Gen Psychiatry. 1982;39:486-487.
 * Movement ratings use the embedded Abnormal Involuntary Movement Scale (AIMS;
 * Guy W, ECDEU Assessment Manual for Psychopharmacology, 1976).
 */

export const SCHOOLER_KANE_NAME = 'Schooler-Kane Criteria for Tardive Dyskinesia (TD)';

export const SK_IMAGE_ALT =
  'Schooler-Kane criteria for tardive dyskinesia: ≥3 months neuroleptic exposure, exclusion of other causes, AIMS ≥3 in one area or ≥2 in two areas; probable TD sustained ≥3 months, persistent TD ≥6 months.';
export const SK_IMAGE_CAPTION = 'Kane JM, Schooler NR. Arch Gen Psychiatry. 1982.';

export const SK_EXPOSURE_LABEL =
  'Cumulative neuroleptic/antipsychotic exposure of at least 3 months (continuous or discontinuous)';

export const AIMS_EXAM_PROCEDURE: string[] = [
  'Ask the patient whether there is anything in their mouth (e.g. gum, candy) and, if so, to remove it.',
  'Ask about the current condition of their teeth, whether they wear dentures, and whether teeth or dentures bother them now.',
  'Ask whether they notice any movements in the mouth, face, hands or feet. If yes, ask them to describe the movements and to what extent they currently bother them or interfere with activities.',
  'Have the patient sit in a firm, armless chair with hands on knees, legs slightly apart and feet flat on the floor. Look at the entire body for movements while in this position.',
  'Ask the patient to sit with hands hanging unsupported (between the legs, or over the knees). Observe the hands and other body areas.',
  'Ask the patient to open the mouth. Observe the tongue at rest within the mouth. Do this twice.',
  'Ask the patient to protrude the tongue. Observe abnormalities of tongue movement. Do this twice.',
  'Ask the patient to tap the thumb with each finger as rapidly as possible for 10-15 seconds, separately with the right hand, then the left hand. Observe facial and leg movements.',
  'Flex and extend the left and right arms, one at a time. Note any rigidity.',
  'Ask the patient to stand up. Observe in profile. Observe all body areas again, hips included.',
  'Ask the patient to extend both arms outstretched in front with palms down. Observe trunk, legs and mouth.',
  'Have the patient walk a few paces, turn and walk back to the chair. Observe hands and gait. Do this twice.',
];

export const AIMS_ACTIVATION_NOTE =
  'Activated movements (elicited during activation manoeuvres, e.g. finger tapping) are rated one point lower than those observed spontaneously.';

export const SEVERITY_ANCHORS = ['None', 'Minimal', 'Mild', 'Moderate', 'Severe'] as const;
export const AWARENESS_ANCHORS = [
  'No awareness',
  'Aware, no distress',
  'Aware, mild distress',
  'Aware, moderate distress',
  'Aware, severe distress',
] as const;

export interface SkAimsItem {
  id: string;
  number: number;
  group: 'Facial and oral movements' | 'Extremity movements' | 'Trunk movements' | 'Global judgements' | 'Dental status';
  label: string;
  /** Short label used in results / copied text */
  short: string;
  description?: string;
  kind: 'severity' | 'awareness' | 'yesno';
}

export const SK_AIMS_ITEMS: SkAimsItem[] = [
  { id: 'face', number: 1, group: 'Facial and oral movements', label: 'Muscles of facial expression', short: 'Facial expression', description: 'e.g. movements of forehead, eyebrows, periorbital area, cheeks; include frowning, blinking, smiling, grimacing.', kind: 'severity' },
  { id: 'lips', number: 2, group: 'Facial and oral movements', label: 'Lips and perioral area', short: 'Lips/perioral', description: 'e.g. puckering, pouting, smacking.', kind: 'severity' },
  { id: 'jaw', number: 3, group: 'Facial and oral movements', label: 'Jaw', short: 'Jaw', description: 'e.g. biting, clenching, chewing, mouth opening, lateral movement.', kind: 'severity' },
  { id: 'tongue', number: 4, group: 'Facial and oral movements', label: 'Tongue', short: 'Tongue', description: 'Rate only increases in movement both in and out of the mouth, not inability to sustain movement.', kind: 'severity' },
  { id: 'upper', number: 5, group: 'Extremity movements', label: 'Upper extremities (arms, wrists, hands, fingers)', short: 'Upper extremities', description: 'Include choreic movements (rapid, objectively purposeless, irregular, spontaneous) and athetoid movements (slow, irregular, complex, serpentine). Do not include tremor (repetitive, regular, rhythmic).', kind: 'severity' },
  { id: 'lower', number: 6, group: 'Extremity movements', label: 'Lower extremities (legs, knees, ankles, toes)', short: 'Lower extremities', description: 'e.g. lateral knee movement, foot tapping, heel dropping, foot squirming, inversion and eversion of the foot.', kind: 'severity' },
  { id: 'trunk', number: 7, group: 'Trunk movements', label: 'Neck, shoulders, hips', short: 'Neck/shoulders/hips', description: 'e.g. rocking, twisting, squirming, pelvic gyrations.', kind: 'severity' },
  { id: 'overall', number: 8, group: 'Global judgements', label: 'Severity of abnormal movements overall', short: 'Overall severity', kind: 'severity' },
  { id: 'incapacitation', number: 9, group: 'Global judgements', label: 'Incapacitation due to abnormal movements', short: 'Incapacitation', kind: 'severity' },
  { id: 'awareness', number: 10, group: 'Global judgements', label: "Patient's awareness of abnormal movements (rate only the patient's report)", short: 'Patient awareness', kind: 'awareness' },
  { id: 'teeth', number: 11, group: 'Dental status', label: 'Current problems with teeth and/or dentures', short: 'Teeth/denture problems', kind: 'yesno' },
  { id: 'dentures', number: 12, group: 'Dental status', label: 'Does the patient usually wear dentures?', short: 'Usually wears dentures', kind: 'yesno' },
];

/** AIMS items 1-7 (body areas) used for the total and the Schooler-Kane threshold. */
export const SK_BODY_AREA_IDS = SK_AIMS_ITEMS.filter((i) => i.number <= 7).map((i) => i.id);

export interface SkRuleOut {
  id: string;
  label: string;
}

export const SK_RULE_OUTS: SkRuleOut[] = [
  { id: 'spontaneous', label: 'Spontaneous dyskinesia (e.g. edentulous or senile orofacial dyskinesia)' },
  { id: 'huntington', label: "Huntington's disease" },
  { id: 'tics', label: 'Tics' },
  { id: 'acuteEps', label: 'Acute extrapyramidal reaction (e.g. acute dystonia, akathisia, parkinsonian tremor)' },
  { id: 'other', label: 'Other neurological, medical or drug-induced cause' },
];

export const SK_NO_ALTERNATIVE_LABEL = 'No alternative cause identified';

export interface SkSubtype {
  id: string;
  name: string;
  definition: string;
}

export const SK_SUBTYPES: SkSubtype[] = [
  { id: 'probable', name: 'Probable TD', definition: 'All three criteria met, with qualifying AIMS scores sustained for at least 3 months.' },
  { id: 'maskedProbable', name: 'Masked probable TD', definition: 'Meets criteria for probable TD, but movements are suppressed within 2 weeks by increasing or restarting the antipsychotic.' },
  { id: 'transient', name: 'Transient TD', definition: 'Met criteria for probable TD once, but movements are absent on a later examination within 3 months.' },
  { id: 'withdrawal', name: 'Withdrawal TD', definition: 'Movements emerge during, or within 2 weeks of, reducing or stopping the antipsychotic and remit within 3 months.' },
  { id: 'persistent', name: 'Persistent TD', definition: 'Qualifying AIMS scores sustained for at least 6 months.' },
  { id: 'maskedPersistent', name: 'Masked persistent TD', definition: 'Meets criteria for persistent TD, but movements are suppressed by increasing or restarting the antipsychotic.' },
];

export const SK_TIMING_NOTE = 'Timings per Schooler NR, Kane JM. Arch Gen Psychiatry 1982;39:486-487.';

export const SK_REFERENCES: { label: string; url?: string }[] = [
  { label: 'Schooler NR, Kane JM. Research diagnoses for tardive dyskinesia (RD-TD). Arch Gen Psychiatry. 1982;39:486-487.', url: 'https://www.researchgate.net/publication/17063863_Schooler_NR_Kane_JM_Research_diagnoses_for_tardive_dyskinesia_RD-TD_Arch_Gen_Psychiatry_39_486-487' },
  { label: 'Guy W. ECDEU Assessment Manual for Psychopharmacology. Rockville, MD: US DHEW; 1976 (AIMS).' },
  { label: 'Düşünen Adam: The Journal of Psychiatry and Neurological Sciences', url: 'https://dusunenadamdergisi.org/article/158/pdf' },
  { label: 'European Neuropsychopharmacology (2025)', url: 'https://www.sciencedirect.com/science/article/pii/S0924977X25008041' },
  { label: 'Psychiatric Times: Identification, assessment and clinical management of tardive dyskinesia: an update', url: 'https://www.psychiatrictimes.com/view/identification-assessment-and-clinical-management-tardive-dyskinesia-update' },
  { label: 'PMC10292174', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10292174/' },
  { label: 'J Clin Psychiatry: Assessing patients with tardive dyskinesia', url: 'https://www.psychiatrist.com/jcp/assessing-patients-tardive-dyskinesia/' },
  { label: 'Neurology Advisor: Old challenges and new directions in managing tardive dyskinesia', url: 'https://www.neurologyadvisor.com/features/old-challenges-and-new-directions-in-managing-tardive-dyskinesia/2/' },
];

export interface SchoolerKaneState {
  exposure: boolean;
  /** AIMS ratings 0-4 for items 1-10, keyed by item id */
  aims: Record<string, number | undefined>;
  /** AIMS items 11-12 (yes/no) */
  dental: Record<string, boolean | undefined>;
  ruleOuts: Record<string, boolean>;
  noAlternative: boolean;
  subtype?: string;
}

export const createInitialSchoolerKaneState = (): SchoolerKaneState => ({
  exposure: false,
  aims: {},
  dental: {},
  ruleOuts: {},
  noAlternative: false,
  subtype: undefined,
});

export interface AimsThresholdResult {
  met: boolean;
  /** Body-area item ids that satisfy the threshold rule (for highlighting). */
  qualifyingIds: string[];
  countAtLeast3: number;
  countAtLeast2: number;
}

/**
 * Schooler-Kane AIMS threshold: at least one body area (items 1-7) rated >=3
 * (moderate) OR at least two body areas rated >=2 (mild).
 */
export function evaluateAimsThreshold(aims: Record<string, number | undefined>): AimsThresholdResult {
  const scores = SK_BODY_AREA_IDS.map((id) => ({ id, v: aims[id] ?? 0 }));
  const ge3 = scores.filter((s) => s.v >= 3);
  const ge2 = scores.filter((s) => s.v >= 2);
  const viaTwoMild = ge2.length >= 2;
  const viaOneModerate = ge3.length >= 1;
  const met = viaOneModerate || viaTwoMild;
  const qualifyingIds = !met ? [] : viaTwoMild ? ge2.map((s) => s.id) : ge3.map((s) => s.id);
  return { met, qualifyingIds, countAtLeast3: ge3.length, countAtLeast2: ge2.length };
}

export function aimsTotal(aims: Record<string, number | undefined>): number {
  return SK_BODY_AREA_IDS.reduce((sum, id) => sum + (aims[id] ?? 0), 0);
}

export interface SchoolerKaneResult {
  aimsTotal: number;
  threshold: AimsThresholdResult;
  exposureMet: boolean;
  aimsMet: boolean;
  exclusionMet: boolean;
  anyRuleOut: boolean;
  meetsProbable: boolean;
  missing: string[];
  interpretation: string;
  subtype?: SkSubtype;
}

export const SK_CRITERIA_LABELS = {
  exposure: 'Criterion 1 - Neuroleptic exposure ≥3 months',
  aims: 'Criterion 2 - AIMS threshold',
  exclusion: 'Criterion 3 - Exclusion of other causes',
} as const;

export function evaluateSchoolerKane(state: SchoolerKaneState): SchoolerKaneResult {
  const threshold = evaluateAimsThreshold(state.aims);
  const anyRuleOut = SK_RULE_OUTS.some((r) => state.ruleOuts[r.id]);
  const exposureMet = !!state.exposure;
  const aimsMet = threshold.met;
  const exclusionMet = !anyRuleOut && !!state.noAlternative;
  const meetsProbable = exposureMet && aimsMet && exclusionMet;
  const missing: string[] = [];
  if (!exposureMet) missing.push('neuroleptic exposure ≥3 months');
  if (!aimsMet) missing.push('AIMS threshold (≥3 in one area or ≥2 in two areas)');
  if (!exclusionMet) missing.push(anyRuleOut ? 'exclusion of other causes (alternative cause present)' : 'exclusion of other causes (not confirmed)');
  const interpretation = meetsProbable
    ? 'Meets Schooler-Kane criteria for probable TD'
    : `Does not meet Schooler-Kane criteria for probable TD - missing: ${missing.join('; ')}`;
  return {
    aimsTotal: aimsTotal(state.aims),
    threshold,
    exposureMet,
    aimsMet,
    exclusionMet,
    anyRuleOut,
    meetsProbable,
    missing,
    interpretation,
    subtype: SK_SUBTYPES.find((s) => s.id === state.subtype),
  };
}

const ratingLabel = (item: SkAimsItem, v: number) =>
  `${v} (${item.kind === 'awareness' ? AWARENESS_ANCHORS[v] : SEVERITY_ANCHORS[v]})`;

/** Results-only report data used by Copy / Download / PDF. */
export function buildSchoolerKaneReport(state: SchoolerKaneState): ReportData {
  const r = evaluateSchoolerKane(state);
  const itemLines: string[] = [];
  if (state.exposure) itemLines.push('Neuroleptic/antipsychotic exposure ≥3 months: Yes');
  SK_AIMS_ITEMS.forEach((item) => {
    if (item.kind === 'yesno') {
      const v = state.dental[item.id];
      if (v !== undefined) itemLines.push(`AIMS ${item.number} ${item.short}: ${v ? 'Yes' : 'No'}`);
    } else {
      const v = state.aims[item.id];
      if (v !== undefined) itemLines.push(`AIMS ${item.number} ${item.short}: ${ratingLabel(item, v)}`);
    }
  });
  if (r.threshold.qualifyingIds.length) {
    const names = r.threshold.qualifyingIds.map((id) => SK_AIMS_ITEMS.find((i) => i.id === id)?.short).join(', ');
    itemLines.push(`Qualifying AIMS areas: ${names}`);
  }
  SK_RULE_OUTS.filter((ro) => state.ruleOuts[ro.id]).forEach((ro) => itemLines.push(`Alternative cause present: ${ro.label}`));
  if (state.noAlternative && !r.anyRuleOut) itemLines.push(`${SK_NO_ALTERNATIVE_LABEL}: Yes`);

  const criteria = [
    `${SK_CRITERIA_LABELS.exposure}: ${r.exposureMet ? 'Met' : 'Not met'}`,
    `${SK_CRITERIA_LABELS.aims}: ${r.aimsMet ? 'Met' : 'Not met'}`,
    `${SK_CRITERIA_LABELS.exclusion}: ${r.exclusionMet ? 'Met' : 'Not met'}`,
  ];
  if (r.subtype) criteria.push(`Subtype: ${r.subtype.name} - ${r.subtype.definition}`);

  return {
    assessmentName: SCHOOLER_KANE_NAME,
    date: new Date().toLocaleDateString(),
    totalScore: `AIMS total (items 1-7) ${r.aimsTotal}/28`,
    interpretation: r.interpretation,
    sections: [
      { title: 'Findings', items: itemLines, type: 'info' },
      { title: 'Criteria', items: criteria, type: 'info' },
    ],
  };
}
