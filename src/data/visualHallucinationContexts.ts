export interface ClinicalContext {
  condition: string;
  conditionMl: string;
  keyFeatures: string;
  keyFeaturesMl: string;
}

export const visualHallucinationContexts: ClinicalContext[] = [
  {
    condition: "Parkinson's disease",
    conditionMl: "പാർക്കിൻസൺസ് രോഗം",
    keyFeatures: "Occurs throughout PD from early stage disease without cognitive impairment to PDD. Other hallucination modalities can be involved in later stages.",
    keyFeaturesMl: "കോഗ്നിറ്റീവ് വൈകല്യമില്ലാത്ത ആദ്യഘട്ട രോഗം മുതൽ PDD വരെ PD യിലുടനീളം സംഭവിക്കുന്നു. പിന്നീട് മറ്റ് ഹാലൂസിനേഷൻ രീതികളും ഉൾപ്പെടാം."
  },
  {
    condition: "Charles Bonnet syndrome",
    conditionMl: "ചാൾസ് ബോണറ്റ് സിൻഡ്രോം",
    keyFeatures: "Eye or visual pathway disease.",
    keyFeaturesMl: "കണ്ണ് അല്ലെങ്കിൽ വിഷ്വൽ പാത്ത്‌വേ രോഗം."
  },
  {
    condition: "Dementia",
    conditionMl: "ഡിമെൻഷ്യ",
    keyFeatures: "Includes AD, DLB, PDD, VaD. Other hallucination modalities can be involved.",
    keyFeaturesMl: "AD, DLB, PDD, VaD ഉൾപ്പെടുന്നു. മറ്റ് ഹാലൂസിനേഷൻ രീതികളും ഉൾപ്പെടാം."
  },
  {
    condition: "Comorbid disease",
    conditionMl: "കോമോർബിഡ് രോഗം",
    keyFeatures: "Eye and neurodegenerative disease combined.",
    keyFeaturesMl: "കണ്ണും ന്യൂറോഡിജനറേറ്റീവ് രോഗവും സംയോജിപ്പിച്ചത്."
  },
  {
    condition: "Schizophrenia/bipolar disorder",
    conditionMl: "സ്കീസോഫ്രീനിയ/ബൈപോളാർ ഡിസോർഡർ",
    keyFeatures: "Visual hallucinations are less prevalent than auditory hallucinations in schizophrenia and other psychoses. VH in these conditions rarely occur without auditory hallucinations during the course of the illness and are typically interspersed with unimodal auditory hallucinations.",
    keyFeaturesMl: "സ്കീസോഫ്രീനിയയിലും മറ്റ് സൈക്കോസുകളിലും ശ്രവണ ഹാലൂസിനേഷനുകളേക്കാൾ വിഷ്വൽ ഹാലൂസിനേഷനുകൾ കുറവാണ്. ഈ അവസ്ഥകളിൽ VH രോഗത്തിന്റെ കാലത്ത് ശ്രവണ ഹാലൂസിനേഷനുകളില്ലാതെ അപൂർവ്വമായേ സംഭവിക്കൂ, സാധാരണയായി യൂണിമോഡൽ ശ്രവണ ഹാലൂസിനേഷനുകളുമായി കൂടിച്ചേർന്നതാണ്."
  },
  {
    condition: "Bereavement",
    conditionMl: "വിയോഗം",
    keyFeatures: "VH of the deceased can occur as part of normal grief reaction but are less frequent than sensed presence of the deceased.",
    keyFeaturesMl: "മരിച്ചയാളുടെ VH സാധാരണ ദുഃഖ പ്രതികരണത്തിന്റെ ഭാഗമായി സംഭവിക്കാം, പക്ഷേ മരിച്ചയാളുടെ സാന്നിധ്യം അനുഭവപ്പെടുന്നതിനേക്കാൾ കുറവാണ്."
  },
  {
    condition: "Delirium",
    conditionMl: "ഡെലിറിയം",
    keyFeatures: "VH are the most common modality of hallucination in delirium where they occur in the context of clouded consciousness, sleep dysregulation and affective symptoms.",
    keyFeaturesMl: "മൂടിയ ബോധം, ഉറക്ക നിയന്ത്രണരാഹിത്യം, വൈകാരിക ലക്ഷണങ്ങൾ എന്നിവയുടെ പശ്ചാത്തലത്തിൽ ഡെലിറിയത്തിൽ VH ഹാലൂസിനേഷന്റെ ഏറ്റവും സാധാരണമായ രീതിയാണ്."
  },
  {
    condition: "Sleep-related",
    conditionMl: "ഉറക്കവുമായി ബന്ധപ്പെട്ടത്",
    keyFeatures: "Occasional VH can be normal experiences at the margins of sleep (hypnagogic/hypnopompic hallucinations). They may also present as part of a sleep-disorder (e.g., narcolepsy).",
    keyFeaturesMl: "ഉറക്കത്തിന്റെ അരികുകളിൽ (ഹിപ്നാഗോജിക്/ഹിപ്നോപോംപിക് ഹാലൂസിനേഷനുകൾ) ഇടയ്ക്കിടെയുള്ള VH സാധാരണ അനുഭവങ്ങളായിരിക്കാം. ഉറക്ക തകരാറിന്റെ (ഉദാ., നാർകോലെപ്സി) ഭാഗമായും അവ പ്രത്യക്ഷപ്പെടാം."
  },
  {
    condition: "Medication side effects",
    conditionMl: "മരുന്നിന്റെ പാർശ്വഫലങ്ങൾ",
    keyFeatures: "PD medication can precipitate VH but the exact mechanism and its relation to PD neurodegeneration is unclear. Medication with anti-muscarinic effects and opiates are particularly implicated in VH.",
    keyFeaturesMl: "PD മരുന്നിന് VH ത്വരിതപ്പെടുത്താൻ കഴിയും, പക്ഷേ കൃത്യമായ സംവിധാനവും PD ന്യൂറോഡിജനറേഷനുമായുള്ള അതിന്റെ ബന്ധവും അവ്യക്തമാണ്. ആന്റി-മസ്കരിനിക് ഇഫക്റ്റുകളും ഒപിയേറ്റുകളും ഉള്ള മരുന്നുകൾ VH യിൽ പ്രത്യേകിച്ചും ഉൾപ്പെട്ടിരിക്കുന്നു."
  },
  {
    condition: "Hallucinogen use",
    conditionMl: "ഹാലൂസിനോജൻ ഉപയോഗം",
    keyFeatures: "Visual perceptual phenomena including visual snow (see below) afterimages, palinopsia and flashback VH may persist after hallucinogen exposure (hallucinogen persisting perception disorder).",
    keyFeaturesMl: "വിഷ്വൽ സ്നോ ഉൾപ്പെടെയുള്ള വിഷ്വൽ പെർസെപ്ച്വൽ പ്രതിഭാസങ്ങൾ, ആഫ്റ്റർഇമേജുകൾ, പാലിനോപ്സിയ, ഫ്ലാഷ്ബാക്ക് VH ഹാലൂസിനോജൻ എക്സ്പോഷറിന് ശേഷം നിലനിൽക്കാം (ഹാലൂസിനോജൻ പെർസിസ്റ്റിംഗ് പെർസെപ്ഷൻ ഡിസോർഡർ)."
  },
  {
    condition: "Peduncular hallucinations",
    conditionMl: "പെഡൻകുലാർ ഹാലൂസിനേഷനുകൾ",
    keyFeatures: "Complex visual hallucinations caused by brainstem or thalamic lesions. When caused by brainstem lesions, VH are associated with sleep disturbance and eye movement dysfunction. Hallucinations in other modalities can occur.",
    keyFeaturesMl: "ബ്രെയിൻസ്റ്റെം അല്ലെങ്കിൽ തലാമിക് നാശങ്ങൾ മൂലമുണ്ടാകുന്ന സങ്കീർണ്ണമായ വിഷ്വൽ ഹാലൂസിനേഷനുകൾ. ബ്രെയിൻസ്റ്റെം നാശങ്ങൾ മൂലമുണ്ടാകുമ്പോൾ, VH ഉറക്ക തകരാറുമായും കണ്ണിന്റെ ചലന വൈകല്യവുമായും ബന്ധപ്പെട്ടിരിക്കുന്നു. മറ്റ് രീതികളിലുള്ള ഹാലൂസിനേഷനുകൾ സംഭവിക്കാം."
  },
  {
    condition: "Occipital/temporal seizures",
    conditionMl: "ഓക്സിപിറ്റൽ/ടെമ്പറൽ പിടിച്ചെടുക്കലുകൾ",
    keyFeatures: "Ictal phenomenology is based on location of seizure. Simple VH are associated with occipital foci. Complex VH imply involvement of the temporal lobe and limbic cortex.",
    keyFeaturesMl: "ഇക്ടൽ പ്രതിഭാസശാസ്ത്രം പിടിച്ചെടുക്കലിന്റെ സ്ഥാനത്തെ അടിസ്ഥാനമാക്കിയുള്ളതാണ്. ലളിതമായ VH ഓക്സിപിറ്റൽ ഫോസികളുമായി ബന്ധപ്പെട്ടിരിക്കുന്നു. സങ്കീർണ്ണമായ VH ടെമ്പറൽ ലോബിന്റെയും ലിംബിക് കോർട്ടക്സിന്റെയും ഉൾപ്പെടലിനെ സൂചിപ്പിക്കുന്നു."
  },
  {
    condition: "Migraine",
    conditionMl: "മൈഗ്രേൻ",
    keyFeatures: "Teichopsia in classical migraine aura and other visual perceptual phenomena.",
    keyFeaturesMl: "ക്ലാസിക്കൽ മൈഗ്രേൻ ഓറയിലെ ടെയ്‌കോപ്സിയയും മറ്റ് വിഷ്വൽ പെർസെപ്ച്വൽ പ്രതിഭാസങ്ങളും."
  },
  {
    condition: "Visual snow syndrome",
    conditionMl: "വിഷ്വൽ സ്നോ സിൻഡ്രോം",
    keyFeatures: "A syndrome characterised by persistent dynamic visual noise (snow), palinopsia, entopic phenomena, photophobia and nyctalopia. Associated with migraine.",
    keyFeaturesMl: "സ്ഥിരമായ ഡൈനാമിക് വിഷ്വൽ നോയ്‌സ് (സ്നോ), പാലിനോപ്സിയ, എന്റോപിക് പ്രതിഭാസങ്ങൾ, ഫോട്ടോഫോബിയ, നിക്ടലോപിയ എന്നിവയാൽ സവിശേഷതയുള്ള ഒരു സിൻഡ്രോം. മൈഗ്രേനുമായി ബന്ധപ്പെട്ടിരിക്കുന്നു."
  }
];
