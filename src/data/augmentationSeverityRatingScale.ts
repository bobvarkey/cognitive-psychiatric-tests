export interface AsrsItem {
  id: string;
  number: number;
  question: string;
  description: string;
  type: 'scale' | 'yesno';
  maxScore: number;
}

export const ASRS_ITEMS: AsrsItem[] = [
  {
    id: 'earlier_onset',
    number: 1,
    question: 'Earlier onset of RLS symptoms during the day',
    description: 'Compared to before starting treatment, do your RLS symptoms start earlier in the day or occur sooner after the same dose of medication?',
    type: 'scale',
    maxScore: 3
  },
  {
    id: 'increased_intensity',
    number: 2,
    question: 'Increased intensity of RLS symptoms',
    description: 'Compared to before starting treatment, have your RLS symptoms become more intense or severe?',
    type: 'scale',
    maxScore: 3
  },
  {
    id: 'symptom_spread',
    number: 3,
    question: 'Spread of symptoms to previously unaffected body parts',
    description: 'Have your RLS symptoms spread to involve body parts that were previously not affected (e.g., from legs to arms, trunk, or other areas)?',
    type: 'scale',
    maxScore: 3
  },
  {
    id: 'less_effect_dose',
    number: 4,
    question: 'Less effect from the same dose of medication',
    description: 'Do you notice that the same dose of your RLS medication provides less relief than it used to?',
    type: 'yesno',
    maxScore: 1
  },
  {
    id: 'shorter_duration',
    number: 5,
    question: 'Shorter duration of benefit from medication',
    description: 'Does the relief from your RLS medication last for a shorter period of time than it used to?',
    type: 'yesno',
    maxScore: 1
  },
  {
    id: 'daytime_symptoms',
    number: 6,
    question: 'Emergence of daytime symptoms after evening dose',
    description: 'Have you developed RLS symptoms during the daytime (between doses), particularly in the late afternoon or early evening?',
    type: 'yesno',
    maxScore: 1
  },
  {
    id: 'rebound_symptoms',
    number: 7,
    question: 'Rebound or withdrawal symptoms in the early morning',
    description: 'Do you experience worsening or rebound of RLS symptoms in the early morning hours, or withdrawal symptoms when medication is wearing off?',
    type: 'yesno',
    maxScore: 1
  }
];

export const ASRS_SCALE_SCORING_GUIDE: Record<number, string> = {
  0: 'No change',
  1: 'Slight increase / 1-2 hours earlier',
  2: 'Moderate increase / 3-5 hours earlier',
  3: 'Very large increase / 6+ hours earlier or spread to 4+ limbs/trunk'
};

export const ASRS_SCALE_ITEM_SCORING: Record<string, Record<number, string>> = {
  earlier_onset: {
    0: 'No change in symptom onset time',
    1: 'Symptoms start 1-2 hours earlier than before',
    2: 'Symptoms start 3-5 hours earlier than before',
    3: 'Symptoms start 6 or more hours earlier than before'
  },
  increased_intensity: {
    0: 'No change in symptom intensity',
    1: 'Slight increase in symptom intensity',
    2: 'Moderate increase in symptom intensity',
    3: 'Very large increase in symptom intensity'
  },
  symptom_spread: {
    0: 'No spread (same body areas as before)',
    1: 'Spread to 1 additional limb (arm or leg)',
    2: 'Spread to 2-3 additional limbs',
    3: 'Spread to 4 limbs or involvement of the trunk'
  }
};

export const ASRS_YESNO_SCORING_GUIDE: Record<number, string> = {
  0: 'No',
  1: 'Yes'
};

export const ASRS_INTERPRETATION = {
  noAugmentation: {
    range: '0-3',
    level: 'No Augmentation',
    severity: 'None',
    severityColor: 'text-green-600 bg-green-50 border-green-200',
    description: 'No evidence of augmentation with current dopaminergic therapy. Patient is not experiencing clinically significant worsening of RLS symptoms related to dopaminergic treatment.',
    recommendations: [
      'Continue current RLS treatment with appropriate monitoring.',
      'Educate patient about signs of augmentation for early detection.',
      'Reassess periodically using the ASRS to screen for augmentation development.',
      'Maintain iron stores at optimal levels (ferritin > 75 ng/mL, or > 100 ng/mL if on dopaminergic therapy).'
    ]
  },
  probableAugmentation: {
    range: '4-9',
    level: 'Probable Augmentation',
    severity: 'Moderate to Severe',
    severityColor: 'text-red-600 bg-red-50 border-red-200',
    description: 'Patient shows evidence of probable augmentation with dopaminergic therapy. Clinical features suggest medication-related worsening of RLS symptoms that requires intervention.',
    recommendations: [
      'Confirm augmentation diagnosis: earlier onset, increased severity, and/or spread to previously unaffected areas.',
      'Check serum ferritin and optimize iron stores before adjusting medications.',
      'Consider dose reduction or discontinuation of dopaminergic therapy.',
      'Switch to alpha-2-delta ligand (gabapentin, pregabalin, gabapentin enacarbil) as alternative first-line therapy.',
      'If severe augmentation, consider complete dopamine agonist withdrawal (may require temporary opioids to manage withdrawal exacerbation).',
      'Refer to sleep medicine specialist or movement disorder neurologist for management of augmentation.',
      'Schedule close follow-up within 2-4 weeks to monitor response to treatment changes.'
    ]
  }
};
