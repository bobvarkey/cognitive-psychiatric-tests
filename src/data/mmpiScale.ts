import { MmpiItem } from '@/types/mmpi';

export const MMPI_ITEMS: MmpiItem[] = [
  {
    id: 'hs',
    scale: 'Hypochondriasis',
    scaleAbbr: 'Hs',
    statement: 'I worry excessively about vague aches/pains in my body.',
    statementMl: 'എന്റെ ശരീരത്തിലെ അവ്യക്തമായ വേദനകളെക്കുറിച്ച് ഞാൻ അമിതമായി ആശങ്കപ്പെടുന്നു.',
  },
  {
    id: 'd',
    scale: 'Depression',
    scaleAbbr: 'D',
    statement: 'I feel sad, guilty, and isolated most days.',
    statementMl: 'മിക്ക ദിവസങ്ങളിലും ഞാൻ സങ്കടവും കുറ്റബോധവും ഒറ്റപ്പെടലും അനുഭവിക്കുന്നു.',
  },
  {
    id: 'hy',
    scale: 'Conversion Hysteria',
    scaleAbbr: 'Hy',
    statement: 'My problems are mostly physical; therapy won\'t help.',
    statementMl: 'എന്റെ പ്രശ്നങ്ങൾ കൂടുതലും ശാരീരികമാണ്; തെറാപ്പി സഹായിക്കില്ല.',
  },
  {
    id: 'pd',
    scale: 'Psychopathic Deviate',
    scaleAbbr: 'Pd',
    statement: 'I resent authority and often feel hostile toward rules.',
    statementMl: 'ഞാൻ അധികാരത്തോട് വിരോധം കാണിക്കുന്നു, നിയമങ്ങളോട് പലപ്പോഴും ശത്രുത അനുഭവിക്കുന്നു.',
  },
  {
    id: 'mf',
    scale: 'Masculinity-Femininity',
    scaleAbbr: 'Mf',
    statement: '(Males) I prefer passive, artistic pursuits; (Females) I\'m uninterested in traditional women\'s roles.',
    statementMl: '(പുരുഷൻ) ഞാൻ നിഷ്ക്രിയമായ, കലാപരമായ പ്രവർത്തനങ്ങൾ ഇഷ്ടപ്പെടുന്നു; (സ്ത്രീ) പരമ്പരാഗത സ്ത്രീ ഭൂമികകളിൽ എനിക്ക് താൽപ്പര്യമില്ല.',
  },
  {
    id: 'pa',
    scale: 'Paranoia',
    scaleAbbr: 'Pa',
    statement: 'People are often suspicious or out to criticize me.',
    statementMl: 'ആളുകൾ പലപ്പോഴും എന്നെ സംശയിക്കുകയോ വിമർശിക്കാൻ ശ്രമിക്കുകയോ ചെയ്യുന്നു.',
  },
  {
    id: 'pt',
    scale: 'Psychasthenia',
    scaleAbbr: 'Pt',
    statement: 'I\'m tense, worried, and can\'t make decisions easily.',
    statementMl: 'ഞാൻ പിരിമുറുക്കത്തിലും ആശങ്കയിലുമാണ്, തീരുമാനങ്ങൾ എളുപ്പത്തിൽ എടുക്കാൻ കഴിയുന്നില്ല.',
  },
  {
    id: 'sc',
    scale: 'Schizophrenia',
    scaleAbbr: 'Sc',
    statement: 'My thoughts feel bizarre; I feel alienated or lack focus.',
    statementMl: 'എന്റെ ചിന്തകൾ വിചിത്രമായി അനുഭവപ്പെടുന്നു; ഞാൻ അന്യവൽക്കരിക്കപ്പെട്ടതായോ ശ്രദ്ധ കേന്ദ്രീകരിക്കാൻ കഴിയാത്തതായോ അനുഭവിക്കുന്നു.',
  },
  {
    id: 'ma',
    scale: 'Hypomania',
    scaleAbbr: 'Ma',
    statement: 'I\'m overly energetic with racing thoughts and mood swings.',
    statementMl: 'ഞാൻ അമിതമായ ഊർജ്ജത്തോടെയും ചിന്തകളുടെ ഓട്ടത്തോടെയും മാനസികാവസ്ഥ മാറ്റങ്ങളോടെയും ഇരിക്കുന്നു.',
  },
  {
    id: 'si',
    scale: 'Social Introversion',
    scaleAbbr: 'Si',
    statement: 'I\'m shy, introverted, and lack social confidence.',
    statementMl: 'ഞാൻ ലജ്ജാശീലനും അന്തർമുഖനുമാണ്, സാമൂഹിക ആത്മവിശ്വാസം ഇല്ല.',
  },
];

export const SOMATIZATION_SCALES = ['hs', 'd', 'hy'];

export function getRiskLevel(trueCount: number): { level: 'low' | 'mild' | 'high'; label: string; labelMl: string; action: string; actionMl: string } {
  if (trueCount <= 1) {
    return { level: 'low', label: 'Low Risk', labelMl: 'കുറഞ്ഞ അപകടം', action: 'Routine check', actionMl: 'പതിവ് പരിശോധന' };
  } else if (trueCount <= 3) {
    return { level: 'mild', label: 'Mild Risk', labelMl: 'മിതമായ അപകടം', action: 'Monitor + psychoeducation', actionMl: 'നിരീക്ഷണം + മാനസിക വിദ്യാഭ്യാസം' };
  } else {
    return { level: 'high', label: 'High Risk', labelMl: 'ഉയർന്ന അപകടം', action: 'Urgent MMPI-2-RF / psych eval', actionMl: 'അടിയന്തര MMPI-2-RF / മനോരോഗ മൂല്യനിർണ്ണയം' };
  }
}
