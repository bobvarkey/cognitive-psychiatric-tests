export interface StopBangItem {
  id: string;
  number: number;
  category: string;
  question: string;
  description: string;
  yesValue: number;
}

export const STOP_BANG_ITEMS: StopBangItem[] = [
  {
    id: 'snore',
    number: 1,
    category: 'S',
    question: 'Do you SNORE loudly (louder than talking or loud enough to be heard through closed doors)?',
    description: 'Assess for loud snoring pattern',
    yesValue: 1
  },
  {
    id: 'tired',
    number: 2,
    category: 'T',
    question: 'Do you often feel TIRED, fatigued, or sleepy during the daytime?',
    description: 'Assess for daytime somnolence',
    yesValue: 1
  },
  {
    id: 'observed',
    number: 3,
    category: 'O',
    question: 'Has anyone OBSERVED you stop breathing or choking/gasping during sleep?',
    description: 'Assess for observed apneas',
    yesValue: 1
  },
  {
    id: 'blood_pressure',
    number: 4,
    category: 'P',
    question: 'Do you have high BLOOD PRESSURE or are you on medication for blood pressure?',
    description: 'Assess for hypertension',
    yesValue: 1
  },
  {
    id: 'bmi',
    number: 5,
    category: 'B',
    question: 'BMI more than 35 kg/m²?',
    description: 'Assess body mass index (>35 = High Risk)',
    yesValue: 1
  },
  {
    id: 'age',
    number: 6,
    category: 'A',
    question: 'Are you older than 50 years old?',
    description: 'Assess age (>50 years = High Risk)',
    yesValue: 1
  },
  {
    id: 'neck',
    number: 7,
    category: 'N',
    question: 'Is your NECK circumference large? (measured around the neck)',
    description: 'Neck circumference >16 inches (40 cm) for females or >17 inches (43 cm) for males = High Risk',
    yesValue: 1
  },
  {
    id: 'gender',
    number: 8,
    category: 'G',
    question: 'Are you MALE?',
    description: 'Assess gender (Male = High Risk)',
    yesValue: 1
  }
];

export const STOP_BANG_INTERPRETATION = {
  low: {
    range: '0-2',
    level: 'Low Risk of OSA',
    description: 'Patient has low risk of obstructive sleep apnea. Sleep study is not recommended based on STOP-BANG screening.',
    recommendation: 'Continue with clinical observation and sleep hygiene counseling.'
  },
  intermediate: {
    range: '3-4',
    level: 'Intermediate Risk of OSA',
    description: 'Patient has intermediate risk of obstructive sleep apnea. Further evaluation should be considered.',
    recommendation: 'Consider referral for sleep study or further sleep medicine evaluation.'
  },
  high: {
    range: '5-8',
    level: 'High Risk of OSA',
    description: 'Patient has high risk of obstructive sleep apnea. Sleep study is strongly recommended.',
    recommendation: 'Refer for sleep study (polysomnography or home sleep apnea test).'
  }
};
