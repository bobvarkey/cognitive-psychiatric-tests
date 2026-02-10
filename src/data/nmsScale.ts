import { NmsItem } from '@/types/nms';

export const NMS_REFERENCE = {
  citation: 'Sachdev P. A rating scale for neuroleptic malignant syndrome. Psychiatry Research. 2005;135:249-256.',
  citationMl: 'Sachdev P. ന്യൂറോലെപ്റ്റിക് മാലിഗ്നന്റ് സിൻഡ്രോമിനുള്ള റേറ്റിംഗ് സ്കെയിൽ. Psychiatry Research. 2005;135:249-256.',
  doi: '10.1016/j.psychres.2005.05.001'
};

export const NMS_DIAGNOSTIC_CRITERIA = {
  noNms: {
    range: '0-4',
    label: 'No NMS',
    labelMl: 'NMS ഇല്ല',
    description: 'Score 0-4: No evidence of Neuroleptic Malignant Syndrome',
    descriptionMl: 'സ്കോർ 0-4: ന്യൂറോലെപ്റ്റിക് മാലിഗ്നന്റ് സിൻഡ്രോമിന്റെ തെളിവില്ല'
  },
  possibleNms: {
    range: '5-8',
    label: 'Possible NMS',
    labelMl: 'സാധ്യതയുള്ള NMS',
    description: 'Score 5-8: Features suggestive of possible NMS. Close monitoring recommended.',
    descriptionMl: 'സ്കോർ 5-8: സാധ്യതയുള്ള NMS-നെ സൂചിപ്പിക്കുന്ന സവിശേഷതകൾ. സൂക്ഷ്മ നിരീക്ഷണം ശുപാർശ ചെയ്യുന്നു.'
  },
  definiteNms: {
    range: '>8',
    label: 'Definite NMS',
    labelMl: 'നിശ്ചിത NMS',
    description: 'Score >8: Strong evidence of Neuroleptic Malignant Syndrome. If score ≥2 in at least 3 domains, and alternative explanations (encephalitis, hyperthermia from other causes) are lacking, diagnosis is strongly supported.',
    descriptionMl: 'സ്കോർ >8: ന്യൂറോലെപ്റ്റിക് മാലിഗ്നന്റ് സിൻഡ്രോമിന്റെ ശക്തമായ തെളിവ്. കുറഞ്ഞത് 3 ഡൊമെയ്‌നുകളിൽ സ്കോർ ≥2 ഉണ്ടെങ്കിൽ, ബദൽ വിശദീകരണങ്ങൾ (എൻസെഫലൈറ്റിസ്, മറ്റ് കാരണങ്ങളിൽ നിന്നുള്ള ഹൈപ്പർതെർമിയ) ഇല്ലെങ്കിൽ, രോഗനിർണയം ശക്തമായി പിന്തുണയ്ക്കപ്പെടുന്നു.'
  }
};

export const NMS_CLINICAL_NOTES = {
  purpose: {
    en: 'This scale is designed to rate the severity of NMS once a clinical diagnosis has been made, not to diagnose NMS.',
    ml: 'ക്ലിനിക്കൽ രോഗനിർണയം നടത്തിയ ശേഷം NMS-ന്റെ തീവ്രത വിലയിരുത്താനാണ് ഈ സ്കെയിൽ രൂപകൽപ്പന ചെയ്തിരിക്കുന്നത്, NMS രോഗനിർണയം നടത്താനല്ല.'
  },
  serialMonitoring: {
    en: 'This scale can be used to assess serial changes in NMS over time, allowing clinicians to track disease progression or improvement with treatment.',
    ml: 'കാലക്രമേണ NMS-ലെ തുടർച്ചയായ മാറ്റങ്ങൾ വിലയിരുത്താൻ ഈ സ്കെയിൽ ഉപയോഗിക്കാം, ചികിത്സയോടെ രോഗ പുരോഗതിയോ മെച്ചപ്പെടലോ ട്രാക്ക് ചെയ്യാൻ ക്ലിനിഷ്യൻമാരെ അനുവദിക്കുന്നു.'
  },
  diagnosticSupport: {
    en: 'If the clinician suspects NMS and alternative explanations (encephalitis, hyperthermia from other causes, etc.) are lacking, a scale score >8 with a score of ≥2 in at least 3 domains is strongly supportive of the clinical diagnosis.',
    ml: 'ക്ലിനിഷ്യൻ NMS സംശയിക്കുകയും ബദൽ വിശദീകരണങ്ങൾ (എൻസെഫലൈറ്റിസ്, മറ്റ് കാരണങ്ങളിൽ നിന്നുള്ള ഹൈപ്പർതെർമിയ മുതലായവ) ഇല്ലെങ്കിലും, കുറഞ്ഞത് 3 ഡൊമെയ്‌നുകളിൽ ≥2 സ്കോറോടെ >8 സ്കെയിൽ സ്കോർ ക്ലിനിക്കൽ രോഗനിർണയത്തെ ശക്തമായി പിന്തുണയ്ക്കുന്നു.'
  }
};

export const NMS_ITEMS: NmsItem[] = [
  // Temperature
  {
    id: 'oralTemperature',
    name: 'Oral Temperature',
    nameMl: 'വായിലെ താപനില',
    description: 'Fever is rated positive if idiopathic and part of NMS. Rate "0" if another cause (e.g., infection). Use highest temp in 24h. Add 0.2°C to axillary, subtract 0.5°C from rectal.',
    descriptionMl: 'പനി NMS-ന്റെ ഭാഗമായി ഇഡിയോപാത്തിക് ആണെങ്കിൽ പോസിറ്റീവ് ആയി റേറ്റ് ചെയ്യുക. മറ്റൊരു കാരണം ഉണ്ടെങ്കിൽ "0" റേറ്റ് ചെയ്യുക. 24 മണിക്കൂറിലെ ഏറ്റവും ഉയർന്ന താപനില ഉപയോഗിക്കുക.',
    category: 'temperature',
    maxScore: 6,
    scoringGuide: {
      0: '<37°C',
      1: '37.0-37.4°C',
      2: '37.5-37.9°C',
      3: '38.0-38.9°C',
      4: '39.0-39.9°C',
      5: '40.0-41.9°C',
      6: '≥42°C'
    },
    scoringGuideMl: {
      0: '<37°C',
      1: '37.0-37.4°C',
      2: '37.5-37.9°C',
      3: '38.0-38.9°C',
      4: '39.0-39.9°C',
      5: '40.0-41.9°C',
      6: '≥42°C'
    }
  },
  // Extrapyramidal symptoms
  {
    id: 'rigidity',
    name: 'Rigidity',
    nameMl: 'കടുപ്പം',
    description: 'Assess in flexor muscles of wrist/elbow and neck rotation by passive movement with/without recruitment.',
    descriptionMl: 'കൈത്തണ്ട/കൈമുട്ടിലെ ഫ്ലെക്സർ പേശികളിലും കഴുത്ത് ഭ്രമണത്തിലും പാസീവ് ചലനത്തിലൂടെ വിലയിരുത്തുക.',
    category: 'extrapyramidal',
    maxScore: 3,
    scoringGuide: {
      0: 'Nil - No rigidity',
      1: 'Mild - Slight rigidity, obvious on recruitment with jaw clenching',
      2: 'Moderate - Definitely present, no limitation of passive movement',
      3: 'Severe - Produces some limitation of passive movement'
    },
    scoringGuideMl: {
      0: 'ഇല്ല - കടുപ്പമില്ല',
      1: 'നേരിയത് - ചെറിയ കടുപ്പം, താടി അമർത്തുമ്പോൾ വ്യക്തമാകുന്നു',
      2: 'മിതമായത് - തീർച്ചയായും ഉണ്ട്, പാസീവ് ചലനത്തിന് തടസ്സമില്ല',
      3: 'കഠിനം - പാസീവ് ചലനത്തിന് കുറച്ച് പരിമിതി ഉണ്ടാക്കുന്നു'
    }
  },
  {
    id: 'dysphagia',
    name: 'Dysphagia',
    nameMl: 'വിഴുങ്ങാൻ ബുദ്ധിമുട്ട്',
    description: 'Present when patient complains of difficulty swallowing or nursing observation suggests this. Drooling of saliva may indicate.',
    descriptionMl: 'രോഗി വിഴുങ്ങാൻ ബുദ്ധിമുട്ട് പരാതിപ്പെടുമ്പോൾ അല്ലെങ്കിൽ നഴ്സിംഗ് നിരീക്ഷണം ഇത് സൂചിപ്പിക്കുമ്പോൾ ഉണ്ട്.',
    category: 'extrapyramidal',
    maxScore: 1,
    scoringGuide: {
      0: 'Absent',
      1: 'Present'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: 'ഉണ്ട്'
    }
  },
  {
    id: 'restingTremor',
    name: 'Resting Tremor',
    nameMl: 'വിശ്രമ വിറയൽ',
    description: 'Observe with arms supported. Medium frequency tremor, may have pill-rolling quality. Rate positive if cog-wheeling present.',
    descriptionMl: 'കൈകൾ താങ്ങിയിരിക്കുമ്പോൾ നിരീക്ഷിക്കുക. ഇടത്തരം ആവൃത്തിയുള്ള വിറയൽ, ഗുളിക ഉരുട്ടുന്ന ഗുണമുണ്ടാകാം.',
    category: 'extrapyramidal',
    maxScore: 2,
    scoringGuide: {
      0: 'No tremor',
      1: 'Present intermittently and/or unilaterally',
      2: 'Prominent bilateral resting tremor'
    },
    scoringGuideMl: {
      0: 'വിറയലില്ല',
      1: 'ഇടയ്ക്കിടെ കൂടാതെ/അല്ലെങ്കിൽ ഒരു വശത്ത് മാത്രം',
      2: 'രണ്ട് വശത്തും പ്രമുഖമായ വിശ്രമ വിറയൽ'
    }
  },
  // Autonomic instability
  {
    id: 'systolicBP',
    name: 'Systolic BP Rise',
    nameMl: 'സിസ്റ്റോളിക് BP ഉയർച്ച',
    description: '≥30mm above baseline (or ≥150mm if no baseline available)',
    descriptionMl: 'ബേസ്‌ലൈനിന് ≥30mm മുകളിൽ (അല്ലെങ്കിൽ ബേസ്‌ലൈൻ ലഭ്യമല്ലെങ്കിൽ ≥150mm)',
    category: 'autonomic',
    maxScore: 1,
    scoringGuide: { 0: 'Absent', 1: 'Present' },
    scoringGuideMl: { 0: 'ഇല്ല', 1: 'ഉണ്ട്' }
  },
  {
    id: 'diastolicBP',
    name: 'Diastolic BP Rise',
    nameMl: 'ഡയസ്റ്റോളിക് BP ഉയർച്ച',
    description: '≥20mm above baseline (or ≥100mm if no baseline available)',
    descriptionMl: 'ബേസ്‌ലൈനിന് ≥20mm മുകളിൽ (അല്ലെങ്കിൽ ബേസ്‌ലൈൻ ലഭ്യമല്ലെങ്കിൽ ≥100mm)',
    category: 'autonomic',
    maxScore: 1,
    scoringGuide: { 0: 'Absent', 1: 'Present' },
    scoringGuideMl: { 0: 'ഇല്ല', 1: 'ഉണ്ട്' }
  },
  {
    id: 'tachycardia',
    name: 'Tachycardia',
    nameMl: 'ടാക്കികാർഡിയ',
    description: 'Heart rate ≥30/min above baseline (or ≥100 if no baseline available)',
    descriptionMl: 'ഹൃദയമിടിപ്പ് ബേസ്‌ലൈനിന് ≥30/മിനിറ്റ് മുകളിൽ (അല്ലെങ്കിൽ ബേസ്‌ലൈൻ ലഭ്യമല്ലെങ്കിൽ ≥100)',
    category: 'autonomic',
    maxScore: 1,
    scoringGuide: { 0: 'Absent', 1: 'Present' },
    scoringGuideMl: { 0: 'ഇല്ല', 1: 'ഉണ്ട്' }
  },
  {
    id: 'diaphoresis',
    name: 'Diaphoresis',
    nameMl: 'വിയർപ്പ്',
    description: 'Profuse sweating not accounted for by ambient temperature or analgesic use',
    descriptionMl: 'പരിസ്ഥിതി താപനില അല്ലെങ്കിൽ വേദനസംഹാരി ഉപയോഗം കൊണ്ട് വിശദീകരിക്കാത്ത അമിത വിയർപ്പ്',
    category: 'autonomic',
    maxScore: 1,
    scoringGuide: { 0: 'Absent', 1: 'Present' },
    scoringGuideMl: { 0: 'ഇല്ല', 1: 'ഉണ്ട്' }
  },
  {
    id: 'incontinence',
    name: 'Incontinence',
    nameMl: 'അസന്ധാരണത',
    description: 'Fecal or urinary incontinence not accounted for by altered consciousness or catatonia',
    descriptionMl: 'മാറ്റപ്പെട്ട ബോധമോ കാറ്റടോണിയയോ കൊണ്ട് വിശദീകരിക്കാത്ത മലമൂത്ര അസന്ധാരണത',
    category: 'autonomic',
    maxScore: 1,
    scoringGuide: { 0: 'Absent', 1: 'Present' },
    scoringGuideMl: { 0: 'ഇല്ല', 1: 'ഉണ്ട്' }
  },
  {
    id: 'tachypnea',
    name: 'Tachypnea',
    nameMl: 'ടാക്കിപ്നിയ',
    description: 'Respiratory rate ≥15/min above baseline (or ≥40/min if baseline not available)',
    descriptionMl: 'ശ്വസന നിരക്ക് ബേസ്‌ലൈനിന് ≥15/മിനിറ്റ് മുകളിൽ (അല്ലെങ്കിൽ ബേസ്‌ലൈൻ ലഭ്യമല്ലെങ്കിൽ ≥40/മിനിറ്റ്)',
    category: 'autonomic',
    maxScore: 1,
    scoringGuide: { 0: 'Absent', 1: 'Present' },
    scoringGuideMl: { 0: 'ഇല്ല', 1: 'ഉണ്ട്' }
  },
  // Altered consciousness
  {
    id: 'alteredConsciousness',
    name: 'Altered Consciousness',
    nameMl: 'മാറ്റപ്പെട്ട ബോധം',
    description: 'Rate altered consciousness level. Rate "0" if no alteration or explained by other causes.',
    descriptionMl: 'മാറ്റപ്പെട്ട ബോധ നില റേറ്റ് ചെയ്യുക. മാറ്റമില്ലെങ്കിലോ മറ്റ് കാരണങ്ങളാൽ വിശദീകരിക്കാമെങ്കിലോ "0" റേറ്റ് ചെയ്യുക.',
    category: 'consciousness',
    maxScore: 6,
    scoringGuide: {
      0: 'No alteration or explained by other causes',
      1: 'Perplexity obvious but fully oriented',
      2: 'Mild disorientation in time or place',
      3: 'Fluctuating consciousness with periods of normality',
      4: 'Sustained delirium (clinical or abnormal EEG)',
      5: 'Stuporose - responds to painful stimuli',
      6: 'Comatose - totally unresponsive'
    },
    scoringGuideMl: {
      0: 'മാറ്റമില്ല അല്ലെങ്കിൽ മറ്റ് കാരണങ്ങളാൽ വിശദീകരിക്കാം',
      1: 'ആശയക്കുഴപ്പം വ്യക്തം പക്ഷേ പൂർണ്ണമായി ഓറിയന്റഡ്',
      2: 'സമയത്തിലോ സ്ഥലത്തിലോ നേരിയ ഡിസ്ഓറിയന്റേഷൻ',
      3: 'സാധാരണ കാലഘട്ടങ്ങളുള്ള ചാഞ്ചാട്ട ബോധം',
      4: 'നിലനിൽക്കുന്ന ഡെലിരിയം (ക്ലിനിക്കൽ അല്ലെങ്കിൽ അസാധാരണ EEG)',
      5: 'സ്റ്റുപറോസ് - വേദനാജനകമായ ഉത്തേജനങ്ങളോട് പ്രതികരിക്കുന്നു',
      6: 'കോമ - പൂർണ്ണമായും പ്രതികരിക്കുന്നില്ല'
    }
  },
  // Catatonia/movement disorder
  {
    id: 'posturing',
    name: 'Posturing',
    nameMl: 'പോസ്ചറിംഗ്',
    description: 'Unexplained maintenance of abnormal posture for prolonged period. Rate "0" if present before neuroleptic use.',
    descriptionMl: 'ദീർഘകാലത്തേക്ക് അസാധാരണ ഭാവത്തിന്റെ വിശദീകരിക്കാനാകാത്ത നിലനിർത്തൽ.',
    category: 'catatonia',
    maxScore: 1,
    scoringGuide: { 0: 'Absent', 1: 'Present' },
    scoringGuideMl: { 0: 'ഇല്ല', 1: 'ഉണ്ട്' }
  },
  {
    id: 'povertyOfSpeech',
    name: 'Poverty of Speech',
    nameMl: 'സംസാര ദാരിദ്ര്യം',
    description: 'Reduction of spontaneous and responsive speech developed following NMS onset.',
    descriptionMl: 'NMS ആരംഭത്തിനു ശേഷം സ്വയമേവയുള്ളതും പ്രതികരണാത്മകവുമായ സംസാരത്തിലെ കുറവ്.',
    category: 'catatonia',
    maxScore: 1,
    scoringGuide: { 0: 'Absent', 1: 'Present' },
    scoringGuideMl: { 0: 'ഇല്ല', 1: 'ഉണ്ട്' }
  },
  {
    id: 'mutism',
    name: 'Mutism',
    nameMl: 'മ്യൂട്ടിസം',
    description: 'Unexplained lack of speech. Rate based on whether intermittent or continuous.',
    descriptionMl: 'വിശദീകരിക്കാനാകാത്ത സംസാരമില്ലായ്മ. ഇടയ്ക്കിടെയോ തുടർച്ചയായോ എന്നതിനെ അടിസ്ഥാനമാക്കി റേറ്റ് ചെയ്യുക.',
    category: 'catatonia',
    maxScore: 2,
    scoringGuide: {
      0: 'Absent',
      1: 'Intermittent mutism',
      2: 'Continuous mutism'
    },
    scoringGuideMl: {
      0: 'ഇല്ല',
      1: 'ഇടയ്ക്കിടെ മ്യൂട്ടിസം',
      2: 'തുടർച്ചയായ മ്യൂട്ടിസം'
    }
  },
  {
    id: 'choreiformMovements',
    name: 'Choreiform Movements',
    nameMl: 'കോറിഫോം ചലനങ്ങൾ',
    description: 'Presence of choreiform movements developed following neuroleptic use.',
    descriptionMl: 'ന്യൂറോലെപ്റ്റിക് ഉപയോഗത്തിന് ശേഷം വികസിച്ച കോറിഫോം ചലനങ്ങളുടെ സാന്നിധ്യം.',
    category: 'catatonia',
    maxScore: 1,
    scoringGuide: { 0: 'Absent', 1: 'Present' },
    scoringGuideMl: { 0: 'ഇല്ല', 1: 'ഉണ്ട്' }
  },
  {
    id: 'dystonia',
    name: 'Dystonia',
    nameMl: 'ഡിസ്റ്റോണിയ',
    description: 'Retrocollis, opisthotonus, trismus, oculogyric crises, etc.',
    descriptionMl: 'റെട്രോകോളിസ്, ഒപിസ്‌തോടോണസ്, ട്രിസ്മസ്, ഓക്യുലോജൈറിക് ക്രൈസിസ് മുതലായവ.',
    category: 'catatonia',
    maxScore: 1,
    scoringGuide: { 0: 'Absent', 1: 'Present' },
    scoringGuideMl: { 0: 'ഇല്ല', 1: 'ഉണ്ട്' }
  },
  // Laboratory investigations
  {
    id: 'ckLevel',
    name: 'CK Level (U/L)',
    nameMl: 'CK ലെവൽ (U/L)',
    description: 'Creatine Kinase level. If IM injection in previous 24 hours, reduce score by 1 for levels 200-1000.',
    descriptionMl: 'ക്രിയാറ്റിൻ കൈനേസ് ലെവൽ. കഴിഞ്ഞ 24 മണിക്കൂറിനുള്ളിൽ IM ഇഞ്ചക്ഷൻ ഉണ്ടെങ്കിൽ, 200-1000 ലെവലുകൾക്ക് സ്കോർ 1 കുറയ്ക്കുക.',
    category: 'laboratory',
    maxScore: 4,
    scoringGuide: {
      0: '<200 U/L',
      1: '200-400 U/L (0 if IM injection in 24h)',
      2: '400-1000 U/L (1 if IM injection in 24h)',
      3: '1000-10000 U/L',
      4: '>10000 U/L'
    },
    scoringGuideMl: {
      0: '<200 U/L',
      1: '200-400 U/L (24 മണിക്കൂറിൽ IM ഇഞ്ചക്ഷൻ ഉണ്ടെങ്കിൽ 0)',
      2: '400-1000 U/L (24 മണിക്കൂറിൽ IM ഇഞ്ചക്ഷൻ ഉണ്ടെങ്കിൽ 1)',
      3: '1000-10000 U/L',
      4: '>10000 U/L'
    }
  },
  {
    id: 'leucocytosis',
    name: 'Leucocytosis',
    nameMl: 'ല്യൂക്കോസൈറ്റോസിസ്',
    description: 'White blood cell count elevation.',
    descriptionMl: 'വെളുത്ത രക്താണുക്കളുടെ എണ്ണം ഉയർച്ച.',
    category: 'laboratory',
    maxScore: 2,
    scoringGuide: {
      0: '<15000',
      1: '15000-30000',
      2: '>30000'
    },
    scoringGuideMl: {
      0: '<15000',
      1: '15000-30000',
      2: '>30000'
    }
  }
];

export const NMS_CATEGORIES = {
  temperature: {
    name: 'Oral Temperature',
    nameMl: 'വായിലെ താപനില',
    maxScore: 6
  },
  extrapyramidal: {
    name: 'Extrapyramidal Symptoms',
    nameMl: 'എക്സ്ട്രാപിരമിഡൽ ലക്ഷണങ്ങൾ',
    maxScore: 6
  },
  autonomic: {
    name: 'Autonomic Instability',
    nameMl: 'ഓട്ടോണോമിക് അസ്ഥിരത',
    maxScore: 6
  },
  consciousness: {
    name: 'Altered Consciousness',
    nameMl: 'മാറ്റപ്പെട്ട ബോധം',
    maxScore: 6
  },
  catatonia: {
    name: 'Catatonia/Movement Disorders',
    nameMl: 'കാറ്റടോണിയ/ചലന വൈകല്യങ്ങൾ',
    maxScore: 6
  },
  laboratory: {
    name: 'Laboratory Investigations',
    nameMl: 'ലബോറട്ടറി പരിശോധനകൾ',
    maxScore: 6
  }
};

export const NMS_SEVERITY_LEVELS = {
  mild: {
    range: '1-12',
    name: 'Mild NMS',
    nameMl: 'നേരിയ NMS',
    description: 'Early or mild NMS features. Close monitoring required.',
    descriptionMl: 'ആദ്യകാല അല്ലെങ്കിൽ നേരിയ NMS സവിശേഷതകൾ. സൂക്ഷ്മ നിരീക്ഷണം ആവശ്യമാണ്.'
  },
  moderate: {
    range: '13-24',
    name: 'Moderate NMS',
    nameMl: 'മിതമായ NMS',
    description: 'Significant NMS features. Immediate intervention needed.',
    descriptionMl: 'പ്രധാനപ്പെട്ട NMS സവിശേഷതകൾ. ഉടനടി ഇടപെടൽ ആവശ്യമാണ്.'
  },
  severe: {
    range: '25-30',
    name: 'Severe NMS',
    nameMl: 'കഠിനമായ NMS',
    description: 'Severe NMS. ICU admission and aggressive treatment required.',
    descriptionMl: 'കഠിനമായ NMS. ഐസിയു അഡ്മിഷനും ആക്രമണാത്മക ചികിത്സയും ആവശ്യമാണ്.'
  },
  critical: {
    range: '>30',
    name: 'Critical NMS',
    nameMl: 'ഗുരുതരമായ NMS',
    description: 'Life-threatening NMS. Maximum supportive care and specific treatments required.',
    descriptionMl: 'ജീവൻ അപകടത്തിലാക്കുന്ന NMS. പരമാവധി പിന്തുണാ പരിചരണവും പ്രത്യേക ചികിത്സകളും ആവശ്യമാണ്.'
  }
};

export const NMS_RECOMMENDATIONS = {
  general: [
    'Stop all neuroleptic medications immediately',
    'Transfer to ICU for close monitoring',
    'Supportive care: IV fluids, cooling measures',
    'Monitor vital signs frequently (every 15-30 minutes)',
    'Serial CK and renal function monitoring',
    'Consider dantrolene sodium (1-2.5 mg/kg IV)',
    'Consider bromocriptine (2.5-10 mg PO/NG TID)',
    'ECT may be considered for refractory cases'
  ],
  generalMl: [
    'എല്ലാ ന്യൂറോലെപ്റ്റിക് മരുന്നുകളും ഉടൻ നിർത്തുക',
    'സൂക്ഷ്മ നിരീക്ഷണത്തിനായി ഐസിയുവിലേക്ക് മാറ്റുക',
    'പിന്തുണാ പരിചരണം: IV ദ്രാവകങ്ങൾ, തണുപ്പിക്കൽ നടപടികൾ',
    'വൈറ്റൽ സൈൻസ് ഇടയ്ക്കിടെ നിരീക്ഷിക്കുക (ഓരോ 15-30 മിനിറ്റിലും)',
    'സീരിയൽ CK, വൃക്ക പ്രവർത്തന നിരീക്ഷണം',
    'ഡാൻട്രോലീൻ സോഡിയം പരിഗണിക്കുക (1-2.5 mg/kg IV)',
    'ബ്രോമോക്രിപ്റ്റിൻ പരിഗണിക്കുക (2.5-10 mg PO/NG TID)',
    'റിഫ്രാക്ടറി കേസുകൾക്ക് ECT പരിഗണിക്കാം'
  ]
};
