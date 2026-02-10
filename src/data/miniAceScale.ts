import { MiniAceItem, MiniAceVersion } from '@/types/miniace';

// M-ACE INDIA – ADAPTATION FRAMEWORK
// Three parallel Indian versions to reduce learning effect, exactly like NZ A/B/C

export const MINI_ACE_VERSIONS: MiniAceVersion[] = [
  {
    version: 'A',
    words: ['Ravi', 'Menon', '42', 'MG Road', 'Ernakulam', 'Kerala'],
    wordsMl: ['രവി', 'മേനോൻ', '42', 'എം.ജി. റോഡ്', 'എറണാകുളം', 'കേരളം'],
    address: {
      name: 'Ravi Menon',
      nameMl: 'രവി മേനോൻ',
      street: '42, MG Road',
      streetMl: '42, എം.ജി. റോഡ്',
      city: 'Ernakulam',
      cityMl: 'എറണാകുളം',
      state: 'Kerala',
      stateMl: 'കേരളം'
    },
    letterFluency: 'Animals' // Changed from letter to Animals (culture-fair)
  },
  {
    version: 'B',
    words: ['Suresh', 'Kumar', '18', 'Gandhi Nagar', 'Trivandrum', 'Kerala'],
    wordsMl: ['സുരേഷ്', 'കുമാർ', '18', 'ഗാന്ധി നഗർ', 'തിരുവനന്തപുരം', 'കേരളം'],
    address: {
      name: 'Suresh Kumar',
      nameMl: 'സുരേഷ് കുമാർ',
      street: '18, Gandhi Nagar',
      streetMl: '18, ഗാന്ധി നഗർ',
      city: 'Trivandrum',
      cityMl: 'തിരുവനന്തപുരം',
      state: 'Kerala',
      stateMl: 'കേരളം'
    },
    letterFluency: 'Animals'
  },
  {
    version: 'C',
    words: ['Anita', 'Sharma', '55', 'Park Street', 'Kochi', 'Kerala'],
    wordsMl: ['അനിത', 'ശർമ്മ', '55', 'പാർക്ക് സ്ട്രീറ്റ്', 'കൊച്ചി', 'കേരളം'],
    address: {
      name: 'Anita Sharma',
      nameMl: 'അനിത ശർമ്മ',
      street: '55, Park Street',
      streetMl: '55, പാർക്ക് സ്ട്രീറ്റ്',
      city: 'Kochi',
      cityMl: 'കൊച്ചി',
      state: 'Kerala',
      stateMl: 'കേരളം'
    },
    letterFluency: 'Animals'
  }
];

export const MINI_ACE_ITEMS: MiniAceItem[] = [
  {
    id: 'attention',
    domain: 'attention',
    title: 'Attention & Orientation',
    titleMl: 'ശ്രദ്ധ',
    instructions: 'Ask:\n• What is the day? (Day of the week)\n• What is the date?\n• What is the month?\n• What is the year?\n\nScore 1 point for each correct answer.',
    instructionsMl: 'ചോദിക്കുക:\n• ഇന്ന് ആഴ്ചയിലെ ഏത് ദിവസം?\n• ഇന്ന് തീയതി?\n• മാസം?\n• വർഷം?\n\nഓരോ ശരിയായ ഉത്തരത്തിനും 1 പോയിന്റ്.',
    maxScore: 4,
    scoringGuidelines: 'Day of week (1 pt), Date (1 pt), Month (1 pt), Year (1 pt)',
    scoringGuidelinesMl: 'ആഴ്ചയിലെ ദിവസം (1 pt), തീയതി (1 pt), മാസം (1 pt), വർഷം (1 pt)'
  },
  {
    id: 'memory',
    domain: 'memory',
    title: 'Memory Registration',
    titleMl: 'ഓർമ്മ (രജിസ്ട്രേഷൻ)',
    instructions: '"I\'m going to give you a name and address. Please repeat it after me. We\'ll do this three times. Later I will ask you to remember it."\n\nRead the name and address clearly. Have patient repeat 3 times.\n\n⚠️ Score only the 3rd trial.',
    instructionsMl: '"ഞാൻ ഒരു പേരും വിലാസവും പറയാം. ദയവായി അത് എന്നോട് ആവർത്തിക്കുക. നാം ഇത് മൂന്ന് പ്രാവശ്യം ചെയ്യും. പിന്നീട് ഞാൻ ഇത് ചോദിക്കും."\n\nപേരും വിലാസവും വ്യക്തമായി വായിക്കുക. രോഗി 3 തവണ ആവർത്തിക്കട്ടെ.\n\n⚠️ മൂന്നാമത്തെ ശ്രമം മാത്രം സ്കോർ ചെയ്യുക.',
    maxScore: 7,
    scoringGuidelines: 'First name (1 pt), Last name (1 pt), House number (1 pt), Street/Road (1 pt), City (1 pt), State - Kerala (2 pts)',
    scoringGuidelinesMl: 'ആദ്യ പേര് (1 pt), അവസാന പേര് (1 pt), വീട്ട് നമ്പർ (1 pt), റോഡ്/സ്ട്രീറ്റ് (1 pt), നഗരം (1 pt), സംസ്ഥാനം - കേരളം (2 pts)'
  },
  {
    id: 'fluency',
    domain: 'fluency',
    title: 'Verbal Fluency - Animals',
    titleMl: 'വാക്കാലുള്ള പ്രവാഹം - മൃഗങ്ങൾ',
    instructions: '"Now can you name as many animals as possible in one minute?"\n\nStart timer. Count valid animal names (repetitions and variations of same animal don\'t count).',
    instructionsMl: '"ഒരു മിനിറ്റിനുള്ളിൽ നിങ്ങൾക്ക് ഓർമ്മ വരുന്നത്ര മൃഗങ്ങളുടെ പേരുകൾ പറയൂ."\n\nടൈമർ ആരംഭിക്കുക. സാധുവായ മൃഗ നാമങ്ങൾ എണ്ണുക (ആവർത്തനങ്ങളും ഒരേ മൃഗത്തിന്റെ വകഭേദങ്ങളും എണ്ണരുത്).',
    maxScore: 7,
    scoringGuidelines: '0-4 animals = 0 pts, 5-6 = 1 pt, 7-8 = 2 pts, 9-10 = 3 pts, 11-12 = 4 pts, 13-14 = 5 pts, 15-16 = 6 pts, 17+ = 7 pts',
    scoringGuidelinesMl: '0-4 മൃഗങ്ങൾ = 0 pts, 5-6 = 1 pt, 7-8 = 2 pts, 9-10 = 3 pts, 11-12 = 4 pts, 13-14 = 5 pts, 15-16 = 6 pts, 17+ = 7 pts'
  },
  {
    id: 'clock',
    domain: 'clock',
    title: 'Clock Drawing',
    titleMl: 'ഘടികാര ചിത്രം',
    instructions: '"Please draw a clock face and put the hands at ten past five."\n\nProvide blank paper. Patient should draw unprompted.',
    instructionsMl: '"പത്ത് കഴിഞ്ഞ് അഞ്ച് മണി (5:10) കാണിക്കുന്ന ഒരു ഘടികാര ചിത്രം വരയ്ക്കൂ."\n\nവെറും കടലാസ് നൽകുക. രോഗി പ്രേരണയില്ലാതെ വരയ്ക്കണം.',
    maxScore: 5,
    scoringGuidelines: 'Circle drawn (1 pt), Numbers correctly positioned (2 pts), Hands showing 5:10 correctly (2 pts)',
    scoringGuidelinesMl: 'വൃത്തം വരച്ചു (1 pt), അക്കങ്ങൾ ശരിയായ സ്ഥാനത്ത് (2 pts), 5:10 ശരിയായി കാണിക്കുന്ന സൂചികൾ (2 pts)'
  },
  {
    id: 'recall',
    domain: 'recall',
    title: 'Memory Recall',
    titleMl: 'ഓർമ്മ തിരികെ വിളിക്കൽ',
    instructions: '"Now tell me what you remember about the name and address we repeated earlier."\n\nAllow free recall. Do not prompt.',
    instructionsMl: '"ആദ്യത്തിൽ പറഞ്ഞ പേരും വിലാസവും ഇപ്പോൾ ഓർമ്മയുള്ളതെല്ലാം പറയൂ."\n\nസ്വതന്ത്രമായി ഓർക്കാൻ അനുവദിക്കുക. പ്രേരിപ്പിക്കരുത്.',
    maxScore: 7,
    scoringGuidelines: 'First name (1 pt), Last name (1 pt), House number (1 pt), Street/Road (1 pt), City (1 pt), State - Kerala (2 pts)',
    scoringGuidelinesMl: 'ആദ്യ പേര് (1 pt), അവസാന പേര് (1 pt), വീട്ട് നമ്പർ (1 pt), റോഡ്/സ്ട്രീറ്റ് (1 pt), നഗരം (1 pt), സംസ്ഥാനം - കേരളം (2 pts)'
  }
];

export const MINI_ACE_INTERPRETATIONS = {
  cutoff25: {
    label: 'High sensitivity cut-off (≤25)',
    labelMl: 'ഉയർന്ന സംവേദനക്ഷമത കട്ട്-ഓഫ് (≤25)',
    description: 'Score ≤25 has high sensitivity and specificity for detecting dementia',
    descriptionMl: 'ഡിമെൻഷ്യ കണ്ടെത്തുന്നതിന് ≤25 സ്കോറിന് ഉയർന്ന സംവേദനക്ഷമതയും പ്രത്യേകതയും ഉണ്ട്'
  },
  cutoff21: {
    label: 'High specificity cut-off (≤21)',
    labelMl: 'ഉയർന്ന പ്രത്യേകത കട്ട്-ഓഫ് (≤21)',
    description: 'Score ≤21 is almost certainly from a dementia patient regardless of clinical setting',
    descriptionMl: '≤21 സ്കോർ ക്ലിനിക്കൽ സെറ്റിംഗ് പരിഗണിക്കാതെ ഏതാണ്ട് തീർച്ചയായും ഒരു ഡിമെൻഷ്യ രോഗിയിൽ നിന്നാണ്'
  }
};

// Clinical usage notes
export const CLINICAL_NOTES = {
  englishVersion: {
    title: 'Use Indian English version for:',
    titleMl: 'ഇന്ത്യൻ ഇംഗ്ലീഷ് പതിപ്പ് ഉപയോഗിക്കുക:',
    points: [
      'English-medium education',
      'Urban patients'
    ],
    pointsMl: [
      'ഇംഗ്ലീഷ് മീഡിയം വിദ്യാഭ്യാസം',
      'നഗര രോഗികൾ'
    ]
  },
  malayalamVersion: {
    title: 'Use Malayalam version for:',
    titleMl: 'മലയാളം പതിപ്പ് ഉപയോഗിക്കുക:',
    points: [
      'Lower literacy',
      'Rural or primary Malayalam speakers'
    ],
    pointsMl: [
      'കുറഞ്ഞ സാക്ഷരത',
      'ഗ്രാമീണ അല്ലെങ്കിൽ പ്രാഥമിക മലയാളം സംസാരിക്കുന്നവർ'
    ]
  },
  cautionNote: {
    title: 'Interpret scores cautiously in:',
    titleMl: 'സ്കോറുകൾ ശ്രദ്ധയോടെ വ്യാഖ്യാനിക്കുക:',
    points: [
      '≤8 years of education',
      'Illiterate patients (especially clock drawing)'
    ],
    pointsMl: [
      '≤8 വർഷം വിദ്യാഭ്യാസം',
      'നിരക്ഷരരായ രോഗികൾ (പ്രത്യേകിച്ച് ഘടികാര ചിത്രം)'
    ]
  },
  legalNote: {
    en: 'This is a culturally adapted clinical version, not a newly normed instrument. If used for research or publication, state: "Culturally adapted Indian version of M-ACE based on NZ M-ACE (2020)"',
    ml: 'ഇത് സാംസ്കാരികമായി അനുകൂലമാക്കിയ ക്ലിനിക്കൽ പതിപ്പാണ്, പുതുതായി നോർം ചെയ്ത ഉപകരണമല്ല. ഗവേഷണത്തിനോ പ്രസിദ്ധീകരണത്തിനോ ഉപയോഗിക്കുകയാണെങ്കിൽ, പ്രസ്താവിക്കുക: "NZ M-ACE (2020) അടിസ്ഥാനമാക്കിയുള്ള M-ACE യുടെ സാംസ്കാരികമായി അനുകൂലമാക്കിയ ഇന്ത്യൻ പതിപ്പ്"'
  }
};

export const getInterpretation = (score: number, language: 'en' | 'ml'): { interpretation: string; riskLevel: 'normal' | 'mild' | 'moderate' | 'severe' } => {
  if (score > 25) {
    return {
      interpretation: language === 'ml' 
        ? 'സാധാരണ പരിധിക്കുള്ളിൽ. ഡിമെൻഷ്യ സൂചനകൾ ഇല്ല.'
        : 'Score within normal range. No significant indicators of dementia.',
      riskLevel: 'normal'
    };
  } else if (score > 21) {
    return {
      interpretation: language === 'ml'
        ? 'സ്കോർ ≤25: സാധ്യമായ വൈജ്ഞാനിക കുറവ് സൂചിപ്പിക്കുന്നു. കൂടുതൽ വിലയിരുത്തൽ ശുപാർശ ചെയ്യുന്നു.'
        : 'Score ≤25: Indicates possible cognitive impairment. Further assessment recommended.',
      riskLevel: 'mild'
    };
  } else if (score > 15) {
    return {
      interpretation: language === 'ml'
        ? 'സ്കോർ ≤21: ഡിമെൻഷ്യ വളരെ സാധ്യതയുള്ളതാണ്. സമഗ്രമായ ന്യൂറോളജിക്കൽ മൂല്യനിർണ്ണയം ആവശ്യമാണ്.'
        : 'Score ≤21: Dementia highly likely. Comprehensive neurological evaluation required.',
      riskLevel: 'moderate'
    };
  } else {
    return {
      interpretation: language === 'ml'
        ? 'കഠിനമായ വൈജ്ഞാനിക കുറവ്. അടിയന്തര ന്യൂറോളജിക്കൽ കൺസൾട്ടേഷനും പരിചരണ പിന്തുണയും ആവശ്യമാണ്.'
        : 'Severe cognitive impairment indicated. Urgent neurological consultation and care support needed.',
      riskLevel: 'severe'
    };
  }
};
