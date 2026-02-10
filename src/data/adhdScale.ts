import { AdhdSymptom, AdhdCriterion } from '@/types/adhd';

// DSM-5-TR Criteria for ADHD
// Source: American Psychiatric Association. Diagnostic and Statistical Manual of Mental Disorders. 5th ed, text revision. 2022:68-69.

export const ADHD_INATTENTION_SYMPTOMS: AdhdSymptom[] = [
  {
    id: 'ia-1',
    domain: 'inattention',
    label: 'Careless mistakes',
    labelMl: 'അശ്രദ്ധമായ തെറ്റുകൾ',
    description: 'Often fails to give close attention to details or makes careless mistakes in schoolwork, at work, or during other activities',
    descriptionMl: 'പഠനത്തിലോ ജോലിയിലോ മറ്റ് പ്രവർത്തനങ്ങളിലോ വിശദാംശങ്ങളിൽ ശ്രദ്ധ കൊടുക്കാതിരിക്കുകയോ അശ്രദ്ധമായ തെറ്റുകൾ വരുത്തുകയോ ചെയ്യുന്നു'
  },
  {
    id: 'ia-2',
    domain: 'inattention',
    label: 'Difficulty sustaining attention',
    labelMl: 'ശ്രദ്ധ നിലനിർത്തുന്നതിൽ ബുദ്ധിമുട്ട്',
    description: 'Often has difficulty sustaining attention in tasks or play activities',
    descriptionMl: 'ചുമതലകളിലോ കളികളിലോ ശ്രദ്ധ നിലനിർത്തുന്നതിൽ പലപ്പോഴും ബുദ്ധിമുട്ട് അനുഭവപ്പെടുന്നു'
  },
  {
    id: 'ia-3',
    domain: 'inattention',
    label: 'Does not listen when spoken to directly',
    labelMl: 'നേരിട്ട് സംസാരിക്കുമ്പോൾ ശ്രദ്ധിക്കുന്നില്ല',
    description: 'Often does not seem to listen when spoken to directly',
    descriptionMl: 'നേരിട്ട് സംസാരിക്കുമ്പോൾ പോലും ശ്രദ്ധിക്കുന്നതായി തോന്നുന്നില്ല'
  },
  {
    id: 'ia-4',
    domain: 'inattention',
    label: 'Does not follow through on instructions',
    labelMl: 'നിർദ്ദേശങ്ങൾ പാലിക്കുന്നില്ല',
    description: 'Often does not follow through on instructions and fails to finish schoolwork, chores, or duties in the workplace',
    descriptionMl: 'നിർദ്ദേശങ്ങൾ പാലിക്കാതിരിക്കുകയും പഠനം, വീട്ടുജോലികൾ, ഓഫീസ് ജോലികൾ എന്നിവ പൂർത്തിയാക്കാതിരിക്കുകയും ചെയ്യുന്നു'
  },
  {
    id: 'ia-5',
    domain: 'inattention',
    label: 'Difficulty organizing tasks',
    labelMl: 'കാര്യങ്ങൾ ക്രമീകരിക്കുന്നതിൽ ബുദ്ധിമുട്ട്',
    description: 'Often has difficulty organizing tasks and activities',
    descriptionMl: 'ചുമതലകളും പ്രവർത്തനങ്ങളും ക്രമീകരിക്കുന്നതിൽ പലപ്പോഴും ബുദ്ധിമുട്ട് അനുഭവപ്പെടുന്നു'
  },
  {
    id: 'ia-6',
    domain: 'inattention',
    label: 'Avoids tasks with sustained mental effort',
    labelMl: 'മാനസിക പരിശ്രമം ആവശ്യമുള്ള ജോലികൾ ഒഴിവാക്കുന്നു',
    description: 'Often avoids, dislikes, or is reluctant to engage in tasks that require sustained mental effort',
    descriptionMl: 'തുടർച്ചയായ മാനസിക പരിശ്രമം ആവശ്യമുള്ള ജോലികൾ ഒഴിവാക്കുകയോ ഇഷ്ടപ്പെടാതിരിക്കുകയോ ചെയ്യുന്നു'
  },
  {
    id: 'ia-7',
    domain: 'inattention',
    label: 'Loses things',
    labelMl: 'സാധനങ്ങൾ നഷ്ടപ്പെടുത്തുന്നു',
    description: 'Often loses things necessary for tasks and activities (e.g., school materials, pencils, books, tools, wallets, keys, paperwork, eyeglasses, mobile telephones)',
    descriptionMl: 'ചുമതലകൾക്കും പ്രവർത്തനങ്ങൾക്കും ആവശ്യമായ സാധനങ്ങൾ പലപ്പോഴും നഷ്ടപ്പെടുത്തുന്നു (ഉദാ: പെൻസിൽ, പുസ്തകങ്ങൾ, കീകൾ, ഫോൺ, കാശ് )'
  },
  {
    id: 'ia-8',
    domain: 'inattention',
    label: 'Easily distracted',
    labelMl: 'എളുപ്പത്തിൽ ശ്രദ്ധ തെറ്റുന്നു',
    description: 'Is often easily distracted by extraneous stimuli',
    descriptionMl: 'ബാഹ്യ ഉത്തേജനങ്ങളാൽ എളുപ്പത്തിൽ ശ്രദ്ധ തെറ്റുന്നു'
  },
  {
    id: 'ia-9',
    domain: 'inattention',
    label: 'Forgetful',
    labelMl: 'മറവി',
    description: 'Is often forgetful in daily activities',
    descriptionMl: 'ദൈനംദിന പ്രവർത്തനങ്ങളിൽ പലപ്പോഴും മറവി കാണിക്കുന്നു'
  }
];

export const ADHD_HYPERACTIVITY_SYMPTOMS: AdhdSymptom[] = [
  {
    id: 'hi-1',
    domain: 'hyperactivity-impulsivity',
    label: 'Fidgets',
    labelMl: 'അസ്വസ്ഥമായി ചലിക്കുന്നു',
    description: 'Often fidgets with or taps hands or feet or squirms in seat',
    descriptionMl: 'കൈകളോ കാലുകളോ കൊണ്ട് പലപ്പോഴും അടിക്കുകയോ ഇരിപ്പിടത്തിൽ പിടയുകയോ ചെയ്യുന്നു'
  },
  {
    id: 'hi-2',
    domain: 'hyperactivity-impulsivity',
    label: 'Leaves seat',
    labelMl: 'സീറ്റ് വിടുന്നു',
    description: 'Often leaves seat in situations when remaining seated is expected',
    descriptionMl: 'ഇരിക്കേണ്ട സാഹചര്യങ്ങളിൽ പലപ്പോഴും സീറ്റ് വിട്ട് എഴുന്നേൽക്കുന്നു'
  },
  {
    id: 'hi-3',
    domain: 'hyperactivity-impulsivity',
    label: 'Inappropriate running or restlessness',
    labelMl: 'അനുചിതമായ ഓട്ടം അല്ലെങ്കിൽ അസ്വസ്ഥത',
    description: 'Often runs about or climbs in situations where it is inappropriate (in adolescents or adults, may be limited to feeling restless)',
    descriptionMl: 'അനുചിതമായ സാഹചര്യങ്ങളിൽ ഓടുകയോ കയറുകയോ ചെയ്യുന്നു (കൗമാരക്കാരിലും മുതിർന്നവരിലും അസ്വസ്ഥത അനുഭവപ്പെടാം)'
  },
  {
    id: 'hi-4',
    domain: 'hyperactivity-impulsivity',
    label: 'Unable to engage in leisure quietly',
    labelMl: 'ശാന്തമായി വിനോദങ്ങളിൽ ഏർപ്പെടാൻ കഴിയുന്നില്ല',
    description: 'Often unable to play or engage in leisure activities quietly',
    descriptionMl: 'ശാന്തമായി കളിക്കാനോ വിനോദ പ്രവർത്തനങ്ങളിൽ ഏർപ്പെടാനോ പലപ്പോഴും കഴിയുന്നില്ല'
  },
  {
    id: 'hi-5',
    domain: 'hyperactivity-impulsivity',
    label: 'Uncomfortable being still',
    labelMl: 'നിശ്ചലമായിരിക്കുന്നത് അസ്വസ്ഥമാണ്',
    description: 'Is often "on the go," acting as if "driven by a motor"',
    descriptionMl: '"മോട്ടോർ കൊണ്ട് ഓടിക്കുന്നതുപോലെ" എപ്പോഴും ചലനത്തിലാണ്'
  },
  {
    id: 'hi-6',
    domain: 'hyperactivity-impulsivity',
    label: 'Talks excessively',
    labelMl: 'അമിതമായി സംസാരിക്കുന്നു',
    description: 'Often talks excessively',
    descriptionMl: 'പലപ്പോഴും അമിതമായി സംസാരിക്കുന്നു'
  },
  {
    id: 'hi-7',
    domain: 'hyperactivity-impulsivity',
    label: 'Completes others\' sentences',
    labelMl: 'മറ്റുള്ളവരുടെ വാക്യങ്ങൾ പൂർത്തിയാക്കുന്നു',
    description: 'Often blurts out an answer before a question has been completed',
    descriptionMl: 'ചോദ്യം പൂർത്തിയാകുന്നതിന് മുമ്പ് ഉത്തരം പറയുന്നു'
  },
  {
    id: 'hi-8',
    domain: 'hyperactivity-impulsivity',
    label: 'Difficulty waiting turn',
    labelMl: 'ഊഴം കാത്തിരിക്കുന്നതിൽ ബുദ്ധിമുട്ട്',
    description: 'Often has difficulty waiting their turn',
    descriptionMl: 'ഊഴം കാത്തിരിക്കുന്നതിൽ പലപ്പോഴും ബുദ്ധിമുട്ട് അനുഭവപ്പെടുന്നു'
  },
  {
    id: 'hi-9',
    domain: 'hyperactivity-impulsivity',
    label: 'Interrupts others',
    labelMl: 'മറ്റുള്ളവരെ തടസ്സപ്പെടുത്തുന്നു',
    description: 'Often interrupts or intrudes on others (e.g., butts into conversations, games, or activities; may start using other people\'s things without asking or receiving permission)',
    descriptionMl: 'മറ്റുള്ളവരുടെ സംഭാഷണങ്ങളിലോ കളികളിലോ പ്രവർത്തനങ്ങളിലോ തടസ്സപ്പെടുത്തുന്നു; അനുമതിയില്ലാതെ മറ്റുള്ളവരുടെ സാധനങ്ങൾ ഉപയോഗിച്ചേക്കാം'
  }
];

export const ADHD_CRITERIA: AdhdCriterion[] = [
  {
    id: 'B',
    question: 'Were several inattentive or hyperactive-impulsive symptoms present prior to age 12?',
    questionMl: '12 വയസ്സിന് മുമ്പ് പല ശ്രദ്ധക്കുറവ് അല്ലെങ്കിൽ അമിത സജീവത-ആവേഗ ലക്ഷണങ്ങൾ ഉണ്ടായിരുന്നോ?',
    description: 'Several inattentive or hyperactive-impulsive symptoms were present prior to age 12 years.',
    descriptionMl: '12 വയസ്സിന് മുമ്പ് പല ശ്രദ്ധക്കുറവ് അല്ലെങ്കിൽ അമിത സജീവത-ആവേഗ ലക്ഷണങ്ങൾ ഉണ്ടായിരുന്നു.'
  },
  {
    id: 'C',
    question: 'Are symptoms present in two or more settings (e.g., home, school/work, with friends)?',
    questionMl: 'രണ്ടോ അതിലധികമോ സാഹചര്യങ്ങളിൽ ലക്ഷണങ്ങൾ ഉണ്ടോ (ഉദാ: വീട്, സ്കൂൾ/ജോലി, സുഹൃത്തുക്കളോടൊപ്പം)?',
    description: 'Several inattentive or hyperactive-impulsive symptoms are present in two or more settings.',
    descriptionMl: 'രണ്ടോ അതിലധികമോ സാഹചര്യങ്ങളിൽ പല ശ്രദ്ധക്കുറവ് അല്ലെങ്കിൽ അമിത സജീവത-ആവേഗ ലക്ഷണങ്ങൾ ഉണ്ട്.'
  },
  {
    id: 'D',
    question: 'Is there clear evidence that symptoms interfere with or reduce quality of functioning?',
    questionMl: 'ലക്ഷണങ്ങൾ സാമൂഹിക, അക്കാദമിക്, തൊഴിൽ പ്രവർത്തനത്തെ തടസ്സപ്പെടുത്തുന്നതിനോ ഗുണനിലവാരം കുറയ്ക്കുന്നതിനോ വ്യക്തമായ തെളിവുകളുണ്ടോ?',
    description: 'There is clear evidence that the symptoms interfere with, or reduce the quality of, social, academic, or occupational functioning.',
    descriptionMl: 'സാമൂഹിക, അക്കാദമിക്, അല്ലെങ്കിൽ തൊഴിൽ പ്രവർത്തനത്തെ ലക്ഷണങ്ങൾ തടസ്സപ്പെടുത്തുന്നതിനോ ഗുണനിലവാരം കുറയ്ക്കുന്നതിനോ വ്യക്തമായ തെളിവുകളുണ്ട്.'
  },
  {
    id: 'E',
    question: 'Are the symptoms NOT better explained by another mental disorder?',
    questionMl: 'ലക്ഷണങ്ങൾ മറ്റൊരു മാനസിക വൈകല്യത്താൽ നന്നായി വിശദീകരിക്കപ്പെടുന്നില്ല?',
    description: 'The symptoms do not occur exclusively during the course of schizophrenia or another psychotic disorder and are not better explained by another mental disorder.',
    descriptionMl: 'സ്കീസോഫ്രീനിയയുടെയോ മറ്റൊരു സൈക്കോട്ടിക് ഡിസോർഡറിന്റെയോ സമയത്ത് മാത്രമല്ല ലക്ഷണങ്ങൾ ഉണ്ടാകുന്നത്, മറ്റൊരു മാനസിക വൈകല്യത്താൽ മെച്ചമായി വിശദീകരിക്കപ്പെടുന്നുമില്ല.'
  }
];

export const DOMAIN_THRESHOLDS = {
  childAdolescent: 6, // For those <17 years
  adult: 5 // For those ≥17 years
};

export const getPresentation = (
  inattentionCount: number, 
  hyperactivityCount: number, 
  age17Plus: boolean
): 'combined' | 'predominantly-inattentive' | 'predominantly-hyperactive' | 'subthreshold' => {
  const threshold = age17Plus ? DOMAIN_THRESHOLDS.adult : DOMAIN_THRESHOLDS.childAdolescent;
  
  const meetsInattention = inattentionCount >= threshold;
  const meetsHyperactivity = hyperactivityCount >= threshold;
  
  if (meetsInattention && meetsHyperactivity) {
    return 'combined';
  } else if (meetsInattention) {
    return 'predominantly-inattentive';
  } else if (meetsHyperactivity) {
    return 'predominantly-hyperactive';
  }
  return 'subthreshold';
};

export const getPresentationLabel = (presentation: string, language: 'en' | 'ml'): { title: string; description: string } => {
  const labels = {
    'combined': {
      en: { 
        title: 'Combined Presentation', 
        description: 'Meets criteria for both inattention and hyperactivity-impulsivity domains' 
      },
      ml: { 
        title: 'സംയുക്ത അവതരണം', 
        description: 'ശ്രദ്ധക്കുറവ്, അമിത സജീവത-ആവേഗം എന്നീ രണ്ട് മേഖലകളിലും മാനദണ്ഡങ്ങൾ പാലിക്കുന്നു' 
      }
    },
    'predominantly-inattentive': {
      en: { 
        title: 'Predominantly Inattentive Presentation', 
        description: 'Meets criteria for inattention but not hyperactivity-impulsivity' 
      },
      ml: { 
        title: 'പ്രധാനമായും ശ്രദ്ധക്കുറവ് അവതരണം', 
        description: 'ശ്രദ്ധക്കുറവിന്റെ മാനദണ്ഡങ്ങൾ പാലിക്കുന്നു, അമിത സജീവത-ആവേഗത്തിന്റെ അല്ല' 
      }
    },
    'predominantly-hyperactive': {
      en: { 
        title: 'Predominantly Hyperactive-Impulsive Presentation', 
        description: 'Meets criteria for hyperactivity-impulsivity but not inattention' 
      },
      ml: { 
        title: 'പ്രധാനമായും അമിത സജീവത-ആവേഗ അവതരണം', 
        description: 'അമിത സജീവത-ആവേഗത്തിന്റെ മാനദണ്ഡങ്ങൾ പാലിക്കുന്നു, ശ്രദ്ധക്കുറവിന്റെ അല്ല' 
      }
    },
    'subthreshold': {
      en: { 
        title: 'Subthreshold Symptoms', 
        description: 'Does not meet full criteria for any ADHD presentation' 
      },
      ml: { 
        title: 'പരിധിക്ക് താഴെയുള്ള ലക്ഷണങ്ങൾ', 
        description: 'ഒരു ADHD അവതരണത്തിനും പൂർണ്ണ മാനദണ്ഡങ്ങൾ പാലിക്കുന്നില്ല' 
      }
    }
  };
  
  return labels[presentation as keyof typeof labels]?.[language] || labels['subthreshold'][language];
};
