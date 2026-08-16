export interface FastItem {
  id: string;
  stage: number;
  title: string;
  titleMl: string;
  description: string;
  descriptionMl: string;
}

export const FAST_ITEMS: FastItem[] = [
  { id: 'stage1', stage: 1, title: 'No difficulty', titleMl: 'ബുദ്ധിമുട്ടുകളൊന്നുമില്ല', description: 'Normal adult. No functional decline.', descriptionMl: 'സാധാരണ മുതിർന്നയാൾ. പ്രവർത്തനപരമായ കുറവുകളൊന്നുമില്ല.' },
  { id: 'stage2', stage: 2, title: 'Complains of forgetting', titleMl: 'മറവി അനുഭവപ്പെടുന്നു', description: 'Subjective word-finding difficulty or forgetting location of objects.', descriptionMl: 'വാക്കുകൾ കിട്ടാനുള്ള ബുദ്ധിമുട്ട് അല്ലെങ്കിൽ സാധനങ്ങൾ വെച്ച സ്ഥലം മറന്നുപോവുക.' },
  { id: 'stage3', stage: 3, title: 'Early-stage dementia', titleMl: 'ഡിമെൻഷ്യയുടെ ആദ്യഘട്ടം', description: 'Decreased job functioning evident to co-workers; difficulty traveling to new locations.', descriptionMl: 'സഹപ്രവർത്തകർക്ക് മനസ്സിലാകുന്ന രീതിയിൽ ജോലികളിൽ കുറവ്; പുതിയ സ്ഥലങ്ങളിലേക്ക് യാത്ര ചെയ്യാനുള്ള ബുദ്ധിമുട്ട്.' },
  { id: 'stage4', stage: 4, title: 'Mild dementia', titleMl: 'നേരിയ ഡിമെൻഷ്യ', description: 'Decreased ability to perform complex tasks (finances, planning dinner).', descriptionMl: 'സങ്കീർണ്ണമായ ജോലികൾ ചെയ്യുന്നതിലെ ബുദ്ധിമുട്ട് (സാമ്പത്തികം, ഭക്ഷണം ആസൂത്രണം ചെയ്യൽ).' },
  { id: 'stage5', stage: 5, title: 'Moderate dementia', titleMl: 'മിതമായ ഡിമെൻഷ്യ', description: 'Needs assistance choosing proper clothing for the season/occasion.', descriptionMl: 'സീസൺ/അവസരത്തിനനുസരിച്ച് വസ്ത്രം തിരഞ്ഞെടുക്കുന്നതിൽ സഹായം ആവശ്യമാണ്.' },
  { id: 'stage6a', stage: 6, title: 'Moderately severe dementia (a)', titleMl: 'മിതമായ കഠിനമായ ഡിമെൻഷ്യ (a)', description: 'Needs assistance putting on clothes.', descriptionMl: 'വസ്ത്രം ധരിക്കുന്നതിൽ സഹായം ആവശ്യമാണ്.' },
  { id: 'stage6b', stage: 6, title: 'Moderately severe dementia (b)', titleMl: 'മിതമായ കഠിനമായ ഡിമെൻഷ്യ (b)', description: 'Needs assistance bathing.', descriptionMl: 'കുളിക്കുന്നതിൽ സഹായം ആവശ്യമാണ്.' },
  { id: 'stage6c', stage: 6, title: 'Moderately severe dementia (c)', titleMl: 'മിതമായ കഠിനമായ ഡിമെൻഷ്യ (c)', description: 'Needs assistance toileting.', descriptionMl: 'ടോയ്ലറ്റ് ഉപയോഗിക്കുന്നതിൽ സഹായം ആവശ്യമാണ്.' },
  { id: 'stage6d', stage: 6, title: 'Moderately severe dementia (d)', titleMl: 'മിതമായ കഠിനമായ ഡിമെൻഷ്യ (d)', description: 'Urinary incontinence.', descriptionMl: 'മൂത്രമൊഴിക്കൽ നിയന്ത്രണമില്ലായ്മ.' },
  { id: 'stage6e', stage: 6, title: 'Moderately severe dementia (e)', titleMl: 'മിതമായ കഠിനമായ ഡിമെൻഷ്യ (e)', description: 'Fecal incontinence.', descriptionMl: 'മലവിസർജ്ജനം നിയന്ത്രണമില്ലായ്മ.' },
  { id: 'stage7a', stage: 7, title: 'Severe dementia (a)', titleMl: 'കഠിനമായ ഡിമെൻഷ്യ (a)', description: 'Speech limited to about 6 words.', descriptionMl: 'സംസാരം ഏകദേശം 6 വാക്കുകളിൽ ഒതുങ്ങുന്നു.' },
  { id: 'stage7b', stage: 7, title: 'Severe dementia (b)', titleMl: 'കഠിനമായ ഡിമെൻഷ്യ (b)', description: 'Speech limited to 1 word.', descriptionMl: 'സംസാരം 1 വാക്കിൽ ഒതുങ്ങുന്നു.' },
  { id: 'stage7c', stage: 7, title: 'Severe dementia (c)', titleMl: 'കഠിനമായ ഡിമെൻഷ്യ (c)', description: 'Ambulatory ability lost.', descriptionMl: 'നടക്കാനുള്ള കഴിവ് നഷ്ടപ്പെടുന്നു.' },
  { id: 'stage7d', stage: 7, title: 'Severe dementia (d)', titleMl: 'കഠിനമായ ഡിമെൻഷ്യ (d)', description: 'Ability to sit up lost.', descriptionMl: 'എഴുന്നേറ്റിരിക്കാനുള്ള കഴിവ് നഷ്ടപ്പെടുന്നു.' },
  { id: 'stage7e', stage: 7, title: 'Severe dementia (e)', titleMl: 'കഠിനമായ ഡിമെൻഷ്യ (e)', description: 'Ability to smile lost.', descriptionMl: 'ചിരിക്കാനുള്ള കഴിവ് നഷ്ടപ്പെടുന്നു.' },
  { id: 'stage7f', stage: 7, title: 'Severe dementia (f)', titleMl: 'കഠിനമായ ഡിമെൻഷ്യ (f)', description: 'Ability to hold head up lost.', descriptionMl: 'തല ഉയർത്തിപ്പിടിക്കാനുള്ള കഴിവ് നഷ്ടപ്പെടുന്നു.' }
];
