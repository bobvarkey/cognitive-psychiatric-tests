// FRAT — Falls Risk Assessment Tool (Peninsula Health, Victoria, Australia)
// Part 1: 4 risk factors scored 1–4 each (max 20). Risk bands:
//   5–11 Low | 12–15 Medium | 16–20 High.
// Plus an "Automatic High Risk" flag and Part 2 risk-factor checklist.
//
// References:
//   Stapleton C, Hough P, Oldmeadow L, Bull K, Hill K, Greenwood K.
//   Four-item Fall Risk Screening Tool for Subacute and Residential Aged
//   Care: the first step in fall prevention. Australas J Ageing.
//   2009;28(3):139–143.  https://doi.org/10.1111/j.1741-6612.2009.00375.x
//   BMJ 2025;392:s223 — clinical update on inpatient falls assessment.

export interface FratOption {
  label: string;
  labelMl: string;
  value: 1 | 2 | 3 | 4;
}

export interface FratItem {
  id: 'recentFalls' | 'medications' | 'psychological' | 'cognitive';
  name: string;
  nameMl: string;
  description: string;
  descriptionMl: string;
  options: FratOption[];
}

export const FRAT_ITEMS: FratItem[] = [
  {
    id: 'recentFalls',
    name: 'Recent Falls',
    nameMl: 'അടുത്ത കാലത്തെ വീഴ്ചകൾ',
    description: 'In the past 12 months',
    descriptionMl: 'കഴിഞ്ഞ 12 മാസത്തിനുള്ളിൽ',
    options: [
      { label: 'None in last 12 months', labelMl: 'കഴിഞ്ഞ 12 മാസത്തിൽ ഇല്ല', value: 2 },
      { label: 'One or more between 3 and 12 months ago', labelMl: '3–12 മാസം മുമ്പ് ഒന്നോ അതിലധികമോ', value: 4 },
      { label: 'One or more in last 3 months', labelMl: 'കഴിഞ്ഞ 3 മാസത്തിൽ ഒന്നോ അതിലധികമോ', value: 6 },
      { label: 'One or more in last 3 months whilst inpatient / resident', labelMl: 'കഴിഞ്ഞ 3 മാസത്തിനുള്ളിൽ ഇൻപേഷ്യന്റ്/റസിഡന്റ് ആയിരിക്കെ', value: 8 },
    ] as unknown as FratOption[], // values 2/4/6/8 (FRAT scoring)
  },
  {
    id: 'medications',
    name: 'Medications',
    nameMl: 'മരുന്നുകൾ',
    description: 'Sedatives, antidepressants, anti-Parkinson\'s, diuretics, antihypertensives, hypnotics',
    descriptionMl: 'സെഡേറ്റീവുകൾ, ആന്റിഡിപ്രസന്റുകൾ, ആന്റി-പാർക്കിൻസൺ, ഡയൂററ്റിക്സ്, ആന്റിഹൈപ്പർടെൻസീവ്സ്, ഹിപ്നോട്ടിക്സ്',
    options: [
      { label: 'Not taking any of these', labelMl: 'ഇവയിലൊന്നും കഴിക്കുന്നില്ല', value: 1 },
      { label: 'Taking one', labelMl: 'ഒന്ന് കഴിക്കുന്നു', value: 2 },
      { label: 'Taking two', labelMl: 'രണ്ട് കഴിക്കുന്നു', value: 3 },
      { label: 'Taking more than two', labelMl: 'രണ്ടിലധികം കഴിക്കുന്നു', value: 4 },
    ],
  },
  {
    id: 'psychological',
    name: 'Psychological',
    nameMl: 'മാനസികം',
    description: 'Anxiety, depression, ↓cooperation, ↓insight or ↓judgement (esp. re: mobility)',
    descriptionMl: 'ഉത്കണ്ഠ, വിഷാദം, സഹകരണക്കുറവ്, ഉൾക്കാഴ്ച/വിവേചനക്കുറവ് (പ്രത്യേകിച്ച് ചലനത്തെക്കുറിച്ച്)',
    options: [
      { label: 'Does not appear to have any of these', labelMl: 'ഇവയൊന്നും കാണപ്പെടുന്നില്ല', value: 1 },
      { label: 'Appears mildly affected by one or more', labelMl: 'ഒന്നോ അതിലധികമോ കൊണ്ട് നേരിയ തോതിൽ ബാധിച്ചതായി തോന്നുന്നു', value: 2 },
      { label: 'Appears moderately affected by one or more', labelMl: 'മിതമായി ബാധിച്ചതായി തോന്നുന്നു', value: 3 },
      { label: 'Appears severely affected by one or more', labelMl: 'ഗുരുതരമായി ബാധിച്ചതായി തോന്നുന്നു', value: 4 },
    ],
  },
  {
    id: 'cognitive',
    name: 'Cognitive Status',
    nameMl: 'കോഗ്നിറ്റീവ് നില',
    description: 'AMTS (Hodkinson Abbreviated Mental Test Score)',
    descriptionMl: 'AMTS (ഹോഡ്കിൻസൺ അബ്രീവിയേറ്റഡ് മാനസിക പരീക്ഷാ സ്കോർ)',
    options: [
      { label: 'AMTS 9 or 10/10 — intact', labelMl: 'AMTS 9 അല്ലെങ്കിൽ 10/10 — സാധാരണം', value: 1 },
      { label: 'AMTS 7–8 — mildly impaired', labelMl: 'AMTS 7–8 — നേരിയ വൈകല്യം', value: 2 },
      { label: 'AMTS 5–6 — moderately impaired', labelMl: 'AMTS 5–6 — മിതമായ വൈകല്യം', value: 3 },
      { label: 'AMTS 4 or less — severely impaired', labelMl: 'AMTS 4 അല്ലെങ്കിൽ കുറവ് — ഗുരുതര വൈകല്യം', value: 4 },
    ],
  },
];

export const FRAT_AUTOMATIC_HIGH_RISK = [
  {
    id: 'functionalChange',
    label: 'Recent change in functional status and/or medications affecting safe mobility (or anticipated)',
    labelMl: 'സുരക്ഷിതമായ ചലനത്തെ ബാധിക്കുന്ന പ്രവർത്തന നില/മരുന്നുകളിലെ അടുത്തിടെയുണ്ടായ മാറ്റം (അല്ലെങ്കിൽ പ്രതീക്ഷിക്കുന്നത്)',
  },
  {
    id: 'orthostatic',
    label: 'Dizziness / postural hypotension',
    labelMl: 'തലകറക്കം / പോസ്ചറൽ ഹൈപ്പോടെൻഷൻ',
  },
];

export const FRAT_RISK_FACTOR_CHECKLIST = [
  {
    id: 'vision',
    domain: 'Vision',
    domainMl: 'കാഴ്ച',
    item: 'Reports / observed difficulty seeing — objects, signs, finding way around',
    itemMl: 'കാണാൻ ബുദ്ധിമുട്ട് — വസ്തുക്കൾ, അടയാളങ്ങൾ, വഴി കണ്ടെത്തൽ',
  },
  {
    id: 'mobility',
    domain: 'Mobility',
    domainMl: 'ചലനം',
    item: 'Mobility status unknown or appears unsafe / impulsive / forgets gait aid',
    itemMl: 'ചലന നില അജ്ഞാതം / സുരക്ഷിതമല്ല / ആവേശപരം / സഹായ ഉപകരണം മറക്കുന്നു',
  },
  {
    id: 'transfers',
    domain: 'Transfers',
    domainMl: 'കൈമാറ്റം',
    item: 'Transfer status unknown or appears unsafe (e.g., over-reaches, impulsive)',
    itemMl: 'കൈമാറ്റ നില അജ്ഞാതം അല്ലെങ്കിൽ അസുരക്ഷിതം',
  },
  {
    id: 'behavioursAgitation',
    domain: 'Behaviours',
    domainMl: 'പെരുമാറ്റം',
    item: 'Observed or reported agitation, confusion, disorientation',
    itemMl: 'ഉദ്വേഗം, ആശയക്കുഴപ്പം, ദിശാബോധക്കുറവ്',
  },
  {
    id: 'behavioursNonCompliant',
    domain: 'Behaviours',
    domainMl: 'പെരുമാറ്റം',
    item: 'Difficulty following instructions or non-compliant (observed or known)',
    itemMl: 'നിർദ്ദേശങ്ങൾ പിന്തുടരാൻ ബുദ്ധിമുട്ട് / സഹകരിക്കാത്ത സ്വഭാവം',
  },
  {
    id: 'adlRiskTaking',
    domain: 'ADLs',
    domainMl: 'ദൈനംദിന പ്രവർത്തനങ്ങൾ',
    item: 'Observed risk-taking behaviours, or reported from referrer / previous facility',
    itemMl: 'അപകടകരമായ പെരുമാറ്റങ്ങൾ',
  },
  {
    id: 'adlEquipment',
    domain: 'ADLs',
    domainMl: 'ദൈനംദിന പ്രവർത്തനങ്ങൾ',
    item: 'Observed unsafe use of equipment',
    itemMl: 'ഉപകരണങ്ങളുടെ അസുരക്ഷിതമായ ഉപയോഗം',
  },
  {
    id: 'adlFootwear',
    domain: 'ADLs',
    domainMl: 'ദൈനംദിന പ്രവർത്തനങ്ങൾ',
    item: 'Unsafe footwear / inappropriate clothing',
    itemMl: 'അസുരക്ഷിതമായ പാദരക്ഷകൾ / അനുയോജ്യമല്ലാത്ത വസ്ത്രം',
  },
  {
    id: 'environment',
    domain: 'Environment',
    domainMl: 'പരിസരം',
    item: 'Difficulties with orientation to environment (e.g., bed/bathroom/dining)',
    itemMl: 'പരിസരവുമായി പൊരുത്തപ്പെടാൻ ബുദ്ധിമുട്ട്',
  },
  {
    id: 'nutrition',
    domain: 'Nutrition',
    domainMl: 'പോഷകാഹാരം',
    item: 'Underweight / low appetite',
    itemMl: 'ഭാരക്കുറവ് / വിശപ്പില്ലായ്മ',
  },
  {
    id: 'continence',
    domain: 'Continence',
    domainMl: 'മൂത്രനിയന്ത്രണം',
    item: 'Reported or known urgency / nocturia / accidents',
    itemMl: 'അടിയന്തിരത / രാത്രി മൂത്രമൊഴിക്കൽ / അനിയന്ത്രണം',
  },
];

// FRAT Part 1 risk band from total score (5–20)
export type FratBand = 'low' | 'medium' | 'high';

export const fratBandFromScore = (score: number): FratBand => {
  if (score >= 16) return 'high';
  if (score >= 12) return 'medium';
  return 'low';
};

export const FRAT_BAND_LABELS: Record<FratBand, { en: string; ml: string; range: string }> = {
  low: { en: 'Low Risk', ml: 'കുറഞ്ഞ അപകടസാധ്യത', range: '5–11' },
  medium: { en: 'Medium Risk', ml: 'മിതമായ അപകടസാധ്യത', range: '12–15' },
  high: { en: 'High Risk', ml: 'ഉയർന്ന അപകടസാധ്യത', range: '16–20' },
};
