export interface AlcoholSymptomChecklistItem {
  id: string;
  number: number;
  criterion: string;
  question: string;
}

export const ALCOHOL_SYMPTOM_CHECKLIST_ITEMS: AlcoholSymptomChecklistItem[] = [
  { id: 'AUD_01', number: 1, criterion: 'Tolerance', question: 'Did you find that drinking the same amount of alcohol had less effect than it used to, or did you have to drink more alcohol to get intoxicated?' },
  { id: 'AUD_02', number: 2, criterion: 'Withdrawal', question: 'When you cut down or stop drinking, did you get sweaty or nervous, or have an upset stomach or shaky hands? Did you drink alcohol or take other substances to avoid these symptoms?' },
  { id: 'AUD_03', number: 3, criterion: 'Larger/longer use', question: 'When you drank, did you drink more or for longer than you planned to?' },
  { id: 'AUD_04', number: 4, criterion: 'Unsuccessful attempts to cut down', question: 'Have you wanted to or tried to cut back or stop drinking alcohol, but been unable to do so?' },
  { id: 'AUD_05', number: 5, criterion: 'Time spent', question: 'Did you spend a lot of time obtaining alcohol, drinking alcohol, or recovering from drinking?' },
  { id: 'AUD_06', number: 6, criterion: 'Continued use despite problems', question: 'Have you continued to drink even though you knew or suspected it creates or worsens mental or physical problems?' },
  { id: 'AUD_07', number: 7, criterion: 'Failure to fulfill obligations', question: 'Has drinking interfered with your responsibilities at work, school, or home?' },
  { id: 'AUD_08', number: 8, criterion: 'Hazardous use', question: 'Have you been intoxicated more than once in situations where it was dangerous, such as driving a car or operating machinery?' },
  { id: 'AUD_09', number: 9, criterion: 'Social/interpersonal problems', question: 'Did you drink alcohol even though you knew or suspected it causes problems with your family or other people?' },
  { id: 'AUD_10', number: 10, criterion: 'Craving', question: 'Did you experience strong desires or craving to drink alcohol?' },
  { id: 'AUD_11', number: 11, criterion: 'Reduced activities', question: 'Did you spend less time working, enjoying hobbies, or being with others because of your drinking?' },
];

export interface AudSeverityBand {
  range: string;
  level: string;
  description: string;
  clinicalAction: string;
}

export const ALCOHOL_SYMPTOM_CHECKLIST_INTERPRETATION: AudSeverityBand[] = [
  {
    range: '0-1',
    level: 'No Alcohol Use Disorder',
    description: 'Below DSM-5 symptom threshold for Alcohol Use Disorder.',
    clinicalAction: 'Provide appropriate counseling and address drinking risk.',
  },
  {
    range: '2-3',
    level: 'Mild Alcohol Use Disorder',
    description: 'Mild Alcohol Use Disorder (2-3 symptoms) by DSM-5 criteria.',
    clinicalAction: 'Assess severity, drinking pattern, withdrawal risk and treatment needs.',
  },
  {
    range: '4-5',
    level: 'Moderate Alcohol Use Disorder',
    description: 'Moderate Alcohol Use Disorder (4-5 symptoms) by DSM-5 criteria.',
    clinicalAction: 'Assess severity and offer evidence-based treatment.',
  },
  {
    range: '6-11',
    level: 'Severe Alcohol Use Disorder',
    description: 'Severe Alcohol Use Disorder (6-11 symptoms) by DSM-5 criteria.',
    clinicalAction: 'Offer/arrange evidence-based AUD treatment and assess withdrawal and medical risks.',
  },
];
