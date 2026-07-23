import { Pcl5Item } from '@/types/pcl5';

// Full PCL-5: 20-item DSM-5 PTSD Checklist + LEC-style trauma exposure screener (item 0).
// Symptom items are rated 0–4 based on how bothersome each problem has been in the past month.
// Clusters: B (Intrusion) 1–5, C (Avoidance) 6–7, D (Negative alterations in cognition/mood) 8–14,
// E (Alterations in arousal & reactivity) 15–20.
export const pcl5Items: Pcl5Item[] = [
  {
    id: 0,
    text: "Sometimes things happen to people that are unusually or especially frightening, horrible, or traumatic. For example: a serious accident or fire, a physical or sexual assault or abuse, an earthquake or flood, a war, seeing someone be killed or seriously injured, or having a loved one die through homicide or suicide. Have you ever experienced this kind of event?",
    textMl: "ചിലപ്പോൾ ആളുകൾക്ക് അസാധാരണമായ അല്ലെങ്കിൽ പ്രത്യേകിച്ച് ഭയപ്പെടുത്തുന്ന, ഭയാനകമായ അല്ലെങ്കിൽ ആഘാതകരമായ കാര്യങ്ങൾ സംഭവിക്കുന്നു. നിങ്ങൾക്ക് എപ്പോഴെങ്കിലും ഇത്തരത്തിലുള്ള സംഭവം അനുഭവപ്പെട്ടിട്ടുണ്ടോ?",
    type: 'screening',
    cluster: 'screen'
  },
  // Cluster B — Intrusion (1–5)
  { id: 1, cluster: 'B', text: "Repeated, disturbing, and unwanted memories of the stressful experience?", textMl: "സമ്മർദ്ദകരമായ അനുഭവത്തിന്റെ ആവർത്തിച്ചുള്ള, അസ്വസ്ഥമാക്കുന്ന ഓർമ്മകൾ?" , type: 'question' },
  { id: 2, cluster: 'B', text: "Repeated, disturbing dreams of the stressful experience?", textMl: "സമ്മർദ്ദകരമായ അനുഭവത്തിന്റെ ആവർത്തിച്ചുള്ള ദുസ്വപ്നങ്ങൾ?", type: 'question' },
  { id: 3, cluster: 'B', text: "Suddenly feeling or acting as if the stressful experience were actually happening again (flashbacks)?", textMl: "സമ്മർദ്ദകരമായ അനുഭവം വീണ്ടും സംഭവിക്കുന്നതുപോലെ പെട്ടെന്ന് അനുഭവപ്പെടുകയോ പെരുമാറുകയോ ചെയ്യുക (ഫ്ലാഷ്ബാക്കുകൾ)?", type: 'question' },
  { id: 4, cluster: 'B', text: "Feeling very upset when something reminded you of the stressful experience?", textMl: "സമ്മർദ്ദകരമായ അനുഭവം ഓർമ്മിപ്പിക്കുന്ന എന്തെങ്കിലും കണ്ടപ്പോൾ വളരെ അസ്വസ്ഥത അനുഭവപ്പെടുക?", type: 'question' },
  { id: 5, cluster: 'B', text: "Having strong physical reactions when something reminded you of the stressful experience (heart pounding, trouble breathing, sweating)?", textMl: "ഓർമ്മപ്പെടുത്തലുകൾക്ക് ശക്തമായ ശാരീരിക പ്രതികരണങ്ങൾ (ഹൃദയമിടിപ്പ്, ശ്വാസതടസ്സം, വിയർപ്പ്)?", type: 'question' },
  // Cluster C — Avoidance (6–7)
  { id: 6, cluster: 'C', text: "Avoiding memories, thoughts, or feelings related to the stressful experience?", textMl: "സമ്മർദ്ദകരമായ അനുഭവവുമായി ബന്ധപ്പെട്ട ഓർമ്മകൾ, ചിന്തകൾ അല്ലെങ്കിൽ വികാരങ്ങൾ ഒഴിവാക്കുക?", type: 'question' },
  { id: 7, cluster: 'C', text: "Avoiding external reminders of the stressful experience (people, places, conversations, activities, objects, or situations)?", textMl: "ബാഹ്യമായ ഓർമ്മപ്പെടുത്തലുകൾ (ആളുകൾ, സ്ഥലങ്ങൾ, സംഭാഷണങ്ങൾ, പ്രവർത്തനങ്ങൾ, വസ്തുക്കൾ) ഒഴിവാക്കുക?", type: 'question' },
  // Cluster D — Negative alterations in cognitions and mood (8–14)
  { id: 8, cluster: 'D', text: "Trouble remembering important parts of the stressful experience?", textMl: "സമ്മർദ്ദകരമായ അനുഭവത്തിന്റെ പ്രധാന ഭാഗങ്ങൾ ഓർമ്മിക്കാൻ ബുദ്ധിമുട്ട്?", type: 'question' },
  { id: 9, cluster: 'D', text: "Having strong negative beliefs about yourself, other people, or the world (e.g., 'I am bad,' 'no one can be trusted,' 'the world is completely dangerous')?", textMl: "സ്വയത്തെക്കുറിച്ചോ മറ്റുള്ളവരെക്കുറിച്ചോ ലോകത്തെക്കുറിച്ചോ ശക്തമായ നിഷേധാത്മക വിശ്വാസങ്ങൾ?", type: 'question' },
  { id: 10, cluster: 'D', text: "Blaming yourself or someone else for the stressful experience or what happened after it?", textMl: "സംഭവത്തിനോ അതിനുശേഷം സംഭവിച്ചതിനോ സ്വയത്തെയോ മറ്റാരെയെങ്കിലുമോ കുറ്റപ്പെടുത്തുക?", type: 'question' },
  { id: 11, cluster: 'D', text: "Having strong negative feelings such as fear, horror, anger, guilt, or shame?", textMl: "ഭയം, ഭീകരത, കോപം, കുറ്റബോധം അല്ലെങ്കിൽ നാണക്കേട് പോലുള്ള ശക്തമായ നിഷേധാത്മക വികാരങ്ങൾ?", type: 'question' },
  { id: 12, cluster: 'D', text: "Loss of interest in activities that you used to enjoy?", textMl: "മുമ്പ് ആസ്വദിച്ചിരുന്ന പ്രവർത്തനങ്ങളിലുള്ള താൽപ്പര്യം നഷ്ടപ്പെടുക?", type: 'question' },
  { id: 13, cluster: 'D', text: "Feeling distant or cut off from other people?", textMl: "മറ്റുള്ളവരിൽ നിന്ന് അകലം അല്ലെങ്കിൽ വിച്ഛേദിക്കപ്പെട്ടതായി തോന്നുക?", type: 'question' },
  { id: 14, cluster: 'D', text: "Trouble experiencing positive feelings (unable to feel happiness or love for people close to you)?", textMl: "പോസിറ്റീവ് വികാരങ്ങൾ അനുഭവിക്കാൻ ബുദ്ധിമുട്ട് (സന്തോഷമോ സ്നേഹമോ അനുഭവിക്കാൻ കഴിയാതെ വരിക)?", type: 'question' },
  // Cluster E — Alterations in arousal and reactivity (15–20)
  { id: 15, cluster: 'E', text: "Irritable behavior, angry outbursts, or acting aggressively?", textMl: "ദേഷ്യപ്പെരുമാറ്റം, കോപപ്രകടനങ്ങൾ, അല്ലെങ്കിൽ ആക്രമണാത്മകമായി പ്രവർത്തിക്കുക?", type: 'question' },
  { id: 16, cluster: 'E', text: "Taking too many risks or doing things that could cause you harm?", textMl: "വളരെയധികം അപകടസാധ്യതകൾ ഏറ്റെടുക്കുകയോ ഹാനികരമായ കാര്യങ്ങൾ ചെയ്യുകയോ ചെയ്യുക?", type: 'question' },
  { id: 17, cluster: 'E', text: "Being 'super-alert' or watchful or on guard?", textMl: "അമിതജാഗ്രത, കാവൽ പുലർത്തുക?", type: 'question' },
  { id: 18, cluster: 'E', text: "Feeling jumpy or easily startled?", textMl: "എളുപ്പത്തിൽ ഞെട്ടിപ്പോകുക?", type: 'question' },
  { id: 19, cluster: 'E', text: "Having difficulty concentrating?", textMl: "ശ്രദ്ധ കേന്ദ്രീകരിക്കാൻ ബുദ്ധിമുട്ട്?", type: 'question' },
  { id: 20, cluster: 'E', text: "Trouble falling or staying asleep?", textMl: "ഉറക്കം വരാനോ ഉറങ്ങിക്കിടക്കാനോ ബുദ്ധിമുട്ട്?", type: 'question' },
];

// Symptom items use a 0–4 Likert scale.
export const pcl5ScoreOptions = [
  { value: 0, label: 'Not at all', labelMl: 'ഒട്ടും ഇല്ല' },
  { value: 1, label: 'A little bit', labelMl: 'അൽപ്പം' },
  { value: 2, label: 'Moderately', labelMl: 'മിതമായി' },
  { value: 3, label: 'Quite a bit', labelMl: 'നല്ല തോതിൽ' },
  { value: 4, label: 'Extremely', labelMl: 'അതികഠിനമായി' },
];

// Screening (item 0) uses Yes/No.
export const pcl5ScreeningOptions = [
  { value: 0, label: 'No', labelMl: 'ഇല്ല' },
  { value: 1, label: 'Yes', labelMl: 'ഉണ്ട്' },
];
