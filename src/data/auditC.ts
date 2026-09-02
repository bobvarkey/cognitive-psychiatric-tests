export interface AuditCItem {
  id: string;
  number: number;
  question: string;
  options: { value: number; label: string }[];
}

export const AUDIT_C_ITEMS: AuditCItem[] = [
  {
    id: 'AUDIT_C_1',
    number: 1,
    question: 'How often do you have a drink containing alcohol?',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Less than monthly' },
      { value: 2, label: '2-4 times a month' },
      { value: 3, label: '2-3 times a week' },
      { value: 4, label: '4 or more times a week' },
    ],
  },
  {
    id: 'AUDIT_C_2',
    number: 2,
    question: 'How many standard drinks containing alcohol do you have on a typical day when drinking?',
    options: [
      { value: 0, label: '1-2' },
      { value: 1, label: '3-4' },
      { value: 2, label: '5-6' },
      { value: 3, label: '7-9' },
      { value: 4, label: '10 or more' },
    ],
  },
  {
    id: 'AUDIT_C_3',
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
];

export const AUDIT_C_INTERPRETATION = {
  minimum: 0,
  maximum: 12,
  men: {
    threshold: 4,
    positiveScreen: 'Score >= 4',
  },
  women: {
    threshold: 3,
    positiveScreen: 'Score >= 3',
  },
  action: {
    negative: 'Advise regarding low-risk alcohol consumption and reassess periodically.',
    positive: 'Assess for unhealthy alcohol use and Alcohol Use Disorder (AUD).',
  },
};
