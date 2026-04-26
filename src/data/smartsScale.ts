// SMARTS — Systematic Monitoring of Adverse events Related to TreatmentS
// Source: Weiden PJ et al. World Psychiatry. 2010;9(2):124-125.
// PMC application notes: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3896136/
//
// Patient-reported yes/no checklist (last 7 days) covering common
// antipsychotic / psychotropic side-effect domains. Designed to flag
// problematic side effects that warrant clinician follow-up; not a severity
// scale.

export interface SmartsItem {
  id: string;
  domain: string;
  question: string;
  questionMl: string;
}

export const SMARTS_ITEMS: SmartsItem[] = [
  {
    id: 's1',
    domain: 'Sedation / Cognition',
    question:
      'Have you been bothered by feeling sleepy or sluggish during the day?',
    questionMl: 'പകൽ സമയത്ത് ഉറക്കം തോന്നുന്നത് അല്ലെങ്കിൽ മന്ദത ശല്യപ്പെടുത്തിയോ?',
  },
  {
    id: 's2',
    domain: 'Movement (EPS)',
    question:
      'Have you been bothered by trembling or shakiness in your hands or body?',
    questionMl: 'കൈകളിലോ ശരീരത്തിലോ വിറ ശല്യപ്പെടുത്തിയോ?',
  },
  {
    id: 's3',
    domain: 'Akathisia',
    question:
      'Have you been bothered by feeling restless, fidgety, or unable to sit still?',
    questionMl: 'അസ്വസ്ഥത, ഇരിക്കാൻ കഴിയായ്മ ശല്യപ്പെടുത്തിയോ?',
  },
  {
    id: 's4',
    domain: 'Movement (Parkinsonism)',
    question:
      'Have you been bothered by stiffness in your muscles or trouble moving?',
    questionMl: 'പേശികളിലെ കാഠിന്യം അല്ലെങ്കിൽ ചലനത്തിലെ ബുദ്ധിമുട്ട് ശല്യപ്പെടുത്തിയോ?',
  },
  {
    id: 's5',
    domain: 'Dyskinesia',
    question:
      'Have you been bothered by unusual or uncontrolled movements of your face, mouth, or body?',
    questionMl:
      'മുഖത്തോ വായിലോ ശരീരത്തിലോ അസാധാരണമോ നിയന്ത്രണാതീതമോ ആയ ചലനങ്ങൾ ശല്യപ്പെടുത്തിയോ?',
  },
  {
    id: 's6',
    domain: 'Metabolic / Weight',
    question:
      'Have you been bothered by weight gain since starting your medication?',
    questionMl: 'മരുന്ന് തുടങ്ങിയശേഷം ശരീരഭാരം കൂടിയത് ശല്യപ്പെടുത്തിയോ?',
  },
  {
    id: 's7',
    domain: 'Sexual / Endocrine',
    question:
      'Have you been bothered by sexual problems (e.g., loss of interest, performance difficulties)?',
    questionMl: 'ലൈംഗിക പ്രശ്നങ്ങൾ (താൽപ്പര്യക്കുറവ്, പ്രകടന ബുദ്ധിമുട്ടുകൾ) ശല്യപ്പെടുത്തിയോ?',
  },
  {
    id: 's8',
    domain: 'Endocrine (Prolactin)',
    question:
      'Have you been bothered by breast swelling, tenderness, or unusual milk production?',
    questionMl: 'സ്തനത്തിലെ വീക്കം, വേദന, അസാധാരണമായ പാൽ ഉൽപ്പാദനം ശല്യപ്പെടുത്തിയോ?',
  },
  {
    id: 's9',
    domain: 'Menstrual',
    question:
      'Have you been bothered by changes in your menstrual periods (if applicable)?',
    questionMl: 'ആർത്തവത്തിലെ മാറ്റങ്ങൾ ശല്യപ്പെടുത്തിയോ (ബാധകമെങ്കിൽ)?',
  },
  {
    id: 's10',
    domain: 'Anticholinergic / Autonomic',
    question:
      'Have you been bothered by dry mouth, constipation, or blurred vision?',
    questionMl: 'വരണ്ട വായ, മലബന്ധം, അല്ലെങ്കിൽ കാഴ്ച മങ്ങൽ ശല്യപ്പെടുത്തിയോ?',
  },
  {
    id: 's11',
    domain: 'Cardiovascular',
    question:
      'Have you been bothered by dizziness, especially when standing up?',
    questionMl: 'പ്രത്യേകിച്ച് എഴുന്നേൽക്കുമ്പോൾ തലകറക്കം ശല്യപ്പെടുത്തിയോ?',
  },
  {
    id: 's12',
    domain: 'Other',
    question:
      'Are there any other side effects from your medication that bother you?',
    questionMl: 'നിങ്ങളെ ശല്യപ്പെടുത്തുന്ന മറ്റേതെങ്കിലും പാർശ്വഫലങ്ങൾ മരുന്നിൽ നിന്ന് ഉണ്ടോ?',
  },
];

export const SMARTS_FOLLOWUP = {
  en: 'For each "Yes" answer, ask: How much does this bother you? (a little / quite a bit / a lot) and clarify whether it interferes with daily activities or adherence.',
  ml: 'ഓരോ "ഉണ്ട്" ഉത്തരത്തിനും ചോദിക്കുക: ഇത് നിങ്ങളെ എത്രമാത്രം ശല്യപ്പെടുത്തുന്നു? (കുറച്ച് / കുറേ / വളരെ കൂടുതൽ) ദൈനംദിന പ്രവർത്തനങ്ങളെയോ മരുന്നിന്റെ പാലനത്തെയോ ബാധിക്കുന്നുണ്ടോ എന്ന് വ്യക്തമാക്കുക.',
};

export const SMARTS_PURPOSE = {
  en: 'Brief patient-rated checklist of common side effects from psychotropic medications (last 7 days). Designed for routine clinical monitoring; positive endorsements should prompt clinician follow-up about severity and impact on adherence.',
  ml: 'സൈക്കോട്രോപിക് മരുന്നുകളിൽ നിന്നുള്ള സാധാരണ പാർശ്വഫലങ്ങൾക്കായുള്ള (കഴിഞ്ഞ 7 ദിവസം) സംക്ഷിപ്തമായ രോഗി-റേറ്റ് ചെയ്ത ചെക്ക്‌ലിസ്റ്റ്. പതിവ് ക്ലിനിക്കൽ നിരീക്ഷണത്തിനായി രൂപകൽപ്പന ചെയ്തത്; പോസിറ്റീവ് മറുപടികൾ തീവ്രതയും മരുന്നിന്റെ പാലനത്തിലുള്ള സ്വാധീനവും കുറിച്ച് ക്ലിനിഷ്യൻ പിന്തുടരൽ ആവശ്യപ്പെടണം.',
};
