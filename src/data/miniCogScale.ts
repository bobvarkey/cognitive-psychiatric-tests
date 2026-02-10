import { MiniCogItem, MINI_COG_WORD_LISTS } from '@/types/minicog';

export const miniCogScaleEnglish: MiniCogItem[] = [
  {
    id: 'registration',
    step: 'registration',
    title: 'Three Word Registration',
    description: 'The examiner will say three words that you need to remember',
    maxScore: 0,
    instructions: `Look directly at person and say: "Please listen carefully. I am going to say three words that I want you to repeat back to me now and try to remember. The words are [select from one of the versions below]. Please say them for me now." If the person is unable to repeat the words after three attempts, move on to Step 2 (clock drawing).

The following and other word lists have been used in one or more clinical studies. For repeated administrations, use of an alternative word list is recommended.`,
    wordList: MINI_COG_WORD_LISTS[0].words
  },
  {
    id: 'clock',
    step: 'clock',
    title: 'Clock Drawing',
    description: 'Draw a clock with all numbers and set the hands to 10 past 11',
    maxScore: 2,
    instructions: `Say: "Next, I want you to draw a clock for me. First, put in all of the numbers where they go." When that is completed, say: "Now, set the hands to 10 past 11."

Use preprinted circle (see next page) for this exercise. Repeat instructions as needed as this is not a memory test. Move to Step 3 if the clock is not complete within three minutes.

SCORING:
• Normal clock = 2 points. A normal clock has all numbers placed in the correct sequence and approximately correct position (e.g., 12, 3, 6, and 9 are in anchor positions) with no missing or duplicate numbers. Hands are pointing to the 11 and 2 (11:10). Hand length is not scored.
• Inability or refusal to draw a clock (abnormal) = 0 points`,
  },
  {
    id: 'recall',
    step: 'recall',
    title: 'Three Word Recall',
    description: 'Recall the three words from Step 1',
    maxScore: 3,
    instructions: `Ask the person to recall the three words you stated in Step 1. Say: "What were the three words I asked you to remember?" Record the word list version number and the person's answers below.

SCORING:
• 1 point for each word spontaneously recalled without cueing
• Word Recall: ____ (0-3 points)

Total score = Word Recall score + Clock Draw score.

A cut point of <3 on the Mini-Cog™ has been validated for dementia screening, but many individuals with clinically meaningful cognitive impairment will score higher. When greater sensitivity is desired, a cut point of <4 is recommended as it may indicate a need for further evaluation of cognitive status.`,
  }
];

export const miniCogScaleMalayalam: MiniCogItem[] = [
  {
    id: 'registration',
    step: 'registration',
    title: 'മൂന്ന് വാക്ക് രജിസ്ട്രേഷൻ',
    description: 'പരീക്ഷകൻ നിങ്ങൾ ഓർമ്മിക്കേണ്ട മൂന്ന് വാക്കുകൾ പറയും',
    maxScore: 0,
    instructions: `വ്യക്തിയെ നേരിട്ട് നോക്കി പറയുക: "ദയവായി ശ്രദ്ധയോടെ കേൾക്കുക. ഞാൻ മൂന്ന് വാക്കുകൾ പറയാൻ പോകുന്നു, അത് നിങ്ങൾ ഇപ്പോൾ എന്നോട് തിരിച്ച് പറയുകയും ഓർക്കാൻ ശ്രമിക്കുകയും വേണം. വാക്കുകൾ [താഴെയുള്ള പതിപ്പുകളിൽ ഒന്ന് തിരഞ്ഞെടുക്കുക] ആണ്. ദയവായി അവ ഇപ്പോൾ എന്നോട് പറയുക." മൂന്ന് ശ്രമങ്ങൾക്ക് ശേഷവും വ്യക്തിക്ക് വാക്കുകൾ ആവർത്തിക്കാൻ കഴിയുന്നില്ലെങ്കിൽ, ഘട്ടം 2-ലേക്ക് (ക്ലോക്ക് വരയൽ) പോകുക.

ഒന്നോ അതിലധികമോ ക്ലിനിക്കൽ പഠനങ്ങളിൽ താഴെ പറയുന്നതും മറ്റ് വാക്ക് പട്ടികകളും ഉപയോഗിച്ചിട്ടുണ്ട്. ആവർത്തിച്ചുള്ള അഡ്മിനിസ്ട്രേഷനുകൾക്ക്, ഒരു ബദൽ വാക്ക് പട്ടിക ഉപയോഗിക്കാൻ ശുപാർശ ചെയ്യുന്നു.`,
    wordList: MINI_COG_WORD_LISTS[0].wordsMl
  },
  {
    id: 'clock',
    step: 'clock',
    title: 'ക്ലോക്ക് വരയൽ',
    description: 'എല്ലാ സംഖ്യകളും ഉള്ള ഒരു ക്ലോക്ക് വരച്ച് പത്തു മിനിറ്റ് കഴിഞ്ഞ് പതിനൊന്ന് മണി സജ്ജമാക്കുക',
    maxScore: 2,
    instructions: `പറയുക: "അടുത്തത്, എനിക്കായി ഒരു ക്ലോക്ക് വരയ്ക്കണം. ആദ്യം, എല്ലാ സംഖ്യകളും അവ പോകുന്ന സ്ഥലത്ത് ഇടുക." അത് പൂർത്തിയാകുമ്പോൾ, പറയുക: "ഇപ്പോൾ, കൈകൾ പത്തു മിനിറ്റ് കഴിഞ്ഞ് പതിനൊന്ന് മണിയിലേക്ക് സജ്ജമാക്കുക."

ഈ വ്യായാമത്തിനായി മുൻകൂട്ടി അച്ചടിച്ച വൃത്തം (അടുത്ത പേജ് കാണുക) ഉപയോഗിക്കുക. ഇത് ഒരു മെമ്മറി ടെസ്റ്റ് അല്ലാത്തതിനാൽ ആവശ്യാനുസരണം നിർദ്ദേശങ്ങൾ ആവർത്തിക്കുക. മൂന്ന് മിനിറ്റിനുള്ളിൽ ക്ലോക്ക് പൂർത്തിയാകുന്നില്ലെങ്കിൽ ഘട്ടം 3-ലേക്ക് പോകുക.

സ്കോറിംഗ്:
• സാധാരണ ക്ലോക്ക് = 2 പോയിന്റുകൾ. ഒരു സാധാരണ ക്ലോക്കിന് എല്ലാ സംഖ്യകളും ശരിയായ ക്രമത്തിലും ഏകദേശം ശരിയായ സ്ഥാനത്തും (ഉദാ., 12, 3, 6, 9 എന്നിവ ആങ്കർ സ്ഥാനങ്ങളിലാണ്) കാണാതായതോ ഡ്യൂപ്ലിക്കേറ്റ് സംഖ്യകളോ ഇല്ലാതെ സ്ഥാപിച്ചിരിക്കുന്നു. കൈകൾ 11-ഉം 2-ഉം (11:10) ചൂണ്ടുന്നു. കൈ നീളം സ്കോർ ചെയ്യുന്നില്ല.
• ക്ലോക്ക് വരയ്ക്കാനുള്ള കഴിവില്ലായ്മ അല്ലെങ്കിൽ വിസമ്മതം (അസാധാരണം) = 0 പോയിന്റുകൾ`,
  },
  {
    id: 'recall',
    step: 'recall',
    title: 'മൂന്ന് വാക്ക് തിരിച്ചുവിളിക്കൽ',
    description: 'ഘട്ടം 1-ൽ നിന്നുള്ള മൂന്ന് വാക്കുകൾ തിരിച്ചുവിളിക്കുക',
    maxScore: 3,
    instructions: `ഘട്ടം 1-ിൽ നിങ്ങൾ പറഞ്ഞ മൂന്ന് വാക്കുകൾ തിരിച്ചുവിളിക്കാൻ വ്യക്തിയോട് ആവശ്യപ്പെടുക. പറയുക: "ഞാൻ നിങ്ങളോട് ഓർക്കാൻ ആവശ്യപ്പെട്ട മൂന്ന് വാക്കുകൾ എന്തായിരുന്നു?" താഴെ വാക്ക് പട്ടിക പതിപ്പ് നമ്പറും വ്യക്തിയുടെ ഉത്തരങ്ങളും രേഖപ്പെടുത്തുക.

സ്കോറിംഗ്:
• ക്യൂയിംഗ് ഇല്ലാതെ സ്വതഃസ്ഫൂർതമായി തിരിച്ചുവിളിച്ച ഓരോ വാക്കിനും 1 പോയിന്റ്
• വാക്ക് തിരിച്ചുവിളിക്കൽ: ____ (0-3 പോയിന്റുകൾ)

ആകെ സ്കോർ = വാക്ക് തിരിച്ചുവിളിക്കൽ സ്കോർ + ക്ലോക്ക് ഡ്രോ സ്കോർ.

ഡിമെൻഷ്യ സ്ക്രീനിംഗിനായി Mini-Cog™-ൽ <3 എന്ന കട്ട് പോയിന്റ് സാധൂകരിച്ചിട്ടുണ്ട്, എന്നാൽ ക്ലിനിക്കലായി അർത്ഥവത്തായ വൈജ്ഞാനിക വൈകല്യമുള്ള പല വ്യക്തികളും ഉയർന്ന സ്കോർ നേടും. കൂടുതൽ സംവേദനക്ഷമത ആവശ്യമുള്ളപ്പോൾ, <4 എന്ന കട്ട് പോയിന്റ് ശുപാർശ ചെയ്യുന്നു, കാരണം അത് വൈജ്ഞാനിക നിലയുടെ കൂടുതൽ മൂല്യനിർണ്ണയത്തിന്റെ ആവശ്യകത സൂചിപ്പിക്കാം.`,
  }
];
