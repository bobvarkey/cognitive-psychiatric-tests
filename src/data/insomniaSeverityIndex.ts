export interface IsiItem {
  id: string;
  number: number;
  question: string;
  description: string;
}

export const ISI_ITEMS: IsiItem[] = [
  {
    id: 'falling_asleep',
    number: 1,
    question: 'Difficulty falling asleep',
    description: 'Rate the severity of difficulty initiating sleep over the past two weeks.'
  },
  {
    id: 'staying_asleep',
    number: 2,
    question: 'Difficulty staying asleep',
    description: 'Rate the severity of difficulty maintaining sleep (waking during the night) over the past two weeks.'
  },
  {
    id: 'waking_early',
    number: 3,
    question: 'Problem waking up too early',
    description: 'Rate the severity of waking up too early and being unable to fall back asleep over the past two weeks.'
  },
  {
    id: 'satisfaction',
    number: 4,
    question: 'How satisfied/dissatisfied are you with your CURRENT sleep pattern?',
    description: 'Rate your overall satisfaction with your current sleep.'
  },
  {
    id: 'noticeability',
    number: 5,
    question: 'How NOTICEABLE to others do you think your sleep problem is in terms of impairing your quality of life?',
    description: 'Rate how much your sleep problem is noticeable to others.'
  },
  {
    id: 'worry',
    number: 6,
    question: 'How WORRIED/DISTRESSED are you about your current sleep problem?',
    description: 'Rate your level of worry or distress about your sleep problem.'
  },
  {
    id: 'interference',
    number: 7,
    question: 'To what extent do you consider your sleep problem to INTERFERE with your daily functioning?',
    description: 'Rate how much your sleep problem interferes with daily activities (e.g., daytime fatigue, mood, concentration, etc.).'
  }
];

export const ISI_SCORING_GUIDE: Record<number, string> = {
  0: 'None',
  1: 'Mild',
  2: 'Moderate',
  3: 'Severe',
  4: 'Very Severe'
};

export const ISI_INTERPRETATION = {
  0: {
    range: '0-7',
    level: 'No Clinically Significant Insomnia',
    severity: 'Normal',
    description: 'Patient does not meet criteria for clinically significant insomnia. Sleep is within normal limits.',
    recommendations: [
      'Maintain current sleep hygiene practices.',
      'No formal intervention is indicated at this time.',
      'Monitor for any changes in sleep patterns during follow-up visits.'
    ]
  },
  1: {
    range: '8-14',
    level: 'Subthreshold Insomnia',
    severity: 'Mild',
    description: 'Patient exhibits subthreshold insomnia symptoms. Some sleep difficulties are present but do not meet full criteria for clinical insomnia.',
    recommendations: [
      'Provide sleep hygiene education (consistent sleep schedule, limit caffeine/alcohol, optimize sleep environment).',
      'Consider stimulus control therapy and relaxation techniques.',
      'Monitor response to non-pharmacological interventions over 2-4 weeks.',
      'If symptoms persist, consider CBT-I (Cognitive Behavioral Therapy for Insomnia) referral.'
    ]
  },
  2: {
    range: '15-21',
    level: 'Clinical Insomnia (Moderate Severity)',
    severity: 'Moderate',
    description: 'Patient meets criteria for clinical insomnia of moderate severity. Sleep difficulties are significantly impacting daily functioning.',
    recommendations: [
      'Refer for formal CBT-I evaluation and treatment.',
      'Consider targeted pharmacotherapy if rapid relief is needed (short-term use only).',
      'Screen for comorbid psychiatric conditions (anxiety, depression) that may exacerbate insomnia.',
      'Implement comprehensive sleep management plan with follow-up in 2-4 weeks.',
      'Evaluate for underlying medical conditions contributing to sleep disturbance.'
    ]
  },
  3: {
    range: '22-28',
    level: 'Clinical Insomnia (Severe)',
    severity: 'Severe',
    description: 'Patient meets criteria for severe clinical insomnia. Sleep difficulties are severely impairing quality of life and daily functioning.',
    recommendations: [
      'Urgent referral for comprehensive CBT-I and sleep medicine evaluation.',
      'Consider polysomnography to rule out comorbid sleep disorders (sleep apnea, periodic limb movement disorder).',
      'Comprehensive psychiatric evaluation for comorbid mood and anxiety disorders.',
      'Pharmacotherapy may be indicated for short-term management while initiating CBT-I.',
      'Close follow-up with multidisciplinary team (sleep specialist, psychiatrist, primary care).',
      'Evaluate occupational and social functioning impact.'
    ]
  }
};
