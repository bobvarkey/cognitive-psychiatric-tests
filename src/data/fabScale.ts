import { FabItem } from '@/types/fab';

export const fabItems: FabItem[] = [
  {
    id: 1,
    domain: "Similarities (Conceptualization)",
    domainMl: "സാമ്യതകൾ (സങ്കൽപ്പനം)",
    task: "In what way are they alike?",
    taskMl: "അവ എങ്ങനെ സമാനമാണ്?",
    instruction: "Ask: 'In what way are they alike?' for:\n• A banana and an orange\n• A table and a chair\n• A tulip, a rose and a daisy",
    instructionMl: "ചോദിക്കുക: 'അവ എങ്ങനെ സമാനമാണ്?' എന്ന്:\n• വാഴപ്പഴവും ഓറഞ്ചും\n• ഒരു മേശയും കസേരയും\n• ഒരു ട്യൂലിപ്പ്, റോസ്, ഡെയ്സി",
    scoring: [
      { score: 3, criteria: "Three correct category responses (fruits, furniture, flowers)", criteriaMl: "മൂന്ന് ശരിയായ വിഭാഗ ഉത്തരങ്ങൾ (പഴങ്ങൾ, ഫർണിച്ചർ, പൂക്കൾ)" },
      { score: 2, criteria: "Two correct category responses", criteriaMl: "രണ്ട് ശരിയായ വിഭാഗ ഉത്തരങ്ങൾ" },
      { score: 1, criteria: "One correct category response", criteriaMl: "ഒരു ശരിയായ വിഭാഗ ഉത്തരം" },
      { score: 0, criteria: "None correct", criteriaMl: "ഒന്നും ശരിയല്ല" }
    ]
  },
  {
    id: 2,
    domain: "Lexical Fluency (Mental Flexibility)",
    domainMl: "പദ പ്രവാഹം (മാനസിക വഴക്കം)",
    task: "Say as many words as you can beginning with 'S'",
    taskMl: "'S' എന്ന അക്ഷരം കൊണ്ട് തുടങ്ങുന്ന കഴിയുന്നത്ര വാക്കുകൾ പറയുക",
    instruction: "Ask patient to say as many words beginning with 'S' in 60 seconds (no surnames or proper nouns). If no response in 5 seconds, prompt with 'snake'. If 10 second pause, remind 'any word beginning with S'.",
    instructionMl: "60 സെക്കൻഡിൽ 'S' കൊണ്ട് തുടങ്ങുന്ന എത്ര വാക്കുകൾ കഴിയുമോ അത്ര പറയാൻ രോഗിയോട് ആവശ്യപ്പെടുക (കുടുംബപ്പേരുകളോ സ്വന്തം നാമങ്ങളോ ഇല്ല). 5 സെക്കൻഡിൽ പ്രതികരണമില്ലെങ്കിൽ, 'snake' എന്ന് സൂചിപ്പിക്കുക.",
    scoring: [
      { score: 3, criteria: "More than 9 words", criteriaMl: "9-ൽ കൂടുതൽ വാക്കുകൾ" },
      { score: 2, criteria: "6-9 words", criteriaMl: "6-9 വാക്കുകൾ" },
      { score: 1, criteria: "3-5 words", criteriaMl: "3-5 വാക്കുകൾ" },
      { score: 0, criteria: "Less than 3 words", criteriaMl: "3-ൽ കുറവ് വാക്കുകൾ" }
    ]
  },
  {
    id: 3,
    domain: "Motor Series - Luria Test (Programming)",
    domainMl: "മോട്ടോർ സീരീസ് - ലൂറിയ ടെസ്റ്റ് (പ്രോഗ്രാമിംഗ്)",
    task: "Perform fist-edge-palm series",
    taskMl: "മുഷ്ടി-അറ്റം-ഉള്ളംകൈ സീരീസ് നിർവ്വഹിക്കുക",
    instruction: "Demonstrate fist-edge-palm series 3 times with left hand. Ask patient to do same with right hand, first together 3 times, then alone.",
    instructionMl: "ഇടത് കൈകൊണ്ട് മുഷ്ടി-അറ്റം-ഉള്ളംകൈ സീരീസ് 3 തവണ പ്രദർശിപ്പിക്കുക. വലത് കൈകൊണ്ട് അതേ രീതിയിൽ ചെയ്യാൻ രോഗിയോട് ആവശ്യപ്പെടുക, ആദ്യം 3 തവണ ഒരുമിച്ച്, പിന്നെ തനിയെ.",
    scoring: [
      { score: 3, criteria: "Performs 6 correct consecutive series alone", criteriaMl: "തനിയെ 6 ശരിയായ തുടർച്ചയായ സീരീസുകൾ നിർവ്വഹിക്കുന്നു" },
      { score: 2, criteria: "Performs at least 3 correct consecutive series alone", criteriaMl: "തനിയെ കുറഞ്ഞത് 3 ശരിയായ തുടർച്ചയായ സീരീസുകൾ നിർവ്വഹിക്കുന്നു" },
      { score: 1, criteria: "Fails alone but performs 3 correct series with examiner", criteriaMl: "തനിയെ പരാജയപ്പെടുന്നു എന്നാൽ പരീക്ഷകനോടൊപ്പം 3 ശരിയായ സീരീസുകൾ നിർവ്വഹിക്കുന്നു" },
      { score: 0, criteria: "Cannot perform 3 correct series even with examiner", criteriaMl: "പരീക്ഷകനോടൊപ്പം പോലും 3 ശരിയായ സീരീസുകൾ നിർവ്വഹിക്കാൻ കഴിയുന്നില്ല" }
    ]
  },
  {
    id: 4,
    domain: "Conflicting Instructions (Sensitivity to Interference)",
    domainMl: "വൈരുദ്ധ്യമുള്ള നിർദ്ദേശങ്ങൾ (ഇടപെടലിനുള്ള സംവേദനക്ഷമത)",
    task: "Tap twice when I tap once, tap once when I tap twice",
    taskMl: "ഞാൻ ഒരു തവണ തട്ടുമ്പോൾ രണ്ട് തവണ തട്ടുക, ഞാൻ രണ്ട് തവണ തട്ടുമ്പോൾ ഒരു തവണ തട്ടുക",
    instruction: "Practice: 'Tap twice when I tap once' (3 trials: 1-1-1). Then 'Tap once when I tap twice' (3 trials: 2-2-2). Test series: 1-1-2-1-2-2-2-1-1-2.",
    instructionMl: "പരിശീലനം: 'ഞാൻ ഒരു തവണ തട്ടുമ്പോൾ രണ്ട് തവണ തട്ടുക' (3 ട്രയലുകൾ: 1-1-1). പിന്നെ 'ഞാൻ രണ്ട് തവണ തട്ടുമ്പോൾ ഒരു തവണ തട്ടുക' (3 ട്രയലുകൾ: 2-2-2). പരീക്ഷണ സീരീസ്: 1-1-2-1-2-2-2-1-1-2.",
    scoring: [
      { score: 3, criteria: "No errors", criteriaMl: "തെറ്റുകളൊന്നുമില്ല" },
      { score: 2, criteria: "1-2 errors", criteriaMl: "1-2 തെറ്റുകൾ" },
      { score: 1, criteria: "More than 2 errors", criteriaMl: "2-ൽ കൂടുതൽ തെറ്റുകൾ" },
      { score: 0, criteria: "Patient taps like examiner at least 4 consecutive times", criteriaMl: "രോഗി പരീക്ഷകനെപ്പോലെ കുറഞ്ഞത് 4 തുടർച്ചയായി തട്ടുന്നു" }
    ]
  },
  {
    id: 5,
    domain: "Go-No Go (Inhibitory Control)",
    domainMl: "ഗോ-നോ ഗോ (നിരോധന നിയന്ത്രണം)",
    task: "Tap once when I tap once, do not tap when I tap twice",
    taskMl: "ഞാൻ ഒരു തവണ തട്ടുമ്പോൾ ഒരു തവണ തട്ടുക, ഞാൻ രണ്ട് തവണ തട്ടുമ്പോൾ തട്ടരുത്",
    instruction: "Practice: 'Tap once when I tap once' (3 trials: 1-1-1). Then 'Do not tap when I tap twice' (3 trials: 2-2-2). Test series: 1-1-2-1-2-2-2-1-1-2.",
    instructionMl: "പരിശീലനം: 'ഞാൻ ഒരു തവണ തട്ടുമ്പോൾ ഒരു തവണ തട്ടുക' (3 ട്രയലുകൾ: 1-1-1). പിന്നെ 'ഞാൻ രണ്ട് തവണ തട്ടുമ്പോൾ തട്ടരുത്' (3 ട്രയലുകൾ: 2-2-2). പരീക്ഷണ സീരീസ്: 1-1-2-1-2-2-2-1-1-2.",
    scoring: [
      { score: 3, criteria: "No errors", criteriaMl: "തെറ്റുകളൊന്നുമില്ല" },
      { score: 2, criteria: "1-2 errors", criteriaMl: "1-2 തെറ്റുകൾ" },
      { score: 1, criteria: "More than 2 errors", criteriaMl: "2-ൽ കൂടുതൽ തെറ്റുകൾ" },
      { score: 0, criteria: "Patient taps like examiner at least 4 consecutive times", criteriaMl: "രോഗി പരീക്ഷകനെപ്പോലെ കുറഞ്ഞത് 4 തുടർച്ചയായി തട്ടുന്നു" }
    ]
  },
  {
    id: 6,
    domain: "Prehension Behaviour (Environmental Autonomy)",
    domainMl: "പിടിപ്പിക്കൽ പെരുമാറ്റം (പാരിസ്ഥിതിക സ്വയംഭരണം)",
    task: "Do not take my hands",
    taskMl: "എന്റെ കൈകൾ എടുക്കരുത്",
    instruction: "Patient's hands palm up on knees. Say 'Do not take my hands.' Bring your hands close and touch patient's palms. If patient takes hands, try again with reminder.",
    instructionMl: "രോഗിയുടെ കൈകൾ മുട്ടുകളിൽ ഉള്ളംകൈ മുകളിലേക്ക്. 'എന്റെ കൈകൾ എടുക്കരുത്' എന്ന് പറയുക. നിങ്ങളുടെ കൈകൾ അടുപ്പിച്ച് രോഗിയുടെ ഉള്ളംകൈകൾ സ്പർശിക്കുക. രോഗി കൈകൾ എടുത്താൽ, ഓർമ്മപ്പെടുത്തലോടെ വീണ്ടും ശ്രമിക്കുക.",
    scoring: [
      { score: 3, criteria: "Patient does not take examiner's hands", criteriaMl: "രോഗി പരീക്ഷകന്റെ കൈകൾ എടുക്കുന്നില്ല" },
      { score: 2, criteria: "Patient hesitates and asks what to do", criteriaMl: "രോഗി മടിക്കുകയും എന്തു ചെയ്യണമെന്ന് ചോദിക്കുകയും ചെയ്യുന്നു" },
      { score: 1, criteria: "Patient takes hands without hesitation", criteriaMl: "രോഗി മടിയില്ലാതെ കൈകൾ എടുക്കുന്നു" },
      { score: 0, criteria: "Patient takes hands even after being told not to", criteriaMl: "വേണ്ടെന്ന് പറഞ്ഞതിനു ശേഷവും രോഗി കൈകൾ എടുക്കുന്നു" }
    ]
  }
];
