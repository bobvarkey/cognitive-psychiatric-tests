import { DaphneItem } from '@/types/daphne';

export const DAPHNE_SCALE_ITEMS_EN: DaphneItem[] = [
  {
    id: 'disinhibition',
    domain: 'disinhibition',
    title: 'Disinhibition',
    descriptions: {
      normal: 'No trouble',
      veryMild: 'Subject makes unpleasant, hurtful comments to family members; subject seeks out contact with strangers',
      mild: 'Subject makes unpleasant, hurtful comments to strangers',
      moderate: 'Subject is unable to participate in any social activity because of inappropriate social behavior (impatience, etc.)',
      severe: 'Subject interrupts strangers\' activities, behaves inappropriately and disturbs public order (obscene words, urination, etc.)'
    }
  },
  {
    id: 'inappropriate-joviality',
    domain: 'disinhibition',
    title: 'Inappropriate Joviality',
    descriptions: {
      normal: 'No trouble',
      veryMild: 'Subject is jovial and laughs unreasonably but in appropriate situations and can stop when asked to',
      mild: 'Subject is jovial and laughs unreasonably in inappropriate situations but cannot stop when asked to',
      moderate: 'Subject is jovial in embarrassing situations (talks to strangers, etc.)',
      severe: 'Subject is jovial and says unacceptable words (jokes, sneers) in inappropriate situations (at funerals, with young children, etc.)'
    }
  },
  {
    id: 'unrestrained-spending',
    domain: 'disinhibition',
    title: 'Unrestrained Spending Habits',
    descriptions: {
      normal: 'No trouble',
      veryMild: 'Subject buys a lot by mail order or repeatedly buys the same low-value things, but can listen to reason',
      mild: 'Subject buys a lot by mail order or repeatedly buys the same low-value things, but cannot listen to reason',
      moderate: 'Subject buys lots of expensive objects and does not understand that they are excessive and inappropriate',
      severe: 'Subject is indebted because of lots of expensive purchases or gambling (card games, casino, etc.)'
    }
  },
  {
    id: 'sexual-disinhibition',
    domain: 'disinhibition',
    title: 'Sexual Disinhibition',
    descriptions: {
      normal: 'No trouble',
      veryMild: 'Subject makes inappropriate sexual comments or jokes, but can stop if asked to',
      mild: 'Subject makes inappropriate and uncontrolled sexual comments or jokes, which he/she then acts on; subject is indecent (undresses in inappropriate places, etc.)',
      moderate: 'Subject displays unwanted and inappropriate sexual behavior (public masturbation, sexual touching of a minor, sexual attraction to animals, etc.)',
      severe: ''
    }
  },
  {
    id: 'apathy',
    domain: 'apathy',
    title: 'Apathy',
    descriptions: {
      normal: 'No trouble',
      veryMild: 'Subject can take part in usual activities, but must be encouraged to do anything outside of the ordinary',
      mild: 'Subject can take part in usual activities, but does not complete them; subject can restart an activity, but only with stimulation',
      moderate: 'Subject interrupts activities and does not restart them, even with stimulation; subject does not want to do usual activities',
      severe: 'Subject has no interest; does not do anything despite stimulation, stays in his/her seat or in bed all day'
    }
  },
  {
    id: 'loss-of-empathy',
    domain: 'empathy',
    title: 'Loss of Empathy',
    descriptions: {
      normal: 'No trouble',
      veryMild: 'Subject complains about loss of emotion towards relatives',
      mild: 'Subject shows little interest in stories from relatives or in emotionally current matters; subject has difficulty expressing feelings',
      moderate: 'Subject is indifferent to relatives, does not care about them, and is not concerned when people speak about him/her',
      severe: 'Subject is unable to express or decipher any emotion, can have inappropriate emotional responses'
    }
  },
  {
    id: 'perseverations',
    domain: 'perseverations',
    title: 'Perseverations',
    descriptions: {
      normal: 'No trouble',
      veryMild: 'Subject collects usual objects or has trouble getting rid of things or has routine activities',
      mild: 'Subject collects unusual objects or does not throw anything away, has ritualized activities or has obsessions (hours, etc.), but this is consistent with social life',
      moderate: 'Subject collects lots of objects or has difficulty sitting still, has obsessional rituals that interfere with social life',
      severe: 'Subject has continuous rituals (grinding of teeth, rubbing of body, grasping of objects, repetition of words or sentences); subject does not stand still'
    }
  },
  {
    id: 'hyperorality',
    domain: 'hyperorality',
    title: 'Hyperorality',
    descriptions: {
      normal: 'No trouble',
      veryMild: 'Subject has a new preference for sweets',
      mild: 'Subject has new or bizarre food preferences but can listen to reason',
      moderate: 'Subject eats or drinks excessively and cannot listen to reason (padlock on cupboard, etc.)',
      severe: 'Subject eats and drinks everything within reach, including in other people\'s plates or glasses, or eats inedible substances'
    }
  },
  {
    id: 'bulimia-gluttony',
    domain: 'hyperorality',
    title: 'Bulimia, Gluttony',
    descriptions: {
      normal: 'No trouble',
      veryMild: 'Subject eats much more, has put on weight',
      mild: 'Subject eats gluttonously, voraciously, without getting dirty',
      moderate: 'Subject eats quickly and gets dirty, takes big pieces, risking choking',
      severe: 'Subject eats with hands, uncleanly, does not cut his food, keeps food in mouth; subject has put on a lot of weight'
    }
  },
  {
    id: 'personal-neglect',
    domain: 'neglect',
    title: 'Personal Neglect',
    descriptions: {
      normal: 'No trouble',
      veryMild: 'Subject looks less neat',
      mild: 'Subject must be stimulated to wash or change clothes',
      moderate: 'Subject can wash or change clothes only when threatened or tricked',
      severe: 'Subject has very poor hygiene (dirty fingernails, dirty hair, dirty clothes, etc.)'
    }
  },
  {
    id: 'hyperorality-objects',
    domain: 'hyperorality',
    title: 'Hyperorality (Objects)',
    descriptions: {
      normal: 'No trouble',
      veryMild: 'Subject explores objects with mouth',
      mild: 'Subject puts non-food objects in mouth',
      moderate: 'Subject chews or swallows non-food objects',
      severe: 'Subject continuously puts objects in mouth, high risk of ingestion'
    }
  },
  {
    id: 'environmental-neglect',
    domain: 'neglect',
    title: 'Environmental Neglect',
    descriptions: {
      normal: 'No trouble',
      veryMild: 'Subject is less concerned about home cleanliness',
      mild: 'Subject ignores household chores previously performed',
      moderate: 'Subject allows environment to become unsanitary',
      severe: 'Total neglect of living conditions, hoarding or squalor'
    }
  }
];

export const getDaphneScaleItems = (lang: string) => {
  const allItems = lang === 'ml' ? DAPHNE_SCALE_ITEMS_ML : DAPHNE_SCALE_ITEMS_EN;
  // DAPHNE-6 uses exactly 10 items according to the scoring logic requirement
  const selectedIds = [
    'disinhibition',
    'inappropriate-joviality',
    'unrestrained-spending',
    'sexual-disinhibition',
    'apathy',
    'loss-of-empathy',
    'perseverations',
    'hyperorality',
    'bulimia-gluttony',
    'personal-neglect'
  ];
  return allItems.filter(item => selectedIds.includes(item.id));
};


export const DAPHNE_SCALE_ITEMS_ML: DaphneItem[] = [
  {
    id: 'disinhibition',
    domain: 'disinhibition',
    title: 'അനിയന്ത്രണം (Disinhibition)',
    descriptions: {
      normal: 'കുഴപ്പമില്ല',
      veryMild: 'രോഗി കുടുംബാംഗങ്ങളോട് അരോചകവും വേദനാജനകവുമായ അഭിപ്രായങ്ങൾ പറയുന്നു; അപരിചിതരുമായി ബന്ധം അന്വേഷിക്കുന്നു',
      mild: 'രോഗി അപരിചിതരോട് അരോചകവും വേദനാജനകവുമായ അഭിപ്രായങ്ങൾ പറയുന്നു',
      moderate: 'അനുചിതമായ സാമൂഹിക പെരുമാറ്റം (അക്ഷമത മുതലായവ) കാരണം രോഗിക്ക് ഏതെങ്കിലും സാമൂഹിക പ്രവർത്തനത്തിൽ പങ്കെടുക്കാൻ കഴിയുന്നില്ല',
      severe: 'രോഗി അപരിചിതരുടെ പ്രവർത്തനങ്ങളിൽ ഇടപെടുന്നു, അനുചിതമായി പെരുമാറുന്നു, പൊതു ക്രമം ശല്യപ്പെടുത്തുന്നു (അശ്ലീല വാക്കുകൾ, മൂത്രമൊഴിക്കൽ മുതലായവ)'
    }
  },
  {
    id: 'inappropriate-joviality',
    domain: 'disinhibition', 
    title: 'അനുചിതമായ ആനന്ദം (Inappropriate Joviality)',
    descriptions: {
      normal: 'കുഴപ്പമില്ല',
      veryMild: 'രോഗി ആനന്ദപൂർവ്വം അയുക്തമായി ചിരിക്കുന്നു എന്നാൽ ഉചിതമായ സാഹചര്യങ്ങളിൽ, ആവശ്യപ്പെടുമ്പോൾ നിർത്താൻ കഴിയുന്നു',
      mild: 'രോഗി അനുചിതമായ സാഹചര്യങ്ങളിൽ ആനന്ദപൂർവ്വം അയുക്തമായി ചിരിക്കുന്നു, എന്നാൽ ആവശ്യപ്പെടുമ്പോൾ നിർത്താൻ കഴിയുന്നില്ല',
      moderate: 'രോഗി ലജ്ജാകരമായ സാഹചര്യങ്ങളിൽ ആനന്ദപൂർവ്വമാണ് (അപരിചിതരോട് സംസാരിക്കുന്നു മുതലായവ)',
      severe: 'രോഗി അനുചിതമായ സാഹചര്യങ്ങളിൽ (ശവസംസ്കാര ചടങ്ങുകളിൽ, ചെറിയ കുട്ടികളോടൊപ്പം മുതലായവ) ആനന്ദപൂർവ്വം അസ്വീകാര്യമായ വാക്കുകൾ (തമാശകൾ, പരിഹാസങ്ങൾ) പറയുന്നു'
    }
  },
  {
    id: 'unrestrained-spending',
    domain: 'disinhibition',
    title: 'അനിയന്ത്രിതമായ ചെലവ് ശീലങ്ങൾ (Unrestrained Spending)',
    descriptions: {
      normal: 'കുഴപ്പമില്ല',
      veryMild: 'രോഗി മെയിൽ ഓർഡർ വഴി ധാരാളം വസ്തുക്കൾ വാങ്ങുന്നു അല്ലെങ്കിൽ അതേ കുറഞ്ഞ മൂല്യമുള്ള വസ്തുക്കൾ ആവർത്തിച്ച് വാങ്ങുന്നു, പക്ഷേ യുക്തി കേൾക്കാൻ കഴിയുന്നു',
      mild: 'രോഗി മെയിൽ ഓർഡർ വഴി ധാരാളം വസ്തുക്കൾ വാങ്ങുന്നു അല്ലെങ്കിൽ അതേ കുറഞ്ഞ മൂല്യമുള്ള വസ്തുക്കൾ ആവർത്തിച്ച് വാങ്ങുന്നു, പക്ഷേ യുക്തി കേൾക്കാൻ കഴിയുന്നില്ല',
      moderate: 'രോഗി ധാരാളം വിലയേറിയ വസ്തുക്കൾ വാങ്ങുന്നു, അവ അധികവും അനുചിതവുമാണെന്ന് മനസ്സിലാക്കുന്നില്ല',
      severe: 'ധാരാളം വിലയേറിയ വാങ്ങലുകൾ അല്ലെങ്കിൽ ചൂതാട്ടം (കാർഡ് ഗെയിമുകൾ, കാസിനോ മുതലായവ) കാരണം രോഗി കടക്കാരനാണ്'
    }
  },
  {
    id: 'sexual-disinhibition',
    domain: 'disinhibition',
    title: 'ലൈംഗിക അനിയന്ത്രണം (Sexual Disinhibition)',
    descriptions: {
      normal: 'കുഴപ്പമില്ല',
      veryMild: 'രോഗി അനുചിതമായ ലൈംഗിക അഭിപ്രായങ്ങളോ തമാശകളോ പറയുന്നു, പക്ഷേ ആവശ്യപ്പെടുമ്പോൾ നിർത്താൻ കഴിയുന്നു',
      mild: 'രോഗി അനുചിതവും അനിയന്ത്രിതവുമായ ലൈംഗിക അഭിപ്രായങ്ങളോ തമാശകളോ പറയുന്നു, പിന്നീട് അവയിൽ പ്രവർത്തിക്കുന്നു; രോഗി അസഭ്യമാണ് (അനുചിതമായ സ്ഥലങ്ങളിൽ വസ്ത്രം അഴിക്കുന്നു മുതലായവ)',
      moderate: 'രോഗി അനാവശ്യവും അനുചിതവുമായ ലൈംഗിക പെരുമാറ്റം കാണിക്കുന്നു (പൊതു സ്വയംഭോഗം, പ്രായപൂർത്തിയാകാത്തവരെ ലൈംഗികമായി സ്പർശിക്കൽ, മൃഗങ്ങളോടുള്ള ലൈംഗിക ആകർഷണം മുതലായവ)',
      severe: ''
    }
  },
  {
    id: 'apathy',
    domain: 'apathy',
    title: 'നിസ്സംഗത (Apathy)',
    descriptions: {
      normal: 'കുഴപ്പമില്ല',
      veryMild: 'രോഗിക്ക് സാധാരണ പ്രവർത്തനങ്ങളിൽ പങ്കെടുക്കാൻ കഴിയുന്നു, പക്ഷേ സാധാരണമല്ലാത്ത എന്തെങ്കിലും ചെയ്യാൻ പ്രോത്സാഹിപ്പിക്കേണ്ടതുണ്ട്',
      mild: 'രോഗിക്ക് സാധാരണ പ്രവർത്തനങ്ങളിൽ പങ്കെടുക്കാൻ കഴിയുന്നു, പക്ഷേ അവ പൂർത്തിയാക്കുന്നില്ല; പ്രേരണയോടെ മാത്രമേ ഒരു പ്രവർത്തനം പുനരാരംഭിക്കാൻ കഴിയൂ',
      moderate: 'രോഗി പ്രവർത്തനങ്ങൾ തടസ്സപ്പെടുത്തുകയും പ്രേരണയോടെ പോലും അവ പുനരാരംഭിക്കാതിരിക്കുകയും ചെയ്യുന്നു; സാധാരണ പ്രവർത്തനങ്ങൾ ചെയ്യാൻ ആഗ്രഹിക്കുന്നില്ല',
      severe: 'രോഗിക്ക് താൽപ്പര്യമില്ല; പ്രേരണ ഉണ്ടായിട്ടും ഒന്നും ചെയ്യുന്നില്ല, ദിവസം മുഴുവൻ ഇരിപ്പിടത്തിലോ കിടക്കയിലോ തന്നെ കഴിയുന്നു'
    }
  },
  {
    id: 'loss-of-empathy',
    domain: 'empathy',
    title: 'സഹാനുഭൂതിയുടെ നഷ്ടം (Loss of Empathy)',
    descriptions: {
      normal: 'കുഴപ്പമില്ല',
      veryMild: 'രോഗി ബന്ധുക്കളോടുള്ള വികാരങ്ങളുടെ നഷ്ടത്തെക്കുറിച്ച് പരാതിപ്പെടുന്നു',
      mild: 'രോഗി ബന്ധുക്കളുടെ കഥകളിലോ വൈകാരികമായി പ്രസക്തമായ കാര്യങ്ങളിലോ വളരെ കുറച്ച് താൽപ്പര്യം കാണിക്കുന്നു; വികാരങ്ങൾ പ്രകടിപ്പിക്കുന്നതിൽ ബുദ്ധിമുട്ട് അനുഭവിക്കുന്നു',
      moderate: 'രോഗി ബന്ധുക്കളോട് നിസ്സംഗനാണ്, അവരെക്കുറിച്ച് ശ്രദ്ധിക്കുന്നില്ല, ആളുകൾ അവനെ/അവളെക്കുറിച്ച് സംസാരിക്കുമ്പോൾ ആശങ്കപ്പെടുന്നില്ല',
      severe: 'രോഗിക്ക് ഒരു വികാരവും പ്രകടിപ്പിക്കാനോ മനസ്സിലാക്കാനോ കഴിയുന്നില്ല, അനുചിതമായ വൈകാരിക പ്രതികരണങ്ങൾ ഉണ്ടാകാം'
    }
  },
  {
    id: 'perseverations',
    domain: 'perseverations',
    title: 'ആവർത്തനം (Perseverations)',
    descriptions: {
      normal: 'കുഴപ്പമില്ല',
      veryMild: 'രോഗി സാധാരണ വസ്തുക്കൾ ശേഖരിക്കുന്നു അല്ലെങ്കിൽ വസ്തുക്കൾ വലിച്ചെറിയുന്നതിൽ പ്രശ്നമുണ്ട് അല്ലെങ്കിൽ പതിവ് പ്രവർത്തനങ്ങൾ ഉണ്ട്',
      mild: 'രോഗി അസാധാരണമായ വസ്തുക്കൾ ശേഖരിക്കുന്നു അല്ലെങ്കിൽ ഒന്നും വലിച്ചെറിയുന്നില്ല, ആചാരപരമായ പ്രവർത്തനങ്ങൾ അല്ലെങ്കിൽ ഭ്രാന്തുകൾ (മണിക്കൂറുകൾ മുതലായവ) ഉണ്ട്, പക്ഷേ ഇത് സാമൂഹിക ജീവിതവുമായി പൊരുത്തപ്പെടുന്നു',
      moderate: 'രോഗി ധാരാളം വസ്തുക്കൾ ശേഖരിക്കുന്നു അല്ലെങ്കിൽ നിശ്ചലമായി ഇരിക്കുന്നതിൽ പ്രശ്നമുണ്ട്, സാമൂഹിക ജീവിതത്തെ തടസ്സപ്പെടുത്തുന്ന ഭ്രാന്തമായ ആചാരങ്ങൾ ഉണ്ട്',
      severe: 'രോഗിക്ക് തുടർച്ചയായ ആചാരങ്ങൾ ഉണ്ട് (പല്ല് കടിക്കൽ, ശരീരം തടവൽ, വസ്തുക്കൾ പിടിക്കൽ, വാക്കുകളുടെയോ വാക്യങ്ങളുടെയോ ആവർത്തനം); രോഗി നിശ്ചലമായി നിൽക്കുന്നില്ല'
    }
  },
  {
    id: 'hyperorality',
    domain: 'hyperorality',
    title: 'അമിത വായ്ക്കോളിത്തം (Hyperorality)',
    descriptions: {
      normal: 'കുഴപ്പമില്ല',
      veryMild: 'രോഗിക്ക് മധുരപലഹാരങ്ങളോട് പുതിയ മുൻഗണന ഉണ്ട്',
      mild: 'രോഗിക്ക് പുതിയതോ വിചിത്രമായതോ ആയ ഭക്ഷണ മുൻഗണനകൾ ഉണ്ട് പക്ഷേ യുക്തി കേൾക്കാൻ കഴിയുന്നു',
      moderate: 'രോഗി അമിതമായി ഭക്ഷിക്കുകയോ കുടിക്കുകയോ ചെയ്യുന്നു, യുക്തി കേൾക്കാൻ കഴിയുന്നില്ല (അലമാരയിൽ പൂട്ട് മുതലായവ)',
      severe: 'രോഗി എത്തിക്കാവുന്ന എല്ലാം ഭക്ഷിക്കുകയും കുടിക്കുകയും ചെയ്യുന്നു, മറ്റുള്ളവരുടെ പ്ലേറ്റുകളിലോ ഗ്ലാസുകളിലോ ഉള്ളവ ഉൾപ്പെടെ, അല്ലെങ്കിൽ ഭക്ഷിക്കാനാകാത്ത പദാർത്ഥങ്ങൾ ഭക്ഷിക്കുന്നു'
    }
  },
  {
    id: 'bulimia-gluttony',
    domain: 'hyperorality',
    title: 'അമിതഭക്ഷണം, അത്യാഗ്രഹം (Bulimia, Gluttony)',
    descriptions: {
      normal: 'കുഴപ്പമില്ല',
      veryMild: 'രോഗി വളരെ കൂടുതൽ ഭക്ഷിക്കുന്നു, ഭാരം കൂടിയിട്ടുണ്ട്',
      mild: 'രോഗി അത്യാഗ്രഹത്തോടെ, വിശപ്പോടെ ഭക്ഷിക്കുന്നു, വൃത്തികേടാകാതെ',
      moderate: 'രോഗി വേഗത്തിൽ ഭക്ഷിക്കുന്നു, വൃത്തികേടാകുന്നു, വലിയ കഷണങ്ങൾ എടുക്കുന്നു, ശ്വാസംമുട്ടലിന്റെ അപകടസാധ്യതയുണ്ട്',
      severe: 'രോഗി കൈകൊണ്ട് ഭക്ഷിക്കുന്നു, വൃത്തികേടായി, ഭക്ഷണം മുറിക്കുന്നില്ല, വായിൽ ഭക്ഷണം സൂക്ഷിക്കുന്നു; രോഗിയുടെ ഭാരം വളരെ കൂടിയിട്ടുണ്ട്'
    }
  },
  {
    id: 'personal-neglect',
    domain: 'neglect',
    title: 'വ്യക്തിഗത അവഗണന (Personal Neglect)',
    descriptions: {
      normal: 'കുഴപ്പമില്ല',
      veryMild: 'രോഗി കുറച്ച് വൃത്തിയായി കാണപ്പെടുന്നു',
      mild: 'രോഗിയെ കുളിക്കാനോ വസ്ത്രം മാറാനോ പ്രേരിപ്പിക്കേണ്ടതുണ്ട്',
      moderate: 'ഭീഷണിപ്പെടുത്തുമ്പോഴോ കബളിപ്പിക്കുമ്പോഴോ മാത്രമേ രോഗിയ്ക്ക് കുളിക്കാനോ വസ്ത്രം മാറാനോ കഴിയൂ',
      severe: 'രോഗിക്ക് വളരെ മോശമായ ശുചിത്വമുണ്ട് (വൃത്തികേടായ നഖങ്ങൾ, വൃത്തികേടായ മുടി, വൃത്തികേടായ വസ്ത്രങ്ങൾ മുതലായവ)'
    }
  },
  {
    id: 'hyperorality-objects',
    domain: 'hyperorality',
    title: 'വായ്‌ക്കൂട്ടൽ - വസ്തുക്കൾ (Hyperorality - Objects)',
    descriptions: {
      normal: 'കുഴപ്പമില്ല',
      veryMild: 'രോഗി വസ്തുക്കളെ വായ കൊണ്ട് പരിശോധിക്കുന്നു',
      mild: 'രോഗി ഭക്ഷ്യേതര വസ്തുക്കൾ വായിൽ ഇടുന്നു',
      moderate: 'രോഗി ഭക്ഷ്യേതര വസ്തുക്കൾ ചവയ്ക്കുകയോ വിഴുങ്ങുകയോ ചെയ്യുന്നു',
      severe: 'രോഗി തുടർച്ചയായി വസ്തുക്കൾ വായിൽ ഇടുന്നു, വിഴുങ്ങാനുള്ള ഉയർന്ന സാധ്യത'
    }
  },
  {
    id: 'environmental-neglect',
    domain: 'neglect',
    title: 'പരിസര അവഗണന (Environmental Neglect)',
    descriptions: {
      normal: 'കുഴപ്പമില്ല',
      veryMild: 'രോഗി വീടിന്റെ വൃത്തിയിൽ കുറഞ്ഞ ശ്രദ്ധ കാണിക്കുന്നു',
      mild: 'മുമ്പ് ചെയ്തിരുന്ന വീട്ടുജോലികൾ രോഗി അവഗണിക്കുന്നു',
      moderate: 'പരിസരം അശുചിത്വമാകാൻ രോഗി അനുവദിക്കുന്നു',
      severe: 'ജീവിതസാഹചര്യങ്ങളുടെ പൂർണ്ണമായ അവഗണന, പൂഴ്ത്തിവെപ്പ് അല്ലെങ്കിൽ അഴുക്ക്'
    }
  }
];


import type { Language } from '@/contexts/LanguageContext';

export const getDaphneScaleItems = (language: Language): DaphneItem[] => {
  return language === 'en' ? DAPHNE_SCALE_ITEMS_EN : DAPHNE_SCALE_ITEMS_ML;
};