import { SteadiItem, MorseItem } from '@/types/fallRisk';

export const STEADI_ITEMS: SteadiItem[] = [
  {
    id: 'fallen_past_year',
    question: 'I have fallen in the past year.',
    questionMl: 'കഴിഞ്ഞ വർഷത്തിനുള്ളിൽ ഞാൻ വീണിട്ടുണ്ട്.',
    points: 2,
    explanation: 'People who have fallen once are likely to fall again.',
    explanationMl: 'ഒരിക്കൽ വീണവർക്ക് വീണ്ടും വീഴാനുള്ള സാധ്യത കൂടുതലാണ്.'
  },
  {
    id: 'use_cane_walker',
    question: 'I use or have been advised to use a cane or walker to get around safely.',
    questionMl: 'സുരക്ഷിതമായി നടക്കാൻ ഞാൻ വടി അല്ലെങ്കിൽ വാക്കർ ഉപയോഗിക്കുന്നു അല്ലെങ്കിൽ ഉപയോഗിക്കാൻ നിർദ്ദേശിച്ചിട്ടുണ്ട്.',
    points: 2,
    explanation: 'People who have been advised to use a cane or walker may already be more likely to fall.',
    explanationMl: 'വടി അല്ലെങ്കിൽ വാക്കർ ഉപയോഗിക്കാൻ നിർദ്ദേശിച്ചവർക്ക് വീഴാനുള്ള സാധ്യത കൂടുതലായിരിക്കാം.'
  },
  {
    id: 'feel_unsteady',
    question: 'Sometimes I feel unsteady when I am walking.',
    questionMl: 'നടക്കുമ്പോൾ ചിലപ്പോൾ എനിക്ക് അസ്ഥിരത അനുഭവപ്പെടുന്നു.',
    points: 1,
    explanation: 'Unsteadiness or needing support while walking are signs of poor balance.',
    explanationMl: 'നടക്കുമ്പോൾ അസ്ഥിരതയോ പിന്തുണ ആവശ്യമോ മോശം ബാലൻസിന്റെ ലക്ഷണങ്ങളാണ്.'
  },
  {
    id: 'hold_furniture',
    question: 'I steady myself by holding onto furniture when walking at home.',
    questionMl: 'വീട്ടിൽ നടക്കുമ്പോൾ ഞാൻ ഫർണിച്ചറിൽ പിടിച്ച് സ്ഥിരത നിലനിർത്തുന്നു.',
    points: 1,
    explanation: 'This is also a sign of poor balance.',
    explanationMl: 'ഇതും മോശം ബാലൻസിന്റെ ലക്ഷണമാണ്.'
  },
  {
    id: 'worried_falling',
    question: 'I am worried about falling.',
    questionMl: 'വീഴുമെന്ന് ഞാൻ ഭയപ്പെടുന്നു.',
    points: 1,
    explanation: 'People who are worried about falling are more likely to fall.',
    explanationMl: 'വീഴുമെന്ന് ഭയപ്പെടുന്നവർക്ക് വീഴാനുള്ള സാധ്യത കൂടുതലാണ്.'
  },
  {
    id: 'push_hands_stand',
    question: 'I need to push with my hands to stand up from a chair.',
    questionMl: 'കസേരയിൽ നിന്ന് എഴുന്നേൽക്കാൻ എനിക്ക് കൈകൾ കൊണ്ട് തള്ളേണ്ടതുണ്ട്.',
    points: 1,
    explanation: 'This is a sign of weak leg muscles, a major reason for falling.',
    explanationMl: 'ഇത് ദുർബലമായ കാൽ പേശികളുടെ ലക്ഷണമാണ്, വീഴാനുള്ള പ്രധാന കാരണം.'
  },
  {
    id: 'trouble_curb',
    question: 'I have some trouble stepping up onto a curb.',
    questionMl: 'ഫുട്‌പാത്തിലേക്ക് കയറാൻ എനിക്ക് ചില ബുദ്ധിമുട്ടുകളുണ്ട്.',
    points: 1,
    explanation: 'This is also a sign of weak leg muscles.',
    explanationMl: 'ഇതും ദുർബലമായ കാൽ പേശികളുടെ ലക്ഷണമാണ്.'
  },
  {
    id: 'rush_toilet',
    question: 'I often have to rush to the toilet.',
    questionMl: 'എനിക്ക് പലപ്പോഴും ടോയ്‌ലറ്റിലേക്ക് തിരക്കിട്ട് പോകേണ്ടിവരുന്നു.',
    points: 1,
    explanation: 'Rushing to the bathroom, especially at night, increases your chance of falling.',
    explanationMl: 'ബാത്ത്‌റൂമിലേക്ക് തിരക്കിട്ട് പോകുന്നത്, പ്രത്യേകിച്ച് രാത്രിയിൽ, വീഴാനുള്ള സാധ്യത വർദ്ധിപ്പിക്കുന്നു.'
  },
  {
    id: 'lost_feeling_feet',
    question: 'I have lost some feeling in my feet.',
    questionMl: 'എന്റെ കാലുകളിൽ ചില സംവേദനം നഷ്ടപ്പെട്ടു.',
    points: 1,
    explanation: 'Numbness in your feet can cause stumbles and lead to falls.',
    explanationMl: 'കാലുകളിലെ മരവിപ്പ് ഇടറലുകൾക്കും വീഴ്ചകൾക്കും കാരണമാകും.'
  },
  {
    id: 'medicine_lightheaded',
    question: 'I take medicine that sometimes makes me feel light-headed or more tired than usual.',
    questionMl: 'ചിലപ്പോൾ എനിക്ക് തലകറക്കമോ സാധാരണയിലും കൂടുതൽ ക്ഷീണമോ അനുഭവപ്പെടുന്ന മരുന്ന് ഞാൻ കഴിക്കുന്നു.',
    points: 1,
    explanation: 'Side effects from medicines can sometimes increase your chance of falling.',
    explanationMl: 'മരുന്നുകളുടെ പാർശ്വഫലങ്ങൾ ചിലപ്പോൾ വീഴാനുള്ള സാധ്യത വർദ്ധിപ്പിക്കും.'
  },
  {
    id: 'medicine_sleep_mood',
    question: 'I take medicine to help me sleep or improve my mood.',
    questionMl: 'ഉറങ്ങാൻ സഹായിക്കാനോ മാനസികാവസ്ഥ മെച്ചപ്പെടുത്താനോ ഞാൻ മരുന്ന് കഴിക്കുന്നു.',
    points: 1,
    explanation: 'These medicines can sometimes increase your chance of falling.',
    explanationMl: 'ഈ മരുന്നുകൾ ചിലപ്പോൾ വീഴാനുള്ള സാധ്യത വർദ്ധിപ്പിക്കും.'
  },
  {
    id: 'feel_sad_depressed',
    question: 'I often feel sad or depressed.',
    questionMl: 'ഞാൻ പലപ്പോഴും സങ്കടമോ വിഷാദമോ അനുഭവിക്കുന്നു.',
    points: 1,
    explanation: 'Symptoms of depression, such as not feeling well or feeling slowed down, are linked to falls.',
    explanationMl: 'വിഷാദത്തിന്റെ ലക്ഷണങ്ങൾ, സുഖമില്ലായ്മ അല്ലെങ്കിൽ മന്ദഗതിയിലുള്ള അനുഭവം, വീഴ്ചകളുമായി ബന്ധപ്പെട്ടിരിക്കുന്നു.'
  }
];

export const MORSE_ITEMS: MorseItem[] = [
  {
    id: 'history_of_falling',
    name: 'History of Falling (immediate or within 3 months)',
    nameMl: 'വീഴ്ചയുടെ ചരിത്രം (ഉടനടി അല്ലെങ്കിൽ 3 മാസത്തിനുള്ളിൽ)',
    options: [
      { label: 'No', labelMl: 'ഇല്ല', value: 0 },
      { label: 'Yes', labelMl: 'ഉണ്ട്', value: 25 }
    ]
  },
  {
    id: 'secondary_diagnosis',
    name: 'Secondary Diagnosis (more than one medical diagnosis)',
    nameMl: 'ദ്വിതീയ രോഗനിർണയം (ഒന്നിലധികം മെഡിക്കൽ ഡയഗ്നോസിസ്)',
    options: [
      { label: 'No', labelMl: 'ഇല്ല', value: 0 },
      { label: 'Yes', labelMl: 'ഉണ്ട്', value: 15 }
    ]
  },
  {
    id: 'ambulatory_aid',
    name: 'Ambulatory Aid',
    nameMl: 'നടക്കാനുള്ള സഹായം',
    options: [
      { label: 'Bed rest / Nurse assist', labelMl: 'ബെഡ് റെസ്റ്റ് / നഴ്സ് സഹായം', value: 0 },
      { label: 'Crutches / Cane / Walker', labelMl: 'ക്രച്ചസ് / വടി / വാക്കർ', value: 15 },
      { label: 'Furniture (clutching for support)', labelMl: 'ഫർണിച്ചർ (പിന്തുണയ്ക്കായി പിടിക്കുന്നു)', value: 30 }
    ]
  },
  {
    id: 'iv_heparin_lock',
    name: 'IV / Heparin Lock',
    nameMl: 'IV / ഹെപ്പാറിൻ ലോക്ക്',
    options: [
      { label: 'No', labelMl: 'ഇല്ല', value: 0 },
      { label: 'Yes', labelMl: 'ഉണ്ട്', value: 20 }
    ]
  },
  {
    id: 'gait_transferring',
    name: 'Gait / Transferring',
    nameMl: 'നടത്തം / കൈമാറ്റം',
    options: [
      { label: 'Normal / Bed rest / Immobile', labelMl: 'സാധാരണ / ബെഡ് റെസ്റ്റ് / ചലനമില്ല', value: 0 },
      { label: 'Weak (stooped, short steps, shuffling)', labelMl: 'ദുർബലം (കുനിഞ്ഞ, ചെറിയ ചുവടുകൾ, ഷഫ്ലിംഗ്)', value: 10 },
      { label: 'Impaired (difficulty rising, poor balance, needs support)', labelMl: 'ബുദ്ധിമുട്ടുള്ളത് (എഴുന്നേൽക്കാൻ ബുദ്ധിമുട്ട്, മോശം ബാലൻസ്, പിന്തുണ ആവശ്യം)', value: 20 }
    ]
  },
  {
    id: 'mental_status',
    name: 'Mental Status',
    nameMl: 'മാനസിക നില',
    options: [
      { label: 'Oriented to own ability', labelMl: 'സ്വന്തം കഴിവിനെക്കുറിച്ച് ബോധ്യമുണ്ട്', value: 0 },
      { label: 'Forgets limitations (overestimates ability)', labelMl: 'പരിമിതികൾ മറക്കുന്നു (കഴിവ് അമിതമായി കണക്കാക്കുന്നു)', value: 15 }
    ]
  }
];

export const THREE_KEY_QUESTIONS = {
  unsteady: {
    question: 'Do you feel unsteady when standing or walking?',
    questionMl: 'നിൽക്കുമ്പോഴോ നടക്കുമ്പോഴോ അസ്ഥിരത അനുഭവപ്പെടുന്നുണ്ടോ?'
  },
  worried: {
    question: 'Are you worried about falling?',
    questionMl: 'വീഴുമെന്ന് ഭയമുണ്ടോ?'
  },
  fallen: {
    question: 'Have you fallen in the past year?',
    questionMl: 'കഴിഞ്ഞ വർഷത്തിനുള്ളിൽ വീണിട്ടുണ്ടോ?'
  }
};

export const PHYSICAL_ASSESSMENTS = {
  tug: {
    name: 'Timed Up & Go (TUG)',
    nameMl: 'ടൈംഡ് അപ്പ് & ഗോ (TUG)',
    description: 'Time in seconds for patient to stand from chair, walk 3 meters, turn, walk back, and sit down.',
    descriptionMl: 'രോഗിക്ക് കസേരയിൽ നിന്ന് എഴുന്നേൽക്കാനും 3 മീറ്റർ നടക്കാനും തിരിയാനും തിരികെ നടക്കാനും ഇരിക്കാനും എടുക്കുന്ന സമയം സെക്കന്റിൽ.',
    cutoff: 12,
    unit: 'seconds'
  },
  chairStand: {
    name: '30-Second Chair Stand',
    nameMl: '30-സെക്കന്റ് ചെയർ സ്റ്റാൻഡ്',
    description: 'Number of times patient can stand from chair in 30 seconds.',
    descriptionMl: '30 സെക്കന്റിൽ രോഗിക്ക് എത്ര തവണ കസേരയിൽ നിന്ന് എഴുന്നേൽക്കാൻ കഴിയും.',
    ageNorms: {
      '60-64': { male: 14, female: 12 },
      '65-69': { male: 12, female: 11 },
      '70-74': { male: 12, female: 10 },
      '75-79': { male: 11, female: 10 },
      '80-84': { male: 10, female: 9 },
      '85-89': { male: 8, female: 8 },
      '90-94': { male: 7, female: 4 }
    }
  },
  balanceTest: {
    name: '4-Stage Balance Test',
    nameMl: '4-ഘട്ട ബാലൻസ് ടെസ്റ്റ്',
    stages: [
      { name: 'Stage 1: Side-by-Side Stand', nameMl: 'ഘട്ടം 1: അടുത്തടുത്ത് നിൽക്കൽ', duration: 10 },
      { name: 'Stage 2: Semi-Tandem Stand', nameMl: 'ഘട്ടം 2: സെമി-ടാൻഡം സ്റ്റാൻഡ്', duration: 10 },
      { name: 'Stage 3: Tandem Stand', nameMl: 'ഘട്ടം 3: ടാൻഡം സ്റ്റാൻഡ്', duration: 10 },
      { name: 'Stage 4: One-Leg Stand', nameMl: 'ഘട്ടം 4: ഒറ്റക്കാലിൽ നിൽക്കൽ', duration: 10 }
    ]
  }
};

export const MORSE_RISK_LEVELS = {
  no_risk: {
    range: '0-24',
    label: 'No Risk',
    labelMl: 'അപകടസാധ്യത ഇല്ല',
    action: 'Good Basic Nursing Care',
    actionMl: 'നല്ല അടിസ്ഥാന നഴ്‌സിംഗ് പരിചരണം'
  },
  low_risk: {
    range: '25-50',
    label: 'Low Risk',
    labelMl: 'കുറഞ്ഞ അപകടസാധ്യത',
    action: 'Implement Standard Fall Prevention Interventions',
    actionMl: 'സ്റ്റാൻഡേർഡ് വീഴ്ച പ്രതിരോധ ഇടപെടലുകൾ നടപ്പിലാക്കുക'
  },
  high_risk: {
    range: '51+',
    label: 'High Risk',
    labelMl: 'ഉയർന്ന അപകടസാധ്യത',
    action: 'Implement High Risk Fall Prevention Interventions',
    actionMl: 'ഉയർന്ന അപകട വീഴ്ച പ്രതിരോധ ഇടപെടലുകൾ നടപ്പിലാക്കുക'
  }
};

export const INTERVENTIONS = {
  gaitBalance: {
    title: 'Poor Gait, Strength & Balance',
    titleMl: 'മോശം നടത്തം, ശക്തി & ബാലൻസ്',
    recommendations: [
      'Refer for physical therapy',
      'Refer to evidence-based exercise or fall prevention program (e.g., Tai Chi)'
    ],
    recommendationsMl: [
      'ഫിസിക്കൽ തെറാപ്പിക്ക് റഫർ ചെയ്യുക',
      'തെളിവ് അടിസ്ഥാനമാക്കിയ വ്യായാമ അല്ലെങ്കിൽ വീഴ്ച പ്രതിരോധ പരിപാടിയിലേക്ക് റഫർ ചെയ്യുക (ഉദാ: തായ് ചി)'
    ]
  },
  medications: {
    title: 'Medication(s) Likely to Increase Fall Risk',
    titleMl: 'വീഴ്ച അപകടസാധ്യത വർദ്ധിപ്പിക്കാൻ സാധ്യതയുള്ള മരുന്നുകൾ',
    recommendations: [
      'Optimize medications by stopping, switching, or reducing dosage',
      'Review Beers Criteria medications'
    ],
    recommendationsMl: [
      'മരുന്നുകൾ നിർത്തുകയോ മാറ്റുകയോ ഡോസ് കുറയ്ക്കുകയോ ചെയ്ത് ഒപ്റ്റിമൈസ് ചെയ്യുക',
      'ബിയേഴ്സ് ക്രൈറ്റീരിയ മരുന്നുകൾ അവലോകനം ചെയ്യുക'
    ]
  },
  homeHazards: {
    title: 'Home Hazards Likely',
    titleMl: 'വീട്ടിലെ അപകടങ്ങൾ സാധ്യത',
    recommendations: [
      'Refer to occupational therapist to evaluate home safety',
      'Remove throw rugs and clutter',
      'Ensure adequate lighting',
      'Install grab bars in bathroom'
    ],
    recommendationsMl: [
      'വീട്ടിലെ സുരക്ഷ വിലയിരുത്താൻ ഒക്യുപേഷണൽ തെറാപ്പിസ്റ്റിലേക്ക് റഫർ ചെയ്യുക',
      'ത്രോ റഗ്ഗുകളും അലങ്കോലവും നീക്കം ചെയ്യുക',
      'മതിയായ വെളിച്ചം ഉറപ്പാക്കുക',
      'ബാത്ത്‌റൂമിൽ ഗ്രാബ് ബാറുകൾ സ്ഥാപിക്കുക'
    ]
  },
  orthostaticHypotension: {
    title: 'Orthostatic Hypotension',
    titleMl: 'ഓർത്തോസ്റ്റാറ്റിക് ഹൈപ്പോടെൻഷൻ',
    recommendations: [
      'Stop, switch, or reduce dose of medications that increase fall risk',
      'Educate about importance of exercises (e.g., foot pumps)',
      'Establish appropriate blood pressure goal',
      'Encourage adequate hydration',
      'Consider compression stockings'
    ],
    recommendationsMl: [
      'വീഴ്ച അപകടസാധ്യത വർദ്ധിപ്പിക്കുന്ന മരുന്നുകൾ നിർത്തുക, മാറ്റുക, അല്ലെങ്കിൽ ഡോസ് കുറയ്ക്കുക',
      'വ്യായാമങ്ങളുടെ പ്രാധാന്യത്തെക്കുറിച്ച് ബോധവൽക്കരിക്കുക (ഉദാ: ഫൂട്ട് പമ്പുകൾ)',
      'ഉചിതമായ രക്തസമ്മർദ്ദ ലക്ഷ്യം സ്ഥാപിക്കുക',
      'മതിയായ ജലാംശം പ്രോത്സാഹിപ്പിക്കുക',
      'കംപ്രഷൻ സ്റ്റോക്കിംഗ്‌സ് പരിഗണിക്കുക'
    ]
  },
  visualImpairment: {
    title: 'Visual Impairment',
    titleMl: 'കാഴ്ച വൈകല്യം',
    recommendations: [
      'Refer to ophthalmologist/optometrist',
      'Stop, switch, or reduce dose of medications affecting vision',
      'Consider benefits of cataract surgery',
      'Provide education on depth perception and single vs. multifocal lenses'
    ],
    recommendationsMl: [
      'ഒഫ്താൽമോളജിസ്റ്റ്/ഒപ്റ്റോമെട്രിസ്റ്റിലേക്ക് റഫർ ചെയ്യുക',
      'കാഴ്ചയെ ബാധിക്കുന്ന മരുന്നുകൾ നിർത്തുക, മാറ്റുക, അല്ലെങ്കിൽ ഡോസ് കുറയ്ക്കുക',
      'തിമിര ശസ്ത്രക്രിയയുടെ ഗുണങ്ങൾ പരിഗണിക്കുക',
      'ഡെപ്ത് പെർസെപ്ഷനെക്കുറിച്ചും സിംഗിൾ vs മൾട്ടിഫോക്കൽ ലെൻസുകളെക്കുറിച്ചും വിദ്യാഭ്യാസം നൽകുക'
    ]
  },
  feetFootwear: {
    title: 'Feet/Footwear Issues',
    titleMl: 'പാദം/ഷൂ പ്രശ്നങ്ങൾ',
    recommendations: [
      'Provide education on shoe fit, traction, insoles, and heel height',
      'Refer to podiatrist'
    ],
    recommendationsMl: [
      'ഷൂ ഫിറ്റ്, ട്രാക്ഷൻ, ഇൻസോൾസ്, ഹീൽ ഉയരം എന്നിവയെക്കുറിച്ച് വിദ്യാഭ്യാസം നൽകുക',
      'പോഡിയാട്രിസ്റ്റിലേക്ക് റഫർ ചെയ്യുക'
    ]
  },
  vitaminD: {
    title: 'Vitamin D Deficiency',
    titleMl: 'വിറ്റാമിൻ D കുറവ്',
    recommendations: [
      'Recommend daily vitamin D supplement (800-1000 IU)'
    ],
    recommendationsMl: [
      'ദൈനംദിന വിറ്റാമിൻ D സപ്ലിമെന്റ് ശുപാർശ ചെയ്യുക (800-1000 IU)'
    ]
  }
};

export const CATEGORY_LABELS = {
  steadi: { en: 'STEADI Stay Independent (12 Questions)', ml: 'STEADI സ്റ്റേ ഇൻഡിപെൻഡന്റ് (12 ചോദ്യങ്ങൾ)' },
  morse: { en: 'Morse Fall Scale', ml: 'മോഴ്സ് ഫാൾ സ്കെയിൽ' },
  physical: { en: 'Physical Assessments', ml: 'ശാരീരിക വിലയിരുത്തലുകൾ' },
  threeKey: { en: 'Three Key Screening Questions', ml: 'മൂന്ന് പ്രധാന സ്ക്രീനിംഗ് ചോദ്യങ്ങൾ' }
};
