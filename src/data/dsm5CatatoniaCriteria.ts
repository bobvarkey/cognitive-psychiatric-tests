// DSM-5-TR Catatonia (293.89) — diagnostic criteria.
// Diagnosis requires three (or more) of the following twelve features.

export interface Dsm5CatatoniaItem {
  id: string;
  feature: string;
  featureMl: string;
  description: string;
  descriptionMl: string;
}

export const DSM5_CATATONIA_FEATURES: Dsm5CatatoniaItem[] = [
  {
    id: 'd1',
    feature: 'Stupor',
    featureMl: 'സ്റ്റുപ്പർ',
    description: 'No psychomotor activity; not actively relating to environment.',
    descriptionMl: 'സൈക്കോമോട്ടോർ പ്രവർത്തനമില്ല; പരിസരവുമായി സജീവമായി ബന്ധപ്പെടുന്നില്ല.',
  },
  {
    id: 'd2',
    feature: 'Catalepsy',
    featureMl: 'കാറ്റലെപ്സി',
    description: 'Passive induction of a posture held against gravity.',
    descriptionMl: 'ഗുരുത്വാകർഷണത്തിനെതിരെ പിടിക്കുന്ന ഒരു ഭാവത്തിന്റെ പാസീവ് ഇൻഡക്ഷൻ.',
  },
  {
    id: 'd3',
    feature: 'Waxy flexibility',
    featureMl: 'വാക്സി ഫ്ലെക്സിബിലിറ്റി',
    description: 'Slight, even resistance to positioning by examiner.',
    descriptionMl: 'പരീക്ഷകൻ പൊസിഷൻ ചെയ്യുന്നതിന് ചെറിയതും ഏകീകൃതവുമായ പ്രതിരോധം.',
  },
  {
    id: 'd4',
    feature: 'Mutism',
    featureMl: 'മ്യൂട്ടിസം',
    description: 'No, or very little, verbal response (exclude if known aphasia).',
    descriptionMl: 'വാക്കാലുള്ള പ്രതികരണം ഇല്ല അല്ലെങ്കിൽ വളരെ കുറവ് (അഫേസിയ ഉണ്ടെങ്കിൽ ഒഴിവാക്കുക).',
  },
  {
    id: 'd5',
    feature: 'Negativism',
    featureMl: 'നെഗറ്റിവിസം',
    description: 'Opposition or no response to instructions or external stimuli.',
    descriptionMl: 'നിർദ്ദേശങ്ങൾക്കോ ​​ബാഹ്യ ഉത്തേജനങ്ങൾക്കോ എതിർപ്പ് അല്ലെങ്കിൽ പ്രതികരണമില്ലായ്മ.',
  },
  {
    id: 'd6',
    feature: 'Posturing',
    featureMl: 'പോസ്ചറിംഗ്',
    description: 'Spontaneous and active maintenance of a posture against gravity.',
    descriptionMl: 'ഗുരുത്വാകർഷണത്തിനെതിരെ ഒരു ഭാവത്തിന്റെ സ്വാഭാവികവും സജീവവുമായ പരിപാലനം.',
  },
  {
    id: 'd7',
    feature: 'Mannerism',
    featureMl: 'മാനറിസം',
    description: 'Odd, circumstantial caricature of normal actions.',
    descriptionMl: 'സാധാരണ പ്രവൃത്തികളുടെ വിചിത്രവും അസാധാരണവുമായ കാരിക്കേച്ചർ.',
  },
  {
    id: 'd8',
    feature: 'Stereotypy',
    featureMl: 'സ്റ്റീരിയോട്ടൈപ്പി',
    description: 'Repetitive, abnormally frequent, non-goal-directed movements.',
    descriptionMl: 'ആവർത്തിച്ചുള്ള, അസാധാരണമായി ഇടയ്ക്കിടെ, ലക്ഷ്യബോധമില്ലാത്ത ചലനങ്ങൾ.',
  },
  {
    id: 'd9',
    feature: 'Agitation',
    featureMl: 'അജിറ്റേഷൻ',
    description: 'Agitation, not influenced by external stimuli.',
    descriptionMl: 'ബാഹ്യ ഉത്തേജനങ്ങളാൽ സ്വാധീനിക്കപ്പെടാത്ത അസ്വസ്ഥത.',
  },
  {
    id: 'd10',
    feature: 'Grimacing',
    featureMl: 'ഗ്രിമേസിംഗ്',
    description: 'Maintenance of odd facial expressions.',
    descriptionMl: 'വിചിത്രമായ മുഖഭാവങ്ങളുടെ പരിപാലനം.',
  },
  {
    id: 'd11',
    feature: 'Echolalia',
    featureMl: 'എക്കോലേലിയ',
    description: "Mimicking another's speech.",
    descriptionMl: 'മറ്റൊരാളുടെ സംസാരം അനുകരിക്കുന്നു.',
  },
  {
    id: 'd12',
    feature: 'Echopraxia',
    featureMl: 'എക്കോപ്രാക്സിയ',
    description: "Mimicking another's movements.",
    descriptionMl: 'മറ്റൊരാളുടെ ചലനങ്ങൾ അനുകരിക്കുന്നു.',
  },
];

export const DSM5_CATATONIA_THRESHOLD = 3;
