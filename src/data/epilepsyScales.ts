// LAEP - Likelihood of Adverse Effects Profile
export const LAEP_ITEMS = [
  {
    id: 'tremor',
    name: 'Hand Tremor',
    description: 'Shaking or tremor in hands',
  },
  {
    id: 'dizziness',
    name: 'Dizziness',
    description: 'Feeling lightheaded or dizzy',
  },
  {
    id: 'fatigue',
    name: 'Fatigue/Tiredness',
    description: 'Excessive tiredness or lack of energy',
  },
  {
    id: 'cognitive',
    name: 'Cognitive Effects',
    description: 'Difficulty concentrating or memory problems',
  },
  {
    id: 'mood',
    name: 'Mood Changes',
    description: 'Irritability, depression, or anxiety',
  },
  {
    id: 'coordination',
    name: 'Coordination Problems',
    description: 'Clumsiness or balance issues',
  },
  {
    id: 'nausea',
    name: 'Nausea/Vomiting',
    description: 'Stomach upset or vomiting',
  },
  {
    id: 'rash',
    name: 'Skin Rash',
    description: 'Allergic skin reactions',
  },
];

// ESGS - Epilepsy Surgery Grading Scale
export interface ESGSComponent {
  name: string;
  description: string;
  scoring: string;
  example?: string;
}

export const ESGS_COMPONENTS: Record<string, ESGSComponent> = {
  mri: {
    name: 'MRI Findings',
    description: 'Structural abnormality visible on MRI',
    scoring: '0 (none) to 3 (definite lesion correlated with seizure focus)',
    example: 'Hippocampal sclerosis, focal cortical dysplasia, tumor, etc.',
  },
  eeg: {
    name: 'Interictal EEG',
    description: 'EEG findings between seizures',
    scoring: '0 (none) to 3 (consistent focal epileptiform abnormality)',
    example: 'Focal spike or spike-wave discharges',
  },
  semiology: {
    name: 'Seizure Semiology',
    description: 'Clinical characteristics of seizures',
    scoring: '0 (generalized) to 3 (highly focal features)',
    example: 'Aura, focal motor onset, asymmetric tonic-clonic',
  },
  iq: {
    name: 'Intelligence Quotient',
    description: 'Cognitive function assessment',
    scoring: 'Continuous variable; higher IQ = better outcome',
    example: 'Normal IQ correlates with better post-surgical outcomes',
  },
};

export const ESGS_GRADING = {
  grade1: {
    name: 'Grade 1 (Most Favorable)',
    score: '≥7.5',
    probability: '60-80% seizure freedom',
    description: 'Excellent prognosis for seizure freedom after surgery',
  },
  grade2: {
    name: 'Grade 2 (Intermediate)',
    score: '>4 to <7.5',
    probability: '40-60% seizure freedom',
    description: 'Moderate prognosis for seizure freedom after surgery',
  },
  grade3: {
    name: 'Grade 3 (Least Favorable)',
    score: '≤4',
    probability: '<40% seizure freedom',
    description: 'Limited prognosis for seizure freedom after surgery',
  },
};

// CASES Tool - Clinical Appropriateness Scores
export const CASES_SCREENING_ITEMS = [
  {
    id: 'drugResistant',
    name: 'Drug-Resistant Epilepsy',
    description: 'Failed adequate trial of ≥2 antiepileptic drugs',
    scoring: 'Yes/No',
  },
  {
    id: 'focal',
    name: 'Focal Seizure Onset',
    description: 'Evidence of focal seizure onset on EEG/imaging',
    scoring: 'Yes/No',
  },
  {
    id: 'lobe',
    name: 'Localizable to Brain Lobe',
    description: 'Seizures localize to specific lobe',
    scoring: 'Yes/No',
  },
  {
    id: 'mri',
    name: 'Structural MRI Findings',
    description: 'Focal lesion on MRI',
    scoring: 'Yes/No',
  },
  {
    id: 'cognitive',
    name: 'Acceptable Cognitive Function',
    description: 'Sufficient cognitive reserve for surgery',
    scoring: 'Yes/No',
  },
  {
    id: 'surgery',
    name: 'Potential Surgical Corridor',
    description: 'Resectable area without eloquent cortex involvement',
    scoring: 'Yes/No',
  },
];

// Engel Scale - Post-Surgical Outcome Assessment
export const ENGEL_SCALE = [
  {
    id: 'ia',
    name: 'Class Ia',
    description: 'Completely seizure-free since surgery',
  },
  {
    id: 'ib',
    name: 'Class Ib',
    description: 'Only auras, no other seizures',
  },
  {
    id: 'ic',
    name: 'Class Ic',
    description: 'Seizures only in sleep',
  },
  {
    id: 'id',
    name: 'Class Id',
    description: 'Exclusively nocturnal seizures (generalized)',
  },
  {
    id: 'ii',
    name: 'Class II',
    description: 'Rare seizure occurrence (≤3 per month)',
  },
  {
    id: 'iii',
    name: 'Class III',
    description: 'Worthwhile improvement (>90% reduction in seizures)',
  },
  {
    id: 'iv',
    name: 'Class IV',
    description: 'No worthwhile improvement or worsening',
  },
];

export const ENGEL_OUTCOME_CATEGORIES = {
  excellent: {
    classes: ['ia', 'ib', 'ic', 'id'],
    description: 'Favorable outcomes',
  },
  good: {
    classes: ['ii'],
    description: 'Significant improvement',
  },
  moderate: {
    classes: ['iii'],
    description: 'Some improvement but not seizure-free',
  },
  poor: {
    classes: ['iv'],
    description: 'No worthwhile improvement',
  },
};
