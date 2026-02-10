import { DelusionItem } from '@/types/delusions';
import capgrasImage from '@/assets/delusions/capgras.png';
import reverseCapgrasImage from '@/assets/delusions/reverse-capgras.png';
import subjectiveCapgrasImage from '@/assets/delusions/subjective-capgras.png';
import fregoliImage from '@/assets/delusions/fregoli.png';
import reverseFregoliImage from '@/assets/delusions/reverse-fregoli.png';
import intermetamorphosisImage from '@/assets/delusions/intermetamorphosis.png';
import persecutionImage from '@/assets/delusions/persecution.png';
import jealousyImage from '@/assets/delusions/jealousy.png';
import guiltImage from '@/assets/delusions/guilt.png';
import povertyImage from '@/assets/delusions/poverty.png';
import referenceImage from '@/assets/delusions/reference.png';
import erotomanicImage from '@/assets/delusions/erotomanic.png';
import controlImage from '@/assets/delusions/control.png';
import thoughtBroadcastingImage from '@/assets/delusions/thought-broadcasting.png';
import thoughtInsertionImage from '@/assets/delusions/thought-insertion.png';
import thoughtWithdrawalImage from '@/assets/delusions/thought-withdrawal.png';
import grandioseImage from '@/assets/delusions/grandiose.png';
import religiousImage from '@/assets/delusions/religious.png';
import somaticImage from '@/assets/delusions/somatic.png';
import hypochondriacalImage from '@/assets/delusions/hypochondriacal.png';
import infestationImage from '@/assets/delusions/infestation.png';
import cotardImage from '@/assets/delusions/cotard.png';
import nihilisticImage from '@/assets/delusions/nihilistic.png';
import somatoparaphreniaImage from '@/assets/delusions/somatoparaphrenia.png';
import companionImage from '@/assets/delusions/companion.webp';
import mirrorAgnosiaImage from '@/assets/delusions/mirror-agnosia.png';
import mirrorImageAgnosiaImage from '@/assets/delusions/mirror-image-agnosia.png';
import phantomBoarderImage from '@/assets/delusions/phantom-boarder.png';
import tvSignImage from '@/assets/delusions/tv-sign.png';
import cloningSyndromeImage from '@/assets/delusions/cloning-syndrome.png';
import reduplicativeParamnesiaImage from '@/assets/delusions/reduplicative-paramnesia.png';
import clonalPluralizationImage from '@/assets/delusions/clonal-pluralization.png';
import personReduplicationImage from '@/assets/delusions/person-reduplication.png';
import delusionalHermaphroditismImage from '@/assets/delusions/delusional-hermaphroditism.png';
import placeMisidentificationImage from '@/assets/delusions/place-misidentification.png';
import presenceHallucinationImage from '@/assets/delusions/presence-hallucination.png';
import passageHallucinationImage from '@/assets/delusions/passage-hallucination.png';
import visualIllusionsImage from '@/assets/delusions/visual-illusions.png';
import complexVisualHallucinationImage from '@/assets/delusions/complex-visual-hallucination.png';
import pareidoliaImage from '@/assets/delusions/pareidolia.png';
import metamorphopsiaImage from '@/assets/delusions/metamorphopsia.png';
import multimodalityHallucinationImage from '@/assets/delusions/multimodality-hallucination.png';
import pseudohallucinationImage from '@/assets/delusions/pseudohallucination.png';
import secondaryDelusionImage from '@/assets/delusions/secondary-delusion.png';

export const delusionsScale: DelusionItem[] = [
  // ============= DELUSIONS SECTION =============
  {
    id: 'capgras',
    section: 'Delusions',
    category: 'Misidentification Syndromes',
    type: 'Capgras Syndrome',
    typeMl: 'കാപ്‌ഗ്രാസ് സിൻഡ്രോം',
    description: 'Belief that a familiar person has been replaced by an imposter',
    descriptionMl: 'പരിചിതമായ ഒരാളെ ഒരു വ്യാജൻ മാറ്റിസ്ഥാപിച്ചു എന്ന് വിശ്വസിക്കുക',
    familiarity: 'Hypofamiliarity',
    image: capgrasImage
  },
  {
    id: 'reverse-capgras',
    section: 'Delusions',
    category: 'Misidentification Syndromes',
    type: 'Reverse Capgras Syndrome',
    typeMl: 'റിവേഴ്സ് കാപ്‌ഗ്രാസ് സിൻഡ്രോം',
    description: 'Belief that an unfamiliar person is actually a familiar person',
    descriptionMl: 'പരിചയമില്ലാത്ത ഒരാൾ വാസ്തവത്തിൽ ഒരു പരിചയമുള്ള വ്യക്തിയാണെന്ന് വിശ്വസിക്കുക',
    familiarity: 'Hyperfamiliarity',
    image: reverseCapgrasImage
  },
  {
    id: 'subjective-capgras',
    section: 'Delusions',
    category: 'Misidentification Syndromes',
    type: 'Subjective Capgras Delusion',
    typeMl: 'ആത്മനിഷ്ഠമായ കാപ്‌ഗ്രാസ് ഡെലൂഷൻ',
    description: 'Belief that a familiar person has had a subtle personality change',
    descriptionMl: 'പരിചിതമായ ഒരാൾക്ക് സൂക്ഷ്മമായ വ്യക്തിത്വ മാറ്റം സംഭവിച്ചു എന്ന് വിശ്വസിക്കുക',
    image: subjectiveCapgrasImage
  },
  {
    id: 'fregoli',
    section: 'Delusions',
    category: 'Misidentification Syndromes',
    type: 'Fregoli Delusion',
    typeMl: 'ഫ്രെഗോളി ഡെലൂഷൻ',
    description: 'Belief that different people are actually the same person in disguise',
    descriptionMl: 'വ്യത്യസ്ത ആളുകൾ യഥാർത്ഥത്തിൽ ഒരേ വ്യക്തിയാണെന്ന് വിശ്വസിക്കുക',
    familiarity: 'Hyperfamiliarity',
    image: fregoliImage
  },
  {
    id: 'reverse-fregoli',
    section: 'Delusions',
    category: 'Misidentification Syndromes',
    type: 'Reverse Fregoli Delusion',
    typeMl: 'റിവേഴ്സ് ഫ്രെഗോളി ഡെലൂഷൻ',
    description: 'Belief that the same person is actually different people',
    descriptionMl: 'ഒരേ വ്യക്തി യഥാർത്ഥത്തിൽ വ്യത്യസ്ത ആളുകളാണെന്ന് വിശ്വസിക്കുക',
    familiarity: 'Hypofamiliarity',
    image: reverseFregoliImage
  },
  {
    id: 'intermetamorphosis',
    section: 'Delusions',
    category: 'Misidentification Syndromes',
    type: 'Intermetamorphosis',
    typeMl: 'ഇന്റർമെറ്റാമോർഫോസിസ്',
    description: 'Belief that people have physically transformed into other people',
    descriptionMl: 'ആളുകൾ ശാരീരികമായി മറ്റ് ആളുകളായി രൂപാന്തരം പ്രാപിച്ചു എന്ന് വിശ്വസിക്കുക',
    image: intermetamorphosisImage
  },
  {
    id: 'reduplicative-paramnesia',
    section: 'Delusions',
    category: 'Misidentification Syndromes',
    type: 'Reduplicative Paramnesia',
    typeMl: 'റിഡ്യൂപ്ലിക്കേറ്റീവ് പാരാമ്നേഷ്യ',
    description: 'Belief that a place or location has been duplicated or moved to another location',
    descriptionMl: 'ഒരു സ്ഥലമോ ലൊക്കേഷനോ തനിപ്പകർപ്പ് എടുത്ത് മറ്റൊരു സ്ഥലത്തേക്ക് മാറ്റിയെന്ന് വിശ്വസിക്കുക',
    image: reduplicativeParamnesiaImage
  },
  {
    id: 'clonal-pluralization',
    section: 'Delusions',
    category: 'Misidentification Syndromes',
    type: 'Clonal Pluralization',
    typeMl: 'ക്ലോണൽ പ്ലൂറലൈസേഷൻ',
    description: 'Belief that there are multiple identical copies of a person or object',
    descriptionMl: 'ഒരു വ്യക്തിയുടെയോ വസ്തുവിന്റെയോ ഒന്നിലധികം തനിപ്പകർപ്പുകൾ ഉണ്ടെന്ന് വിശ്വസിക്കുക',
    image: clonalPluralizationImage
  },
  {
    id: 'person-reduplication',
    section: 'Delusions',
    category: 'Misidentification Syndromes',
    type: 'Person Reduplication',
    typeMl: 'പേഴ്സൺ റിഡ്യൂപ്ലിക്കേഷൻ',
    description: 'Belief that a specific person exists in two or more identical forms',
    descriptionMl: 'ഒരു പ്രത്യേക വ്യക്തി രണ്ട് അല്ലെങ്കിൽ അതിലധികമോ സമാന രൂപങ്ങളിൽ നിലവിലുണ്ടെന്ന് വിശ്വസിക്കുക',
    image: personReduplicationImage
  },
  {
    id: 'delusional-hermaphroditism',
    section: 'Delusions',
    category: 'Misidentification Syndromes',
    type: 'Delusional Hermaphroditism',
    typeMl: 'ഡെല്യൂഷണൽ ഹെർമാഫ്രോഡിറ്റിസം',
    description: 'Belief that one is both male and female',
    descriptionMl: 'ഒരാൾ ആണും പെണ്ണുമാണെന്ന് വിശ്വസിക്കുക',
    image: delusionalHermaphroditismImage
  },
  {
    id: 'place-misidentification',
    section: 'Delusions',
    category: 'Misidentification Syndromes',
    type: 'Place Misidentification',
    typeMl: 'പ്ലേസ് മിസ് ഐഡന്റിഫിക്കേഷൻ',
    description: 'Uncertainty or misidentification of one’s location',
    descriptionMl: 'ഒരാളുടെ സ്ഥാനം സംബന്ധിച്ച് ഉറപ്പില്ലായ്മ അല്ലെങ്കിൽ തെറ്റായ തിരിച്ചറിയൽ',
    image: placeMisidentificationImage
  },
  {
    id: 'phantom-boarder',
    section: 'Delusions',
    category: 'Misidentification Syndromes',
    type: 'Phantom Boarder',
    typeMl: 'ഫാന്റം ബോർഡർ',
    description: 'The delusion that an individual is living in one\'s house',
    descriptionMl: 'ഒരു വ്യക്തി ഒരാളുടെ വീട്ടിൽ താമസിക്കുന്നു എന്ന മിഥ്യാബോധം',
    image: phantomBoarderImage
  },
  {
    id: 'tv-sign',
    section: 'Delusions',
    category: 'Misidentification Syndromes',
    type: 'TV Sign',
    typeMl: 'ടിവി സൈൻ',
    description: 'The delusion that one\'s relatives have been replaced by actors',
    descriptionMl: 'ഒരാളുടെ ബന്ധുക്കളെ നടന്മാർ മാറ്റിസ്ഥാപിച്ചു എന്ന മിഥ്യാബോധം',
    image: tvSignImage
  },
  {
    id: 'cloning-syndrome',
    section: 'Delusions',
    category: 'Misidentification Syndromes',
    type: 'Cloning Syndrome',
    typeMl: 'ക്ലോണിംഗ് സിൻഡ്രോം',
    description: 'The delusion that one has been cloned',
    descriptionMl: 'ഒരാളെ ക്ലോൺ ചെയ്തു എന്ന മിഥ്യാബോധം',
    image: cloningSyndromeImage
  },
  {
    id: 'persecution',
    section: 'Delusions',
    category: 'Content-Based Delusions',
    type: 'Persecutory Delusion',
    typeMl: 'പീഡന ഡെലൂഷൻ',
    description: 'Belief that one is going to be harmed, harassed, etc., by an individual, organization, or group',
    descriptionMl: 'ഒരാളെ ഒരു വ്യക്തി, സംഘടന അല്ലെങ്കിൽ ഗ്രൂപ്പ് ഉപദ്രവിക്കാൻ പോകുന്നു എന്ന് വിശ്വസിക്കുക',
    image: persecutionImage
  },
  {
    id: 'jealousy',
    section: 'Delusions',
    category: 'Content-Based Delusions',
    type: 'Delusion of Jealousy',
    typeMl: 'അസൂയയുടെ ഡെലൂഷൻ',
    description: 'Belief that one\'s spouse or partner is unfaithful',
    descriptionMl: 'ഒരാളുടെ പങ്കാളി വിശ്വാസമില്ലാത്തവരാണെന്ന് വിശ്വസിക്കുക',
    image: jealousyImage
  },
  {
    id: 'guilt',
    section: 'Delusions',
    category: 'Content-Based Delusions',
    type: 'Delusion of Guilt',
    typeMl: 'കുറ്റബോധം',
    description: 'False feeling of remorse or guilt that is disproportionate to any wrongdoing',
    descriptionMl: 'തെറ്റായ കുറ്റബോധം അല്ലെങ്കിൽ തെറ്റായ പ്രവർത്തിക്ക് ആനുപാതികമല്ലാത്ത കുറ്റബോധം',
    image: guiltImage
  },
  {
    id: 'poverty',
    section: 'Delusions',
    category: 'Content-Based Delusions',
    type: 'Delusion of Poverty',
    typeMl: 'ദാരിദ്ര്യത്തിന്റെ ഡെലൂഷൻ',
    description: 'False belief that one will be deprived of all material possessions',
    descriptionMl: 'എല്ലാ ഭൗതിക വസ്തുക്കളും നഷ്ട്ടപ്പെടുമെന്ന് തെറ്റായി വിശ്വസിക്കുക',
    image: povertyImage
  },
  {
    id: 'reference',
    section: 'Delusions',
    category: 'Content-Based Delusions',
    type: 'Delusion of Reference',
    typeMl: 'റഫറൻസിന്റെ ഡെലൂഷൻ',
    description: 'Belief that certain gestures, comments, passages from books, newspapers, song lyrics, etc., are directed at oneself',
    descriptionMl: 'പുസ്തകങ്ങൾ, പത്രങ്ങൾ, പാട്ട് വരികൾ തുടങ്ങിയവയിലെ ചില ആംഗ്യങ്ങൾ, അഭിപ്രായങ്ങൾ, ഭാഗങ്ങൾ എന്നിവ സ്വയം ലക്ഷ്യമിട്ടുള്ളതാണെന്ന് വിശ്വസിക്കുക',
    image: referenceImage
  },
  {
    id: 'erotomanic',
    section: 'Delusions',
    category: 'Content-Based Delusions',
    type: 'Erotomanic Delusion',
    typeMl: 'ഇറോടോമാനിയക് ഡെലൂഷൻ',
    description: 'Belief that another person, usually of higher status, is in love with one',
    descriptionMl: 'മറ്റൊരാൾ, സാധാരണയായി ഉയർന്ന സ്ഥാനത്തുള്ള ഒരാൾ, തന്നോട് പ്രണയത്തിലാണെന്ന് വിശ്വസിക്കുക',
    image: erotomanicImage
  },
  {
    id: 'control',
    section: 'Delusions',
    category: 'Control & Influence Delusions',
    type: 'Delusion of Control',
    typeMl: 'നിയന്ത്രണത്തിന്റെ ഡെലൂഷൻ',
    description: 'Belief that one\'s body or actions are being acted on or manipulated by some outside force',
    descriptionMl: 'ഒരാളുടെ ശരീരമോ പ്രവർത്തനങ്ങളോ ഏതെങ്കിലും ബാഹ്യശക്തിയാൽ പ്രവർത്തിക്കുകയോ കൃത്രിമം കാണിക്കുകയോ ചെയ്യുന്നു എന്ന് വിശ്വസിക്കുക',
    image: controlImage
  },
  {
    id: 'thought-broadcasting',
    section: 'Delusions',
    category: 'Control & Influence Delusions',
    type: 'Thought Broadcasting',
    typeMl: 'ചിന്താ പ്രക്ഷേപണം',
    description: 'Belief that one\'s thoughts are being broadcast out loud so that they can be perceived by other people',
    descriptionMl: 'ഒരാളുടെ ചിന്തകൾ ഉച്ചത്തിൽ പ്രക്ഷേപണം ചെയ്യപ്പെടുന്നു, അതിനാൽ അവ മറ്റുള്ളവർക്ക് മനസ്സിലാക്കാൻ കഴിയും എന്ന് വിശ്വസിക്കുക',
    image: thoughtBroadcastingImage
  },
  {
    id: 'thought-insertion',
    section: 'Delusions',
    category: 'Control & Influence Delusions',
    type: 'Thought Insertion',
    typeMl: 'ചിന്താ ഇൻസെർഷൻ',
    description: 'Belief that thoughts that are not one\'s own have been inserted into one\'s mind',
    descriptionMl: 'ഒരാളുടെ സ്വന്തമല്ലാത്ത ചിന്തകൾ മനസ്സിലേക്ക് തിരുകി കയറ്റി എന്ന് വിശ്വസിക്കുക',
    image: thoughtInsertionImage
  },
  {
    id: 'thought-withdrawal',
    section: 'Delusions',
    category: 'Control & Influence Delusions',
    type: 'Thought Withdrawal',
    typeMl: 'ചിന്താ പിൻവലിക്കൽ',
    description: 'Belief that thoughts have been removed from one\'s mind',
    descriptionMl: 'ചിന്തകൾ ഒരാളുടെ മനസ്സിൽ നിന്ന് നീക്കം ചെയ്തു എന്ന് വിശ്വസിക്കുക',
    image: thoughtWithdrawalImage
  },
  {
    id: 'grandiose',
    section: 'Delusions',
    category: 'Grandiose & Religious',
    type: 'Grandiose Delusion',
    typeMl: 'ഗംഭീരമായ ഡെലൂഷൻ',
    description: 'Belief that one has some great (but unrecognized) talent, insight, or discovery',
    descriptionMl: 'ഒരാൾക്ക് വലിയ (എന്നാൽ തിരിച്ചറിയപ്പെടാത്ത) കഴിവോ, ഉൾക്കാഴ്ചയോ അല്ലെങ്കിൽ കണ്ടുപിടുത്തമോ ഉണ്ടെന്ന് വിശ്വസിക്കുക',
    image: grandioseImage
  },
  {
    id: 'religious',
    section: 'Delusions',
    category: 'Grandiose & Religious',
    type: 'Religious Delusion',
    typeMl: 'മതപരമായ ഡെലൂഷൻ',
    description: 'Any delusion with a religious or spiritual theme',
    descriptionMl: 'മതപരമായ അല്ലെങ്കിൽ ആത്മീയപരമായ ചിന്തകളുള്ള ഏതെങ്കിലും ഡെലൂഷൻ',
    image: religiousImage
  },
  {
    id: 'somatic',
    section: 'Delusions',
    category: 'Somatic & Hypochondriacal',
    type: 'Somatic Delusion',
    typeMl: 'സോമാറ്റിക് ഡെലൂഷൻ',
    description: 'Delusion whose main content pertains to the appearance or functioning of one\'s body',
    descriptionMl: 'ഒരാളുടെ ശരീരത്തിന്റെ രൂപത്തെയും പ്രവർത്തനത്തെയും കുറിച്ചുള്ള ഡെലൂഷൻ',
    image: somaticImage
  },
  {
    id: 'hypochondriacal',
    section: 'Delusions',
    category: 'Somatic & Hypochondriacal',
    type: 'Hypochondriacal Delusion',
    typeMl: 'ഹൈപ്പോകോൺഡ്രിയാക്കൽ ഡെലൂഷൻ',
    description: 'Conviction that one has, or is about to develop, a serious medical illness',
    descriptionMl: 'ഒരാൾക്ക് ഗുരുതരമായ ഒരു രോഗം വരാൻ പോകുന്നു എന്ന് വിശ്വസിക്കുക',
    image: hypochondriacalImage
  },
  {
    id: 'infestation',
    section: 'Delusions',
    category: 'Somatic & Hypochondriacal',
    type: 'Delusion of Infestation',
    typeMl: 'ഇൻഫെസ്റ്റേഷൻ ഡെലൂഷൻ',
    description: 'Belief that one is infested with insects, bacteria, mites, parasites, or other living organisms',
    descriptionMl: 'കീടങ്ങൾ, ബാക്ടീരിയകൾ, ചെള്ള്, പരാന്നഭോജികൾ അല്ലെങ്കിൽ മറ്റ് ജീവജാലങ്ങൾ എന്നിവ ബാധിച്ചിട്ടുണ്ടെന്ന് വിശ്വസിക്കുക',
    image: infestationImage
  },
  {
    id: 'cotard',
    section: 'Delusions',
    category: 'Somatic & Hypochondriacal',
    type: 'Cotard Delusion',
    typeMl: 'കോട്ടാർഡ് ഡെലൂഷൻ',
    description: 'Belief that one is dead, does not exist, is putrefying, or has lost his/her blood or internal organs',
    descriptionMl: 'ഒരാൾ മരിച്ചു, നിലവിലില്ല, ജീർണ്ണിക്കുന്നു അല്ലെങ്കിൽ രക്തം അല്ലെങ്കിൽ ആന്തരിക അവയവങ്ങൾ നഷ്ടപ്പെട്ടു എന്ന് വിശ്വസിക്കുക',
    image: cotardImage
  },
  {
    id: 'nihilistic',
    section: 'Delusions',
    category: 'Somatic & Hypochondriacal',
    type: 'Nihilistic Delusion',
    typeMl: 'നിഹിലിസ്റ്റിക് ഡെലൂഷൻ',
    description: 'Belief that the world, or a part of it, does not exist',
    descriptionMl: 'ലോകം, അല്ലെങ്കിൽ അതിന്റെ ഒരു ഭാഗം നിലവിലില്ലെന്ന് വിശ്വസിക്കുക',
    image: nihilisticImage
  },
  {
    id: 'somatoparaphrenia',
    section: 'Delusions',
    category: 'Somatic & Hypochondriacal',
    type: 'Somatoparaphrenia',
    typeMl: 'സോമാറ്റോപാരാഫ്രീനിയ',
    description: 'Denial of ownership of a limb or an entire side of one\'s body',
    descriptionMl: 'ഒരാളുടെ ശരീരത്തിന്റെ ഒരു അവയവത്തിന്റെയോ മുഴുവൻ ഭാഗത്തിന്റെയോ ഉടമസ്ഥാവകാശം നിഷേധിക്കുക',
    image: somatoparaphreniaImage
  },
  {
    id: 'companion',
    section: 'Delusions',
    category: 'Somatic & Hypochondriacal',
    type: 'Companion',
    typeMl: 'കൂട്ടുകാരൻ',
    description: 'The delusion that one is accompanied by an invisible companion',
    descriptionMl: 'ഒരാൾക്ക് ഒരു അദൃശ്യ കൂട്ടുകാരനുണ്ടെന്ന മിഥ്യാബോധം',
    image: companionImage
  },
  {
    id: 'mirror-agnosia',
    section: 'Delusions',
    category: 'Somatic & Hypochondriacal',
    type: 'Mirror Agnosia',
    typeMl: 'മിറർ അഗ്നോസിയ',
    description: 'The delusion that one\'s reflection in the mirror is another person',
    descriptionMl: 'കണ്ണാടിയിലെ പ്രതിബിംബം മറ്റൊരു വ്യക്തിയാണെന്ന മിഥ്യാബോധം',
    image: mirrorAgnosiaImage
  },
  {
    id: 'mirror-image-agnosia',
    section: 'Delusions',
    category: 'Somatic & Hypochondriacal',
    type: 'Mirror Image Agnosia',
    typeMl: 'മിറർ ഇമേജ് അഗ്നോസിയ',
    description: 'The delusion that one\'s reflection in the mirror is not oneself',
    descriptionMl: 'കണ്ണാടിയിലെ പ്രതിബിംബം താനല്ലെന്ന മിഥ്യാബോധം',
    image: mirrorImageAgnosiaImage
  },
  
  // ============= HALLUCINATIONS SECTION =============
  {
    id: 'visual-hallucination',
    section: 'Hallucinations',
    category: 'Visual Hallucinations',
    type: 'Visual Hallucination',
    typeMl: 'വിഷ്വൽ ഹാലൂസിനേഷൻ',
    description: 'Visual percept not associated with a real object',
    descriptionMl: 'യഥാർത്ഥ വസ്തുവുമായി ബന്ധപ്പെട്ടിട്ടില്ലാത്ത ദൃശ്യ ധാരണ',
    image: complexVisualHallucinationImage
  },
  {
    id: 'complex-visual-hallucination',
    section: 'Hallucinations',
    category: 'Visual Hallucinations',
    type: 'Complex Visual Hallucination',
    typeMl: 'സങ്കീർണ്ണമായ വിഷ്വൽ ഹാലൂസിനേഷൻ',
    description: 'Subtype of visual hallucination whose content is a formed object, face, animal, figure, etc.',
    descriptionMl: 'രൂപീകൃത വസ്തു, മുഖം, മൃഗം, രൂപം മുതലായവയുടെ ഉള്ളടക്കമുള്ള വിഷ്വൽ ഹാലൂസിനേഷന്റെ ഉപവിഭാഗം',
    image: complexVisualHallucinationImage
  },
  {
    id: 'visual-illusion',
    section: 'Hallucinations',
    category: 'Visual Hallucinations',
    type: 'Visual Illusion',
    typeMl: 'വിഷ്വൽ ഇല്യൂഷൻ',
    description: 'Real object perceived incorrectly. Traditionally used to refer to errors of category identity (e.g., pile of cloths seen as a cat)',
    descriptionMl: 'യഥാർത്ഥ വസ്തു തെറ്റായി മനസ്സിലാക്കിയത്. വിഭാഗ ഐഡന്റിറ്റിയുടെ പിശകുകൾ സൂചിപ്പിക്കാൻ പരമ്പരാഗതമായി ഉപയോഗിക്കുന്നു (ഉദാ., തുണികൂട്ടം പൂച്ചയായി കാണുക)',
    image: visualIllusionsImage
  },
  {
    id: 'pareidolia',
    section: 'Hallucinations',
    category: 'Visual Hallucinations',
    type: 'Pareidolia',
    typeMl: 'പാരീഡോളിയ',
    description: 'Specific subtype of illusion in which faces, objects, etc., are perceived when viewing formless visual stimuli such as clouds, tree-bark, flames or in patterned visual stimuli such as carpets, wallpaper',
    descriptionMl: 'മേഘങ്ങൾ, മരത്തോൽ, തീജ്വാലകൾ അല്ലെങ്കിൽ പരവതാനി, വാൾപേപ്പർ പോലുള്ള പാറ്റേണുള്ള ദൃശ്യ ഉത്തേജകങ്ങൾ കാണുമ്പോൾ മുഖങ്ങൾ, വസ്തുക്കൾ മുതലായവ മനസ്സിലാക്കുന്ന ഇല്യൂഷന്റെ പ്രത്യേക ഉപവിഭാഗം',
    image: pareidoliaImage
  },
  {
    id: 'metamorphopsia',
    section: 'Hallucinations',
    category: 'Visual Hallucinations',
    type: 'Metamorphopsia',
    typeMl: 'മെറ്റാമോർഫോപ്സിയ',
    description: 'A subtype of illusion used to refer to errors of spatial, temporal perception (e.g., seeing a real object distorted, seeing a real object persist in time or at the wrong spatial location)',
    descriptionMl: 'സ്പേഷ്യൽ, ടെമ്പറൽ പെർസെപ്ഷന്റെ പിശകുകൾ സൂചിപ്പിക്കാൻ ഉപയോഗിക്കുന്ന ഒരു ഇല്യൂഷൻ ഉപവിഭാഗം (ഉദാ., യഥാർത്ഥ വസ്തു വികൃതമായി കാണുക, യഥാർത്ഥ വസ്തു സമയത്തിൽ തുടരുന്നത് അല്ലെങ്കിൽ തെറ്റായ സ്പേഷ്യൽ ലൊക്കേഷനിൽ കാണുക)',
    image: metamorphopsiaImage
  },
  {
    id: 'passage-hallucination',
    section: 'Hallucinations',
    category: 'Visual Hallucinations',
    type: 'Passage Hallucination',
    typeMl: 'പാസേജ് ഹാലൂസിനേഷൻ',
    description: 'Animal or person passing (en passage), typically brief and in peripheral visual field. Characteristic of Parkinson\'s disease psychosis',
    descriptionMl: 'മൃഗമോ വ്യക്തിയോ കടന്നുപോകുന്നത് (എൻ പാസേജ്), സാധാരണയായി ഹ്രസ്വവും പെരിഫറൽ വിഷ്വൽ ഫീൽഡിലുമാണ്. പാർക്കിൻസൺസ് രോഗ സൈക്കോസിസിന്റെ സവിശേഷത',
    image: passageHallucinationImage
  },
  {
    id: 'presence-hallucination',
    section: 'Hallucinations',
    category: 'Visual Hallucinations',
    type: 'Presence Hallucination',
    typeMl: 'സാന്നിധ്യ ഹാലൂസിനേഷൻ',
    description: 'Sense of someone being close by or beside without an associated visual, auditory or tactile experience. Characteristic of Parkinson\'s disease psychosis',
    descriptionMl: 'ബന്ധപ്പെട്ട ദൃശ്യ, ശ്രവണ അല്ലെങ്കിൽ സ്പർശന അനുഭവമില്ലാതെ ആരെങ്കിലും അടുത്തോ അരികിലോ ആണെന്ന തോന്നൽ. പാർക്കിൻസൺസ് രോഗ സൈക്കോസിസിന്റെ സവിശേഷത',
    image: presenceHallucinationImage
  },
  {
    id: 'minor-hallucination',
    section: 'Hallucinations',
    category: 'Visual Hallucinations',
    type: 'Minor Hallucination',
    typeMl: 'മൈനർ ഹാലൂസിനേഷൻ',
    description: 'Collective term used in Parkinson\'s disease to describe illusions, passage hallucinations and presence hallucinations',
    descriptionMl: 'പാർക്കിൻസൺസ് രോഗത്തിൽ ഇല്യൂഷനുകൾ, പാസേജ് ഹാലൂസിനേഷനുകൾ, സാന്നിധ്യ ഹാലൂസിനേഷനുകൾ വിവരിക്കാൻ ഉപയോഗിക്കുന്ന കൂട്ടായ പദം',
    image: passageHallucinationImage
  },
  {
    id: 'multimodality-hallucination',
    section: 'Hallucinations',
    category: 'Visual Hallucinations',
    type: 'Multimodality Hallucination',
    typeMl: 'മൾട്ടിമോഡാലിറ്റി ഹാലൂസിനേഷൻ',
    description: 'Visual hallucination combined with hallucinations in other senses. Content in different modalities may be perceptually related (e.g., figure talking to you) or perceptually unrelated (disembodied voice with content unrelated to figure)',
    descriptionMl: 'മറ്റ് ഇന്ദ്രിയങ്ങളിലെ ഹാലൂസിനേഷനുകളുമായി സംയോജിപ്പിച്ച വിഷ്വൽ ഹാലൂസിനേഷൻ. വിവിധ രീതികളിലെ ഉള്ളടക്കം മനസ്സിലാക്കാൻ ബന്ധപ്പെട്ടിരിക്കാം (ഉദാ., രൂപം നിങ്ങളോട് സംസാരിക്കുന്നു) അല്ലെങ്കിൽ മനസ്സിലാക്കാൻ ബന്ധമില്ലാത്തത് (രൂപവുമായി ബന്ധമില്ലാത്ത ഉള്ളടക്കമുള്ള ശരീരമില്ലാത്ത ശബ്ദം)',
    image: multimodalityHallucinationImage
  },
  {
    id: 'pseudohallucination',
    section: 'Hallucinations',
    category: 'Visual Hallucinations',
    type: 'Pseudohallucination',
    typeMl: 'സ്യൂഡോഹാലൂസിനേഷൻ',
    description: 'In neurological literature, a hallucination with insight. In psychiatric literature, a hallucination in the mind\'s eye rather than externally projected and related to imagery',
    descriptionMl: 'ന്യൂറോളജിക്കൽ സാഹിത്യത്തിൽ, ഉൾക്കാഴ്ചയോടുകൂടിയ ഹാലൂസിനേഷൻ. സൈക്യാട്രിക് സാഹിത്യത്തിൽ, ബാഹ്യമായി പ്രൊജക്റ്റ് ചെയ്യുന്നതിനുപകരം മനസ്സിന്റെ കണ്ണിലെ ഹാലൂസിനേഷൻ, ഇമേജറിയുമായി ബന്ധപ്പെട്ടത്',
    image: pseudohallucinationImage
  },
  {
    id: 'secondary-delusion',
    section: 'Hallucinations',
    category: 'Visual Hallucinations',
    type: 'Secondary Delusion',
    typeMl: 'ദ്വിതീയ ഡെലൂഷൻ',
    description: 'A false belief related to the visual hallucination (e.g., people have been let into the house). Secondary delusions imply impaired insight',
    descriptionMl: 'വിഷ്വൽ ഹാലൂസിനേഷനുമായി ബന്ധപ്പെട്ട തെറ്റായ വിശ്വാസം (ഉദാ., ആളുകളെ വീട്ടിലേക്ക് അനുവദിച്ചു). ദ്വിതീയ ഡെലൂഷനുകൾ വൈകല്യമുള്ള ഉൾക്കാഴ്ചയെ സൂചിപ്പിക്കുന്നു',
    image: secondaryDelusionImage
  }
];
