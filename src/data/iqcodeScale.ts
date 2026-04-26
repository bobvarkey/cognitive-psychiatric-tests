// Short IQCODE — Informant Questionnaire on Cognitive Decline in the Elderly
// Jorm AF. Centre for Mental Health Research, ANU. 16 items, 5-point scale.
// Score = mean of items (1.0–5.0). Cutoff for cognitive decline: ≥3.31 (commonly 3.31–3.38).

export interface IqcodeItem {
  id: number;
  question: string;
  questionMl: string;
}

export const IQCODE_ITEMS: IqcodeItem[] = [
  { id: 1,  question: 'Remembering things about family and friends e.g. occupations, birthdays, addresses', questionMl: 'കുടുംബാംഗങ്ങളെയും സുഹൃത്തുക്കളെയും കുറിച്ചുള്ള കാര്യങ്ങൾ ഓർക്കൽ (ജോലി, ജന്മദിനം, വിലാസം)' },
  { id: 2,  question: 'Remembering things that have happened recently', questionMl: 'അടുത്തിടെ സംഭവിച്ച കാര്യങ്ങൾ ഓർക്കൽ' },
  { id: 3,  question: 'Recalling conversations a few days later', questionMl: 'കുറച്ച് ദിവസങ്ങൾക്ക് ശേഷം സംഭാഷണങ്ങൾ ഓർക്കൽ' },
  { id: 4,  question: 'Remembering his/her address and telephone number', questionMl: 'സ്വന്തം വിലാസവും ഫോൺ നമ്പറും ഓർക്കൽ' },
  { id: 5,  question: 'Remembering what day and month it is', questionMl: 'ദിവസവും മാസവും ഓർക്കൽ' },
  { id: 6,  question: 'Remembering where things are usually kept', questionMl: 'സാധനങ്ങൾ സാധാരണ എവിടെ വയ്ക്കാറുണ്ടെന്ന് ഓർക്കൽ' },
  { id: 7,  question: 'Remembering where to find things which have been put in a different place from usual', questionMl: 'പതിവില്ലാത്ത സ്ഥലത്ത് വച്ച സാധനങ്ങൾ എവിടെയാണെന്ന് ഓർക്കൽ' },
  { id: 8,  question: 'Knowing how to work familiar machines around the house', questionMl: 'വീട്ടിലെ പരിചിതമായ ഉപകരണങ്ങൾ പ്രവർത്തിപ്പിക്കാൻ അറിയൽ' },
  { id: 9,  question: 'Learning to use a new gadget or machine around the house', questionMl: 'വീട്ടിലെ പുതിയ ഉപകരണം ഉപയോഗിക്കാൻ പഠിക്കൽ' },
  { id: 10, question: 'Learning new things in general', questionMl: 'പൊതുവെ പുതിയ കാര്യങ്ങൾ പഠിക്കൽ' },
  { id: 11, question: 'Following a story in a book or on TV', questionMl: 'പുസ്തകത്തിലോ ടിവിയിലോ ഉള്ള കഥ പിന്തുടരൽ' },
  { id: 12, question: 'Making decisions on everyday matters', questionMl: 'ദൈനംദിന കാര്യങ്ങളിൽ തീരുമാനങ്ങളെടുക്കൽ' },
  { id: 13, question: 'Handling money for shopping', questionMl: 'ഷോപ്പിംഗിനായി പണം കൈകാര്യം ചെയ്യൽ' },
  { id: 14, question: 'Handling financial matters e.g. the pension, dealing with the bank', questionMl: 'സാമ്പത്തിക കാര്യങ്ങൾ കൈകാര്യം ചെയ്യൽ (പെൻഷൻ, ബാങ്ക് ഇടപാടുകൾ)' },
  { id: 15, question: 'Handling other everyday arithmetic problems e.g. knowing how much food to buy, knowing how long between visits from family or friends', questionMl: 'മറ്റ് ദൈനംദിന ഗണിത പ്രശ്നങ്ങൾ കൈകാര്യം ചെയ്യൽ' },
  { id: 16, question: "Using his/her intelligence to understand what's going on and to reason things through", questionMl: 'കാര്യങ്ങൾ മനസ്സിലാക്കാനും യുക്തിപൂർവ്വം ചിന്തിക്കാനും ബുദ്ധി ഉപയോഗിക്കൽ' },
];

export const IQCODE_OPTIONS: { score: 1 | 2 | 3 | 4 | 5; label: string; labelMl: string }[] = [
  { score: 1, label: 'Much improved',  labelMl: 'വളരെയധികം മെച്ചപ്പെട്ടു' },
  { score: 2, label: 'A bit improved', labelMl: 'അൽപ്പം മെച്ചപ്പെട്ടു' },
  { score: 3, label: 'Not much change', labelMl: 'വലിയ മാറ്റമില്ല' },
  { score: 4, label: 'A bit worse',    labelMl: 'അൽപ്പം മോശമായി' },
  { score: 5, label: 'Much worse',     labelMl: 'വളരെയധികം മോശമായി' },
];
