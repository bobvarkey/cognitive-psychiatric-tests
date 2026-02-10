import { StressScreeningItem } from '@/types/stressScreening';

export const STRESS_SCREENING_ITEMS: StressScreeningItem[] = [
  // Stressor and Onset
  {
    id: 'no_clear_precipitant',
    category: 'stressor',
    question: 'Symptoms began without a clear identifiable stressor',
    questionMl: 'വ്യക്തമായ കാരണമില്ലാതെ ലക്ഷണങ്ങൾ ആരംഭിച്ചു',
    redFlag: true,
  },
  {
    id: 'symptoms_persist_after_stressor',
    category: 'stressor',
    question: 'Symptoms persist even after the stressor has resolved',
    questionMl: 'സ്ട്രെസ് കാരണം മാറിയിട്ടും ലക്ഷണങ്ങൾ തുടരുന്നു',
    redFlag: true,
  },
  {
    id: 'symptoms_independent_triggers',
    category: 'stressor',
    question: 'Symptoms recur independent of immediate situational triggers',
    questionMl: 'ലക്ഷണങ്ങൾ ഉടനടി സാഹചര്യ ട്രിഗറുകളിൽ നിന്ന് സ്വതന്ത്രമായി ആവർത്തിക്കുന്നു',
    redFlag: true,
  },

  // Duration
  {
    id: 'duration_over_6_months',
    category: 'duration',
    question: 'Symptoms have persisted for more than 6 months (GAD criteria)',
    questionMl: 'ലക്ഷണങ്ങൾ 6 മാസത്തിലധികമായി തുടരുന്നു (GAD മാനദണ്ഡം)',
    redFlag: true,
  },
  {
    id: 'no_improvement_3_months',
    category: 'duration',
    question: 'No improvement despite 3 months since stressor onset',
    questionMl: 'സ്ട്രെസ് തുടങ്ങി 3 മാസമായിട്ടും മെച്ചപ്പെടുന്നില്ല',
    redFlag: true,
  },
  {
    id: 'depression_2_weeks',
    category: 'duration',
    question: 'Low mood or anhedonia lasting ≥2 weeks (MDD criteria)',
    questionMl: 'കുറഞ്ഞ മാനസികാവസ്ഥ അല്ലെങ്കിൽ അൻഹെഡോണിയ ≥2 ആഴ്ച (MDD മാനദണ്ഡം)',
    redFlag: true,
  },
  {
    id: 'mania_1_week',
    category: 'duration',
    question: 'Elevated/irritable mood with increased energy lasting ≥1 week',
    questionMl: 'ഉയർന്ന/ക്ഷോഭകരമായ മാനസികാവസ്ഥ, ≥1 ആഴ്ച നീണ്ടുനിൽക്കുന്ന ഊർജ്ജ വർദ്ധനവ്',
    redFlag: true,
  },
  {
    id: 'ptsd_1_month',
    category: 'duration',
    question: 'Trauma symptoms persisting ≥1 month after the event',
    questionMl: 'സംഭവത്തിന് ശേഷം ≥1 മാസം നീണ്ടുനിൽക്കുന്ന ആഘാത ലക്ഷണങ്ങൾ',
    redFlag: true,
  },

  // Severity - Out of Proportion
  {
    id: 'distress_disproportionate',
    category: 'severity',
    question: 'Distress is markedly out of proportion to the stressor',
    questionMl: 'സ്ട്രെസിന് അനുപാതമല്ലാത്ത വിധം അസ്വസ്ഥത',
    redFlag: true,
  },
  {
    id: 'suicidal_ideation',
    category: 'severity',
    question: 'Suicidal thoughts, self-harm behaviors, or hopelessness',
    questionMl: 'ആത്മഹത്യാ ചിന്തകൾ, സ്വയം ഉപദ്രവം, അല്ലെങ്കിൽ നിരാശ',
    redFlag: true,
  },
  {
    id: 'substance_misuse',
    category: 'severity',
    question: 'New or increased substance use to cope',
    questionMl: 'പ്രശ്നങ്ങളെ നേരിടാൻ പുതിയ അല്ലെങ്കിൽ കൂടുതൽ ലഹരി ഉപയോഗം',
    redFlag: true,
  },
  {
    id: 'lost_coping_capacity',
    category: 'severity',
    question: 'Lost usual coping capacity; unable to resume baseline functioning',
    questionMl: 'സാധാരണ നേരിടാനുള്ള കഴിവ് നഷ്ടപ്പെട്ടു; അടിസ്ഥാന പ്രവർത്തനം പുനരാരംഭിക്കാൻ കഴിയുന്നില്ല',
    redFlag: true,
  },

  // Functional Impairment
  {
    id: 'work_impairment',
    category: 'impairment',
    question: 'Significant impairment in work or academic functioning',
    questionMl: 'ജോലിയിലോ പഠനത്തിലോ കാര്യമായ തടസ്സം',
    redFlag: true,
  },
  {
    id: 'social_impairment',
    category: 'impairment',
    question: 'Significant impairment in social relationships',
    questionMl: 'സാമൂഹിക ബന്ധങ്ങളിൽ കാര്യമായ തടസ്സം',
    redFlag: true,
  },
  {
    id: 'self_care_neglect',
    category: 'impairment',
    question: 'Neglect of basic self-care (hygiene, nutrition, sleep)',
    questionMl: 'അടിസ്ഥാന സ്വയം പരിചരണം അവഗണിക്കുന്നു (ശുചിത്വം, ഭക്ഷണം, ഉറക്കം)',
    redFlag: true,
  },
  {
    id: 'ego_dystonic',
    category: 'impairment',
    question: 'Symptoms feel distressing/alien (ego-dystonic) rather than understandable',
    questionMl: 'ലക്ഷണങ്ങൾ മനസ്സിലാക്കാവുന്നതിനേക്കാൾ അസ്വസ്ഥമായി/അന്യമായി തോന്നുന്നു (ഈഗോ-ഡിസ്റ്റോണിക്)',
    redFlag: true,
  },
  {
    id: 'unresponsive_support',
    category: 'impairment',
    question: 'Symptoms unresponsive to social support and self-care measures',
    questionMl: 'സാമൂഹിക പിന്തുണയോടും സ്വയം പരിചരണ നടപടികളോടും ലക്ഷണങ്ങൾ പ്രതികരിക്കുന്നില്ല',
    redFlag: true,
  },

  // Qualitative Features (Specific Syndrome Signs)
  {
    id: 'pervasive_anhedonia',
    category: 'qualitative',
    question: 'Pervasive anhedonia (loss of interest/pleasure in most activities)',
    questionMl: 'മിക്ക പ്രവർത്തനങ്ങളിലും താൽപ്പര്യം/സന്തോഷം നഷ്ടപ്പെടൽ',
    redFlag: true,
  },
  {
    id: 'panic_attacks',
    category: 'qualitative',
    question: 'Panic attacks (abrupt onset of ≥4 sympathetic symptoms)',
    questionMl: 'പാനിക് അറ്റാക്കുകൾ (≥4 സിമ്പതറ്റിക് ലക്ഷണങ്ങളുടെ പെട്ടെന്നുള്ള തുടക്കം)',
    redFlag: true,
  },
  {
    id: 'trauma_reexperiencing',
    category: 'qualitative',
    question: 'Intrusive trauma memories, flashbacks, or nightmares (Criterion A exposure)',
    questionMl: 'ആഘാതകരമായ ഓർമ്മകൾ, ഫ്ലാഷ്ബാക്കുകൾ, അല്ലെങ്കിൽ പേടിസ്വപ്നങ്ങൾ',
    redFlag: true,
  },
  {
    id: 'avoidance_behavior',
    category: 'qualitative',
    question: 'Marked avoidance of trauma reminders or related thoughts/feelings',
    questionMl: 'ആഘാത ഓർമ്മകളെയോ ബന്ധപ്പെട്ട ചിന്തകളെയോ വികാരങ്ങളെയോ കാര്യമായി ഒഴിവാക്കൽ',
    redFlag: true,
  },
  {
    id: 'hyperarousal',
    category: 'qualitative',
    question: 'Persistent hyperarousal (hypervigilance, exaggerated startle, sleep disturbance)',
    questionMl: 'തുടർച്ചയായ ഹൈപ്പർഅറൗസൽ (ഹൈപ്പർവിജിലൻസ്, അമിത ഞെട്ടൽ, ഉറക്ക തടസ്സം)',
    redFlag: true,
  },
  {
    id: 'excessive_worry_6months',
    category: 'qualitative',
    question: 'Excessive worry about multiple domains lasting ≥6 months',
    questionMl: 'പല മേഖലകളിലും 6 മാസം അല്ലെങ്കിൽ അതിലധികം നീണ്ടുനിൽക്കുന്ന അമിത ആശങ്ക',
    redFlag: true,
  },
  {
    id: 'manic_features',
    category: 'qualitative',
    question: 'DIGFAST features (Distractibility, Impulsivity, Grandiosity, Flight of ideas, Activity increase, Sleep deficit, Talkativeness)',
    questionMl: 'DIGFAST സവിശേഷതകൾ (ശ്രദ്ധാഭംഗം, ആവേഗപരത, മഹത്വമാനം, ആശയങ്ങളുടെ പറക്കൽ, പ്രവർത്തന വർദ്ധനവ്, ഉറക്ക കുറവ്, സംസാരം കൂടുതൽ)',
    redFlag: true,
  },
  {
    id: 'psychomotor_changes',
    category: 'qualitative',
    question: 'Psychomotor retardation or agitation',
    questionMl: 'സൈക്കോമോട്ടോർ റിറ്റാർഡേഷൻ അല്ലെങ്കിൽ ആന്ദോളനം',
    redFlag: true,
  },
  {
    id: 'dissociative_phenomena',
    category: 'qualitative',
    question: 'Dissociative phenomena (depersonalization, derealization)',
    questionMl: 'വിഛേദന പ്രതിഭാസങ്ങൾ (ഡീപേഴ്സണലൈസേഷൻ, ഡീറിയലൈസേഷൻ)',
    redFlag: true,
  },

  // MSE Findings
  {
    id: 'psychotic_symptoms',
    category: 'mse',
    question: 'Hallucinations or delusions present',
    questionMl: 'ഭ്രമങ്ങൾ അല്ലെങ്കിൽ മിഥ്യാധാരണകൾ ഉണ്ട്',
    redFlag: true,
  },
  {
    id: 'blunted_affect',
    category: 'mse',
    question: 'Blunted, flat, or incongruent affect',
    questionMl: 'മന്ദമായ, പരന്ന, അല്ലെങ്കിൽ പൊരുത്തമില്ലാത്ത വികാരം',
    redFlag: true,
  },
  {
    id: 'cognitive_deficits',
    category: 'mse',
    question: 'Disorientation, memory deficits, or impaired reality testing',
    questionMl: 'ദിശാബോധമില്ലായ്മ, ഓർമ്മക്കുറവ്, അല്ലെങ്കിൽ യാഥാർത്ഥ്യ പരിശോധന തകരാറ്',
    redFlag: true,
  },
  {
    id: 'pathologic_guilt',
    category: 'mse',
    question: 'Pathological guilt or worthlessness',
    questionMl: 'രോഗാത്മക കുറ്റബോധം അല്ലെങ്കിൽ വിലയില്ലായ്മ തോന്നൽ',
    redFlag: true,
  },
  {
    id: 'impaired_insight',
    category: 'mse',
    question: 'Impaired insight or judgment',
    questionMl: 'ഉൾക്കാഴ്ച അല്ലെങ്കിൽ വിധിന്യായം തകരാറിലായി',
    redFlag: true,
  },
  {
    id: 'thought_disorder',
    category: 'mse',
    question: 'Disorganized thought process (tangentiality, loosening of associations)',
    questionMl: 'ക്രമരഹിതമായ ചിന്താ പ്രക്രിയ (ടാൻജെൻഷ്യാലിറ്റി, ബന്ധങ്ങളുടെ അയവ്)',
    redFlag: true,
  },
];

export const CATEGORY_LABELS: Record<string, { en: string; ml: string }> = {
  stressor: { en: 'Stressor & Onset', ml: 'സ്ട്രെസറും ആരംഭവും' },
  duration: { en: 'Duration & Course', ml: 'കാലാവധിയും ഗതിയും' },
  severity: { en: 'Severity Indicators', ml: 'തീവ്രത സൂചകങ്ങൾ' },
  impairment: { en: 'Functional Impairment', ml: 'പ്രവർത്തന വൈകല്യം' },
  qualitative: { en: 'Syndrome-Specific Features', ml: 'സിൻഡ്രോം-നിർദ്ദിഷ്ട സവിശേഷതകൾ' },
  mse: { en: 'Mental Status Examination', ml: 'മാനസിക നില പരിശോധന' },
};

// Clinical guidance for differentiation
export const CLINICAL_GUIDANCE = {
  ordinaryStress: {
    en: [
      'Time-limited and proportionate to identifiable stressors',
      'Patient retains coping capacity and resumes baseline functioning within days to weeks',
      'Symptoms are ego-syntonic (understandable in context)',
      'Resolves with social support and self-care',
      'Symptoms fluctuate with stressor exposure and improve when stressors abate',
    ],
    ml: [
      'സമയ പരിമിതിയുള്ളതും തിരിച്ചറിയാവുന്ന സ്ട്രെസറുകൾക്ക് ആനുപാതികവുമാണ്',
      'രോഗി നേരിടാനുള്ള കഴിവ് നിലനിർത്തുകയും ദിവസങ്ങൾക്കുള്ളിൽ അടിസ്ഥാന പ്രവർത്തനം പുനരാരംഭിക്കുകയും ചെയ്യുന്നു',
      'ലക്ഷണങ്ങൾ ഈഗോ-സിന്റോണിക് ആണ് (സാഹചര്യത്തിൽ മനസ്സിലാക്കാവുന്നവ)',
      'സാമൂഹിക പിന്തുണയും സ്വയം പരിചരണവും കൊണ്ട് പരിഹരിക്കുന്നു',
      'സ്ട്രെസർ എക്സ്പോഷറിനൊപ്പം ലക്ഷണങ്ങൾ ഏറ്റക്കുറച്ചിൽ ഉണ്ടാകുന്നു',
    ],
  },
  mentalDisorder: {
    en: [
      'Persistent symptoms meeting diagnostic time thresholds (eg, ≥2 weeks for MDD, ≥6 months for GAD)',
      'Significant interference with work, relationships, or self-care',
      'Symptoms are ego-dystonic (feel alien, uncontrollable)',
      'May include intrusive suicidal thoughts, uncontrollable panic attacks, pervasive anhedonia',
      'Psychophysiologic signs: psychomotor retardation/agitation, excessive guilt, dissociative phenomena',
      'Episodes independent of immediate situational triggers',
    ],
    ml: [
      'ഡയഗ്നോസ്റ്റിക് സമയ പരിധികൾ പാലിക്കുന്ന സ്ഥിരമായ ലക്ഷണങ്ങൾ (ഉദാ: MDD-ക്ക് ≥2 ആഴ്ച, GAD-ക്ക് ≥6 മാസം)',
      'ജോലി, ബന്ധങ്ങൾ, അല്ലെങ്കിൽ സ്വയം പരിചരണത്തിൽ കാര്യമായ ഇടപെടൽ',
      'ലക്ഷണങ്ങൾ ഈഗോ-ഡിസ്റ്റോണിക് ആണ് (അന്യമായി, നിയന്ത്രിക്കാനാകാത്തതായി തോന്നുന്നു)',
      'നുഴഞ്ഞുകയറുന്ന ആത്മഹത്യാ ചിന്തകൾ, നിയന്ത്രിക്കാനാകാത്ത പാനിക് അറ്റാക്കുകൾ, വ്യാപകമായ അൻഹെഡോണിയ',
      'സൈക്കോഫിസിയോളജിക് ലക്ഷണങ്ങൾ: സൈക്കോമോട്ടോർ റിറ്റാർഡേഷൻ/ആന്ദോളനം, അമിത കുറ്റബോധം, വിഛേദന പ്രതിഭാസങ്ങൾ',
      'ഉടനടി സാഹചര്യ ട്രിഗറുകളിൽ നിന്ന് സ്വതന്ത്രമായ എപ്പിസോഡുകൾ',
    ],
  },
  screeningTools: {
    en: [
      'PHQ-2/PHQ-9: Two-question screen for depression (low mood or anhedonia)',
      'GAD-7: Generalized Anxiety Disorder screening',
      'PCL-5: PTSD Checklist for trauma-related symptoms',
      'DIGFAST: Mnemonic for mania screening',
    ],
    ml: [
      'PHQ-2/PHQ-9: വിഷാദത്തിനുള്ള ടു-ക്വസ്റ്റ്യൺ സ്ക്രീൻ',
      'GAD-7: ജനറലൈസ്ഡ് ആങ്സൈറ്റി ഡിസോർഡർ സ്ക്രീനിംഗ്',
      'PCL-5: ആഘാത ബന്ധപ്പെട്ട ലക്ഷണങ്ങൾക്കുള്ള PTSD ചെക്ക്ലിസ്റ്റ്',
      'DIGFAST: മാനിയ സ്ക്രീനിംഗിനുള്ള സ്മരണ സഹായി',
    ],
  },
};
