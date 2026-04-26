// Clinician reference checklist of common adverse effects of neuropsychiatric
// medications, organized by drug category. Compiled from Stahl SM,
// Stahl's Essential Psychopharmacology, 5th ed. (2021); Maudsley Prescribing
// Guidelines, 14th ed. (Taylor et al., 2021); and APA Practice Guidelines.

export interface AdverseEffectItem {
  id: string;
  label: string;
  detail?: string;
}

export interface AdverseEffectGroup {
  id: string;
  category: string;
  examples: string;
  groups: { heading: string; items: AdverseEffectItem[] }[];
}

export const ADVERSE_EFFECTS: AdverseEffectGroup[] = [
  {
    id: 'antipsychotics',
    category: 'Antipsychotics',
    examples: 'e.g., Risperidone, Olanzapine, Clozapine, Haloperidol, Aripiprazole',
    groups: [
      {
        heading: 'Movement Disorders (EPS)',
        items: [
          { id: 'ap-akathisia', label: 'Akathisia', detail: 'Inner restlessness, inability to sit still' },
          { id: 'ap-parkinsonism', label: 'Parkinsonism', detail: 'Bradykinesia, rigidity, resting tremor' },
          { id: 'ap-dystonia', label: 'Acute dystonia', detail: 'Sustained muscle contractions, oculogyric crisis, torticollis' },
          { id: 'ap-td', label: 'Tardive dyskinesia', detail: 'Late-onset involuntary orofacial/limb movements' },
        ],
      },
      {
        heading: 'Metabolic',
        items: [
          { id: 'ap-weight', label: 'Significant weight gain' },
          { id: 'ap-dm', label: 'New-onset / worsening diabetes mellitus' },
          { id: 'ap-lipids', label: 'Dyslipidemia' },
        ],
      },
      {
        heading: 'Other Common',
        items: [
          { id: 'ap-sedation', label: 'Sedation / drowsiness' },
          { id: 'ap-dizziness', label: 'Dizziness / orthostatic hypotension' },
          { id: 'ap-blurred', label: 'Blurred vision' },
          { id: 'ap-constipation', label: 'Constipation' },
          { id: 'ap-sialorrhea', label: 'Sialorrhea (drooling)', detail: 'Especially clozapine' },
          { id: 'ap-prolactin', label: 'Hyperprolactinaemia', detail: 'Galactorrhea, amenorrhea, sexual dysfunction' },
        ],
      },
    ],
  },
  {
    id: 'antidepressants',
    category: 'Antidepressants',
    examples: 'SSRIs, SNRIs, TCAs (e.g., Sertraline, Venlafaxine, Amitriptyline)',
    groups: [
      {
        heading: 'Gastrointestinal',
        items: [
          { id: 'ad-nausea', label: 'Nausea' },
          { id: 'ad-diarrhea', label: 'Diarrhea' },
          { id: 'ad-constipation', label: 'Constipation', detail: 'More common with TCAs' },
        ],
      },
      {
        heading: 'Sexual',
        items: [
          { id: 'ad-libido', label: 'Reduced libido' },
          { id: 'ad-arousal', label: 'Reduced arousal / anorgasmia' },
          { id: 'ad-ed', label: 'Erectile dysfunction' },
        ],
      },
      {
        heading: 'Neurological / Psychological',
        items: [
          { id: 'ad-insomnia', label: 'Insomnia' },
          { id: 'ad-drowsy', label: 'Drowsiness / fatigue' },
          { id: 'ad-agitation', label: 'Agitation / activation' },
          { id: 'ad-tremor', label: 'Tremor' },
          { id: 'ad-headache', label: 'Headache' },
          { id: 'ad-hyponatremia', label: 'Hyponatremia (SIADH)', detail: 'Especially elderly on SSRIs' },
        ],
      },
    ],
  },
  {
    id: 'anxiolytics',
    category: 'Anti-Anxiety Agents',
    examples: 'Benzodiazepines (e.g., Diazepam, Lorazepam, Clonazepam)',
    groups: [
      {
        heading: 'Sedation',
        items: [
          { id: 'bz-sleepy', label: 'Daytime sleepiness' },
          { id: 'bz-fatigue', label: 'Fatigue' },
          { id: 'bz-dizziness', label: 'Dizziness' },
        ],
      },
      {
        heading: 'Cognitive',
        items: [
          { id: 'bz-confusion', label: 'Confusion' },
          { id: 'bz-slowed', label: 'Slowed thinking / psychomotor slowing' },
          { id: 'bz-memory', label: 'Anterograde memory impairment' },
        ],
      },
      {
        heading: 'Other',
        items: [
          { id: 'bz-coord', label: 'Impaired coordination / increased fall risk' },
          { id: 'bz-dependence', label: 'Tolerance / dependence / withdrawal risk' },
          { id: 'bz-resp', label: 'Respiratory depression', detail: 'Especially with opioids/alcohol' },
        ],
      },
    ],
  },
  {
    id: 'mood-stabilizers',
    category: 'Mood Stabilizers',
    examples: 'Lithium, Valproate, Carbamazepine, Lamotrigine',
    groups: [
      {
        heading: 'Lithium',
        items: [
          { id: 'li-tremor', label: 'Fine tremor' },
          { id: 'li-thirst', label: 'Polydipsia / polyuria' },
          { id: 'li-diarrhea', label: 'Diarrhea / GI upset' },
          { id: 'li-weight', label: 'Weight gain' },
          { id: 'li-thyroid', label: 'Hypothyroidism' },
          { id: 'li-renal', label: 'Renal impairment / nephrogenic DI' },
          { id: 'li-toxicity', label: 'Toxicity (coarse tremor, ataxia, confusion)' },
        ],
      },
      {
        heading: 'Valproate',
        items: [
          { id: 'vp-weight', label: 'Weight gain' },
          { id: 'vp-nausea', label: 'Nausea' },
          { id: 'vp-sedation', label: 'Sedation' },
          { id: 'vp-hepato', label: 'Hepatotoxicity' },
          { id: 'vp-thrombo', label: 'Thrombocytopenia' },
          { id: 'vp-teratogen', label: 'Teratogenicity (avoid in pregnancy)' },
        ],
      },
      {
        heading: 'Carbamazepine / Lamotrigine',
        items: [
          { id: 'cb-rash', label: 'Rash (risk of SJS/TEN)' },
          { id: 'cb-diplopia', label: 'Diplopia / ataxia' },
          { id: 'cb-hyponatremia', label: 'Hyponatremia (carbamazepine)' },
          { id: 'cb-bm', label: 'Bone marrow suppression (carbamazepine)' },
        ],
      },
    ],
  },
  {
    id: 'serious',
    category: 'Serious but Less Common',
    examples: 'Medical emergencies — recognize and act urgently',
    groups: [
      {
        heading: 'Syndromes',
        items: [
          { id: 'sr-nms', label: 'Neuroleptic Malignant Syndrome (NMS)', detail: 'Rigidity, fever, autonomic instability, ↑CK — antipsychotics' },
          { id: 'sr-ss', label: 'Serotonin Syndrome', detail: 'Clonus, agitation, hyperthermia — serotonergic agents' },
          { id: 'sr-td', label: 'Tardive Dyskinesia', detail: 'Late, often irreversible involuntary movements' },
          { id: 'sr-agranulo', label: 'Agranulocytosis', detail: 'Clozapine, carbamazepine — monitor FBC' },
          { id: 'sr-qtc', label: 'QTc prolongation / torsades', detail: 'Many antipsychotics, citalopram, methadone' },
          { id: 'sr-sjs', label: 'Stevens-Johnson syndrome / TEN', detail: 'Lamotrigine, carbamazepine' },
          { id: 'sr-suicidality', label: 'Treatment-emergent suicidality', detail: 'Especially in young adults on antidepressants' },
        ],
      },
    ],
  },
];

export const ADVERSE_EFFECTS_PURPOSE =
  'Clinician checklist of common and serious adverse effects of neuropsychiatric medications, organized by drug class. Use during medication review to systematically inquire and document side effects, guide dose changes, and identify medical emergencies.';
