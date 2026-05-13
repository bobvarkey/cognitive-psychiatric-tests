export interface IrlsItem {
  id: string;
  number: number;
  question: string;
  description: string;
}

export const IRLS_ITEMS: IrlsItem[] = [
  {
    id: 'discomfort',
    number: 1,
    question: 'Overall discomfort in your legs or arms due to RLS',
    description: 'Rate the overall level of discomfort (crawling, tingling, aching, or other unpleasant sensations) in your legs or arms due to restless legs syndrome over the past week.'
  },
  {
    id: 'need_to_move',
    number: 2,
    question: 'Need to move around due to RLS symptoms',
    description: 'Rate the intensity of your need to move your legs or arms to relieve RLS symptoms over the past week.'
  },
  {
    id: 'relief_with_movement',
    number: 3,
    question: 'Relief from discomfort with movement',
    description: 'Rate the degree of relief you experienced from moving around (walking, stretching, etc.) when you had RLS symptoms over the past week.'
  },
  {
    id: 'sleep_disturbance',
    number: 4,
    question: 'Sleep disturbance due to RLS symptoms',
    description: 'Rate the severity of sleep disturbance caused by RLS symptoms over the past week (difficulty falling asleep, staying asleep, or waking too early).'
  },
  {
    id: 'daytime_fatigue',
    number: 5,
    question: 'Daytime fatigue or sleepiness due to RLS',
    description: 'Rate the severity of daytime tiredness, fatigue, or sleepiness resulting from RLS-related sleep disturbance over the past week.'
  },
  {
    id: 'overall_severity',
    number: 6,
    question: 'Overall severity of your RLS',
    description: 'Rate the overall severity of your restless legs syndrome over the past week, considering all symptoms and their impact.'
  },
  {
    id: 'symptom_frequency',
    number: 7,
    question: 'How often did you experience RLS symptoms?',
    description: 'Rate how frequently you experienced RLS symptoms over the past week.'
  },
  {
    id: 'average_severity',
    number: 8,
    question: 'When you had RLS symptoms, how severe were they on average?',
    description: 'Rate the average severity of RLS symptoms when they occurred over the past week.'
  },
  {
    id: 'daily_activities',
    number: 9,
    question: 'Impact of RLS on your ability to carry out daily activities',
    description: 'Rate how much your RLS symptoms interfered with your ability to perform daily activities (work, social activities, home responsibilities) over the past week.'
  },
  {
    id: 'mood_impact',
    number: 10,
    question: 'Impact of RLS on your mood',
    description: 'Rate how much your RLS symptoms affected your mood (feeling irritable, anxious, depressed, or frustrated) over the past week.'
  }
];

export const IRLS_SCORING_GUIDE: Record<number, string> = {
  0: 'None',
  1: 'Mild',
  2: 'Moderate',
  3: 'Severe',
  4: 'Very Severe'
};

export const IRLS_INTERPRETATION = {
  none: {
    range: '0',
    level: 'No RLS',
    severity: 'None',
    severityColor: 'text-green-600 bg-green-50 border-green-200',
    description: 'Patient does not report any symptoms of restless legs syndrome. No further evaluation for RLS is indicated.',
    recommendations: [
      'No intervention for RLS is needed at this time.',
      'If patient reports sleep disturbance, evaluate for other sleep disorders.'
    ]
  },
  mild: {
    range: '1-10',
    level: 'Mild RLS',
    severity: 'Mild',
    severityColor: 'text-blue-600 bg-blue-50 border-blue-200',
    description: 'Patient reports mild restless legs syndrome symptoms. Symptoms are present but have limited impact on sleep quality and daily functioning.',
    recommendations: [
      'Provide education on sleep hygiene and trigger avoidance (caffeine, alcohol, sleep deprivation).',
      'Consider non-pharmacological interventions: moderate exercise, leg massage, warm baths before bedtime.',
      'Check serum ferritin levels; if < 75 ng/mL, consider iron supplementation.',
      'Review current medications that may exacerbate RLS (antidepressants, antihistamines, dopamine antagonists).',
      'Reassess at follow-up in 3-6 months.'
    ]
  },
  moderate: {
    range: '11-20',
    level: 'Moderate RLS',
    severity: 'Moderate',
    severityColor: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    description: 'Patient reports moderate restless legs syndrome symptoms with noticeable impact on sleep quality and daily activities. Intervention is warranted.',
    recommendations: [
      'Check and optimize serum ferritin (target > 75 ng/mL, or > 100 ng/mL if on dopaminergic therapy).',
      'Consider first-line pharmacotherapy: alpha-2-delta ligands (gabapentin, pregabalin) for patients without significant daytime sleepiness.',
      'Non-ergot dopamine agonists (pramipexole, ropinirole, rotigotine) may be considered in select patients, with caution regarding augmentation risk.',
      'Regular monitoring for augmentation (symptom worsening, earlier onset, spread to other body parts).',
      'Refer to sleep medicine specialist for comprehensive evaluation and management.'
    ]
  },
  severe: {
    range: '21-30',
    level: 'Severe RLS',
    severity: 'Severe',
    severityColor: 'text-orange-600 bg-orange-50 border-orange-200',
    description: 'Patient reports severe restless legs syndrome with significant disruption of sleep quality, daily functioning, and mood. Urgent intervention is required.',
    recommendations: [
      'Urgent referral to sleep medicine specialist or movement disorder neurologist.',
      'Comprehensive evaluation including serum ferritin, transferrin saturation, renal function, and neuropathy screen.',
      'Consider IV iron therapy if ferritin < 75 ng/mL and oral iron is ineffective or poorly tolerated.',
      'Alpha-2-delta ligands or opioids (in refractory cases under specialist supervision) for symptom management.',
      'If already on dopaminergic therapy, evaluate for augmentation and consider medication adjustment.',
      'Address comorbid sleep disorders (sleep apnea, PLMD) with polysomnography if indicated.',
      'Assess for depression and anxiety related to chronic sleep disruption.'
    ]
  },
  verySevere: {
    range: '31-40',
    level: 'Very Severe RLS',
    severity: 'Very Severe',
    severityColor: 'text-red-600 bg-red-50 border-red-200',
    description: 'Patient reports very severe restless legs syndrome with profound impact on quality of life, sleep, mood, and daily functioning. Requires urgent multidisciplinary intervention.',
    recommendations: [
      'Immediate referral to sleep medicine specialist or movement disorder neurologist.',
      'Comprehensive laboratory workup including iron studies, renal function, hemoglobin A1c, neuropathy workup.',
      'Polysomnography to evaluate for comorbid sleep disorders (OSA, PLMD).',
      'Consider IV iron therapy (ferric carboxymaltose 1000 mg or low molecular weight iron dextran 1000 mg) even if ferritin is normal.',
      'Combination therapy may be required: alpha-2-delta ligand + opioid or dopamine agonist (with vigilance for augmentation).',
      'Screen for psychiatric comorbidities and provide mental health support.',
      'Evaluate occupational impact; consider workplace accommodations.',
      'Close follow-up with multi-disciplinary team approach.'
    ]
  }
};
