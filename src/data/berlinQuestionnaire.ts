export interface BerlinItem {
  id: string;
  number: number;
  category: 1 | 2 | 3;
  question: string;
  description: string;
  type: 'yesno' | 'frequency' | 'loudness';
  options: { label: string; value: number }[];
}

export const BERLIN_ITEMS: BerlinItem[] = [
  // Category 1: Snoring and Apnea (items 1-5)
  {
    id: 'snore',
    number: 1,
    category: 1,
    question: 'Do you snore?',
    description: 'Assess for presence of snoring.',
    type: 'yesno',
    options: [
      { label: 'Yes', value: 1 },
      { label: 'No', value: 0 },
      { label: "Don't know", value: 0 }
    ]
  },
  {
    id: 'snore_loudness',
    number: 2,
    category: 1,
    question: 'If you snore, how loud is your snoring?',
    description: 'Assess for snoring loudness level.',
    type: 'loudness',
    options: [
      { label: 'Louder than breathing', value: 0 },
      { label: 'As loud as talking', value: 1 },
      { label: 'Louder than talking', value: 2 },
      { label: 'Very loud — can be heard in adjacent rooms', value: 2 }
    ]
  },
  {
    id: 'snore_frequency',
    number: 3,
    category: 1,
    question: 'How often do you snore?',
    description: 'Assess for snoring frequency.',
    type: 'frequency',
    options: [
      { label: 'Almost every day', value: 2 },
      { label: '3-4 times a week', value: 2 },
      { label: '1-2 times a week', value: 0 },
      { label: '1-2 times a month', value: 0 },
      { label: 'Never or almost never', value: 0 }
    ]
  },
  {
    id: 'snore_bother_others',
    number: 4,
    category: 1,
    question: 'Has your snoring ever bothered other people?',
    description: 'Assess whether snoring disturbs others.',
    type: 'yesno',
    options: [
      { label: 'Yes', value: 1 },
      { label: 'No', value: 0 },
      { label: "Don't know", value: 0 }
    ]
  },
  {
    id: 'apnea_noticed',
    number: 5,
    category: 1,
    question: 'Has anyone noticed that you stop breathing or choke/gasp during your sleep?',
    description: 'Assess for witnessed apneas.',
    type: 'frequency',
    options: [
      { label: 'Almost every day', value: 2 },
      { label: '3-4 times a week', value: 2 },
      { label: '1-2 times a week', value: 0 },
      { label: '1-2 times a month', value: 0 },
      { label: 'Never', value: 0 }
    ]
  },
  // Category 2: Daytime Sleepiness (items 6-9)
  {
    id: 'tired_after_sleep',
    number: 6,
    category: 2,
    question: 'How often do you feel tired or fatigued after your sleep?',
    description: 'Assess for non-restorative sleep and post-sleep fatigue.',
    type: 'frequency',
    options: [
      { label: 'Almost every day', value: 2 },
      { label: '3-4 times a week', value: 2 },
      { label: '1-2 times a week', value: 0 },
      { label: '1-2 times a month', value: 0 },
      { label: 'Never', value: 0 }
    ]
  },
  {
    id: 'tired_awake',
    number: 7,
    category: 2,
    question: 'During your waking time, do you feel tired, fatigued, or not up to par?',
    description: 'Assess for daytime fatigue during waking hours.',
    type: 'frequency',
    options: [
      { label: 'Almost every day', value: 2 },
      { label: '3-4 times a week', value: 2 },
      { label: '1-2 times a week', value: 0 },
      { label: '1-2 times a month', value: 0 },
      { label: 'Never', value: 0 }
    ]
  },
  {
    id: 'dozed_driving',
    number: 8,
    category: 2,
    question: 'Have you ever nodded off or fallen asleep while driving a vehicle?',
    description: 'Assess for dangerous sleepiness while driving.',
    type: 'yesno',
    options: [
      { label: 'Yes', value: 1 },
      { label: 'No', value: 0 }
    ]
  },
  {
    id: 'doze_frequency_driving',
    number: 9,
    category: 2,
    question: 'If yes, how often does this occur?',
    description: 'Assess frequency of dozing while driving.',
    type: 'frequency',
    options: [
      { label: 'Almost every day', value: 2 },
      { label: '3-4 times a week', value: 2 },
      { label: '1-2 times a week', value: 0 },
      { label: '1-2 times a month', value: 0 },
      { label: 'Never', value: 0 }
    ]
  },
  // Category 3: Hypertension and BMI (items 10-11)
  {
    id: 'hypertension',
    number: 10,
    category: 3,
    question: 'Do you have high blood pressure?',
    description: 'Assess for comorbid hypertension.',
    type: 'yesno',
    options: [
      { label: 'Yes', value: 1 },
      { label: 'No', value: 0 },
      { label: "Don't know", value: 0 }
    ]
  },
  {
    id: 'bmi_gt_30',
    number: 11,
    category: 3,
    question: 'Is your Body Mass Index (BMI) greater than 30 kg/m²?',
    description: 'BMI > 30 is considered a risk factor for OSA.',
    type: 'yesno',
    options: [
      { label: 'Yes', value: 1 },
      { label: 'No', value: 0 }
    ]
  }
];

export const BERLIN_CATEGORY_DEFINITIONS = {
  1: {
    name: 'Snoring and Apnea',
    items: ['snore', 'snore_loudness', 'snore_frequency', 'snore_bother_others', 'apnea_noticed'],
    positiveThreshold: 2
  },
  2: {
    name: 'Daytime Sleepiness',
    items: ['tired_after_sleep', 'tired_awake', 'dozed_driving', 'doze_frequency_driving'],
    positiveThreshold: 2
  },
  3: {
    name: 'Hypertension / BMI',
    items: ['hypertension', 'bmi_gt_30'],
    positiveThreshold: 1
  }
};

export const BERLIN_INTERPRETATION = {
  highRisk: {
    level: 'High Risk for Obstructive Sleep Apnea',
    severity: 'High',
    description: 'Patient screens positive for high risk of obstructive sleep apnea (OSA) based on the Berlin Questionnaire. Two or more categories are positive.',
    recommendations: [
      'Refer for comprehensive sleep evaluation and polysomnography (PSG) or home sleep apnea testing (HSAT).',
      'Assess for cardiovascular risk factors and comorbid conditions.',
      'Educate patient about OSA risks including cardiovascular disease, stroke, and metabolic syndrome.',
      'Evaluate impact on daytime functioning, mood, and quality of life.',
      'Consider empiric CPAP trial if clinical suspicion is very high while awaiting sleep study.'
    ],
    color: 'red'
  },
  lowRisk: {
    level: 'Low Risk for Obstructive Sleep Apnea',
    severity: 'Low',
    description: 'Patient screens negative for high risk of obstructive sleep apnea based on the Berlin Questionnaire. Zero or one category is positive.',
    recommendations: [
      'Provide sleep hygiene education.',
      'Address any modifiable risk factors (weight management, alcohol reduction).',
      'Monitor for development or worsening of symptoms during follow-up.',
      'If clinical suspicion remains high despite screening result, consider further evaluation.'
    ],
    color: 'green'
  }
};
