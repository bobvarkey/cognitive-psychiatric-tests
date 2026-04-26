// Psychosis assessment scales — data-driven. Each scale defines its items,
// item-level scoring anchors, optional subscales, and severity bands.
//
// Sources (item lists are clinical paraphrases — see the cited manuals for
// official wording before any clinical or research use):
//  • BPRS-18 — Overall & Gorham, 1962 (1–7 anchored).
//  • SAPS / SANS — Andreasen, 1984 (0–5 global ratings, public domain).
//  • CRDPSS — DSM-5 Section III, APA 2013 (8 items, 0–4).
//  • SOPS / SIPS — Miller, McGlashan et al., 2003.
//  • PSYRATS-AH / -DEL — Haddock et al., 1999.
//  • VAGUS-SR — Gerretsen et al., 2014.

export type ScaleId =
  | 'bprs'
  | 'sapsSans'
  | 'crdpss'
  | 'sops'
  | 'psyrats'
  | 'vagus';

export interface ScaleAnchor {
  value: number;
  label: string;
}

export interface ScaleItem {
  id: string;
  label: string;          // Item name
  hint?: string;          // Brief clinical description / construct
  /** Optional subscale grouping for totals (e.g. "Positive", "Negative"). */
  subscale?: string;
  /** Per-item anchor override; if omitted, the scale-level anchors are used. */
  anchors?: ScaleAnchor[];
}

export interface SeverityBand {
  /** Inclusive lower bound on the relevant total. */
  min: number;
  /** Inclusive upper bound. */
  max: number;
  label: string;
  description: string;
  tone: 'success' | 'warning' | 'orange' | 'destructive';
}

export interface PsychosisScale {
  id: ScaleId;
  name: string;
  fullName: string;
  shortDescription: string;
  instructions: string;
  /** Default anchors used by every item unless the item overrides. */
  anchors: ScaleAnchor[];
  items: ScaleItem[];
  /** Subscales for grouped totals; omit for one global total. */
  subscales?: { id: string; label: string }[];
  /** Severity bands keyed by subscale id; "total" = overall total. */
  severityBands?: Record<string, SeverityBand[]>;
  /** Optional clinically meaningful threshold notes. */
  thresholdNote?: string;
  citation: string;
  citationUrl?: string;
  /** Items the scale uses an inverted scoring direction for (sum is reverse-scored). */
  reverseScoredIds?: string[];
}

// ────────────────────────────────────────────────────────────
// 1. BPRS-18 — Brief Psychiatric Rating Scale (1962)
// ────────────────────────────────────────────────────────────
const BPRS_ANCHORS: ScaleAnchor[] = [
  { value: 1, label: '1 — Not present' },
  { value: 2, label: '2 — Very mild' },
  { value: 3, label: '3 — Mild' },
  { value: 4, label: '4 — Moderate' },
  { value: 5, label: '5 — Moderately severe' },
  { value: 6, label: '6 — Severe' },
  { value: 7, label: '7 — Extremely severe' },
];

const BPRS: PsychosisScale = {
  id: 'bprs',
  name: 'BPRS',
  fullName: 'Brief Psychiatric Rating Scale (18-item)',
  shortDescription:
    '18 clinician-rated symptom constructs scored 1–7. Tracks acute psychiatric symptom severity and treatment response.',
  instructions:
    'Rate each construct based on your interview and observations over the past 2–3 days. 1 = not present, 7 = extremely severe.',
  anchors: BPRS_ANCHORS,
  items: [
    { id: 'somconcern', label: 'Somatic concern', hint: 'Preoccupation with physical health, illness, or functioning.' },
    { id: 'anxiety', label: 'Anxiety', hint: 'Worry, fear, or over-concern about present or future.' },
    { id: 'emotwithdraw', label: 'Emotional withdrawal', hint: 'Deficient relating to interviewer; lack of emotional contact.' },
    { id: 'concept', label: 'Conceptual disorganization', hint: 'Confused, disconnected or disorganised speech.' },
    { id: 'guilt', label: 'Guilt feelings', hint: 'Self-blame, shame, remorse for past behaviour.' },
    { id: 'tension', label: 'Tension', hint: 'Physical and motor signs of nervousness, agitation.' },
    { id: 'mannerism', label: 'Mannerisms & posturing', hint: 'Unusual or unnatural motor behaviour.' },
    { id: 'grandiosity', label: 'Grandiosity', hint: 'Inflated self-opinion, conviction of unusual abilities or worth.' },
    { id: 'depmood', label: 'Depressive mood', hint: 'Sorrow, sadness, despondency, pessimism.' },
    { id: 'hostility', label: 'Hostility', hint: 'Animosity, contempt, belligerence toward others.' },
    { id: 'suspicious', label: 'Suspiciousness', hint: 'Belief that others have or have had malicious intent.' },
    { id: 'halluc', label: 'Hallucinatory behaviour', hint: 'Perceptions without external stimulus (any modality).' },
    { id: 'motorret', label: 'Motor retardation', hint: 'Slowed or reduced movement, speech, reactions.' },
    { id: 'uncoop', label: 'Uncooperativeness', hint: 'Resistance, guardedness, rejection of authority.' },
    { id: 'unusual', label: 'Unusual thought content', hint: 'Unusual, odd, strange or bizarre thought content.' },
    { id: 'blunted', label: 'Blunted affect', hint: 'Reduced emotional tone, reduced normal intensity of feelings.' },
    { id: 'excite', label: 'Excitement', hint: 'Heightened emotional tone, agitation, increased reactivity.' },
    { id: 'disorient', label: 'Disorientation', hint: 'Confusion or lack of orientation to person, place, time.' },
  ],
  severityBands: {
    total: [
      { min: 18, max: 30, label: 'Minimal', description: 'No clinically significant symptoms', tone: 'success' },
      { min: 31, max: 40, label: 'Mild', description: 'Mild psychiatric symptoms', tone: 'warning' },
      { min: 41, max: 52, label: 'Moderate', description: 'Moderate symptom burden', tone: 'orange' },
      { min: 53, max: 126, label: 'Severe', description: 'Marked / severe symptoms — clinical attention', tone: 'destructive' },
    ],
  },
  thresholdNote:
    'Total range 18–126. A drop of ≥20% on treatment is often used as a response criterion in trials.',
  citation:
    'Overall JE, Gorham DR. The Brief Psychiatric Rating Scale. Psychol Rep. 1962;10(3):799–812.',
  citationUrl: 'https://doi.org/10.2466/pr0.1962.10.3.799',
};

// ────────────────────────────────────────────────────────────
// 2. SAPS / SANS — Andreasen (replacement for PANSS)
// ────────────────────────────────────────────────────────────
const SAPS_SANS_ANCHORS: ScaleAnchor[] = [
  { value: 0, label: '0 — None' },
  { value: 1, label: '1 — Questionable' },
  { value: 2, label: '2 — Mild' },
  { value: 3, label: '3 — Moderate' },
  { value: 4, label: '4 — Marked' },
  { value: 5, label: '5 — Severe' },
];

const SAPS_SANS: PsychosisScale = {
  id: 'sapsSans',
  name: 'SAPS / SANS',
  fullName: 'Scales for Assessment of Positive & Negative Symptoms (Andreasen)',
  shortDescription:
    'Global ratings of positive and negative symptoms (0–5). Used here in lieu of PANSS to avoid licensed wording.',
  instructions:
    'Rate each global symptom domain over the past month: 0 = none, 5 = severe. Use the global rating, not item-level counts.',
  anchors: SAPS_SANS_ANCHORS,
  subscales: [
    { id: 'positive', label: 'Positive (SAPS)' },
    { id: 'negative', label: 'Negative (SANS)' },
  ],
  items: [
    // SAPS — positive
    { id: 'halluc', subscale: 'positive', label: 'Hallucinations (global)', hint: 'Auditory, visual, somatic, olfactory, gustatory.' },
    { id: 'delusions', subscale: 'positive', label: 'Delusions (global)', hint: 'Persecutory, grandiose, religious, referential, somatic, control, etc.' },
    { id: 'bizarre', subscale: 'positive', label: 'Bizarre behaviour (global)', hint: 'Clothing, social, aggressive, repetitive/stereotyped behaviour.' },
    { id: 'thoughtdis', subscale: 'positive', label: 'Formal thought disorder (global)', hint: 'Derailment, tangentiality, incoherence, illogicality, neologisms.' },
    // SANS — negative
    { id: 'affect', subscale: 'negative', label: 'Affective flattening (global)', hint: 'Unchanging facial expression, decreased gestures, poor eye contact.' },
    { id: 'alogia', subscale: 'negative', label: 'Alogia (global)', hint: 'Poverty of speech, poverty of content, blocking, increased latency.' },
    { id: 'avolition', subscale: 'negative', label: 'Avolition–apathy (global)', hint: 'Grooming/hygiene, impersistence at work/school, physical anergia.' },
    { id: 'anhedonia', subscale: 'negative', label: 'Anhedonia–asociality (global)', hint: 'Recreational, sexual, intimacy/closeness, social relationships.' },
    { id: 'attention', subscale: 'negative', label: 'Attention (global)', hint: 'Social inattentiveness, inattentiveness during testing.' },
  ],
  severityBands: {
    positive: [
      { min: 0, max: 4, label: 'Minimal positive', description: 'No clinically significant positive symptoms', tone: 'success' },
      { min: 5, max: 9, label: 'Mild positive', description: 'Mild positive symptom burden', tone: 'warning' },
      { min: 10, max: 14, label: 'Moderate positive', description: 'Moderate positive symptoms', tone: 'orange' },
      { min: 15, max: 20, label: 'Severe positive', description: 'Severe positive symptoms', tone: 'destructive' },
    ],
    negative: [
      { min: 0, max: 5, label: 'Minimal negative', description: 'No clinically significant negative symptoms', tone: 'success' },
      { min: 6, max: 11, label: 'Mild negative', description: 'Mild negative symptom burden', tone: 'warning' },
      { min: 12, max: 17, label: 'Moderate negative', description: 'Moderate negative symptoms', tone: 'orange' },
      { min: 18, max: 25, label: 'Severe negative', description: 'Severe negative symptoms', tone: 'destructive' },
    ],
  },
  thresholdNote:
    'Public-domain Andreasen scales used here as a positive/negative-symptom alternative to PANSS.',
  citation:
    'Andreasen NC. The Scale for the Assessment of Negative Symptoms (SANS) and the Scale for the Assessment of Positive Symptoms (SAPS). University of Iowa, 1983–1984.',
  citationUrl: 'https://en.wikipedia.org/wiki/Scale_for_the_Assessment_of_Negative_Symptoms',
};

// ────────────────────────────────────────────────────────────
// 3. CRDPSS — DSM-5 Clinician-Rated Dimensions of Psychosis Symptom Severity
// ────────────────────────────────────────────────────────────
const CRDPSS_ANCHORS: ScaleAnchor[] = [
  { value: 0, label: '0 — Not present' },
  { value: 1, label: '1 — Equivocal' },
  { value: 2, label: '2 — Present, mild' },
  { value: 3, label: '3 — Present, moderate' },
  { value: 4, label: '4 — Present, severe' },
];

const CRDPSS: PsychosisScale = {
  id: 'crdpss',
  name: 'CRDPSS',
  fullName: 'Clinician-Rated Dimensions of Psychosis Symptom Severity (DSM-5)',
  shortDescription:
    '8-item DSM-5 dimensional rating of psychosis severity over the past 7 days (0–4 each).',
  instructions:
    'Rate the severity of each dimension over the past 7 days: 0 = not present, 4 = present and severe.',
  anchors: CRDPSS_ANCHORS,
  items: [
    { id: 'halluc', label: 'I. Hallucinations', hint: 'Any modality; rate intrusiveness and impact.' },
    { id: 'delusions', label: 'II. Delusions', hint: 'Fixity, preoccupation, behavioural impact.' },
    { id: 'disorgspeech', label: 'III. Disorganized speech', hint: 'Loosening, tangentiality, incoherence.' },
    { id: 'abnormalpsy', label: 'IV. Abnormal psychomotor behaviour', hint: 'Catatonia, agitation, stereotypies.' },
    { id: 'negsym', label: 'V. Negative symptoms', hint: 'Restricted affect, avolition.' },
    { id: 'cog', label: 'VI. Impaired cognition', hint: 'Below expectation given background; functional impact.' },
    { id: 'depression', label: 'VII. Depression', hint: 'Sadness, hopelessness, worthlessness, guilt.' },
    { id: 'mania', label: 'VIII. Mania', hint: 'Elevated/expansive/irritable mood with increased energy.' },
  ],
  severityBands: {
    total: [
      { min: 0, max: 3, label: 'Minimal', description: 'No or minimal psychosis-spectrum symptoms', tone: 'success' },
      { min: 4, max: 9, label: 'Mild', description: 'Mild psychosis-spectrum symptoms', tone: 'warning' },
      { min: 10, max: 17, label: 'Moderate', description: 'Moderate psychosis-spectrum symptoms', tone: 'orange' },
      { min: 18, max: 32, label: 'Severe', description: 'Severe psychosis-spectrum symptoms', tone: 'destructive' },
    ],
  },
  thresholdNote:
    'A score of ≥2 on hallucinations, delusions, or disorganized speech crosses the DSM-5 threshold for that symptom domain.',
  citation:
    'American Psychiatric Association. Clinician-Rated Dimensions of Psychosis Symptom Severity. DSM-5 Section III Assessment Measures, 2013.',
  citationUrl: 'https://www.psychiatry.org/psychiatrists/practice/dsm/educational-resources/assessment-measures',
};

// ────────────────────────────────────────────────────────────
// 4. SOPS — Scale of Prodromal Symptoms (within SIPS)
// ────────────────────────────────────────────────────────────
const SOPS_ANCHORS: ScaleAnchor[] = [
  { value: 0, label: '0 — Absent' },
  { value: 1, label: '1 — Questionably present' },
  { value: 2, label: '2 — Mild' },
  { value: 3, label: '3 — Moderate (attenuated)' },
  { value: 4, label: '4 — Moderately severe (attenuated)' },
  { value: 5, label: '5 — Severe but not psychotic' },
  { value: 6, label: '6 — Severe and psychotic' },
];

const SOPS: PsychosisScale = {
  id: 'sops',
  name: 'SOPS',
  fullName: 'Scale of Prodromal Symptoms (within SIPS)',
  shortDescription:
    '19-item rating of attenuated and prodromal psychotic symptoms (0–6). Identifies clinical high-risk states.',
  instructions:
    'Rate each item 0–6 based on the past month. Scores of 3–5 on positive items meet attenuated-symptom criteria; a single 6 indicates frank psychosis.',
  anchors: SOPS_ANCHORS,
  subscales: [
    { id: 'positive', label: 'Positive (P)' },
    { id: 'negative', label: 'Negative (N)' },
    { id: 'disorg', label: 'Disorganization (D)' },
    { id: 'general', label: 'General (G)' },
  ],
  items: [
    { id: 'p1', subscale: 'positive', label: 'P1 Unusual thought content / delusional ideas' },
    { id: 'p2', subscale: 'positive', label: 'P2 Suspiciousness / persecutory ideas' },
    { id: 'p3', subscale: 'positive', label: 'P3 Grandiose ideas' },
    { id: 'p4', subscale: 'positive', label: 'P4 Perceptual abnormalities / hallucinations' },
    { id: 'p5', subscale: 'positive', label: 'P5 Disorganized communication' },
    { id: 'n1', subscale: 'negative', label: 'N1 Social anhedonia' },
    { id: 'n2', subscale: 'negative', label: 'N2 Avolition' },
    { id: 'n3', subscale: 'negative', label: 'N3 Expression of emotion' },
    { id: 'n4', subscale: 'negative', label: 'N4 Experience of emotions and self' },
    { id: 'n5', subscale: 'negative', label: 'N5 Ideational richness' },
    { id: 'n6', subscale: 'negative', label: 'N6 Occupational functioning' },
    { id: 'd1', subscale: 'disorg', label: 'D1 Odd behaviour or appearance' },
    { id: 'd2', subscale: 'disorg', label: 'D2 Bizarre thinking' },
    { id: 'd3', subscale: 'disorg', label: 'D3 Trouble with focus and attention' },
    { id: 'd4', subscale: 'disorg', label: 'D4 Impairment in personal hygiene' },
    { id: 'g1', subscale: 'general', label: 'G1 Sleep disturbance' },
    { id: 'g2', subscale: 'general', label: 'G2 Dysphoric mood' },
    { id: 'g3', subscale: 'general', label: 'G3 Motor disturbances' },
    { id: 'g4', subscale: 'general', label: 'G4 Impaired tolerance to normal stress' },
  ],
  severityBands: {
    positive: [
      { min: 0, max: 5, label: 'No attenuated symptoms', description: 'Below attenuated-symptom threshold', tone: 'success' },
      { min: 6, max: 14, label: 'Sub-threshold positive', description: 'Some positive symptoms — monitor', tone: 'warning' },
      { min: 15, max: 24, label: 'Attenuated psychosis', description: 'Likely meets attenuated-symptom criteria; refer to specialist', tone: 'orange' },
      { min: 25, max: 30, label: 'High positive burden', description: 'High positive-symptom burden; consider frank psychosis', tone: 'destructive' },
    ],
  },
  thresholdNote:
    'A SOPS positive item rated 3–5 within the past year (occurring ≥1×/week, new onset or worsening) meets Attenuated Positive Symptom Syndrome (APSS) criteria. A 6 indicates frank psychosis.',
  citation:
    'Miller TJ, McGlashan TH, Rosen JL, et al. Prodromal assessment with the Structured Interview for Prodromal Syndromes and the Scale of Prodromal Symptoms: predictive validity, interrater reliability, and training to reliability. Schizophr Bull. 2003;29(4):703–715.',
  citationUrl: 'https://doi.org/10.1093/oxfordjournals.schbul.a007040',
};

// ────────────────────────────────────────────────────────────
// 5. PSYRATS — Auditory Hallucinations + Delusions
// ────────────────────────────────────────────────────────────
const PSYRATS_ANCHORS: ScaleAnchor[] = [
  { value: 0, label: '0' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
];

const PSYRATS: PsychosisScale = {
  id: 'psyrats',
  name: 'PSYRATS',
  fullName: 'Psychotic Symptom Rating Scales — Auditory Hallucinations & Delusions',
  shortDescription:
    'Multidimensional ratings (0–4) of auditory hallucinations (11 items) and delusions (6 items).',
  instructions:
    'Rate each item 0–4 based on the past week. Higher scores indicate greater frequency, distress, or impact.',
  anchors: PSYRATS_ANCHORS,
  subscales: [
    { id: 'ah', label: 'Auditory hallucinations (AHRS)' },
    { id: 'del', label: 'Delusions (DRS)' },
  ],
  items: [
    // Auditory hallucinations — 11 items
    { id: 'ah1', subscale: 'ah', label: 'AH1 Frequency' },
    { id: 'ah2', subscale: 'ah', label: 'AH2 Duration' },
    { id: 'ah3', subscale: 'ah', label: 'AH3 Location' },
    { id: 'ah4', subscale: 'ah', label: 'AH4 Loudness' },
    { id: 'ah5', subscale: 'ah', label: 'AH5 Beliefs about origin of voices' },
    { id: 'ah6', subscale: 'ah', label: 'AH6 Amount of negative content' },
    { id: 'ah7', subscale: 'ah', label: 'AH7 Degree of negative content' },
    { id: 'ah8', subscale: 'ah', label: 'AH8 Amount of distress' },
    { id: 'ah9', subscale: 'ah', label: 'AH9 Intensity of distress' },
    { id: 'ah10', subscale: 'ah', label: 'AH10 Disruption to life' },
    { id: 'ah11', subscale: 'ah', label: 'AH11 Controllability of voices' },
    // Delusions — 6 items
    { id: 'd1', subscale: 'del', label: 'D1 Amount of preoccupation with delusions' },
    { id: 'd2', subscale: 'del', label: 'D2 Duration of preoccupation' },
    { id: 'd3', subscale: 'del', label: 'D3 Conviction' },
    { id: 'd4', subscale: 'del', label: 'D4 Amount of distress' },
    { id: 'd5', subscale: 'del', label: 'D5 Intensity of distress' },
    { id: 'd6', subscale: 'del', label: 'D6 Disruption to life caused by beliefs' },
  ],
  severityBands: {
    ah: [
      { min: 0, max: 10, label: 'Minimal AH', description: 'Minimal auditory-hallucination burden', tone: 'success' },
      { min: 11, max: 22, label: 'Moderate AH', description: 'Moderate AH frequency / distress', tone: 'warning' },
      { min: 23, max: 33, label: 'Severe AH', description: 'Severe AH burden', tone: 'orange' },
      { min: 34, max: 44, label: 'Very severe AH', description: 'Very severe AH burden — clinical priority', tone: 'destructive' },
    ],
    del: [
      { min: 0, max: 6, label: 'Minimal delusions', description: 'Minimal delusion burden', tone: 'success' },
      { min: 7, max: 12, label: 'Moderate delusions', description: 'Moderate delusion conviction / distress', tone: 'warning' },
      { min: 13, max: 18, label: 'Severe delusions', description: 'Severe delusion burden', tone: 'orange' },
      { min: 19, max: 24, label: 'Very severe delusions', description: 'Very severe delusion burden', tone: 'destructive' },
    ],
  },
  thresholdNote:
    'AH range 0–44, Delusions range 0–24. Useful for tracking change with CBTp or pharmacotherapy.',
  citation:
    'Haddock G, McCarron J, Tarrier N, Faragher EB. Scales to measure dimensions of hallucinations and delusions: the Psychotic Symptom Rating Scales (PSYRATS). Psychol Med. 1999;29(4):879–889.',
  citationUrl: 'https://doi.org/10.1017/s0033291799008661',
};

// ────────────────────────────────────────────────────────────
// 6. VAGUS-SR — 10-item self-report insight scale
// ────────────────────────────────────────────────────────────
const VAGUS_ANCHORS: ScaleAnchor[] = [
  { value: 0, label: '0 — Not at all / strongly disagree' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5 — Completely / strongly agree' },
];

const VAGUS: PsychosisScale = {
  id: 'vagus',
  name: 'VAGUS-SR',
  fullName: 'VAGUS Insight into Psychosis Scale — Self-Report',
  shortDescription:
    'Brief 10-item self-report measure of insight into psychotic illness (0–5 each). Higher = better insight.',
  instructions:
    'Read each statement and rate how much you agree, from 0 (strongly disagree) to 5 (strongly agree). There are no right or wrong answers.',
  anchors: VAGUS_ANCHORS,
  items: [
    { id: 'v1', label: '1. I have a mental illness.' },
    { id: 'v2', label: '2. I need treatment for my mental illness.' },
    { id: 'v3', label: '3. The medication I take helps my mental health symptoms.' },
    { id: 'v4', label: '4. Without treatment my symptoms would return or get worse.' },
    { id: 'v5', label: '5. My symptoms cause problems in my relationships, work, or daily life.' },
    { id: 'v6', label: '6. The unusual experiences I have (e.g. voices, beliefs others doubt) are caused by my illness.' },
    { id: 'v7', label: '7. My thinking can be affected by my illness.' },
    { id: 'v8', label: '8. My emotions can be affected by my illness.' },
    { id: 'v9', label: '9. My behaviour can be affected by my illness.' },
    { id: 'v10', label: '10. I benefit from working with my mental health team.' },
  ],
  severityBands: {
    total: [
      { min: 0, max: 19, label: 'Poor insight', description: 'Limited awareness of illness, need for treatment, or symptom attribution', tone: 'destructive' },
      { min: 20, max: 34, label: 'Partial insight', description: 'Partial awareness — some domains preserved', tone: 'orange' },
      { min: 35, max: 44, label: 'Good insight', description: 'Good overall insight into illness and treatment', tone: 'warning' },
      { min: 45, max: 50, label: 'Excellent insight', description: 'Excellent insight across all domains', tone: 'success' },
    ],
  },
  thresholdNote:
    'Total range 0–50. Higher = better insight. Useful for adherence and shared-decision-making conversations.',
  citation:
    'Gerretsen P, Remington G, Borlido C, et al. The VAGUS Insight into Psychosis Scale — self-report and clinician-rated versions. Psychiatry Res. 2014;220(3):1010–1015.',
  citationUrl: 'https://doi.org/10.1016/j.psychres.2014.08.005',
};

export const PSYCHOSIS_SCALES: Record<ScaleId, PsychosisScale> = {
  bprs: BPRS,
  sapsSans: SAPS_SANS,
  crdpss: CRDPSS,
  sops: SOPS,
  psyrats: PSYRATS,
  vagus: VAGUS,
};

export const PSYCHOSIS_SCALE_LIST: PsychosisScale[] = [
  BPRS,
  SAPS_SANS,
  CRDPSS,
  SOPS,
  PSYRATS,
  VAGUS,
];
