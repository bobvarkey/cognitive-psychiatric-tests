export interface Assessment {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  category: string;
  subcategory: string;
  component: any;
  icon: string;
  duration: string;
  items: number;
}

export const ASSESSMENT_CATEGORIES = {
  COGNITIVE: 'Cognitive Assessment',
  PSYCHIATRIC: 'Psychiatric Assessment',
  NEUROLOGICAL: 'Neurological Assessment',
  SUBSTANCE: 'Substance Use',
  RISK: 'Risk Assessment',
  MOVEMENT: 'Movement Disorders',
  SLEEP: 'Sleep & Consciousness',
  PEDIATRIC: 'Pediatric Assessment',
  GENERAL: 'General Health',
} as const;

// Import all assessment components dynamically
const assessmentRegistry: Record<string, any> = {};

// This maps component names to their imports
// In practice, these would be lazy-loaded
export const assessments: Assessment[] = [
  // Cognitive Assessments
  {
    id: 'mmse',
    name: 'Mini-Mental State Examination',
    abbreviation: 'MMSE',
    description: 'Brief cognitive screening for dementia and cognitive impairment',
    category: ASSESSMENT_CATEGORIES.COGNITIVE,
    subcategory: 'Cognitive Screening',
    component: null,
    icon: '🧠',
    duration: '5-10 min',
    items: 11,
  },
  {
    id: 'cognitive-syndromes',
    name: 'Cognitive Syndromes Assessment',
    abbreviation: 'CSA',
    description: 'Comprehensive evaluation of cognitive dysfunction patterns',
    category: ASSESSMENT_CATEGORIES.COGNITIVE,
    subcategory: 'Detailed Cognitive',
    component: null,
    icon: '🧠',
    duration: '15-20 min',
    items: 24,
  },
  {
    id: 'dementia',
    name: 'Dementia Screening',
    abbreviation: 'DS',
    description: 'Screening for dementia risk and cognitive decline',
    category: ASSESSMENT_CATEGORIES.COGNITIVE,
    subcategory: 'Dementia Screening',
    component: null,
    icon: '🧠',
    duration: '10-15 min',
    items: 16,
  },

  // Psychiatric Assessments
  {
    id: 'hamd',
    name: 'Hamilton Depression Rating Scale',
    abbreviation: 'HAM-D',
    description: 'Gold-standard depression severity assessment',
    category: ASSESSMENT_CATEGORIES.PSYCHIATRIC,
    subcategory: 'Depression',
    component: null,
    icon: '😞',
    duration: '15 min',
    items: 17,
  },
  {
    id: 'adhd',
    name: 'ADHD Symptom Checklist',
    abbreviation: 'ADHD',
    description: 'Comprehensive ADHD screening with diagnostic criteria',
    category: ASSESSMENT_CATEGORIES.PSYCHIATRIC,
    subcategory: 'ADHD',
    component: null,
    icon: '⚡',
    duration: '10-15 min',
    items: 18,
  },
  {
    id: 'delusions',
    name: 'Delusions Assessment',
    abbreviation: 'DA',
    description: 'Evaluate delusional thinking patterns',
    category: ASSESSMENT_CATEGORIES.PSYCHIATRIC,
    subcategory: 'Psychotic Symptoms',
    component: null,
    icon: '👁️',
    duration: '10 min',
    items: 6,
  },

  // Neurological Assessments
  {
    id: 'consciousness',
    name: 'Consciousness Assessment',
    abbreviation: 'CA',
    description: 'Evaluate level of consciousness and alertness',
    category: ASSESSMENT_CATEGORIES.NEUROLOGICAL,
    subcategory: 'Consciousness',
    component: null,
    icon: '💤',
    duration: '5 min',
    items: 3,
  },
  {
    id: 'catatonia',
    name: 'Catatonia Rating Scale',
    abbreviation: 'CRS',
    description: 'Assess catatonic symptoms and severity',
    category: ASSESSMENT_CATEGORIES.NEUROLOGICAL,
    subcategory: 'Movement Disorders',
    component: null,
    icon: '🚫',
    duration: '10-15 min',
    items: 12,
  },
  {
    id: 'daphne',
    name: 'DAPHNE Scale',
    abbreviation: 'DAPHNE',
    description: 'Drug-induced adverse movement assessment',
    category: ASSESSMENT_CATEGORIES.NEUROLOGICAL,
    subcategory: 'Movement Disorders',
    component: null,
    icon: '⚠️',
    duration: '10 min',
    items: 8,
  },

  // Substance Use
  {
    id: 'adverse-effects',
    name: 'Adverse Effects Assessment',
    abbreviation: 'AEA',
    description: 'Medication side effects and safety monitoring',
    category: ASSESSMENT_CATEGORIES.SUBSTANCE,
    subcategory: 'Side Effects',
    component: null,
    icon: '💊',
    duration: '10 min',
    items: 20,
  },
  {
    id: 'hunter',
    name: 'Hunter Symptom Checklist',
    abbreviation: 'HSC',
    description: 'Substance intoxication and withdrawal screening',
    category: ASSESSMENT_CATEGORIES.SUBSTANCE,
    subcategory: 'Intoxication',
    component: null,
    icon: '⚠️',
    duration: '10 min',
    items: 10,
  },

  // Risk Assessment
  {
    id: 'fall-risk',
    name: 'Fall Risk Assessment',
    abbreviation: 'FRA',
    description: 'Evaluate fall risk in clinical populations',
    category: ASSESSMENT_CATEGORIES.RISK,
    subcategory: 'Physical Safety',
    component: null,
    icon: '⚠️',
    duration: '8 min',
    items: 5,
  },
  {
    id: 'hare',
    name: 'HARE Psychopathy Checklist',
    abbreviation: 'HARE',
    description: 'Assess psychopathic traits and antisocial behavior',
    category: ASSESSMENT_CATEGORIES.RISK,
    subcategory: 'Psychopathy',
    component: null,
    icon: '⚠️',
    duration: '20 min',
    items: 20,
  },

  // Other Assessments
  {
    id: 'adam',
    name: 'ADAM Apathy-Depression-Anhedonia Measure',
    abbreviation: 'ADAM',
    description: 'Dissociate apathy, depression, and anhedonia symptoms',
    category: ASSESSMENT_CATEGORIES.GENERAL,
    subcategory: 'Mood & Apathy',
    component: null,
    icon: '🏥',
    duration: '5 min',
    items: 10,
  },
  {
    id: 'fab',
    name: 'Frontal Assessment Battery',
    abbreviation: 'FAB',
    description: 'Brief frontal lobe function assessment',
    category: ASSESSMENT_CATEGORIES.COGNITIVE,
    subcategory: 'Executive Function',
    component: null,
    icon: '🧠',
    duration: '10 min',
    items: 6,
  },
  {
    id: 'callosa',
    name: 'Callosal Dysfunctions',
    abbreviation: 'CDS',
    description: 'Assess corpus callosum dysfunction',
    category: ASSESSMENT_CATEGORIES.NEUROLOGICAL,
    subcategory: 'Neurological',
    component: null,
    icon: '🧠',
    duration: '8 min',
    items: 4,
  },
  {
    id: 'dpdr',
    name: 'Depersonalization/Derealization',
    abbreviation: 'DPDR',
    description: 'Assess dissociative symptoms severity',
    category: ASSESSMENT_CATEGORIES.PSYCHIATRIC,
    subcategory: 'Dissociation',
    component: null,
    icon: '👻',
    duration: '10 min',
    items: 14,
  },

  // Movement Disorders - Parkinson's Disease
  {
    id: 'mds-updrs',
    name: 'Movement Disorder Society Unified Parkinson\'s Disease Rating Scale',
    abbreviation: 'MDS-UPDRS',
    description: 'Gold standard comprehensive assessment for motor and non-motor symptoms in Parkinson\'s disease',
    category: ASSESSMENT_CATEGORIES.MOVEMENT,
    subcategory: 'Parkinson\'s Disease',
    component: null,
    icon: '🎯',
    duration: '25-30 min',
    items: 27,
  },
  {
    id: 'hoehn-yahr',
    name: 'Hoehn and Yahr Scale',
    abbreviation: 'H&Y',
    description: 'Staging scale for Parkinson\'s disease severity and disability',
    category: ASSESSMENT_CATEGORIES.MOVEMENT,
    subcategory: 'Parkinson\'s Disease',
    component: null,
    icon: '📊',
    duration: '5-10 min',
    items: 1,
  },
  {
    id: 'five-two-one',
    name: '5-2-1 Criteria for Advanced PD',
    abbreviation: '5-2-1',
    description: 'Rule of thumb for identifying advanced Parkinson\'s disease requiring treatment escalation',
    category: ASSESSMENT_CATEGORIES.MOVEMENT,
    subcategory: 'Parkinson\'s Disease - Advanced',
    component: null,
    icon: '⚡',
    duration: '5 min',
    items: 3,
  },
  {
    id: 'anage-pd',
    name: 'ANAGE-PD',
    abbreviation: 'ANAGE-PD',
    description: 'Clinician-based tool for timely identification and management of advanced PD with suboptimal control',
    category: ASSESSMENT_CATEGORIES.MOVEMENT,
    subcategory: 'Parkinson\'s Disease - Advanced',
    component: null,
    icon: '🏥',
    duration: '10-15 min',
    items: 9,
  },
  {
    id: 'd-dats',
    name: 'Dutch DAT Screening Tool',
    abbreviation: 'D-DATS',
    description: 'Screening tool to determine PD patient eligibility for Device-Aided Therapy (DBS, LCIG, CSAI)',
    category: ASSESSMENT_CATEGORIES.MOVEMENT,
    subcategory: 'Parkinson\'s Disease - Advanced',
    component: null,
    icon: '🔍',
    duration: '10 min',
    items: 6,
  },
  {
    id: 'stimulus-dbs',
    name: 'Stimulus DBS Tool',
    abbreviation: 'Stimulus 2',
    description: 'Evidence-based decision support for assessing appropriateness of Deep Brain Stimulation referral',
    category: ASSESSMENT_CATEGORIES.MOVEMENT,
    subcategory: 'Parkinson\'s Disease - Advanced',
    component: null,
    icon: '🧠',
    duration: '10 min',
    items: 7,
  },

  // Movement Disorders - Dyskinesia
  {
    id: 'aims',
    name: 'Abnormal Involuntary Movement Scale',
    abbreviation: 'AIMS',
    description: 'Comprehensive assessment of involuntary movements and dyskinesia',
    category: ASSESSMENT_CATEGORIES.MOVEMENT,
    subcategory: 'Dyskinesia',
    component: null,
    icon: '🔄',
    duration: '5-10 min',
    items: 11,
  },

  // Movement Disorders - Dystonia
  {
    id: 'twstrs',
    name: 'Toronto Western Spasmodic Torticollis Rating Scale',
    abbreviation: 'TWSTRS',
    description: 'Measure severity and functional impact of cervical dystonia',
    category: ASSESSMENT_CATEGORIES.MOVEMENT,
    subcategory: 'Dystonia',
    component: null,
    icon: '🔗',
    duration: '15 min',
    items: 12,
  },

  // Sleep Disorders
  {
    id: 'epworth',
    name: 'Epworth Sleepiness Scale',
    abbreviation: 'ESS',
    description: 'Measure daytime sleepiness and excessive somnolence',
    category: ASSESSMENT_CATEGORIES.SLEEP,
    subcategory: 'Daytime Sleepiness',
    component: null,
    icon: '😴',
    duration: '5 min',
    items: 8,
  },
  {
    id: 'stop-bang',
    name: 'STOP-BANG Sleep Apnea Screening',
    abbreviation: 'STOP-BANG',
    description: 'Screen for obstructive sleep apnea risk',
    category: ASSESSMENT_CATEGORIES.SLEEP,
    subcategory: 'Sleep Apnea',
    component: null,
    icon: '💤',
    duration: '5 min',
    items: 8,
  },

  // Epilepsy Assessments
  {
    id: 'ilae-seizure-classification',
    name: 'ILAE Updated Classification of Epileptic Seizures',
    abbreviation: 'ILAE 2025',
    description: 'Interactive guide to the 2025 ILAE seizure classification system with detailed taxonomy',
    category: ASSESSMENT_CATEGORIES.NEUROLOGICAL,
    subcategory: 'Epilepsy & Seizures',
    component: null,
    icon: '⚡',
    duration: '10-15 min',
    items: 28,
  },
  {
    id: 'laep',
    name: 'Likelihood of Adverse Effects Profile',
    abbreviation: 'LAEP',
    description: 'Self-report tool for measuring side effects of antiseizure medications',
    category: ASSESSMENT_CATEGORIES.NEUROLOGICAL,
    subcategory: 'Epilepsy & Seizures',
    component: null,
    icon: '💊',
    duration: '5-10 min',
    items: 8,
  },
  {
    id: 'esgs',
    name: 'Epilepsy Surgery Grading Scale',
    abbreviation: 'ESGS',
    description: 'Prediction of seizure-free outcome after resective surgery for drug-resistant focal epilepsy',
    category: ASSESSMENT_CATEGORIES.NEUROLOGICAL,
    subcategory: 'Epilepsy & Seizures',
    component: null,
    icon: '🏥',
    duration: '10 min',
    items: 4,
  },
  {
    id: 'cases',
    name: 'Clinical Appropriateness Scores for Epilepsy Surgery',
    abbreviation: 'CASES',
    description: 'Screening tool to identify patients appropriate for specialized epilepsy surgery evaluation',
    category: ASSESSMENT_CATEGORIES.NEUROLOGICAL,
    subcategory: 'Epilepsy & Seizures',
    component: null,
    icon: '🔍',
    duration: '5 min',
    items: 6,
  },
  {
    id: 'engel',
    name: 'Engel Scale',
    abbreviation: 'Engel',
    description: 'Post-surgical seizure outcome assessment following epilepsy surgery',
    category: ASSESSMENT_CATEGORIES.NEUROLOGICAL,
    subcategory: 'Epilepsy & Seizures',
    component: null,
    icon: '📊',
    duration: '5 min',
    items: 7,
  },
  {
    id: 'sudep-7',
    name: 'SUDEP-7 Inventory',
    abbreviation: 'SUDEP-7',
    description: 'Risk assessment tool for Sudden Unexpected Death in Epilepsy based on 7 key factors',
    category: ASSESSMENT_CATEGORIES.NEUROLOGICAL,
    subcategory: 'Epilepsy & Seizures',
    component: null,
    icon: '⚠️',
    duration: '5-10 min',
    items: 7,
  },
  {
    id: 'sudep-safety',
    name: 'SUDEP Safety Checklist',
    abbreviation: 'SUDEP-Safety',
    description: 'Comprehensive checklist of evidence-based SUDEP risk reduction and safety measures',
    category: ASSESSMENT_CATEGORIES.NEUROLOGICAL,
    subcategory: 'Epilepsy & Seizures',
    component: null,
    icon: '✓',
    duration: '10-15 min',
    items: 20,
  },
];

export const getAssessmentsByCategory = (category: string): Assessment[] => {
  return assessments.filter(a => a.category === category);
};

export const getAssessmentById = (id: string): Assessment | undefined => {
  return assessments.find(a => a.id === id);
};

export const getAllCategories = (): string[] => {
  return Object.values(ASSESSMENT_CATEGORIES);
};

export const getSubcategoriesByCategory = (category: string): string[] => {
  const subcats = assessments
    .filter(a => a.category === category)
    .map(a => a.subcategory);
  return [...new Set(subcats)];
};
