import { CatatoniaItem } from '@/types/catatonia';

export const CATATONIA_ITEMS: CatatoniaItem[] = [
  // Screening items (1-14)
  {
    id: 'excitement',
    number: 1,
    name: 'Excitement',
    nameMl: 'ഉത്തേജനം',
    description: 'Extreme hyperactivity, constant motor unrest which is apparently non-purposeful. Not to be attributed to akathisia or goal-directed agitation.',
    descriptionMl: 'അതീവ ഹൈപ്പർ ആക്ടിവിറ്റി, സ്ഥിരമായ മോട്ടോർ അസ്വസ്ഥത, ഉദ്ദേശ്യരഹിതം. അകാഥിസിയ അല്ലെങ്കിൽ ലക്ഷ്യ-നിർദ്ദിഷ്ട ആന്ദോളനം ആയി കണക്കാക്കരുത്.',
    isScreening: true,
    scoringGuide: {
      0: 'Absent',
      1: 'Excessive motion, intermittent',
      2: 'Constant motion, hyperkinetic without rest periods',
      3: 'Full-blown catatonic excitement, endless frenzied motor activity'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: 'അമിത ചലനം, ഇടയ്ക്കിടെ',
      2: 'സ്ഥിരമായ ചലനം, വിശ്രമ കാലയളവുകളില്ലാതെ ഹൈപ്പർകൈനെറ്റിക്',
      3: 'പൂർണ്ണമായ കാറ്ററ്റോണിക് ഉത്തേജനം, അവസാനമില്ലാത്ത ഉന്മാദ മോട്ടോർ പ്രവർത്തനം'
    }
  },
  {
    id: 'immobility',
    number: 2,
    name: 'Immobility/Stupor',
    nameMl: 'നിശ്ചലത/സ്തബ്ധത',
    description: 'Extreme hypoactivity, immobility, minimally responsive to stimuli.',
    descriptionMl: 'അതീവ ഹൈപ്പോആക്ടിവിറ്റി, നിശ്ചലത, ഉത്തേജനങ്ങളോട് കുറഞ്ഞ പ്രതികരണം.',
    isScreening: true,
    scoringGuide: {
      0: 'Absent',
      1: 'Sits abnormally still, may interact briefly',
      2: 'Virtually no interaction with external world',
      3: 'Stuporous, non-reactive to painful stimuli'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: 'അസാധാരണമായി നിശ്ചലമായി ഇരിക്കുന്നു, ചുരുക്കമായി ഇടപഴകിയേക്കാം',
      2: 'ബാഹ്യ ലോകവുമായി ഫലത്തിൽ ഇടപെടൽ ഇല്ല',
      3: 'സ്തബ്ധത, വേദനാജനകമായ ഉത്തേജനങ്ങളോട് പ്രതികരണമില്ല'
    }
  },
  {
    id: 'mutism',
    number: 3,
    name: 'Mutism',
    nameMl: 'മൗനം',
    description: 'Verbally unresponsive or minimally responsive.',
    descriptionMl: 'വാചികമായി പ്രതികരിക്കാത്തത് അല്ലെങ്കിൽ കുറഞ്ഞ പ്രതികരണം.',
    isScreening: true,
    scoringGuide: {
      0: 'Absent',
      1: 'Verbally unresponsive to majority of questions; incomprehensible whisper',
      2: 'Speaks less than 20 words per 5 minutes',
      3: 'No speech'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: 'മിക്ക ചോദ്യങ്ങളോടും വാചികമായി പ്രതികരിക്കുന്നില്ല; മനസ്സിലാകാത്ത മന്ത്രം',
      2: '5 മിനിറ്റിൽ 20 വാക്കുകളിൽ കുറവ് സംസാരിക്കുന്നു',
      3: 'സംസാരം ഇല്ല'
    }
  },
  {
    id: 'staring',
    number: 4,
    name: 'Staring',
    nameMl: 'ഉറ്റുനോട്ടം',
    description: 'Fixed gaze, little or no visual scanning of environment, decreased blinking.',
    descriptionMl: 'സ്ഥിരമായ നോട്ടം, പരിസ്ഥിതിയുടെ കുറഞ്ഞ അല്ലെങ്കിൽ ദൃശ്യ സ്കാനിംഗ് ഇല്ല, കുറഞ്ഞ കണ്ണടയ്ക്കൽ.',
    isScreening: true,
    scoringGuide: {
      0: 'Absent',
      1: 'Poor eye contact, less than 20 seconds between reorienting',
      2: 'Gaze held longer than 20 seconds, occasionally shifts attention',
      3: 'Fixed gaze, non-reactive'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: 'മോശം കണ്ണ് സമ്പർക്കം, പുനഃക്രമീകരണത്തിനിടയിൽ 20 സെക്കൻഡിൽ കുറവ്',
      2: '20 സെക്കൻഡിൽ കൂടുതൽ നോട്ടം, ഇടയ്ക്കിടെ ശ്രദ്ധ മാറുന്നു',
      3: 'സ്ഥിര നോട്ടം, പ്രതികരണമില്ല'
    }
  },
  {
    id: 'posturing',
    number: 5,
    name: 'Posturing/Catalepsy',
    nameMl: 'ഭാവം/കാറ്റലെപ്സി',
    description: 'Spontaneous maintenance of posture(s), including mundane (e.g., sitting or standing for long periods without reacting).',
    descriptionMl: 'ഭാവ(ങ്ങൾ) സ്വയമേവ നിലനിർത്തൽ, സാധാരണമായത് ഉൾപ്പെടെ (ഉദാ: പ്രതികരിക്കാതെ ദീർഘനേരം ഇരിക്കുക അല്ലെങ്കിൽ നിൽക്കുക).',
    isScreening: true,
    scoringGuide: {
      0: 'Absent',
      1: 'Less than 1 minute',
      2: 'Greater than 1 minute, less than 15 minutes',
      3: 'Bizarre posture, or mundane maintained more than 15 minutes'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: '1 മിനിറ്റിൽ കുറവ്',
      2: '1 മിനിറ്റിൽ കൂടുതൽ, 15 മിനിറ്റിൽ കുറവ്',
      3: 'വിചിത്രമായ ഭാവം, അല്ലെങ്കിൽ 15 മിനിറ്റിൽ കൂടുതൽ നിലനിർത്തിയത്'
    }
  },
  {
    id: 'grimacing',
    number: 6,
    name: 'Grimacing',
    nameMl: 'മുഖവൈകൃതം',
    description: 'Maintenance of odd facial expressions.',
    descriptionMl: 'വിചിത്രമായ മുഖഭാവങ്ങൾ നിലനിർത്തൽ.',
    isScreening: true,
    scoringGuide: {
      0: 'Absent',
      1: 'Less than 10 seconds',
      2: 'Less than 1 minute',
      3: 'Bizarre expression(s) or maintained more than 1 minute'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: '10 സെക്കൻഡിൽ കുറവ്',
      2: '1 മിനിറ്റിൽ കുറവ്',
      3: 'വിചിത്രമായ ഭാവം(ങ്ങൾ) അല്ലെങ്കിൽ 1 മിനിറ്റിൽ കൂടുതൽ നിലനിർത്തിയത്'
    }
  },
  {
    id: 'echopraxia',
    number: 7,
    name: 'Echopraxia/Echolalia',
    nameMl: 'എക്കോപ്രാക്സിയ/എക്കോലാലിയ',
    description: 'Mimicking of examiner\'s movements/speech.',
    descriptionMl: 'പരിശോധകന്റെ ചലനങ്ങൾ/സംസാരം അനുകരിക്കൽ.',
    isScreening: true,
    scoringGuide: {
      0: 'Absent',
      1: 'Occasional',
      2: 'Frequent',
      3: 'Constant'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: 'ഇടയ്ക്കിടെ',
      2: 'പലപ്പോഴും',
      3: 'സ്ഥിരം'
    }
  },
  {
    id: 'stereotypy',
    number: 8,
    name: 'Stereotypy',
    nameMl: 'സ്റ്റീരിയോടൈപ്പി',
    description: 'Repetitive, non-goal-directed motor activity (e.g., finger play, repeatedly touching, patting, or rubbing self).',
    descriptionMl: 'ആവർത്തിച്ചുള്ള, ലക്ഷ്യ-നിർദ്ദേശമില്ലാത്ത മോട്ടോർ പ്രവർത്തനം (ഉദാ: വിരൽ കളി, ആവർത്തിച്ച് സ്പർശിക്കൽ, തലോടൽ, അല്ലെങ്കിൽ സ്വയം ഉരസൽ).',
    isScreening: true,
    scoringGuide: {
      0: 'Absent',
      1: 'Occasional',
      2: 'Frequent',
      3: 'Constant'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: 'ഇടയ്ക്കിടെ',
      2: 'പലപ്പോഴും',
      3: 'സ്ഥിരം'
    }
  },
  {
    id: 'mannerisms',
    number: 9,
    name: 'Mannerisms',
    nameMl: 'മാനറിസങ്ങൾ',
    description: 'Odd, purposeful movements (hopping or walking tiptoe, saluting passers-by, or exaggerated caricatures of mundane movements).',
    descriptionMl: 'വിചിത്രമായ, ഉദ്ദേശ്യപൂർണ്ണമായ ചലനങ്ങൾ (ചാടൽ അല്ലെങ്കിൽ കാൽവിരൽത്തുമ്പിൽ നടക്കൽ, വഴിയാത്രക്കാരെ സല്യൂട്ട് ചെയ്യൽ, അല്ലെങ്കിൽ സാധാരണ ചലനങ്ങളുടെ അതിശയോക്തി കാരിക്കേച്ചറുകൾ).',
    isScreening: true,
    scoringGuide: {
      0: 'Absent',
      1: 'Occasional',
      2: 'Frequent',
      3: 'Constant'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: 'ഇടയ്ക്കിടെ',
      2: 'പലപ്പോഴും',
      3: 'സ്ഥിരം'
    }
  },
  {
    id: 'verbigeration',
    number: 10,
    name: 'Verbigeration',
    nameMl: 'വെർബിജറേഷൻ',
    description: 'Repetition of phrases or sentences (like a broken record).',
    descriptionMl: 'വാക്യങ്ങൾ അല്ലെങ്കിൽ വാക്യങ്ങളുടെ ആവർത്തനം (ഒരു തകർന്ന റെക്കോർഡ് പോലെ).',
    isScreening: true,
    scoringGuide: {
      0: 'Absent',
      1: 'Occasional',
      2: 'Frequent, difficult to interrupt',
      3: 'Constant'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: 'ഇടയ്ക്കിടെ',
      2: 'പലപ്പോഴും, തടസ്സപ്പെടുത്താൻ ബുദ്ധിമുട്ട്',
      3: 'സ്ഥിരം'
    }
  },
  {
    id: 'rigidity',
    number: 11,
    name: 'Rigidity',
    nameMl: 'കാഠിന്യം',
    description: 'Maintenance of a rigid position despite efforts to be moved, exclude if cogwheeling or tremor present.',
    descriptionMl: 'ചലിപ്പിക്കാനുള്ള ശ്രമങ്ങൾ ഉണ്ടായിട്ടും കഠിനമായ സ്ഥാനം നിലനിർത്തൽ, കോഗ്വീലിംഗ് അല്ലെങ്കിൽ വിറയൽ ഉണ്ടെങ്കിൽ ഒഴിവാക്കുക.',
    isScreening: true,
    scoringGuide: {
      0: 'Absent',
      1: 'Mild resistance',
      2: 'Moderate',
      3: 'Severe, cannot be repostured'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: 'നേരിയ പ്രതിരോധം',
      2: 'മിതമായ',
      3: 'കടുത്ത, പുനഃസ്ഥാപിക്കാൻ കഴിയില്ല'
    }
  },
  {
    id: 'negativism',
    number: 12,
    name: 'Negativism',
    nameMl: 'നെഗറ്റിവിസം',
    description: 'Apparently motiveless resistance to instructions or attempts to move/examine the patient. Contrary behavior, does the opposite of the instruction.',
    descriptionMl: 'നിർദ്ദേശങ്ങളോടോ രോഗിയെ നീക്കാനോ പരിശോധിക്കാനോ ഉള്ള ശ്രമങ്ങളോടോ പ്രത്യക്ഷത്തിൽ പ്രേരണയില്ലാത്ത പ്രതിരോധം. വിപരീത പെരുമാറ്റം, നിർദ്ദേശത്തിന് വിപരീതമായി ചെയ്യുന്നു.',
    isScreening: true,
    scoringGuide: {
      0: 'Absent',
      1: 'Mild resistance and/or occasionally contrary',
      2: 'Moderate resistance and/or frequently contrary',
      3: 'Severe resistance and/or continually contrary'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: 'നേരിയ പ്രതിരോധം കൂടാതെ/അല്ലെങ്കിൽ ഇടയ്ക്കിടെ വിപരീതം',
      2: 'മിതമായ പ്രതിരോധം കൂടാതെ/അല്ലെങ്കിൽ പലപ്പോഴും വിപരീതം',
      3: 'കടുത്ത പ്രതിരോധം കൂടാതെ/അല്ലെങ്കിൽ തുടർച്ചയായി വിപരീതം'
    }
  },
  {
    id: 'waxyFlexibility',
    number: 13,
    name: 'Waxy Flexibility',
    nameMl: 'വാക്സി ഫ്ലെക്സിബിലിറ്റി',
    description: 'During reposturing of patient, patient offers initial resistance before allowing themselves to be repositioned, similar to that of bending a warm candle.',
    descriptionMl: 'രോഗിയെ പുനഃസ്ഥാപിക്കുമ്പോൾ, പുനഃസ്ഥാപിക്കാൻ അനുവദിക്കുന്നതിന് മുമ്പ് രോഗി പ്രാരംഭ പ്രതിരോധം വാഗ്ദാനം ചെയ്യുന്നു, ചൂടുള്ള മെഴുകുതിരി വളയ്ക്കുന്നതിന് സമാനം.',
    isScreening: true,
    scoringGuide: {
      0: 'Absent',
      1: '',
      2: '',
      3: 'Present'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: '',
      2: '',
      3: 'ഉണ്ട്'
    }
  },
  {
    id: 'withdrawal',
    number: 14,
    name: 'Withdrawal',
    nameMl: 'പിൻവാങ്ങൽ',
    description: 'Refusal to eat, drink, and/or make eye contact.',
    descriptionMl: 'ഭക്ഷണം കഴിക്കാനോ, കുടിക്കാനോ, കൂടാതെ/അല്ലെങ്കിൽ കണ്ണ് സമ്പർക്കം പുലർത്താനോ വിസമ്മതം.',
    isScreening: true,
    scoringGuide: {
      0: 'Absent',
      1: 'Minimal PO intake and/or no eye contact for less than 1 day',
      2: 'Minimal PO intake and/or no eye contact for greater than 1 day',
      3: 'No PO intake and/or no eye contact for greater than 1 day'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: '1 ദിവസത്തിൽ കുറവ് കുറഞ്ഞ PO കഴിക്കൽ കൂടാതെ/അല്ലെങ്കിൽ കണ്ണ് സമ്പർക്കം ഇല്ല',
      2: '1 ദിവസത്തിൽ കൂടുതൽ കുറഞ്ഞ PO കഴിക്കൽ കൂടാതെ/അല്ലെങ്കിൽ കണ്ണ് സമ്പർക്കം ഇല്ല',
      3: '1 ദിവസത്തിൽ കൂടുതൽ PO കഴിക്കൽ ഇല്ല കൂടാതെ/അല്ലെങ്കിൽ കണ്ണ് സമ്പർക്കം ഇല്ല'
    }
  },
  // Full scale items (15-23)
  {
    id: 'impulsivity',
    number: 15,
    name: 'Impulsivity',
    nameMl: 'ആവേഗം',
    description: 'Patient suddenly engages in inappropriate behavior (e.g., runs down the hallway, starts screaming, or takes off clothes) without provocation. Afterwards, gives no or no explanation for behavior.',
    descriptionMl: 'പ്രകോപനമില്ലാതെ രോഗി പെട്ടെന്ന് അനുചിതമായ പെരുമാറ്റത്തിൽ ഏർപ്പെടുന്നു (ഉദാ: ഇടനാഴിയിലൂടെ ഓടുന്നു, അലറാൻ തുടങ്ങുന്നു, അല്ലെങ്കിൽ വസ്ത്രം അഴിക്കുന്നു). ശേഷം, പെരുമാറ്റത്തിന് വിശദീകരണമോ വിശദീകരണമോ നൽകുന്നില്ല.',
    isScreening: false,
    scoringGuide: {
      0: 'Absent',
      1: 'Occasional',
      2: 'Frequent',
      3: 'Constant or not redirectable'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: 'ഇടയ്ക്കിടെ',
      2: 'പലപ്പോഴും',
      3: 'സ്ഥിരം അല്ലെങ്കിൽ തിരിച്ചുവിടാൻ കഴിയാത്തത്'
    }
  },
  {
    id: 'automaticObedience',
    number: 16,
    name: 'Automatic Obedience',
    nameMl: 'സ്വയമേവ അനുസരണം',
    description: 'Exaggerated cooperation with examiner\'s request or spontaneous continuation of movement requested.',
    descriptionMl: 'പരിശോധകന്റെ അഭ്യർത്ഥനയോടുള്ള അമിതമായ സഹകരണം അല്ലെങ്കിൽ അഭ്യർത്ഥിച്ച ചലനത്തിന്റെ സ്വയമേവ തുടർച്ച.',
    isScreening: false,
    scoringGuide: {
      0: 'Absent',
      1: 'Occasional',
      2: 'Frequent',
      3: 'Constant'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: 'ഇടയ്ക്കിടെ',
      2: 'പലപ്പോഴും',
      3: 'സ്ഥിരം'
    }
  },
  {
    id: 'mitgehen',
    number: 17,
    name: 'Mitgehen',
    nameMl: 'മിറ്റ്ഗെഹെൻ',
    description: '"Anglepoise lamp" arm raising in response to light pressure of finger, despite instructions to the contrary.',
    descriptionMl: 'വിപരീത നിർദ്ദേശങ്ങൾ ഉണ്ടായിരുന്നിട്ടും, വിരലിന്റെ നേരിയ സമ്മർദ്ദത്തിന് പ്രതികരിച്ച് "ആംഗിൾപോയിസ് ലാമ്പ്" കൈ ഉയർത്തൽ.',
    isScreening: false,
    scoringGuide: {
      0: 'Absent',
      1: '',
      2: '',
      3: 'Present'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: '',
      2: '',
      3: 'ഉണ്ട്'
    }
  },
  {
    id: 'gegenhalten',
    number: 18,
    name: 'Gegenhalten',
    nameMl: 'ഗെഗൻഹാൾട്ടൻ',
    description: 'Resistance to passive movement which is proportional to strength of the stimulus; appears automatic rather than willful.',
    descriptionMl: 'ഉത്തേജനത്തിന്റെ ശക്തിക്ക് ആനുപാതികമായി നിഷ്ക്രിയ ചലനത്തോടുള്ള പ്രതിരോധം; ഇഷ്ടപൂർവ്വമല്ല, സ്വയമേവയാണെന്ന് തോന്നുന്നു.',
    isScreening: false,
    scoringGuide: {
      0: 'Absent',
      1: '',
      2: '',
      3: 'Present'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: '',
      2: '',
      3: 'ഉണ്ട്'
    }
  },
  {
    id: 'ambitendency',
    number: 19,
    name: 'Ambitendency',
    nameMl: 'ആംബിറ്റെൻഡൻസി',
    description: 'Patient appears motorically "stuck" in indecisive, hesitant movement.',
    descriptionMl: 'രോഗി തീരുമാനമെടുക്കാത്ത, മടിച്ചുനിൽക്കുന്ന ചലനത്തിൽ മോട്ടോറിക്കായി "കുടുങ്ങി" നിൽക്കുന്നതായി കാണപ്പെടുന്നു.',
    isScreening: false,
    scoringGuide: {
      0: 'Absent',
      1: '',
      2: '',
      3: 'Present'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: '',
      2: '',
      3: 'ഉണ്ട്'
    }
  },
  {
    id: 'grasp',
    number: 20,
    name: 'Grasp Reflex',
    nameMl: 'ഗ്രാസ്പ് റിഫ്ലെക്സ്',
    description: 'Per neurological examination.',
    descriptionMl: 'ന്യൂറോളജിക്കൽ പരിശോധന അനുസരിച്ച്.',
    isScreening: false,
    scoringGuide: {
      0: 'Absent',
      1: '',
      2: '',
      3: 'Present'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: '',
      2: '',
      3: 'ഉണ്ട്'
    }
  },
  {
    id: 'perseveration',
    number: 21,
    name: 'Perseveration',
    nameMl: 'പെർസിവറേഷൻ',
    description: 'Repeatedly returns to same topic or persists with movement.',
    descriptionMl: 'ഒരേ വിഷയത്തിലേക്ക് ആവർത്തിച്ച് മടങ്ങുന്നു അല്ലെങ്കിൽ ചലനത്തിൽ നിലനിൽക്കുന്നു.',
    isScreening: false,
    scoringGuide: {
      0: 'Absent',
      1: 'Occasional',
      2: 'Frequent',
      3: 'Constant'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: 'ഇടയ്ക്കിടെ',
      2: 'പലപ്പോഴും',
      3: 'സ്ഥിരം'
    }
  },
  {
    id: 'combativeness',
    number: 22,
    name: 'Combativeness',
    nameMl: 'യുദ്ധക്കാരൻ',
    description: 'Usually in an undirected manner, without explanation. Distinguish from purposeful aggression.',
    descriptionMl: 'സാധാരണയായി ഒരു ദിശയില്ലാത്ത രീതിയിൽ, വിശദീകരണമില്ലാതെ. ഉദ്ദേശ്യപൂർണ്ണമായ ആക്രമണത്തിൽ നിന്ന് വേർതിരിച്ചറിയുക.',
    isScreening: false,
    scoringGuide: {
      0: 'Absent',
      1: 'Occasionally strikes out, low risk of injury',
      2: 'Frequently strikes out, moderate risk of injury',
      3: 'Grave danger to others'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: 'ഇടയ്ക്കിടെ അടിക്കുന്നു, പരിക്കിന്റെ കുറഞ്ഞ അപകടസാധ്യത',
      2: 'പലപ്പോഴും അടിക്കുന്നു, പരിക്കിന്റെ മിതമായ അപകടസാധ്യത',
      3: 'മറ്റുള്ളവർക്ക് ഗുരുതരമായ അപകടം'
    }
  },
  {
    id: 'autonomic',
    number: 23,
    name: 'Autonomic Abnormality',
    nameMl: 'ഓട്ടോണോമിക് അസാധാരണത്വം',
    description: 'Temperature, blood pressure, pulse, respiratory rate, and diaphoresis.',
    descriptionMl: 'താപനില, രക്തസമ്മർദ്ദം, പൾസ്, ശ്വസന നിരക്ക്, ഡയഫോറെസിസ്.',
    isScreening: false,
    scoringGuide: {
      0: 'Absent',
      1: 'Abnormality of one parameter (exclude pre-existing hypertension)',
      2: 'Abnormality of two parameters',
      3: 'Abnormality of three or more parameters'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: 'ഒരു പാരാമീറ്ററിന്റെ അസാധാരണത (മുൻകൂട്ടിയുള്ള ഉയർന്ന രക്തസമ്മർദ്ദം ഒഴിവാക്കുക)',
      2: 'രണ്ട് പാരാമീറ്ററുകളുടെ അസാധാരണത',
      3: 'മൂന്നോ അതിലധികമോ പാരാമീറ്ററുകളുടെ അസാധാരണത'
    }
  }
];

export const CATATONIA_RESPONSE_OPTIONS = [
  { value: 0, label: '0', labelMl: '0' },
  { value: 1, label: '1', labelMl: '1' },
  { value: 2, label: '2', labelMl: '2' },
  { value: 3, label: '3', labelMl: '3' }
];
