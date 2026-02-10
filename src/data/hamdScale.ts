import { HamdItem } from '@/types/hamd';

export const HAMD_ITEMS: HamdItem[] = [
  {
    id: 1,
    question: "Depressed Mood (sadness, hopeless, helpless, worthless)",
    questionMl: "വിഷാദ മാനസികാവസ്ഥ (സങ്കടം, നിരാശ, അസഹായത, വിലയില്ലായ്മ)",
    maxScore: 4,
    options: [
      "Absent",
      "Indicated only on questioning",
      "Spontaneously reported verbally",
      "Communicated non-verbally (facial expression, posture, voice, tendency to weep)",
      "Patient reports virtually only these feeling states in spontaneous verbal and non-verbal communication"
    ],
    optionsMl: [
      "ഇല്ല",
      "ചോദിക്കുമ്പോൾ മാത്രം സൂചിപ്പിക്കുന്നു",
      "സ്വയമേവ വാക്കാൽ റിപ്പോർട്ട് ചെയ്യുന്നു",
      "വാക്കില്ലാതെ ആശയവിനിമയം ചെയ്യുന്നു (മുഖഭാവം, ഭാവം, ശബ്ദം, കരയാനുള്ള പ്രവണത)",
      "രോഗി സ്വയമേവയുള്ള വാക്കാലുള്ളതും വാക്കില്ലാത്തതുമായ ആശയവിനിമയത്തിൽ ഈ വികാരാവസ്ഥകൾ മാത്രമേ റിപ്പോർട്ട് ചെയ്യുന്നുള്ളൂ"
    ]
  },
  {
    id: 2,
    question: "Feelings of Guilt",
    questionMl: "കുറ്റബോധം",
    maxScore: 4,
    options: [
      "Absent",
      "Self-reproach, feels has let people down",
      "Ideas of guilt or rumination over past errors or sinful deeds",
      "Present illness is a punishment; delusions of guilt",
      "Hears accusatory or denunciatory voices and/or experiences threatening visual hallucinations"
    ],
    optionsMl: [
      "ഇല്ല",
      "സ്വയം കുറ്റപ്പെടുത്തൽ, ആളുകളെ നിരാശരാക്കിയെന്ന് തോന്നുന്നു",
      "കുറ്റബോധ ആശയങ്ങൾ അല്ലെങ്കിൽ മുൻകാല തെറ്റുകളോ പാപങ്ങളോ ഓർത്ത് ചിന്തിക്കൽ",
      "ഇപ്പോഴത്തെ രോഗം ഒരു ശിക്ഷയാണ്; കുറ്റബോധത്തിന്റെ വ്യാമോഹങ്ങൾ",
      "കുറ്റപ്പെടുത്തുന്ന അല്ലെങ്കിൽ അപലപിക്കുന്ന ശബ്ദങ്ങൾ കേൾക്കുന്നു കൂടാതെ/അല്ലെങ്കിൽ ഭീഷണിപ്പെടുത്തുന്ന ദൃശ്യ ഭ്രമാത്മകതകൾ അനുഭവിക്കുന്നു"
    ]
  },
  {
    id: 3,
    question: "Suicide",
    questionMl: "ആത്മഹത്യ",
    maxScore: 4,
    options: [
      "Absent",
      "Feels life is not worth living",
      "Wishes to be dead or any thoughts of possible death to self",
      "Suicide ideas or gesture",
      "Attempts at suicide"
    ],
    optionsMl: [
      "ഇല്ല",
      "ജീവിതം വിലമതിക്കുന്നില്ലെന്ന് തോന്നുന്നു",
      "മരിക്കാൻ ആഗ്രഹിക്കുന്നു അല്ലെങ്കിൽ സ്വയം മരണം സംഭവിക്കാനുള്ള ചിന്തകൾ",
      "ആത്മഹത്യാ ആശയങ്ങൾ അല്ലെങ്കിൽ ആംഗ്യങ്ങൾ",
      "ആത്മഹത്യാ ശ്രമങ്ങൾ"
    ]
  },
  {
    id: 4,
    question: "Insomnia - Early in the night",
    questionMl: "ഉറക്കമില്ലായ്മ - രാത്രി തുടക്കത്തിൽ",
    maxScore: 2,
    options: [
      "No difficulty falling asleep",
      "Complains of occasional difficulty falling asleep (more than 30 minutes)",
      "Complains of nightly difficulty falling asleep"
    ],
    optionsMl: [
      "ഉറങ്ങാൻ ബുദ്ധിമുട്ടില്ല",
      "ഇടയ്ക്കിടെ ഉറങ്ങാൻ ബുദ്ധിമുട്ട് (30 മിനിറ്റിൽ കൂടുതൽ)",
      "എല്ലാ രാത്രിയും ഉറങ്ങാൻ ബുദ്ധിമുട്ട്"
    ]
  },
  {
    id: 5,
    question: "Insomnia - Middle of the night",
    questionMl: "ഉറക്കമില്ലായ്മ - രാത്രി മധ്യത്തിൽ",
    maxScore: 2,
    options: [
      "No difficulty",
      "Restless and disturbed during the night",
      "Wakes during the night (gets out of bed)"
    ],
    optionsMl: [
      "ബുദ്ധിമുട്ടില്ല",
      "രാത്രിയിൽ അസ്വസ്ഥതയും അസ്വസ്ഥതയും",
      "രാത്രിയിൽ ഉണരുന്നു (കിടക്കയിൽ നിന്ന് എഴുന്നേൽക്കുന്നു)"
    ]
  },
  {
    id: 6,
    question: "Insomnia - Early hours of the morning",
    questionMl: "ഉറക്കമില്ലായ്മ - പ്രഭാത നേരത്തെ",
    maxScore: 2,
    options: [
      "No difficulty",
      "Wakes in early hours but goes back to sleep",
      "Unable to fall asleep again if gets out of bed"
    ],
    optionsMl: [
      "ബുദ്ധിമുട്ടില്ല",
      "നേരത്തെ ഉണരുന്നു പക്ഷേ വീണ്ടും ഉറങ്ങുന്നു",
      "കിടക്കയിൽ നിന്ന് എഴുന്നേറ്റാൽ വീണ്ടും ഉറങ്ങാൻ കഴിയില്ല"
    ]
  },
  {
    id: 7,
    question: "Work and Activities",
    questionMl: "ജോലിയും പ്രവർത്തനങ്ങളും",
    maxScore: 4,
    options: [
      "No difficulty",
      "Thoughts and feelings of incapacity related to activities, work or hobbies",
      "Loss of interest in activity, hobbies or work",
      "Decrease in actual time spent or decrease in productivity",
      "Stopped working because of present illness"
    ],
    optionsMl: [
      "ബുദ്ധിമുട്ടില്ല",
      "പ്രവർത്തനങ്ങൾ, ജോലി അല്ലെങ്കിൽ ഹോബികളുമായി ബന്ധപ്പെട്ട കഴിവില്ലായ്മയുടെ ചിന്തകളും വികാരങ്ങളും",
      "പ്രവർത്തനം, ഹോബികൾ അല്ലെങ്കിൽ ജോലിയിൽ താൽപ്പര്യം നഷ്ടം",
      "യഥാർത്ഥ സമയം ചെലവഴിക്കുന്നതിൽ കുറവ് അല്ലെങ്കിൽ ഉൽപ്പാദനക്ഷമതയിൽ കുറവ്",
      "ഇപ്പോഴത്തെ രോഗം കാരണം ജോലി നിർത്തി"
    ]
  },
  {
    id: 8,
    question: "Retardation (slowness of thought and speech, impaired concentration, decreased motor activity)",
    questionMl: "മന്ദത (ചിന്തയുടെയും സംസാരത്തിന്റെയും മന്ദത, ശ്രദ്ധ കുറവ്, ചലന പ്രവർത്തനം കുറവ്)",
    maxScore: 4,
    options: [
      "Normal speech and thought",
      "Slight retardation during the interview",
      "Obvious retardation during the interview",
      "Interview difficult",
      "Complete stupor"
    ],
    optionsMl: [
      "സാധാരണ സംസാരവും ചിന്തയും",
      "അഭിമുഖത്തിൽ ചെറിയ മന്ദത",
      "അഭിമുഖത്തിൽ വ്യക്തമായ മന്ദത",
      "അഭിമുഖം ബുദ്ധിമുട്ടുള്ളത്",
      "പൂർണ്ണ മരവിപ്പ്"
    ]
  },
  {
    id: 9,
    question: "Agitation",
    questionMl: "അസ്വസ്ഥത",
    maxScore: 4,
    options: [
      "None",
      "Fidgetiness",
      "Playing with hands, hair, etc.",
      "Moving about, can't sit still",
      "Hand wringing, nail biting, hair-pulling, biting of lips"
    ],
    optionsMl: [
      "ഇല്ല",
      "അസ്വസ്ഥത",
      "കൈകൾ, മുടി മുതലായവയിൽ കളിക്കുന്നു",
      "നടന്നുതിരിയുന്നു, നിശ്ചലമായി ഇരിക്കാൻ കഴിയില്ല",
      "കൈ ചുരുട്ടൽ, നഖം കടിക്കൽ, മുടി വലിക്കൽ, ചുണ്ട് കടിക്കൽ"
    ]
  },
  {
    id: 10,
    question: "Anxiety - Psychic",
    questionMl: "ഉത്കണ്ഠ - മാനസികം",
    maxScore: 4,
    options: [
      "No difficulty",
      "Subjective tension and irritability",
      "Worrying about minor matters",
      "Apprehensive attitude apparent in face or speech",
      "Fears expressed without questioning"
    ],
    optionsMl: [
      "ബുദ്ധിമുട്ടില്ല",
      "ആത്മനിഷ്ഠമായ പിരിമുറുക്കവും പ്രകോപനവും",
      "ചെറിയ കാര്യങ്ങളെക്കുറിച്ച് ആശങ്കപ്പെടുന്നു",
      "മുഖത്തും സംസാരത്തിലും ഭയപ്പെടുത്തുന്ന മനോഭാവം",
      "ചോദ്യം ചെയ്യാതെ പ്രകടിപ്പിക്കുന്ന ഭയങ്ങൾ"
    ]
  },
  {
    id: 11,
    question: "Anxiety - Somatic (gastrointestinal, cardiovascular, respiratory, urinary symptoms)",
    questionMl: "ഉത്കണ്ഠ - ശാരീരികം (ദഹന, ഹൃദയ, ശ്വസന, മൂത്രാശയ ലക്ഷണങ്ങൾ)",
    maxScore: 4,
    options: [
      "Absent",
      "Mild",
      "Moderate",
      "Severe",
      "Incapacitating"
    ],
    optionsMl: [
      "ഇല്ല",
      "മൃദുവായ",
      "മധ്യമം",
      "കഠിനം",
      "കഴിവില്ലാതാക്കുന്നത്"
    ]
  },
  {
    id: 12,
    question: "Somatic Symptoms - Gastrointestinal",
    questionMl: "ശാരീരിക ലക്ഷണങ്ങൾ - ദഹനവ്യവസ്ഥ",
    maxScore: 2,
    options: [
      "None",
      "Loss of appetite, but eating without encouragement; heavy feelings in abdomen",
      "Difficulty eating without urging; requests or requires medication for bowels or gastrointestinal symptoms"
    ],
    optionsMl: [
      "ഇല്ല",
      "വിശപ്പില്ലായ്മ, പക്ഷേ പ്രോത്സാഹനമില്ലാതെ കഴിക്കുന്നു; വയറ്റിൽ ഭാരം",
      "പ്രേരണയില്ലാതെ ഭക്ഷണം കഴിക്കാൻ ബുദ്ധിമുട്ട്; കുടൽ അല്ലെങ്കിൽ ദഹന ലക്ഷണങ്ങൾക്കുള്ള മരുന്ന് ആവശ്യപ്പെടുന്നു"
    ]
  },
  {
    id: 13,
    question: "Somatic Symptoms - General",
    questionMl: "ശാരീരിക ലക്ഷണങ്ങൾ - പൊതുവായത്",
    maxScore: 2,
    options: [
      "None",
      "Heaviness in limbs, back or head; backaches, headaches, muscle aches; loss of energy, fatigability",
      "Any clear-cut symptom"
    ],
    optionsMl: [
      "ഇല്ല",
      "കൈകാലുകൾ, പുറം അല്ലെങ്കിൽ തലയിൽ ഭാരം; നടുവേദന, തലവേദന, പേശീ വേദന; ഊർജ്ജം നഷ്ടം, തളർച്ച",
      "ഏതെങ്കിലും വ്യക്തമായ ലക്ഷണം"
    ]
  },
  {
    id: 14,
    question: "Genital Symptoms (loss of libido, menstrual disturbances)",
    questionMl: "ലൈംഗിക ലക്ഷണങ്ങൾ (ലിബിഡോ നഷ്ടം, ആർത്തവ അസ്വസ്ഥതകൾ)",
    maxScore: 2,
    options: [
      "Absent",
      "Mild",
      "Severe"
    ],
    optionsMl: [
      "ഇല്ല",
      "മൃദുവായ",
      "കഠിനം"
    ]
  },
  {
    id: 15,
    question: "Hypochondriasis",
    questionMl: "ഹൈപ്പോകോൺഡ്രിയാസിസ് (രോഗഭയം)",
    maxScore: 4,
    options: [
      "Not present",
      "Self-absorption (bodily)",
      "Preoccupation with health",
      "Frequent complaints, requests for help, etc.",
      "Hypochondriacal delusions"
    ],
    optionsMl: [
      "ഇല്ല",
      "സ്വയം-ആഗിരണം (ശാരീരികം)",
      "ആരോഗ്യത്തെക്കുറിച്ചുള്ള ആശങ്ക",
      "പതിവായുള്ള പരാതികൾ, സഹായത്തിനുള്ള അഭ്യർത്ഥനകൾ മുതലായവ",
      "ഹൈപ്പോകോൺഡ്രിയാക്കൽ വ്യാമോഹങ്ങൾ"
    ]
  },
  {
    id: 16,
    question: "Loss of Weight (Rate either A or B)",
    questionMl: "ശരീരഭാരം നഷ്ടം (A അല്ലെങ്കിൽ B റേറ്റ് ചെയ്യുക)",
    maxScore: 2,
    options: [
      "No weight loss",
      "Probable weight loss associated with present illness",
      "Definite weight loss (according to patient)"
    ],
    optionsMl: [
      "ശരീരഭാരം നഷ്ടപ്പെട്ടിട്ടില്ല",
      "ഇപ്പോഴത്തെ രോഗവുമായി ബന്ധപ്പെട്ട് ശരീരഭാരം നഷ്ടപ്പെട്ടേക്കാം",
      "നിശ്ചിത ശരീരഭാരം നഷ്ടം (രോഗി പറയുന്നത് അനുസരിച്ച്)"
    ]
  },
  {
    id: 17,
    question: "Insight",
    questionMl: "ഉൾക്കാഴ്ച",
    maxScore: 2,
    options: [
      "Acknowledges being depressed and ill",
      "Acknowledges illness but attributes cause to bad food, overwork, virus, need for rest, etc.",
      "Denies being ill at all"
    ],
    optionsMl: [
      "വിഷാദവും രോഗവും ഉണ്ടെന്ന് അംഗീകരിക്കുന്നു",
      "രോഗം അംഗീകരിക്കുന്നു പക്ഷേ കാരണം ചീത്ത ഭക്ഷണം, അമിത ജോലി, വൈറസ്, വിശ്രമം ആവശ്യം മുതലായവയെന്ന് പറയുന്നു",
      "രോഗം ഇല്ലെന്ന് നിഷേധിക്കുന്നു"
    ]
  }
];
