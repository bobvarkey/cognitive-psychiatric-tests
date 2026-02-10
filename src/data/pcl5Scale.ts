import { Pcl5Item } from '@/types/pcl5';

export const pcl5Items: Pcl5Item[] = [
  {
    id: 0,
    text: "Sometimes things happen to people that are unusually or especially frightening, horrible, or traumatic. For example: a serious accident or fire, a physical or sexual assault or abuse, an earthquake or flood, a war, seeing someone be killed or seriously injured, or having a loved one die through homicide or suicide. Have you ever experienced this kind of event?",
    textMl: "ചിലപ്പോൾ ആളുകൾക്ക് അസാധാരണമായ അല്ലെങ്കിൽ പ്രത്യേകിച്ച് ഭയപ്പെടുത്തുന്ന, ഭയാനകമായ അല്ലെങ്കിൽ ആഘാതകരമായ കാര്യങ്ങൾ സംഭവിക്കുന്നു. ഉദാഹരണത്തിന്: ഗുരുതരമായ അപകടം അല്ലെങ്കിൽ തീ, ശാരീരികമോ ലൈംഗികമോ ആയ ആക്രമണം അല്ലെങ്കിൽ ദുരുപയോഗം, ഭൂകമ്പം അല്ലെങ്കിൽ വെള്ളപ്പൊക്കം, യുദ്ധം, ആരെയെങ്കിലും കൊല്ലപ്പെടുകയോ ഗുരുതരമായി പരിക്കേൽക്കുകയോ ചെയ്യുന്നത് കാണുക, അല്ലെങ്കിൽ പ്രിയപ്പെട്ട ഒരാൾ കൊലപാതകമോ ആത്മഹത്യയോ വഴി മരിക്കുക. നിങ്ങൾക്ക് എപ്പോഴെങ്കിലും ഇത്തരത്തിലുള്ള സംഭവം അനുഭവപ്പെട്ടിട്ടുണ്ടോ?",
    type: 'screening'
  },
  {
    id: 1,
    text: "In the past month, have you had nightmares about the event(s) or thought about the event(s) when you did not want to?",
    textMl: "കഴിഞ്ഞ മാസത്തിൽ, സംഭവത്തെക്കുറിച്ച് ദുസ്സ്വപ്നങ്ങൾ ഉണ്ടായിട്ടുണ്ടോ അല്ലെങ്കിൽ നിങ്ങൾ ആഗ്രഹിക്കാത്ത സമയങ്ങളിൽ സംഭവത്തെക്കുറിച്ച് ചിന്തിച്ചിട്ടുണ്ടോ?",
    type: 'question'
  },
  {
    id: 2,
    text: "In the past month, have you tried hard not to think about the event(s) or went out of your way to avoid situations that reminded you of the event(s)?",
    textMl: "കഴിഞ്ഞ മാസത്തിൽ, സംഭവത്തെക്കുറിച്ച് ചിന്തിക്കാതിരിക്കാൻ കഠിനമായി ശ്രമിച്ചിട്ടുണ്ടോ അല്ലെങ്കിൽ സംഭവം ഓർമ്മിപ്പിക്കുന്ന സാഹചര്യങ്ങൾ ഒഴിവാക്കാൻ പ്രത്യേകം ശ്രമിച്ചിട്ടുണ്ടോ?",
    type: 'question'
  },
  {
    id: 3,
    text: "In the past month, have you been constantly on guard, watchful, or easily startled?",
    textMl: "കഴിഞ്ഞ മാസത്തിൽ, നിങ്ങൾ നിരന്തരം ജാഗ്രത പാലിക്കുകയോ, കാവൽ നിൽക്കുകയോ, അല്ലെങ്കിൽ എളുപ്പത്തിൽ ഞെട്ടിപ്പോകുകയോ ചെയ്തിട്ടുണ്ടോ?",
    type: 'question'
  },
  {
    id: 4,
    text: "In the past month, have you felt numb or detached from people, activities, or your surroundings?",
    textMl: "കഴിഞ്ഞ മാസത്തിൽ, ആളുകളിൽ നിന്നോ, പ്രവർത്തനങ്ങളിൽ നിന്നോ, അല്ലെങ്കിൽ നിങ്ങളുടെ ചുറ്റുപാടുകളിൽ നിന്നോ വിച്ഛേദിക്കപ്പെട്ടതായോ മരവിച്ചതായോ തോന്നിയിട്ടുണ്ടോ?",
    type: 'question'
  },
  {
    id: 5,
    text: "In the past month, have you felt guilty or unable to stop blaming yourself or others for the event(s) or any problems the event(s) may have caused?",
    textMl: "കഴിഞ്ഞ മാസത്തിൽ, സംഭവത്തിനോ അല്ലെങ്കിൽ സംഭവം ഉണ്ടാക്കിയേക്കാവുന്ന ഏതെങ്കിലും പ്രശ്നങ്ങൾക്കോ നിങ്ങളെത്തന്നെയോ മറ്റുള്ളവരെയോ കുറ്റപ്പെടുത്തുന്നത് നിർത്താൻ കഴിയാതെ പോകുകയോ കുറ്റബോധം തോന്നുകയോ ചെയ്തിട്ടുണ്ടോ?",
    type: 'question'
  }
];

export const pcl5ScoreOptions = [
  { value: 0, label: 'No', labelMl: 'ഇല്ല' },
  { value: 1, label: 'Yes', labelMl: 'ഉണ്ട്' }
];
