import { HamaItem } from '@/types/hama';

/**
 * Hamilton Anxiety Rating Scale (HAM-A)
 * Hamilton M. The assessment of anxiety states by rating. Br J Med Psychol. 1959;32(1):50–55.
 * 14 items, each scored 0–4 (0 = not present, 4 = very severe). Total range 0–56.
 */
export const HAMA_ITEMS: HamaItem[] = [
  {
    id: 1,
    title: 'Anxious mood',
    titleMl: 'ഉത്കണ്ഠാപൂർണ്ണ മാനസികാവസ്ഥ',
    description: 'Worries, anticipation of the worst, fearful anticipation, irritability.',
    descriptionMl: 'ആശങ്കകൾ, ഏറ്റവും മോശമായത് പ്രതീക്ഷിക്കൽ, ഭയപ്പെടുത്തുന്ന പ്രതീക്ഷ, പ്രകോപനം.',
  },
  {
    id: 2,
    title: 'Tension',
    titleMl: 'പിരിമുറുക്കം',
    description: 'Feelings of tension, fatigability, startle response, moved to tears easily, trembling, feelings of restlessness, inability to relax.',
    descriptionMl: 'പിരിമുറുക്കം, ക്ഷീണം, ഞെട്ടൽ പ്രതികരണം, പെട്ടെന്ന് കരയുക, വിറയൽ, അസ്വസ്ഥത, വിശ്രമിക്കാനുള്ള കഴിവില്ലായ്മ.',
  },
  {
    id: 3,
    title: 'Fears',
    titleMl: 'ഭയങ്ങൾ',
    description: 'Of dark, of strangers, of being left alone, of animals, of traffic, of crowds.',
    descriptionMl: 'ഇരുട്ട്, അപരിചിതർ, ഏകാന്തത, മൃഗങ്ങൾ, ഗതാഗതം, ജനക്കൂട്ടം എന്നിവയോട്.',
  },
  {
    id: 4,
    title: 'Insomnia',
    titleMl: 'ഉറക്കമില്ലായ്മ',
    description: 'Difficulty in falling asleep, broken sleep, unsatisfying sleep and fatigue on waking, dreams, nightmares, night terrors.',
    descriptionMl: 'ഉറങ്ങാൻ ബുദ്ധിമുട്ട്, മുറിഞ്ഞ ഉറക്കം, തൃപ്തികരമല്ലാത്ത ഉറക്കം, ഉണരുമ്പോൾ ക്ഷീണം, സ്വപ്നങ്ങൾ, ദുഃസ്വപ്നങ്ങൾ.',
  },
  {
    id: 5,
    title: 'Intellectual (cognitive)',
    titleMl: 'ബുദ്ധിപരം (ജ്ഞാനപരം)',
    description: 'Difficulty in concentration, poor memory.',
    descriptionMl: 'ശ്രദ്ധ കേന്ദ്രീകരിക്കാൻ ബുദ്ധിമുട്ട്, ഓർമ്മക്കുറവ്.',
  },
  {
    id: 6,
    title: 'Depressed mood',
    titleMl: 'വിഷാദ മാനസികാവസ്ഥ',
    description: 'Loss of interest, lack of pleasure in hobbies, depression, early waking, diurnal swing.',
    descriptionMl: 'താൽപ്പര്യം നഷ്ടം, ഹോബികളിൽ സന്തോഷം ഇല്ല, വിഷാദം, നേരത്തെ ഉണരുക, ദിവസേന ഉണ്ടാകുന്ന വ്യതിയാനങ്ങൾ.',
  },
  {
    id: 7,
    title: 'Somatic (muscular)',
    titleMl: 'ശാരീരികം (പേശീ)',
    description: 'Pains and aches, twitchings, stiffness, myoclonic jerks, grinding of teeth, unsteady voice, increased muscular tone.',
    descriptionMl: 'വേദനകൾ, പേശീ വലിവുകൾ, ഉറപ്പ്, മയോക്ലോണിക് ഞെട്ടൽ, പല്ലുകടി, അസ്ഥിര ശബ്ദം, പേശികളിലെ പിരിമുറുക്കം.',
  },
  {
    id: 8,
    title: 'Somatic (sensory)',
    titleMl: 'ശാരീരികം (സംവേദന)',
    description: 'Tinnitus, blurring of vision, hot and cold flushes, feelings of weakness, pricking sensation.',
    descriptionMl: 'ചെവിയിൽ മുഴക്കം, കാഴ്ച മങ്ങൽ, ചൂട്/തണുപ്പ് അനുഭവം, ദുർബലത, കുത്തുന്ന അനുഭവം.',
  },
  {
    id: 9,
    title: 'Cardiovascular symptoms',
    titleMl: 'ഹൃദയ-രക്തചംക്രമണ ലക്ഷണങ്ങൾ',
    description: 'Tachycardia, palpitations, pain in chest, throbbing of vessels, fainting feelings, missing beat.',
    descriptionMl: 'ഹൃദയമിടിപ്പ് വർദ്ധന, പൽപ്പിറ്റേഷൻ, നെഞ്ചുവേദന, രക്തക്കുഴലുകളിലെ മിടിപ്പ്, തലകറക്കം, മിടിപ്പ് മിസ്സാകൽ.',
  },
  {
    id: 10,
    title: 'Respiratory symptoms',
    titleMl: 'ശ്വസന ലക്ഷണങ്ങൾ',
    description: 'Pressure or constriction in chest, choking feelings, sighing, dyspnea.',
    descriptionMl: 'നെഞ്ചിൽ സമ്മർദ്ദമോ ഞെരുക്കമോ, ശ്വാസം മുട്ടൽ, നെടുവീർപ്പ്, ശ്വാസതടസ്സം.',
  },
  {
    id: 11,
    title: 'Gastrointestinal symptoms',
    titleMl: 'ദഹന ലക്ഷണങ്ങൾ',
    description: 'Difficulty in swallowing, wind, abdominal pain, burning sensations, abdominal fullness, nausea, vomiting, borborygmi, looseness of bowels, loss of weight, constipation.',
    descriptionMl: 'വിഴുങ്ങാൻ ബുദ്ധിമുട്ട്, വയറുവേദന, പുകച്ചിൽ, വയറുനിറയൽ, ഓക്കാനം, ഛർദ്ദി, വയറിളക്കം, ശരീരഭാരം നഷ്ടം, മലബന്ധം.',
  },
  {
    id: 12,
    title: 'Genitourinary symptoms',
    titleMl: 'ജനനേന്ദ്രിയ-മൂത്രാശയ ലക്ഷണങ്ങൾ',
    description: 'Frequency of micturition, urgency of micturition, amenorrhea, menorrhagia, development of frigidity, premature ejaculation, loss of libido, impotence.',
    descriptionMl: 'പതിവായ മൂത്രമൊഴിക്കൽ, അടിയന്തിര മൂത്രമൊഴിക്കൽ, ആർത്തവമില്ലായ്മ, അമിത ആർത്തവം, ലിബിഡോ നഷ്ടം, ലൈംഗിക ദുർബലത.',
  },
  {
    id: 13,
    title: 'Autonomic symptoms',
    titleMl: 'സ്വയംഭരണ ലക്ഷണങ്ങൾ',
    description: 'Dry mouth, flushing, pallor, tendency to sweat, giddiness, tension headache, raising of hair.',
    descriptionMl: 'വരണ്ട വായ, മുഖം ചുവക്കൽ, വിളർച്ച, വിയർപ്പ്, തലകറക്കം, പിരിമുറുക്ക തലവേദന, രോമം എഴുന്നുനിൽക്കൽ.',
  },
  {
    id: 14,
    title: 'Behavior at interview',
    titleMl: 'അഭിമുഖത്തിലെ പെരുമാറ്റം',
    description: 'Fidgeting, restlessness or pacing, tremor of hands, furrowed brow, strained face, sighing or rapid respiration, facial pallor, swallowing, etc.',
    descriptionMl: 'അസ്വസ്ഥത, നടന്നുകൊണ്ടിരിക്കൽ, കൈ വിറയൽ, പിരിമുറുക്ക മുഖഭാവം, വേഗത്തിലുള്ള ശ്വസനം, വിഴുങ്ങൽ മുതലായവ.',
  },
];

export const HAMA_OPTIONS = [
  'Not present',
  'Mild',
  'Moderate',
  'Severe',
  'Very severe / incapacitating',
];

export const HAMA_OPTIONS_ML = [
  'ഇല്ല',
  'മൃദുവായ',
  'മധ്യമം',
  'കഠിനം',
  'വളരെ കഠിനം / കഴിവില്ലാതാക്കുന്നത്',
];
