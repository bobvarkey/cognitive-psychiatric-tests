export interface AuditItem {
  id: string;
  number: number;
  question: string;
  options: { value: number; label: string }[];
}

export const AUDIT_ITEMS: AuditItem[] = [
  {
    id: 'frequency',
    number: 1,
    question: 'How often do you have a drink containing alcohol?',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Monthly or less' },
      { value: 2, label: '2-4 times a month' },
      { value: 3, label: '2-3 times a week' },
      { value: 4, label: '4 or more times a week' },
    ],
  },
  {
    id: 'quantity',
    number: 2,
    question: 'How many drinks containing alcohol do you have on a typical day when you are drinking?',
    options: [
      { value: 0, label: '1 or 2' },
      { value: 1, label: '3 or 4' },
      { value: 2, label: '5 or 6' },
      { value: 3, label: '7 to 9' },
      { value: 4, label: '10 or more' },
    ],
  },
  {
    id: 'binge',
    number: 3,
    question: 'How often do you have six or more drinks on one occasion?',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Less than monthly' },
      { value: 2, label: 'Monthly' },
      { value: 3, label: 'Weekly' },
      { value: 4, label: 'Daily or almost daily' },
    ],
  },
  {
    id: 'control',
    number: 4,
    question: 'How often during the last year have you found that you were not able to stop drinking once you had started?',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Less than monthly' },
      { value: 2, label: 'Monthly' },
      { value: 3, label: 'Weekly' },
      { value: 4, label: 'Daily or almost daily' },
    ],
  },
  {
    id: 'fail_expectations',
    number: 5,
    question: 'How often during the last year have you failed to do what was normally expected of you because of drinking?',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Less than monthly' },
      { value: 2, label: 'Monthly' },
      { value: 3, label: 'Weekly' },
      { value: 4, label: 'Daily or almost daily' },
    ],
  },
  {
    id: 'morning_drinking',
    number: 6,
    question: 'How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Less than monthly' },
      { value: 2, label: 'Monthly' },
      { value: 3, label: 'Weekly' },
      { value: 4, label: 'Daily or almost daily' },
    ],
  },
  {
    id: 'guilt',
    number: 7,
    question: 'How often during the last year have you had a feeling of guilt or remorse after drinking?',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Less than monthly' },
      { value: 2, label: 'Monthly' },
      { value: 3, label: 'Weekly' },
      { value: 4, label: 'Daily or almost daily' },
    ],
  },
  {
    id: 'blackouts',
    number: 8,
    question: 'How often during the last year have you been unable to remember what happened the night before because of your drinking?',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Less than monthly' },
      { value: 2, label: 'Monthly' },
      { value: 3, label: 'Weekly' },
      { value: 4, label: 'Daily or almost daily' },
    ],
  },
  {
    id: 'injury',
    number: 9,
    question: 'Have you or someone else been injured because of your drinking?',
    options: [
      { value: 0, label: 'No' },
      { value: 2, label: 'Yes, but not in the last year' },
      { value: 4, label: 'Yes, during the last year' },
    ],
  },
  {
    id: 'concern',
    number: 10,
    question: 'Has a relative, friend, doctor, or other health worker been concerned about your drinking or suggested you cut down?',
    options: [
      { value: 0, label: 'No' },
      { value: 2, label: 'Yes, but not in the last year' },
      { value: 4, label: 'Yes, during the last year' },
    ],
  },
];

export const AUDIT_INTERPRETATION = {
  zone1: {
    range: '0-7',
    level: 'Zone I — Low Risk',
    description: 'Alcohol consumption is within low-risk limits. No intervention is required beyond general health education about safe drinking.',
    recommendation: 'Provide alcohol education and reinforce healthy drinking limits (≤2 drinks/day for men, ≤1 drink/day for women).',
  },
  zone2: {
    range: '8-15',
    level: 'Zone II — Hazardous Drinking',
    description: 'Pattern of alcohol consumption that increases risk of harmful consequences. Simple advice and brief intervention are recommended.',
    recommendation: 'Provide a brief intervention focused on reducing alcohol intake. Set drinking goals, discuss risks, and schedule follow-up.',
  },
  zone3: {
    range: '16-19',
    level: 'Zone III — Harmful Drinking',
    description: 'Alcohol consumption causing physical, mental, or social harm. Brief intervention plus continued monitoring are indicated.',
    recommendation: 'Provide brief intervention with regular monitoring. Consider referral to addiction services for comprehensive assessment.',
  },
  zone4: {
    range: '20-40',
    level: 'Zone IV — Alcohol Dependence',
    description: 'High likelihood of alcohol dependence. Diagnostic evaluation for alcohol use disorder and referral to specialized treatment are strongly recommended.',
    recommendation: 'Refer to addiction specialist or alcohol treatment program. Assess for withdrawal risk and need for medically supervised detoxification.',
  },
};
