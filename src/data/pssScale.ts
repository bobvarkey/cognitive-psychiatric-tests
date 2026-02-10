import { PssItem } from '@/types/pss';

// PSS-10: Perceived Stress Scale (10-item version)
// Items 4, 5, 7, and 8 are reverse-scored
export const PSS_ITEMS: PssItem[] = [
  {
    id: 1,
    question: "In the last month, how often have you been upset because of something that happened unexpectedly?",
    questionMl: "കഴിഞ്ഞ മാസത്തിൽ, പ്രതീക്ഷിക്കാതെ എന്തെങ്കിലും സംഭവിച്ചതിനാൽ നിങ്ങൾ എത്ര തവണ അസ്വസ്ഥരായി?",
    isReversed: false
  },
  {
    id: 2,
    question: "In the last month, how often have you felt that you were unable to control the important things in your life?",
    questionMl: "കഴിഞ്ഞ മാസത്തിൽ, നിങ്ങളുടെ ജീവിതത്തിലെ പ്രധാനപ്പെട്ട കാര്യങ്ങൾ നിയന്ത്രിക്കാൻ കഴിയില്ലെന്ന് നിങ്ങൾക്ക് എത്ര തവണ തോന്നി?",
    isReversed: false
  },
  {
    id: 3,
    question: "In the last month, how often have you felt nervous and stressed?",
    questionMl: "കഴിഞ്ഞ മാസത്തിൽ, നിങ്ങൾക്ക് എത്ര തവണ ഉത്കണ്ഠയും സമ്മർദ്ദവും അനുഭവപ്പെട്ടു?",
    isReversed: false
  },
  {
    id: 4,
    question: "In the last month, how often have you felt confident about your ability to handle your personal problems?",
    questionMl: "കഴിഞ്ഞ മാസത്തിൽ, നിങ്ങളുടെ വ്യക്തിപരമായ പ്രശ്നങ്ങൾ കൈകാര്യം ചെയ്യാനുള്ള കഴിവിൽ നിങ്ങൾക്ക് എത്ര തവണ ആത്മവിശ്വാസം തോന്നി?",
    isReversed: true
  },
  {
    id: 5,
    question: "In the last month, how often have you felt that things were going your way?",
    questionMl: "കഴിഞ്ഞ മാസത്തിൽ, കാര്യങ്ങൾ നിങ്ങളുടെ വഴിക്ക് പോകുന്നുണ്ടെന്ന് നിങ്ങൾക്ക് എത്ര തവണ തോന്നി?",
    isReversed: true
  },
  {
    id: 6,
    question: "In the last month, how often have you found that you could not cope with all the things that you had to do?",
    questionMl: "കഴിഞ്ഞ മാസത്തിൽ, നിങ്ങൾ ചെയ്യേണ്ട എല്ലാ കാര്യങ്ങളുമായി പൊരുത്തപ്പെടാൻ കഴിഞ്ഞില്ലെന്ന് നിങ്ങൾക്ക് എത്ര തവണ തോന്നി?",
    isReversed: false
  },
  {
    id: 7,
    question: "In the last month, how often have you been able to control irritations in your life?",
    questionMl: "കഴിഞ്ഞ മാസത്തിൽ, നിങ്ങളുടെ ജീവിതത്തിലെ പ്രകോപനങ്ങൾ നിയന്ത്രിക്കാൻ നിങ്ങൾക്ക് എത്ര തവണ കഴിഞ്ഞു?",
    isReversed: true
  },
  {
    id: 8,
    question: "In the last month, how often have you felt that you were on top of things?",
    questionMl: "കഴിഞ്ഞ മാസത്തിൽ, കാര്യങ്ങളുടെ മുകളിൽ നിങ്ങളാണെന്ന് നിങ്ങൾക്ക് എത്ര തവണ തോന്നി?",
    isReversed: true
  },
  {
    id: 9,
    question: "In the last month, how often have you been angered because of things that happened that were outside of your control?",
    questionMl: "കഴിഞ്ഞ മാസത്തിൽ, നിങ്ങളുടെ നിയന്ത്രണത്തിന് പുറത്തുള്ള കാര്യങ്ങൾ സംഭവിച്ചതിനാൽ നിങ്ങൾക്ക് എത്ര തവണ ദേഷ്യം തോന്നി?",
    isReversed: false
  },
  {
    id: 10,
    question: "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
    questionMl: "കഴിഞ്ഞ മാസത്തിൽ, ബുദ്ധിമുട്ടുകൾ വളരെ ഉയരത്തിൽ കൂടിക്കൂടി വരുന്നതിനാൽ അവ മറികടക്കാൻ കഴിയില്ലെന്ന് നിങ്ങൾക്ക് എത്ര തവണ തോന്നി?",
    isReversed: false
  }
];

export const PSS_OPTIONS = [
  { value: 0, label: "Never", labelMl: "ഒരിക്കലും ഇല്ല" },
  { value: 1, label: "Almost Never", labelMl: "ഏതാണ്ട് ഒരിക്കലും ഇല്ല" },
  { value: 2, label: "Sometimes", labelMl: "ചിലപ്പോൾ" },
  { value: 3, label: "Fairly Often", labelMl: "മിക്കവാറും" },
  { value: 4, label: "Very Often", labelMl: "വളരെ കൂടുതൽ" }
];
