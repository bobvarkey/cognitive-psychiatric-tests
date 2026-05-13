export interface PsqiItem {
  id: string;
  component: number;
  question: string;
  type: 'scale' | 'time' | 'duration' | 'yesno' | 'frequency';
  options?: { value: number; label: string }[];
}

export const PSQI_ITEMS: PsqiItem[] = [
  // Component 1: Subjective Sleep Quality
  { id: 'sleep_quality', component: 1, question: 'During the past month, how would you rate your sleep quality overall?', type: 'scale', options: [
    { value: 0, label: 'Very good' }, { value: 1, label: 'Fairly good' }, { value: 2, label: 'Fairly bad' }, { value: 3, label: 'Very bad' }
  ]},
  // Component 2: Sleep Latency
  { id: 'bedtime', component: 2, question: 'During the past month, what time have you usually gone to bed at night?', type: 'time' },
  { id: 'sleep_latency_min', component: 2, question: 'During the past month, how long (in minutes) has it usually taken you to fall asleep each night?', type: 'duration' },
  // Component 3: Sleep Duration
  { id: 'wake_time', component: 3, question: 'During the past month, what time have you usually gotten up in the morning?', type: 'time' },
  { id: 'hours_slept', component: 3, question: 'During the past month, how many hours of actual sleep did you get at night?', type: 'duration' },
  // Component 4: Sleep Efficiency (calculated from bedtime, wake time, hours slept)
  // Component 5: Sleep Disturbances
  { id: 'disturb_cannot_sleep', component: 5, question: 'During the past month, how often have you had trouble sleeping because you cannot get to sleep within 30 minutes?', type: 'frequency', options: [
    { value: 0, label: 'Not during the past month' }, { value: 1, label: 'Less than once a week' }, { value: 2, label: 'Once or twice a week' }, { value: 3, label: 'Three or more times a week' }
  ]},
  { id: 'disturb_wake_middle', component: 5, question: 'During the past month, how often have you had trouble sleeping because you wake up in the middle of the night or early morning?', type: 'frequency', options: [
    { value: 0, label: 'Not during the past month' }, { value: 1, label: 'Less than once a week' }, { value: 2, label: 'Once or twice a week' }, { value: 3, label: 'Three or more times a week' }
  ]},
  { id: 'disturb_bathroom', component: 5, question: 'During the past month, how often have you had trouble sleeping because you have to get up to use the bathroom?', type: 'frequency', options: [
    { value: 0, label: 'Not during the past month' }, { value: 1, label: 'Less than once a week' }, { value: 2, label: 'Once or twice a week' }, { value: 3, label: 'Three or more times a week' }
  ]},
  { id: 'disturb_breathe', component: 5, question: 'During the past month, how often have you had trouble sleeping because you cannot breathe comfortably?', type: 'frequency', options: [
    { value: 0, label: 'Not during the past month' }, { value: 1, label: 'Less than once a week' }, { value: 2, label: 'Once or twice a week' }, { value: 3, label: 'Three or more times a week' }
  ]},
  { id: 'disturb_cough_snore', component: 5, question: 'During the past month, how often have you had trouble sleeping because you cough or snore loudly?', type: 'frequency', options: [
    { value: 0, label: 'Not during the past month' }, { value: 1, label: 'Less than once a week' }, { value: 2, label: 'Once or twice a week' }, { value: 3, label: 'Three or more times a week' }
  ]},
  { id: 'disturb_cold', component: 5, question: 'During the past month, how often have you had trouble sleeping because you feel too cold?', type: 'frequency', options: [
    { value: 0, label: 'Not during the past month' }, { value: 1, label: 'Less than once a week' }, { value: 2, label: 'Once or twice a week' }, { value: 3, label: 'Three or more times a week' }
  ]},
  { id: 'disturb_hot', component: 5, question: 'During the past month, how often have you had trouble sleeping because you feel too hot?', type: 'frequency', options: [
    { value: 0, label: 'Not during the past month' }, { value: 1, label: 'Less than once a week' }, { value: 2, label: 'Once or twice a week' }, { value: 3, label: 'Three or more times a week' }
  ]},
  { id: 'disturb_bad_dreams', component: 5, question: 'During the past month, how often have you had trouble sleeping because you had bad dreams?', type: 'frequency', options: [
    { value: 0, label: 'Not during the past month' }, { value: 1, label: 'Less than once a week' }, { value: 2, label: 'Once or twice a week' }, { value: 3, label: 'Three or more times a week' }
  ]},
  { id: 'disturb_pain', component: 5, question: 'During the past month, how often have you had trouble sleeping because you have pain?', type: 'frequency', options: [
    { value: 0, label: 'Not during the past month' }, { value: 1, label: 'Less than once a week' }, { value: 2, label: 'Once or twice a week' }, { value: 3, label: 'Three or more times a week' }
  ]},
  // Component 6: Sleep Medication
  { id: 'sleep_meds', component: 6, question: 'During the past month, how often have you taken medicine to help you sleep (prescribed or over the counter)?', type: 'frequency', options: [
    { value: 0, label: 'Not during the past month' }, { value: 1, label: 'Less than once a week' }, { value: 2, label: 'Once or twice a week' }, { value: 3, label: 'Three or more times a week' }
  ]},
  // Component 7: Daytime Dysfunction
  { id: 'daytime_stay_awake', component: 7, question: 'During the past month, how often have you had trouble staying awake while driving, eating meals, or engaging in social activity?', type: 'frequency', options: [
    { value: 0, label: 'Not during the past month' }, { value: 1, label: 'Less than once a week' }, { value: 2, label: 'Once or twice a week' }, { value: 3, label: 'Three or more times a week' }
  ]},
  { id: 'daytime_enthusiasm', component: 7, question: 'During the past month, how much of a problem has it been for you to keep up enough enthusiasm to get things done?', type: 'scale', options: [
    { value: 0, label: 'No problem at all' }, { value: 1, label: 'Only a very slight problem' }, { value: 2, label: 'Somewhat of a problem' }, { value: 3, label: 'A very big problem' }
  ]},
];

export const PSQI_INTERPRETATION = {
  good: { range: '0-5', level: 'Good Sleep Quality', description: 'Patient reports satisfactory sleep quality over the past month. No significant sleep disturbance detected.', recommendation: 'Maintain current sleep habits and practice good sleep hygiene.' },
  poor: { range: '6-21', level: 'Poor Sleep Quality', description: 'Patient reports poor sleep quality. PSQI > 5 has a diagnostic sensitivity of 89.6% and specificity of 86.5% in distinguishing good from poor sleepers.', recommendation: 'Further evaluation recommended. Consider comprehensive sleep assessment and sleep medicine referral.' }
};
