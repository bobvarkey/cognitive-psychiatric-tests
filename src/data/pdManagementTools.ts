// 5-2-1 Criteria for Advanced PD
export const FIVE_TWO_ONE_CRITERIA = [
  {
    id: 'levodopa',
    title: '≥ 5 doses of oral levodopa per day',
    description: 'Patient taking 5 or more daily doses of levodopa',
    met: false,
  },
  {
    id: 'offTime',
    title: '≥ 2 hours of "off" time per day',
    description: 'Patient experiencing 2 or more hours daily when medication efficacy wanes',
    met: false,
  },
  {
    id: 'dyskinesia',
    title: '≥ 1 hour of troublesome dyskinesia per day',
    description: 'Patient experiencing involuntary movements for 1 or more hours daily',
    met: false,
  },
];

// ANAGE-PD Tool Components
export const ANAGE_PD_DOMAINS = [
  {
    id: 'motor',
    name: 'Motor Complications',
    items: [
      'Dyskinesia (duration and severity)',
      'Motor fluctuations and OFF episodes',
      'Freezing of gait',
      'Postural instability',
    ],
  },
  {
    id: 'nonmotor',
    name: 'Non-Motor Complications',
    items: [
      'Cognitive decline/dementia',
      'Psychiatric symptoms',
      'Sleep disturbances',
      'Autonomic dysfunction',
    ],
  },
  {
    id: 'therapy',
    name: 'Current Therapy Status',
    items: [
      'Suboptimal symptom control on standard therapy',
      'High medication burden',
      'Medication side effects',
      'Disease progression despite optimization',
    ],
  },
];

// D-DATS (Dutch DAT Screening Tool)
export const D_DATS_CRITERIA = [
  {
    id: 'advanced',
    name: 'Advanced PD Diagnosis',
    description: 'Confirmed advanced Parkinson\'s Disease diagnosis',
    required: true,
  },
  {
    id: 'motorFluctuations',
    name: 'Motor Fluctuations',
    description: 'Evidence of motor fluctuations (wearing off, on-off)',
    required: true,
  },
  {
    id: 'dyskinesia',
    name: 'Dyskinesia',
    description: 'Troublesome involuntary movements',
    required: false,
  },
  {
    id: 'optimalMedication',
    name: 'Optimized Medical Therapy',
    description: 'Patient on optimized dopaminergic and adjunctive medications',
    required: true,
  },
  {
    id: 'cognitiveFunction',
    name: 'Adequate Cognitive Function',
    description: 'MMSE ≥ 24 or equivalent cognitive capacity',
    required: true,
  },
  {
    id: 'psychSurgical',
    name: 'Psychological/Surgical Candidacy',
    description: 'Patient suitable for surgical intervention',
    required: true,
  },
];

export const DAT_TYPES = [
  { id: 'dbs', name: 'Deep Brain Stimulation', abbreviation: 'DBS', description: 'Surgical implantation of stimulating electrodes' },
  { id: 'lcig', name: 'Levodopa-Carbidopa Intestinal Gel', abbreviation: 'LCIG', description: 'Continuous intestinal infusion of levodopa' },
  { id: 'csai', name: 'Continuous Subcutaneous Apomorphine', abbreviation: 'CSAI', description: 'Subcutaneous dopamine agonist infusion' },
  { id: 'lecig', name: 'Levodopa-Etacapone Continuous', abbreviation: 'LECIG', description: 'Continuous intestinal infusion with COMT inhibitor' },
];

// Stimulus Tool Components
export const STIMULUS_DBS_VARIABLES = [
  {
    id: 'duration',
    name: 'Disease Duration',
    description: 'Years since PD diagnosis',
    unit: 'years',
  },
  {
    id: 'age',
    name: 'Age',
    description: 'Current patient age',
    unit: 'years',
  },
  {
    id: 'levodopa',
    name: 'Levodopa Response',
    description: 'Initial and current response to levodopa',
    options: ['Good', 'Moderate', 'Poor'],
  },
  {
    id: 'motor',
    name: 'Motor Complications',
    description: 'Type and severity of motor complications',
    options: ['None', 'Mild', 'Moderate', 'Severe'],
  },
  {
    id: 'cognitive',
    name: 'Cognitive Status',
    description: 'Baseline cognitive function',
    options: ['Normal', 'Mild impairment', 'Moderate impairment'],
  },
  {
    id: 'psychiatric',
    name: 'Psychiatric Status',
    description: 'Presence of psychosis or severe depression',
    options: ['None', 'Mild', 'Moderate', 'Severe'],
  },
  {
    id: 'tremor',
    name: 'Predominant Feature',
    description: 'Primary motor manifestation',
    options: ['Tremor-dominant', 'Akinetic-rigid', 'Mixed'],
  },
];

export const STIMULUS_APPROPRIATENESS_SCALE = [
  { value: 1, label: '1: Not appropriate', color: 'text-red-600' },
  { value: 2, label: '2: Inappropriate', color: 'text-red-500' },
  { value: 3, label: '3: Uncertain/Inappropriate', color: 'text-orange-500' },
  { value: 4, label: '4: Uncertain', color: 'text-yellow-500' },
  { value: 5, label: '5: Equivocal', color: 'text-gray-400' },
  { value: 6, label: '6: Uncertain', color: 'text-blue-500' },
  { value: 7, label: '7: Uncertain/Appropriate', color: 'text-cyan-500' },
  { value: 8, label: '8: Appropriate', color: 'text-green-500' },
  { value: 9, label: '9: Highly appropriate', color: 'text-green-600' },
];

export const DBS_CANDIDACY_CRITERIA = {
  favorable: [
    'Good or excellent initial levodopa response',
    'Disease duration 4-10 years',
    'Age at surgery <70 years',
    'Tremor-dominant or mixed phenotype',
    'No or mild cognitive impairment',
    'Stable psychiatric status',
    'No significant comorbidities',
  ],
  unfavorable: [
    'Poor levodopa response',
    'Early dementia or cognitive impairment',
    'Psychosis or severe psychiatric disease',
    'Severe autonomic dysfunction',
    'Atypical parkinsonism',
    'Advanced age (>75-80 years)',
    'Significant medical comorbidities',
  ],
};
