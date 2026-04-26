// SUDEP-7 Inventory
export const SUDEP_7_ITEMS = [
  {
    id: 'tonic-clonic-frequency',
    name: 'Tonic-Clonic Seizure Frequency',
    description: 'Frequency of generalized tonic-clonic seizures',
    scoring: 'How often does patient have tonic-clonic seizures?',
    options: [
      { value: 0, label: 'None' },
      { value: 1, label: 'Rare (< 1 per month)' },
      { value: 2, label: 'Occasional (1-3 per month)' },
      { value: 3, label: 'Frequent (>3 per month)' },
    ],
  },
  {
    id: 'medication-adherence',
    name: 'Medication Adherence',
    description: 'Consistency in taking antiepileptic drugs',
    scoring: 'How consistently does patient take medications?',
    options: [
      { value: 0, label: 'Excellent (>90% adherence)' },
      { value: 1, label: 'Good (70-90% adherence)' },
      { value: 2, label: 'Fair (50-70% adherence)' },
      { value: 3, label: 'Poor (<50% adherence)' },
    ],
  },
  {
    id: 'intellectual-disability',
    name: 'Intellectual Disability',
    description: 'Presence and severity of cognitive impairment',
    scoring: 'Does patient have intellectual disability?',
    options: [
      { value: 0, label: 'None' },
      { value: 1, label: 'Mild' },
      { value: 2, label: 'Moderate' },
      { value: 3, label: 'Severe' },
    ],
  },
  {
    id: 'drug-resistant',
    name: 'Drug-Resistant Epilepsy',
    description: 'Failure to control seizures with standard medications',
    scoring: 'Is patient drug-resistant?',
    options: [
      { value: 0, label: 'No' },
      { value: 3, label: 'Yes' },
    ],
  },
  {
    id: 'seizure-clustering',
    name: 'Seizure Clustering',
    description: 'Multiple seizures in a short time period',
    scoring: 'Does patient have seizure clusters?',
    options: [
      { value: 0, label: 'No' },
      { value: 1, label: 'Occasional' },
      { value: 2, label: 'Frequent' },
    ],
  },
  {
    id: 'young-onset',
    name: 'Young Age of Seizure Onset',
    description: 'Epilepsy beginning in childhood',
    scoring: 'Age when seizures started?',
    options: [
      { value: 0, label: 'Adult onset (>18 years)' },
      { value: 1, label: 'Childhood onset (<18 years)' },
      { value: 2, label: 'Early childhood (<5 years)' },
    ],
  },
  {
    id: 'male-gender',
    name: 'Male Gender',
    description: 'Higher SUDEP risk in males',
    scoring: 'Patient gender?',
    options: [
      { value: 0, label: 'Female' },
      { value: 1, label: 'Male' },
    ],
  },
];

export const SUDEP_7_RISK_LEVELS = {
  low: {
    range: '0-3',
    percentage: '<1% annual SUDEP risk',
    description: 'Low risk',
  },
  moderate: {
    range: '4-7',
    percentage: '1-2% annual SUDEP risk',
    description: 'Moderate risk',
  },
  high: {
    range: '8-13',
    percentage: '2-5% annual SUDEP risk',
    description: 'High risk',
  },
  veryhigh: {
    range: '14+',
    percentage: '>5% annual SUDEP risk',
    description: 'Very high risk',
  },
};

// SUDEP Safety Checklist
export const SUDEP_SAFETY_MEASURES = [
  {
    id: 'medication',
    category: 'Medication Management',
    items: [
      { id: 'adherence', name: 'Adherence Support', description: 'Implement strategies to ensure medication compliance' },
      { id: 'optimization', name: 'Optimization', description: 'Ensure maximum tolerated doses of appropriate AEDs' },
      { id: 'review', name: 'Regular Review', description: 'Periodic reassessment of medication efficacy and side effects' },
    ],
  },
  {
    id: 'seizure-control',
    category: 'Seizure Control',
    items: [
      { id: 'monitoring', name: 'Seizure Monitoring', description: 'Track seizure frequency and patterns' },
      { id: 'triggers', name: 'Trigger Identification', description: 'Identify and avoid seizure triggers' },
      { id: 'treatment', name: 'Advanced Treatment', description: 'Consider surgery or neuromodulation for drug-resistant epilepsy' },
    ],
  },
  {
    id: 'lifestyle',
    category: 'Lifestyle Modifications',
    items: [
      { id: 'sleep', name: 'Sleep Hygiene', description: 'Maintain regular sleep schedule (sleep deprivation lowers seizure threshold)' },
      { id: 'stress', name: 'Stress Management', description: 'Implement stress reduction techniques' },
      { id: 'alcohol', name: 'Avoid Triggers', description: 'Avoid alcohol and other substances that trigger seizures' },
    ],
  },
  {
    id: 'safety',
    category: 'Physical Safety',
    items: [
      { id: 'supervision', name: 'Supervision During Sleep', description: 'Have another person check on patient during sleep' },
      { id: 'positioning', name: 'Sleep Positioning', description: 'Sleep on side to prevent airway obstruction' },
      { id: 'bedding', name: 'Safe Bedding', description: 'Avoid excessive pillows or soft objects in bed' },
      { id: 'detection', name: 'Seizure Detection', description: 'Consider seizure alert devices/wearables' },
    ],
  },
  {
    id: 'emergency',
    category: 'Emergency Preparedness',
    items: [
      { id: 'rescue', name: 'Rescue Medication', description: 'Have rescue medication (e.g., diastat, rescue benzodiazepines) available' },
      { id: 'plan', name: 'Emergency Plan', description: 'Educate family/caregivers on emergency response' },
      { id: 'cpr', name: 'CPR Training', description: 'Family members trained in CPR' },
    ],
  },
  {
    id: 'medical',
    category: 'Medical Monitoring',
    items: [
      { id: 'cardio', name: 'Cardiac Monitoring', description: 'Monitor for cardiac arrhythmias and autonomic dysfunction' },
      { id: 'respiratory', name: 'Respiratory Monitoring', description: 'Assess for ictal/postictal respiratory compromise' },
      { id: 'education', name: 'Patient Education', description: 'Counsel patient on SUDEP awareness and risk reduction' },
    ],
  },
];

export const SUDEP_PREVENTION_STRATEGIES = [
  'Optimize antiepileptic drug therapy',
  'Improve medication adherence',
  'Treat drug-resistant epilepsy with surgery or neuromodulation',
  'Maintain seizure diary',
  'Ensure adequate sleep (avoid sleep deprivation)',
  'Manage comorbid conditions (depression, anxiety)',
  'Provide seizure alert devices/monitoring',
  'Position sleeping patient on side',
  'Have rescue medications available',
  'Educate patient and caregivers about SUDEP',
  'Monitor for autonomic and cardiac dysfunction',
  'Regular follow-up with neurology',
];
