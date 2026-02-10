import { Behav5Item, SoftSignItem, VatItem, HistoryItem, TestItem, ClinicalExamItem, IqcodeItem, CdrDomain } from '@/types/dementia';

// VAT Images
import hedgehogChair from '@/assets/vat/hedgehog-chair.jpg';
import apeUmbrella from '@/assets/vat/ape-umbrella.jpg';
import keyBalloon from '@/assets/vat/key-balloon.jpg';
import dieSaucepan from '@/assets/vat/die-saucepan.jpg';
import birdCarriage from '@/assets/vat/bird-carriage.jpg';
import flagInkwell from '@/assets/vat/flag-inkwell.jpg';
import chairCue from '@/assets/vat/chair-cue.jpg';
import apeCue from '@/assets/vat/ape-cue.jpg';
import balloonCue from '@/assets/vat/balloon-cue.jpg';
import saucepanCue from '@/assets/vat/saucepan-cue.jpg';
import carriageCue from '@/assets/vat/carriage-cue.jpg';
import inkwellCue from '@/assets/vat/inkwell-cue.jpg';

export const BEHAV5_ITEMS: Behav5Item[] = [
  {
    id: 'agitation',
    title: 'Agitation/Aggression',
    titleMl: 'ആക്രമണോത്സുകത/ക്ഷോഭം',
    description: 'Does your care recipient get angry or hostile? Resist care from others?',
    descriptionMl: 'നിങ്ങളുടെ രോഗി ദേഷ്യപ്പെടുകയോ ശത്രുതാ മനോഭാവം കാണിക്കുകയോ ചെയ്യുന്നുണ്ടോ? മറ്റുള്ളവരുടെ പരിചരണം എതിർക്കുന്നുണ്ടോ?'
  },
  {
    id: 'hallucinations',
    title: 'Hallucinations',
    titleMl: 'ഭ്രമാത്മക കാഴ്ചകൾ',
    description: 'Does your care recipient see and/or hear things that no one else can see or hear?',
    descriptionMl: 'മറ്റാർക്കും കാണാനോ കേൾക്കാനോ കഴിയാത്ത കാര്യങ്ങൾ രോഗി കാണുകയോ കേൾക്കുകയോ ചെയ്യുന്നുണ്ടോ?'
  },
  {
    id: 'irritability',
    title: 'Irritability/Frequently Changing Mood',
    titleMl: 'ക്ഷോഭം/ഇടയ്ക്കിടെ മാറുന്ന മാനസികാവസ്ഥ',
    description: 'Does your care recipient act impatient and cranky? Does his or her mood frequently change for no apparent reason?',
    descriptionMl: 'രോഗി അക്ഷമനും ക്ഷോഭിതനും ആയി പെരുമാറുന്നുണ്ടോ? പ്രത്യക്ഷമായ കാരണമില്ലാതെ മാനസികാവസ്ഥ ഇടയ്ക്കിടെ മാറുന്നുണ്ടോ?'
  },
  {
    id: 'suspiciousness',
    title: 'Suspiciousness/Paranoia',
    titleMl: 'സംശയം/പാരനോയ',
    description: 'Does your care recipient act suspicious without good reason (example: believes that others are stealing from him or her, or planning to harm him or her in some way)?',
    descriptionMl: 'ന്യായമായ കാരണമില്ലാതെ രോഗി സംശയം പ്രകടിപ്പിക്കുന്നുണ്ടോ (ഉദാ: മറ്റുള്ളവർ തന്നിൽ നിന്ന് മോഷ്ടിക്കുന്നു അല്ലെങ്കിൽ ഉപദ്രവിക്കാൻ പദ്ധതിയിടുന്നു എന്ന് വിശ്വസിക്കുക)?'
  },
  {
    id: 'withdrawal',
    title: 'Indifference/Social Withdrawal',
    titleMl: 'നിസ്സംഗത/സാമൂഹിക പിന്മാറ്റം',
    description: 'Does your care recipient seem less interested in his or her usual activities or in the activities and plans of others?',
    descriptionMl: 'സാധാരണ പ്രവർത്തനങ്ങളിലോ മറ്റുള്ളവരുടെ പ്രവർത്തനങ്ങളിലോ പദ്ധതികളിലോ രോഗിക്ക് താൽപ്പര്യം കുറഞ്ഞതായി തോന്നുന്നുണ്ടോ?'
  },
  {
    id: 'sleep',
    title: 'Sleep Problems',
    titleMl: 'ഉറക്ക പ്രശ്നങ്ങൾ',
    description: 'Does your care recipient have trouble sleeping at night?',
    descriptionMl: 'രാത്രിയിൽ ഉറങ്ങാൻ രോഗിക്ക് ബുദ്ധിമുട്ട് ഉണ്ടോ?'
  },
  {
    id: 'gadget',
    title: 'Problems with Learning a New Gadget',
    titleMl: 'പുതിയ ഉപകരണം പഠിക്കാനുള്ള പ്രശ്നങ്ങൾ',
    description: 'Does your care recipient have difficulty learning to use new devices like phones, remotes, or appliances?',
    descriptionMl: 'ഫോണുകൾ, റിമോട്ടുകൾ, അല്ലെങ്കിൽ ഉപകരണങ്ങൾ പോലുള്ള പുതിയ ഉപകരണങ്ങൾ ഉപയോഗിക്കാൻ പഠിക്കുന്നതിൽ രോഗിക്ക് ബുദ്ധിമുട്ട് ഉണ്ടോ?'
  },
  {
    id: 'reasoning',
    title: 'Problems with Reasoning',
    titleMl: 'ന്യായവാദത്തിലുള്ള പ്രശ്നങ്ങൾ',
    description: 'Does your care recipient have trouble with logical thinking, problem-solving, or making sound judgments?',
    descriptionMl: 'യുക്തിസഹമായ ചിന്ത, പ്രശ്നപരിഹാരം, അല്ലെങ്കിൽ ശരിയായ തീരുമാനങ്ങൾ എടുക്കുന്നതിൽ രോഗിക്ക് ബുദ്ധിമുട്ട് ഉണ്ടോ?'
  },
  {
    id: 'finance',
    title: 'Problems with Personal Finance',
    titleMl: 'സ്വകാര്യ സാമ്പത്തിക കാര്യങ്ങളിലുള്ള പ്രശ്നങ്ങൾ',
    description: 'Does your care recipient have difficulty managing money, paying bills, or handling financial matters?',
    descriptionMl: 'പണം കൈകാര്യം ചെയ്യുന്നതിലോ, ബില്ലുകൾ അടയ്ക്കുന്നതിലോ, സാമ്പത്തിക കാര്യങ്ങൾ കൈകാര്യം ചെയ്യുന്നതിലോ രോഗിക്ക് ബുദ്ധിമുട്ട് ഉണ്ടോ?'
  }
];

export const SOFT_SIGN_ITEMS: SoftSignItem[] = [
  {
    id: 'mhd',
    title: 'Midline Hand Drift (MHD)',
    titleMl: 'മിഡ്‌ലൈൻ ഹാൻഡ് ഡ്രിഫ്റ്റ് (MHD)',
    description: 'One or both hands unintentionally move toward the midline when the patient is sitting upright with eyes open, arms outstretched, and palms facing upwards.',
    descriptionMl: 'രോഗി കണ്ണുകൾ തുറന്ന്, കൈകൾ നീട്ടി, കൈപ്പത്തികൾ മുകളിലേക്ക് തിരിച്ച് ഇരിക്കുമ്പോൾ ഒരു കൈയോ രണ്ട് കൈകളോ അറിയാതെ മധ്യരേഖയിലേക്ക് നീങ്ങുന്നു.',
    instructions: 'Ask the patient to sit upright with eyes open, arms outstretched forward, and palms facing upwards. Observe for any unintentional movement of hands toward the midline. MHD is positive if one or both hands drift toward the midline.',
    instructionsMl: 'രോഗിയോട് കണ്ണുകൾ തുറന്ന്, കൈകൾ മുന്നോട്ട് നീട്ടി, കൈപ്പത്തികൾ മുകളിലേക്ക് തിരിച്ച് നേരെ ഇരിക്കാൻ ആവശ്യപ്പെടുക. കൈകളുടെ മധ്യരേഖയിലേക്കുള്ള ഏതെങ്കിലും അനിയന്ത്രിത ചലനം നിരീക്ഷിക്കുക.'
  },
  {
    id: 'sts',
    title: 'Shoulder Tapping Sign (STS)',
    titleMl: 'ഷോൾഡർ ടാപ്പിംഗ് സൈൻ (STS)',
    description: 'The patient is asked to tap each shoulder twice with two fingers while keeping eyes shut. The sign is positive if the patient taps either shoulder more than twice.',
    descriptionMl: 'കണ്ണുകൾ അടച്ച് ഓരോ തോളിലും രണ്ട് വിരലുകൾ കൊണ്ട് രണ്ട് തവണ ടാപ്പ് ചെയ്യാൻ രോഗിയോട് ആവശ്യപ്പെടുന്നു. ഏതെങ്കിലും തോളിൽ രണ്ടിലധികം തവണ ടാപ്പ് ചെയ്താൽ സൈൻ പോസിറ്റീവ് ആണ്.',
    instructions: 'Instruct the patient: "Tap each shoulder twice with two fingers keeping your eyes shut." The STS sign is considered positive if the patient taps either shoulder more than twice.',
    instructionsMl: 'രോഗിയോട് നിർദ്ദേശിക്കുക: "കണ്ണുകൾ അടച്ച് രണ്ട് വിരലുകൾ കൊണ്ട് ഓരോ തോളിലും രണ്ട് തവണ ടാപ്പ് ചെയ്യുക." ഏതെങ്കിലും തോളിൽ രണ്ടിലധികം തവണ ടാപ്പ് ചെയ്താൽ STS സൈൻ പോസിറ്റീവ് ആയി കണക്കാക്കുന്നു.'
  },
  {
    id: 'hts',
    title: 'Head Turning Sign (HTS)',
    titleMl: 'ഹെഡ് ടേണിംഗ് സൈൻ (HTS)',
    description: 'The patient turns their head toward their caregiver/companion when asked questions, seeking help to answer. This indicates awareness of memory deficit.',
    descriptionMl: 'ചോദ്യങ്ങൾ ചോദിക്കുമ്പോൾ രോഗി ഉത്തരം നൽകാൻ സഹായം തേടി തങ്ങളുടെ പരിചാരകന്റെ/കൂട്ടാളിയുടെ നേരെ തല തിരിക്കുന്നു. ഇത് ഓർമ്മക്കുറവിനെക്കുറിച്ചുള്ള അവബോധം സൂചിപ്പിക്കുന്നു.',
    instructions: 'During history taking, observe if the patient frequently turns their head toward their caregiver when asked questions about memory, orientation, or daily activities. The sign is positive if this behavior is consistent and pronounced.',
    instructionsMl: 'ഹിസ്റ്ററി എടുക്കുമ്പോൾ, ഓർമ്മ, ഓറിയന്റേഷൻ, അല്ലെങ്കിൽ ദൈനംദിന പ്രവർത്തനങ്ങളെക്കുറിച്ച് ചോദ്യങ്ങൾ ചോദിക്കുമ്പോൾ രോഗി പലപ്പോഴും പരിചാരകന്റെ നേരെ തല തിരിക്കുന്നുണ്ടോ എന്ന് നിരീക്ഷിക്കുക. ഈ പെരുമാറ്റം സ്ഥിരവും പ്രകടവും ആണെങ്കിൽ സൈൻ പോസിറ്റീവ് ആണ്.'
  },
  {
    id: 'applause',
    title: 'Applause Sign',
    titleMl: 'അപ്ലോസ് സൈൻ',
    description: 'The patient cannot stop clapping after being asked to clap exactly 3 times. Indicates frontal lobe dysfunction and executive control impairment.',
    descriptionMl: 'കൃത്യം 3 തവണ കൈയടിക്കാൻ ആവശ്യപ്പെട്ടാൽ രോഗിക്ക് കൈയടി നിർത്താൻ കഴിയുന്നില്ല. ഫ്രോണ്ടൽ ലോബ് പ്രവർത്തന തകരാറും എക്സിക്യൂട്ടീവ് നിയന്ത്രണ വൈകല്യവും സൂചിപ്പിക്കുന്നു.',
    instructions: 'Demonstrate clapping 3 times to the patient, then ask them to "Clap exactly 3 times, just like I did." The sign is positive if the patient claps more than 3 times or cannot inhibit the clapping response.',
    instructionsMl: 'രോഗിയോട് 3 തവണ കൈയടിച്ച് കാണിക്കുക, എന്നിട്ട് "ഞാൻ ചെയ്തത് പോലെ കൃത്യം 3 തവണ കൈയടിക്കുക" എന്ന് ആവശ്യപ്പെടുക. രോഗി 3-ൽ കൂടുതൽ തവണ കൈയടിക്കുകയോ കൈയടി പ്രതികരണം തടയാൻ കഴിയാതെ വരികയോ ചെയ്താൽ സൈൻ പോസിറ്റീവ് ആണ്.'
  },
  {
    id: 'glabellar',
    title: 'Glabellar Tap Reflex (Myerson Sign)',
    titleMl: 'ഗ്ലാബെല്ലാർ ടാപ്പ് റിഫ്ലെക്സ് (മൈയേഴ്സൺ സൈൻ)',
    description: 'Persistent blinking in response to repeated tapping on the glabella (area between eyebrows). Normally, blinking habituates after a few taps.',
    descriptionMl: 'ഗ്ലാബെല്ല (പുരികങ്ങൾക്കിടയിലുള്ള ഭാഗം) ആവർത്തിച്ച് ടാപ്പ് ചെയ്യുമ്പോൾ തുടർച്ചയായി കണ്ണിറുക്കൽ. സാധാരണഗതിയിൽ, കുറച്ച് ടാപ്പുകൾക്ക് ശേഷം കണ്ണിറുക്കൽ നിലയ്ക്കും.',
    instructions: 'Stand behind the patient. Tap the glabella (between the eyebrows) repeatedly with your finger. The reflex is positive if the patient continues to blink with each tap beyond 5-10 taps (failure to habituate).',
    instructionsMl: 'രോഗിയുടെ പിന്നിൽ നിൽക്കുക. ഗ്ലാബെല്ല (പുരികങ്ങൾക്കിടയിൽ) വിരൽ കൊണ്ട് ആവർത്തിച്ച് ടാപ്പ് ചെയ്യുക. 5-10 ടാപ്പുകൾക്ക് ശേഷവും ഓരോ ടാപ്പിനും രോഗി കണ്ണിറുക്കുന്നത് തുടരുകയാണെങ്കിൽ റിഫ്ലെക്സ് പോസിറ്റീവ് ആണ്.'
  },
  {
    id: 'palmomental',
    title: 'Palmomental Reflex',
    titleMl: 'പാൽമോമെന്റൽ റിഫ്ലെക്സ്',
    description: 'Contraction of the mentalis muscle (chin) when the thenar eminence of the palm is stroked. Indicates frontal lobe release.',
    descriptionMl: 'കൈപ്പത്തിയുടെ തെനാർ എമിനൻസ് തലോടുമ്പോൾ മെന്റാലിസ് പേശി (താടി) സങ്കോചിക്കുന്നു. ഫ്രോണ്ടൽ ലോബ് റിലീസ് സൂചിപ്പിക്കുന്നു.',
    instructions: 'Firmly stroke the thenar eminence (base of thumb) of the palm with a tongue depressor or your fingernail. The reflex is positive if there is ipsilateral contraction of the mentalis muscle causing puckering or elevation of the chin.',
    instructionsMl: 'കൈപ്പത്തിയുടെ തെനാർ എമിനൻസ് (തള്ളവിരലിന്റെ അടിഭാഗം) ടങ്ങ് ഡിപ്രസർ അല്ലെങ്കിൽ നിങ്ങളുടെ നഖം കൊണ്ട് ദൃഢമായി തലോടുക. താടിയുടെ ചുരുക്കമോ ഉയർച്ചയോ ഉണ്ടാക്കുന്ന മെന്റാലിസ് പേശിയുടെ ഇപ്സിലാറ്ററൽ സങ്കോചം ഉണ്ടെങ്കിൽ റിഫ്ലെക്സ് പോസിറ്റീവ് ആണ്.'
  },
  {
    id: 'snout',
    title: 'Snout Reflex',
    titleMl: 'സ്നൗട്ട് റിഫ്ലെക്സ്',
    description: 'Pursing or puckering of the lips when the philtrum or upper lip is tapped. A primitive reflex indicating frontal lobe dysfunction.',
    descriptionMl: 'ഫിൽട്രം അല്ലെങ്കിൽ മേൽചുണ്ട് ടാപ്പ് ചെയ്യുമ്പോൾ ചുണ്ടുകൾ ചുരുക്കുകയോ കുത്തുകയോ ചെയ്യുന്നു. ഫ്രോണ്ടൽ ലോബ് പ്രവർത്തനക്കുറവ് സൂചിപ്പിക്കുന്ന പ്രിമിറ്റീവ് റിഫ്ലെക്സ്.',
    instructions: 'Gently tap on the philtrum (vertical groove between nose and upper lip) or upper lip with your finger or reflex hammer. The reflex is positive if the lips purse or pucker in response.',
    instructionsMl: 'ഫിൽട്രം (മൂക്കിനും മേൽചുണ്ടിനും ഇടയിലുള്ള ലംബമായ ചാൽ) അല്ലെങ്കിൽ മേൽചുണ്ട് നിങ്ങളുടെ വിരൽ അല്ലെങ്കിൽ റിഫ്ലെക്സ് ഹാമർ ഉപയോഗിച്ച് മൃദുവായി ടാപ്പ് ചെയ്യുക. പ്രതികരണമായി ചുണ്ടുകൾ ചുരുക്കുകയോ കുത്തുകയോ ചെയ്താൽ റിഫ്ലെക്സ് പോസിറ്റീവ് ആണ്.'
  }
];

// Visual Association Test (VAT) Items
export const VAT_ITEMS: VatItem[] = [
  {
    id: 'vat1',
    cueObject: 'Chair',
    cueObjectMl: 'കസേര',
    targetObject: 'Hedgehog',
    targetObjectMl: 'മുള്ളൻപന്നി',
    associationImage: hedgehogChair,
    cueImage: chairCue,
    question: 'What was on the chair?',
    questionMl: 'കസേരയിൽ എന്തായിരുന്നു?'
  },
  {
    id: 'vat2',
    cueObject: 'Ape',
    cueObjectMl: 'കുരങ്ങൻ',
    targetObject: 'Umbrella',
    targetObjectMl: 'കുട',
    associationImage: apeUmbrella,
    cueImage: apeCue,
    question: 'What was the ape holding?',
    questionMl: 'കുരങ്ങൻ എന്താണ് പിടിച്ചിരുന്നത്?'
  },
  {
    id: 'vat3',
    cueObject: 'Balloon',
    cueObjectMl: 'ബലൂൺ',
    targetObject: 'Key',
    targetObjectMl: 'താക്കോൽ',
    associationImage: keyBalloon,
    cueImage: balloonCue,
    question: 'What was hanging from the balloon?',
    questionMl: 'ബലൂണിൽ നിന്ന് എന്താണ് തൂങ്ങിയിരുന്നത്?'
  },
  {
    id: 'vat4',
    cueObject: 'Saucepan',
    cueObjectMl: 'പാത്രം',
    targetObject: 'Die',
    targetObjectMl: 'പകിട',
    associationImage: dieSaucepan,
    cueImage: saucepanCue,
    question: 'What was in the saucepan?',
    questionMl: 'പാത്രത്തിൽ എന്തായിരുന്നു?'
  },
  {
    id: 'vat5',
    cueObject: 'Baby carriage',
    cueObjectMl: 'കുഞ്ഞിന്റെ വണ്ടി',
    targetObject: 'Bird',
    targetObjectMl: 'പക്ഷി',
    associationImage: birdCarriage,
    cueImage: carriageCue,
    question: 'What was in the baby carriage?',
    questionMl: 'കുഞ്ഞിന്റെ വണ്ടിയിൽ എന്തായിരുന്നു?'
  },
  {
    id: 'vat6',
    cueObject: 'Inkwell',
    cueObjectMl: 'മഷിക്കുപ്പി',
    targetObject: 'Flag',
    targetObjectMl: 'പതാക',
    associationImage: flagInkwell,
    cueImage: inkwellCue,
    question: 'What was standing in the inkwell?',
    questionMl: 'മഷിക്കുപ്പിയിൽ എന്താണ് നിന്നിരുന്നത്?'
  }
];

export const CLINICAL_EXAM_ITEMS: ClinicalExamItem[] = [
  // Frontal Lobe Features
  { id: 'hygiene_neglect', label: 'Neglect of personal hygiene and grooming', labelMl: 'വ്യക്തിപരമായ ശുചിത്വവും ഗ്രൂമിംഗും അവഗണിക്കൽ', category: 'frontal' },
  { id: 'social_awareness_loss', label: 'Loss of social awareness (shoplifting, stealing)', labelMl: 'സാമൂഹിക ബോധം നഷ്ടപ്പെടൽ (കട മോഷണം, മോഷണം)', category: 'frontal' },
  { id: 'disinhibition', label: 'Disinhibition (inappropriate jocularity, restless pacing, hypersexuality)', labelMl: 'ഡിസ്ഇൻഹിബിഷൻ (അനുചിതമായ തമാശ, അസ്വസ്ഥമായ നടത്തം, അമിത ലൈംഗികത)', category: 'frontal' },
  { id: 'insight_loss', label: 'Loss of insight', labelMl: 'ഉൾക്കാഴ്ച നഷ്ടപ്പെടൽ', category: 'frontal' },
  { id: 'hyperorality', label: 'Hyperorality or altered dietary habits; overeating; excessive smoking/alcohol', labelMl: 'ഹൈപ്പർഓറാലിറ്റി അല്ലെങ്കിൽ മാറിയ ഭക്ഷണശീലങ്ങൾ; അമിത ഭക്ഷണം; അമിത പുകവലി/മദ്യപാനം', category: 'frontal' },
  { id: 'apathy', label: 'Apathy or indifference', labelMl: 'അപാഥി അല്ലെങ്കിൽ നിസ്സംഗത', category: 'frontal' },
  { id: 'emotional_indifference', label: 'Emotional indifference or social withdrawal', labelMl: 'വൈകാരിക നിസ്സംഗത അല്ലെങ്കിൽ സാമൂഹിക പിന്മാറ്റം', category: 'frontal' },
  { id: 'stereotyped_behaviors', label: 'Stereotyped or repetitive behaviours (wandering, singing, clapping)', labelMl: 'സ്റ്റീരിയോടൈപ്ഡ് അല്ലെങ്കിൽ ആവർത്തിച്ചുള്ള പെരുമാറ്റങ്ങൾ (അലഞ്ഞുതിരിയൽ, പാട്ട്, കൈയടി)', category: 'frontal' },
  { id: 'ritualistic_behaviors', label: 'Ritualistic behaviours (hoarding, excessive toileting routines)', labelMl: 'ആചാരപരമായ പെരുമാറ്റങ്ങൾ (ശേഖരണം, അമിത ടോയ്‌ലറ്റ് ദിനചര്യകൾ)', category: 'frontal' },
  { id: 'echolalia', label: 'Echolalia or perseveration', labelMl: 'എക്കോലാലിയ അല്ലെങ്കിൽ പെർസെവറേഷൻ', category: 'frontal' },
  { id: 'impaired_judgement', label: 'Impaired judgement', labelMl: 'വിധിന്യായ ശേഷി കുറവ്', category: 'frontal' },
  { id: 'reduced_interest', label: 'Reduced interest in surroundings', labelMl: 'ചുറ്റുപാടുകളിൽ താൽപ്പര്യം കുറവ്', category: 'frontal' },

  // Temporal Lobe Features
  { id: 'forgetting_lists', label: 'Forgetting lists, appointments, telephone numbers, errands, meals', labelMl: 'ലിസ്റ്റുകൾ, അപ്പോയിന്റ്മെന്റുകൾ, ഫോൺ നമ്പറുകൾ, ജോലികൾ, ഭക്ഷണം മറക്കൽ', category: 'temporal' },
  { id: 'reading_writing_difficulty', label: 'Difficulty with reading and writing', labelMl: 'വായനയിലും എഴുത്തിലും ബുദ്ധിമുട്ട്', category: 'temporal' },
  { id: 'altered_speech', label: 'Altered speech patterns', labelMl: 'മാറിയ സംസാര രീതികൾ', category: 'temporal' },

  // Parietal Lobe Features
  { id: 'dressing_apraxia', label: 'Difficulty dressing (dressing apraxia)', labelMl: 'വസ്ത്രം ധരിക്കാൻ ബുദ്ധിമുട്ട് (ഡ്രെസ്സിംഗ് അപ്രാക്സിയ)', category: 'parietal' },
  { id: 'wayfinding', label: 'Poor way-finding; getting lost easily', labelMl: 'വഴി കണ്ടെത്താൻ ബുദ്ധിമുട്ട്; എളുപ്പത്തിൽ വഴി തെറ്റുന്നു', category: 'parietal' },
  { id: 'tool_use_impaired', label: 'Impaired use of everyday tools (e.g., telephone)', labelMl: 'ദൈനംദിന ഉപകരണങ്ങൾ ഉപയോഗിക്കാൻ ബുദ്ധിമുട്ട് (ഉദാ: ടെലിഫോൺ)', category: 'parietal' },
  { id: 'money_handling', label: 'Difficulty handling money', labelMl: 'പണം കൈകാര്യം ചെയ്യാൻ ബുദ്ധിമുട്ട്', category: 'parietal' },
  { id: 'calculation_difficulty', label: 'Difficulty with calculations', labelMl: 'കണക്കുകൂട്ടലിൽ ബുദ്ധിമുട്ട്', category: 'parietal' },
  { id: 'neglect_phenomena', label: 'Neglect phenomena', labelMl: 'നെഗ്ലക്ട് പ്രതിഭാസങ്ങൾ', category: 'parietal' },

  // Occipital Lobe Features
  { id: 'prosopagnosia', label: 'Difficulty recognizing familiar faces (prosopagnosia)', labelMl: 'പരിചിതമായ മുഖങ്ങൾ തിരിച്ചറിയാൻ ബുദ്ധിമുട്ട് (പ്രോസോപാഗ്നോസിയ)', category: 'occipital' },

  // Other General Features
  { id: 'slowed_movements', label: 'Slowed movements', labelMl: 'മന്ദഗതിയിലുള്ള ചലനങ്ങൾ', category: 'general' },
  { id: 'delusions_hallucinations', label: 'Delusions or hallucinations', labelMl: 'മിഥ്യാധാരണകൾ അല്ലെങ്കിൽ ഭ്രമാത്മക കാഴ്ചകൾ', category: 'general' },
  { id: 'emotional_lability', label: 'Emotional lability', labelMl: 'വൈകാരിക അസ്ഥിരത', category: 'general' }
];

export const HISTORY_ITEMS: HistoryItem[] = [
  // Medical History
  { id: 'urinary', label: 'Urinary complaints', labelMl: 'മൂത്ര സംബന്ധമായ പരാതികൾ', category: 'medical' },
  { id: 'hypertension', label: 'Hypertension', labelMl: 'ഉയർന്ന രക്തസമ്മർദ്ദം', category: 'medical' },
  { id: 'diabetes', label: 'Diabetes', labelMl: 'പ്രമേഹം', category: 'medical' },
  { id: 'thyroid', label: 'Thyroid problems', labelMl: 'തൈറോയ്ഡ് പ്രശ്നങ്ങൾ', category: 'medical' },
  { id: 'cardiac_surgery', label: 'Cardiac surgery', labelMl: 'ഹൃദയ ശസ്ത്രക്രിയ', category: 'medical' },
  { id: 'cad', label: 'Coronary Artery Disease (CAD)', labelMl: 'കൊറോണറി ആർട്ടറി ഡിസീസ് (CAD)', category: 'medical' },
  { id: 'smoking', label: 'Smoking', labelMl: 'പുകവലി', category: 'lifestyle' },
  { id: 'alcohol', label: 'Alcohol use', labelMl: 'മദ്യപാനം', category: 'lifestyle' },
  { id: 'substance', label: 'Substance abuse', labelMl: 'ലഹരി ഉപയോഗം', category: 'lifestyle' },
  { id: 'family_history', label: 'Family history of dementia', labelMl: 'കുടുംബത്തിൽ ഡിമെൻഷ്യയുടെ ചരിത്രം', category: 'family' },

  // Aetiological History
  { id: 'stroke_tia', label: 'History of stroke, TIAs', labelMl: 'സ്ട്രോക്ക്, TIA കളുടെ ചരിത്രം', category: 'aetiological' },
  { id: 'raised_icp', label: 'Raised intracranial pressure, gait disturbances, incontinence', labelMl: 'ഉയർന്ന ഇൻട്രാക്രേനിയൽ പ്രഷർ, നടത്ത തകരാറുകൾ, അസ്വാഭാവിക മൂത്രവിസർജ്ജനം', category: 'aetiological' },
  { id: 'head_injury', label: 'Head injury', labelMl: 'തലയ്ക്ക് ക്ഷതം', category: 'aetiological' },
  { id: 'depression', label: 'Depression', labelMl: 'വിഷാദം', category: 'aetiological' },
  { id: 'myoclonus', label: 'Myoclonus', labelMl: 'മയോക്ലോനസ്', category: 'aetiological' },
  { id: 'abnormal_movements', label: 'Abnormal movements (tremor, chorea)', labelMl: 'അസാധാരണ ചലനങ്ങൾ (വിറയൽ, കൊറിയ)', category: 'aetiological' },
  { id: 'neuroleptic_sensitivity', label: 'Neuroleptic sensitivity, cognitive fluctuation, hallucinations', labelMl: 'ന്യൂറോലെപ്റ്റിക് സെൻസിറ്റിവിറ്റി, കോഗ്നിറ്റീവ് ഫ്ലക്ചുവേഷൻ, ഭ്രമാത്മക കാഴ്ചകൾ', category: 'aetiological' },
  { id: 'alien_limb', label: 'Alien limb phenomenon', labelMl: 'ഏലിയൻ ലിംബ് പ്രതിഭാസം', category: 'aetiological' },
  { id: 'dystonia', label: 'Dystonia', labelMl: 'ഡിസ്റ്റോണിയ', category: 'aetiological' },
  { id: 'chronic_meningitis', label: 'Chronic meningitis', labelMl: 'ക്രോണിക് മെനിഞ്ചൈറ്റിസ്', category: 'aetiological' },
  { id: 'sti_exposure', label: 'History of sexually transmitted exposures', labelMl: 'ലൈംഗികമായി പകരുന്ന അണുബാധകളുടെ ചരിത്രം', category: 'aetiological' },
  { id: 'malignancy', label: 'Features suggestive of internal malignancy', labelMl: 'ആന്തരിക മാരകരോഗം സൂചിപ്പിക്കുന്ന ലക്ഷണങ്ങൾ', category: 'aetiological' },
  { id: 'collagen_vascular', label: 'Collagen vascular disorders', labelMl: 'കൊളാജൻ വാസ്കുലർ ഡിസോർഡറുകൾ', category: 'aetiological' },
  { id: 'amyotrophy', label: 'Amyotrophy', labelMl: 'അമയോട്രോഫി', category: 'aetiological' },
  { id: 'seizures', label: 'Seizures', labelMl: 'അപസ്മാരം', category: 'aetiological' },
  { id: 'diarrhoea_malabsorption', label: 'History of diarrhoea or malabsorption', labelMl: 'വയറിളക്കം അല്ലെങ്കിൽ മലാബ്സോർപ്ഷന്റെ ചരിത്രം', category: 'aetiological' },

  // DAPHNE Scale - Behavioral History (unique items not covered above)
  { id: 'inappropriate_joviality', label: 'Inappropriate joviality (laughing unreasonably, embarrassing situations)', labelMl: 'അനുചിതമായ ആനന്ദം (അയുക്തമായി ചിരിക്കുന്നു, ലജ്ജാകരമായ സാഹചര്യങ്ങളിൽ)', category: 'behavioral' },
  { id: 'unrestrained_spending', label: 'Unrestrained spending habits (excessive purchases, gambling, debts)', labelMl: 'അനിയന്ത്രിതമായ ചെലവ് ശീലങ്ങൾ (അമിത വാങ്ങലുകൾ, ചൂതാട്ടം, കടങ്ങൾ)', category: 'behavioral' },
  { id: 'sexual_disinhibition', label: 'Sexual disinhibition (inappropriate comments, indecent behavior)', labelMl: 'ലൈംഗിക അനിയന്ത്രണം (അനുചിത അഭിപ്രായങ്ങൾ, അസഭ്യ പെരുമാറ്റം)', category: 'behavioral' },
  { id: 'loss_of_empathy', label: 'Loss of empathy (indifference to relatives, difficulty expressing feelings)', labelMl: 'സഹാനുഭൂതിയുടെ നഷ്ടം (ബന്ധുക്കളോട് നിസ്സംഗത, വികാരങ്ങൾ പ്രകടിപ്പിക്കുന്നതിൽ ബുദ്ധിമുട്ട്)', category: 'behavioral' },
  { id: 'perseverations', label: 'Perseverations (hoarding, ritualized activities, obsessions)', labelMl: 'ആവർത്തനം (ശേഖരണം, ആചാരപരമായ പ്രവർത്തനങ്ങൾ, ഭ്രാന്തുകൾ)', category: 'behavioral' },
  { id: 'hyperorality_eating', label: 'Hyperorality/Bulimia (new sweet preference, bizarre food preferences, overeating)', labelMl: 'ഹൈപ്പർഓറാലിറ്റി/അമിതഭക്ഷണം (മധുരപലഹാര മുൻഗണന, വിചിത്ര ഭക്ഷണ ശീലങ്ങൾ, അമിതമായി കഴിക്കുന്നു)', category: 'behavioral' },
  { id: 'personal_neglect', label: 'Personal neglect (poor hygiene, must be stimulated to wash/change clothes)', labelMl: 'വ്യക്തിപരമായ അവഗണന (മോശം ശുചിത്വം, കുളിക്കാൻ/വസ്ത്രം മാറാൻ പ്രേരിപ്പിക്കേണ്ടതുണ്ട്)', category: 'behavioral' }
];

export const TEST_ITEMS: TestItem[] = [
  { id: 'tft', label: 'Thyroid Function Test (TFT)', labelMl: 'തൈറോയ്ഡ് ഫങ്ഷൻ ടെസ്റ്റ്', category: 'routine' },
  { id: 'b12', label: 'Vitamin B₁₂ level', labelMl: 'വിറ്റാമിൻ B₁₂ ലെവൽ', category: 'routine' },
  { id: 'cbc', label: 'CBC', labelMl: 'സിബിസി', category: 'routine' },
  { id: 'electrolytes', label: 'Serum electrolytes', labelMl: 'സീറം ഇലക്ട്രോലൈറ്റുകൾ', category: 'routine' },
  { id: 'calcium', label: 'Serum calcium', labelMl: 'സീറം കാൽസ്യം', category: 'routine' },
  { id: 'rbs', label: 'Random Blood Sugar (RBS)', labelMl: 'റാൻഡം ബ്ലഡ് ഷുഗർ', category: 'routine' },
  { id: 'lft', label: 'Liver Function Test (LFT)', labelMl: 'ലിവർ ഫങ്ഷൻ ടെസ്റ്റ്', category: 'routine' },
  { id: 'rft', label: 'Renal Function Test (RFT)', labelMl: 'റീനൽ ഫങ്ഷൻ ടെസ്റ്റ്', category: 'routine' },
  { id: 'urinalysis', label: 'Urinalysis', labelMl: 'യൂറിനാലിസിസ്', category: 'routine' },
  { id: 'vdrl', label: 'Serum VDRL/RPR', labelMl: 'സീറം വിഡിആർഎൽ/ആർപിആർ', category: 'special' },
  { id: 'tpha', label: 'Serum TPHA/FTA-ABS', labelMl: 'സീറം ടിപിഎച്ച്എ/എഫ്ടിഎ-എബിഎസ്', category: 'special' },
  { id: 'csf_vdrl', label: 'CSF VDRL', labelMl: 'സിഎസ്എഫ് വിഡിആർഎൽ', category: 'special' },
  { id: 'csf_tpha', label: 'CSF TPHA/FTA-ABS', labelMl: 'സിഎസ്എഫ് ടിപിഎച്ച്എ/എഫ്ടിഎ-എബിഎസ്', category: 'special' },
  { id: 'hiv', label: 'HIV', labelMl: 'എച്ച്ഐവി', category: 'special' },
  { id: 'lyme', label: 'Lyme disease titer', labelMl: 'ലൈം ഡിസീസ് ടൈറ്റർ', category: 'special' },
  { id: 'mri', label: 'MRI Brain', labelMl: 'എംആർഐ ബ്രെയിൻ', category: 'imaging' },
  { id: 'neuropsych', label: 'Neuropsychological evaluation', labelMl: 'ന്യൂറോസൈക്കോളജിക്കൽ മൂല്യനിർണ്ണയം', category: 'imaging' }
];

// VITAMINS mnemonic for Rapidly Progressive Dementias
export const VITAMINS_MNEMONIC = {
  V: { en: 'Vascular', ml: 'വാസ്കുലർ' },
  I: { en: 'Infectious', ml: 'അണുബാധ' },
  T: { en: 'Toxic-Metabolic', ml: 'വിഷ-ഉപാപചയ' },
  A: { en: 'Autoimmune', ml: 'ഓട്ടോഇമ്മ്യൂൺ' },
  M: { en: 'Metastases/Neoplasm', ml: 'മെറ്റാസ്റ്റേസിസ്/നിയോപ്ലാസം' },
  I2: { en: 'Iatrogenic', ml: 'അയട്രോജെനിക്' },
  N: { en: 'Neurodegenerative', ml: 'ന്യൂറോഡീജനറേറ്റീവ്' },
  S: { en: 'Systemic', ml: 'സിസ്റ്റമിക്' }
};

// Short IQCODE - Informant Questionnaire on Cognitive Decline in the Elderly
export const IQCODE_ITEMS: IqcodeItem[] = [
  { id: 'iq1', question: 'Remembering things about family and friends e.g. occupations, birthdays, addresses', questionMl: 'കുടുംബവും സുഹൃത്തുക്കളും സംബന്ധിച്ച കാര്യങ്ങൾ ഓർമ്മിക്കൽ (ഉദാ: ജോലികൾ, ജന്മദിനങ്ങൾ, വിലാസങ്ങൾ)' },
  { id: 'iq2', question: 'Remembering things that have happened recently', questionMl: 'അടുത്തിടെ സംഭവിച്ച കാര്യങ്ങൾ ഓർമ്മിക്കൽ' },
  { id: 'iq3', question: 'Recalling conversations a few days later', questionMl: 'കുറച്ച് ദിവസങ്ങൾക്ക് ശേഷം സംഭാഷണങ്ങൾ ഓർത്തെടുക്കൽ' },
  { id: 'iq4', question: 'Remembering his/her address and telephone number', questionMl: 'സ്വന്തം വിലാസവും ഫോൺ നമ്പറും ഓർമ്മിക്കൽ' },
  { id: 'iq5', question: 'Remembering what day and month it is', questionMl: 'ഏത് ദിവസവും മാസവും ആണെന്ന് ഓർമ്മിക്കൽ' },
  { id: 'iq6', question: 'Remembering where things are usually kept', questionMl: 'സാധനങ്ങൾ സാധാരണ എവിടെ വെക്കാറുണ്ടെന്ന് ഓർമ്മിക്കൽ' },
  { id: 'iq7', question: 'Remembering where to find things which have been put in a different place from usual', questionMl: 'സാധാരണയിൽ നിന്ന് വ്യത്യസ്തമായ സ്ഥലത്ത് വെച്ച സാധനങ്ങൾ എവിടെ കണ്ടെത്താമെന്ന് ഓർമ്മിക്കൽ' },
  { id: 'iq8', question: 'Knowing how to work familiar machines around the house', questionMl: 'വീട്ടിലെ പരിചിതമായ ഉപകരണങ്ങൾ എങ്ങനെ പ്രവർത്തിപ്പിക്കാമെന്ന് അറിയുക' },
  { id: 'iq9', question: 'Learning to use a new gadget or machine around the house', questionMl: 'വീട്ടിൽ പുതിയ ഉപകരണം അല്ലെങ്കിൽ മെഷീൻ ഉപയോഗിക്കാൻ പഠിക്കൽ' },
  { id: 'iq10', question: 'Learning new things in general', questionMl: 'പൊതുവെ പുതിയ കാര്യങ്ങൾ പഠിക്കൽ' },
  { id: 'iq11', question: 'Following a story in a book or on TV', questionMl: 'പുസ്തകത്തിലോ ടിവിയിലോ ഒരു കഥ പിന്തുടരൽ' },
  { id: 'iq12', question: 'Making decisions on everyday matters', questionMl: 'ദൈനംദിന കാര്യങ്ങളിൽ തീരുമാനങ്ങൾ എടുക്കൽ' },
  { id: 'iq13', question: 'Handling money for shopping', questionMl: 'ഷോപ്പിംഗിനായി പണം കൈകാര്യം ചെയ്യൽ' },
  { id: 'iq14', question: 'Handling financial matters e.g. the pension, dealing with the bank', questionMl: 'സാമ്പത്തിക കാര്യങ്ങൾ കൈകാര്യം ചെയ്യൽ (ഉദാ: പെൻഷൻ, ബാങ്ക് ഇടപാടുകൾ)' },
  { id: 'iq15', question: 'Handling other everyday arithmetic problems e.g. knowing how much food to buy, knowing how long between visits from family or friends', questionMl: 'മറ്റ് ദൈനംദിന ഗണിത പ്രശ്നങ്ങൾ കൈകാര്യം ചെയ്യൽ (ഉദാ: എത്ര ഭക്ഷണം വാങ്ങണമെന്ന് അറിയുക, കുടുംബാംഗങ്ങളുടെ സന്ദർശനങ്ങൾ തമ്മിലുള്ള ഇടവേള അറിയുക)' },
  { id: 'iq16', question: 'Using his/her intelligence to understand what is going on and to reason things through', questionMl: 'എന്താണ് നടക്കുന്നതെന്ന് മനസ്സിലാക്കാനും കാര്യങ്ങൾ യുക്തിസഹമായി ചിന്തിക്കാനും ബുദ്ധി ഉപയോഗിക്കൽ' }
];

export const IQCODE_RESPONSE_OPTIONS = [
  { value: 1, label: 'Much improved', labelMl: 'വളരെ മെച്ചപ്പെട്ടു' },
  { value: 2, label: 'A bit improved', labelMl: 'കുറച്ച് മെച്ചപ്പെട്ടു' },
  { value: 3, label: 'Not much change', labelMl: 'കാര്യമായ മാറ്റമില്ല' },
  { value: 4, label: 'A bit worse', labelMl: 'കുറച്ച് മോശമായി' },
  { value: 5, label: 'Much worse', labelMl: 'വളരെ മോശമായി' }
];

// Clinical Dementia Rating (CDR) Scale
export const CDR_DOMAINS: CdrDomain[] = [
  {
    id: 'memory',
    name: 'Memory',
    nameMl: 'ഓർമ്മ',
    description: 'The ability to remember recent events, learn new information, and recall past memories.',
    descriptionMl: 'സമീപകാല സംഭവങ്ങൾ ഓർക്കാനും പുതിയ വിവരങ്ങൾ പഠിക്കാനും കഴിഞ്ഞ ഓർമ്മകൾ ഓർത്തെടുക്കാനുമുള്ള കഴിവ്.',
    ratings: [
      { score: 0, label: 'None', labelMl: 'ഒന്നുമില്ല', description: 'No memory loss or slight inconsistent forgetfulness', descriptionMl: 'ഓർമ്മക്കുറവ് ഇല്ല അല്ലെങ്കിൽ ചെറിയ, സ്ഥിരമല്ലാത്ത മറവി' },
      { score: 0.5, label: 'Questionable', labelMl: 'സംശയാസ്പദം', description: 'Consistent slight forgetfulness; partial recollection of events; "benign" forgetfulness', descriptionMl: 'സ്ഥിരമായ ചെറിയ മറവി; സംഭവങ്ങളുടെ ഭാഗിക ഓർമ്മ; "സാധാരണ" മറവി' },
      { score: 1, label: 'Mild', labelMl: 'നേരിയത്', description: 'Moderate memory loss, more marked for recent events; defect interferes with everyday activities', descriptionMl: 'മിതമായ ഓർമ്മക്കുറവ്, സമീപകാല സംഭവങ്ങൾക്ക് കൂടുതൽ പ്രകടം; ദൈനംദിന പ്രവർത്തനങ്ങളെ ബാധിക്കുന്നു' },
      { score: 2, label: 'Moderate', labelMl: 'മിതമായത്', description: 'Severe memory loss; only highly learned material retained; new material rapidly lost', descriptionMl: 'കഠിനമായ ഓർമ്മക്കുറവ്; നന്നായി പഠിച്ച കാര്യങ്ങൾ മാത്രം ഓർക്കുന്നു; പുതിയ കാര്യങ്ങൾ വേഗം മറക്കുന്നു' },
      { score: 3, label: 'Severe', labelMl: 'കഠിനമായത്', description: 'Severe memory loss; only fragments remain', descriptionMl: 'കഠിനമായ ഓർമ്മക്കുറവ്; ചെറിയ ഭാഗങ്ങൾ മാത്രം ബാക്കി' }
    ]
  },
  {
    id: 'orientation',
    name: 'Orientation',
    nameMl: 'ഓറിയന്റേഷൻ',
    description: 'Awareness of time, place, and personal identity.',
    descriptionMl: 'സമയം, സ്ഥലം, വ്യക്തിപരമായ ഐഡന്റിറ്റി എന്നിവയെക്കുറിച്ചുള്ള അവബോധം.',
    ratings: [
      { score: 0, label: 'None', labelMl: 'ഒന്നുമില്ല', description: 'Fully oriented', descriptionMl: 'പൂർണ്ണമായും ഓറിയന്റഡ്' },
      { score: 0.5, label: 'Questionable', labelMl: 'സംശയാസ്പദം', description: 'Fully oriented except for slight difficulty with time relationships', descriptionMl: 'സമയ ബന്ധങ്ങളിൽ ചെറിയ ബുദ്ധിമുട്ട് ഒഴികെ പൂർണ്ണമായും ഓറിയന്റഡ്' },
      { score: 1, label: 'Mild', labelMl: 'നേരിയത്', description: 'Moderate difficulty with time relationships; oriented for place at examination; may have geographic disorientation elsewhere', descriptionMl: 'സമയ ബന്ധങ്ങളിൽ മിതമായ ബുദ്ധിമുട്ട്; പരിശോധനാ സ്ഥലത്ത് ഓറിയന്റഡ്; മറ്റിടങ്ങളിൽ ഭൂമിശാസ്ത്രപരമായ ആശയക്കുഴപ്പം ഉണ്ടാകാം' },
      { score: 2, label: 'Moderate', labelMl: 'മിതമായത്', description: 'Severe difficulty with time relationships; usually disoriented to time, often to place', descriptionMl: 'സമയ ബന്ധങ്ങളിൽ കഠിനമായ ബുദ്ധിമുട്ട്; സാധാരണയായി സമയത്തെ കുറിച്ച് ആശയക്കുഴപ്പം, പലപ്പോഴും സ്ഥലത്തെ കുറിച്ചും' },
      { score: 3, label: 'Severe', labelMl: 'കഠിനമായത്', description: 'Oriented to person only', descriptionMl: 'വ്യക്തിയെ മാത്രം തിരിച്ചറിയുന്നു' }
    ]
  },
  {
    id: 'judgment',
    name: 'Judgment & Problem Solving',
    nameMl: 'വിധിന്യായം & പ്രശ്ന പരിഹാരം',
    description: 'The ability to handle problems, business and financial affairs.',
    descriptionMl: 'പ്രശ്നങ്ങൾ, ബിസിനസ്, സാമ്പത്തിക കാര്യങ്ങൾ കൈകാര്യം ചെയ്യാനുള്ള കഴിവ്.',
    ratings: [
      { score: 0, label: 'None', labelMl: 'ഒന്നുമില്ല', description: 'Solves everyday problems and handles business & financial affairs well; judgment good in relation to past performance', descriptionMl: 'ദൈനംദിന പ്രശ്നങ്ങൾ പരിഹരിക്കുകയും ബിസിനസ് & സാമ്പത്തിക കാര്യങ്ങൾ നന്നായി കൈകാര്യം ചെയ്യുകയും ചെയ്യുന്നു' },
      { score: 0.5, label: 'Questionable', labelMl: 'സംശയാസ്പദം', description: 'Slight impairment in solving problems, similarities, and differences', descriptionMl: 'പ്രശ്ന പരിഹാരത്തിൽ ചെറിയ കുറവ്' },
      { score: 1, label: 'Mild', labelMl: 'നേരിയത്', description: 'Moderate difficulty in handling problems, similarities, and differences; social judgment usually maintained', descriptionMl: 'പ്രശ്നങ്ങൾ കൈകാര്യം ചെയ്യുന്നതിൽ മിതമായ ബുദ്ധിമുട്ട്; സാമൂഹിക വിധിന്യായം സാധാരണയായി നിലനിർത്തുന്നു' },
      { score: 2, label: 'Moderate', labelMl: 'മിതമായത്', description: 'Severely impaired in handling problems, similarities, and differences; social judgment usually impaired', descriptionMl: 'പ്രശ്നങ്ങൾ കൈകാര്യം ചെയ്യുന്നതിൽ കഠിനമായ കുറവ്; സാമൂഹിക വിധിന്യായം സാധാരണയായി കുറവ്' },
      { score: 3, label: 'Severe', labelMl: 'കഠിനമായത്', description: 'Unable to make judgments or solve problems', descriptionMl: 'വിധിന്യായം നടത്താനോ പ്രശ്നങ്ങൾ പരിഹരിക്കാനോ കഴിയുന്നില്ല' }
    ]
  },
  {
    id: 'community',
    name: 'Community Affairs',
    nameMl: 'സാമൂഹിക കാര്യങ്ങൾ',
    description: 'Function at job, shopping, volunteer and social groups.',
    descriptionMl: 'ജോലി, ഷോപ്പിംഗ്, വോളണ്ടിയർ, സാമൂഹിക ഗ്രൂപ്പുകളിലെ പ്രവർത്തനം.',
    ratings: [
      { score: 0, label: 'None', labelMl: 'ഒന്നുമില്ല', description: 'Independent function at usual level in job, shopping, volunteer and social groups', descriptionMl: 'ജോലി, ഷോപ്പിംഗ്, വോളണ്ടിയർ, സാമൂഹിക ഗ്രൂപ്പുകളിൽ സാധാരണ നിലയിൽ സ്വതന്ത്ര പ്രവർത്തനം' },
      { score: 0.5, label: 'Questionable', labelMl: 'സംശയാസ്പദം', description: 'Slight impairment in these activities', descriptionMl: 'ഈ പ്രവർത്തനങ്ങളിൽ ചെറിയ കുറവ്' },
      { score: 1, label: 'Mild', labelMl: 'നേരിയത്', description: 'Unable to function independently at these activities, although may still be engaged in some; appears normal to casual inspection', descriptionMl: 'ഈ പ്രവർത്തനങ്ങളിൽ സ്വതന്ത്രമായി പ്രവർത്തിക്കാൻ കഴിയുന്നില്ല, എന്നാൽ ചിലതിൽ ഇപ്പോഴും ഏർപ്പെടാം' },
      { score: 2, label: 'Moderate', labelMl: 'മിതമായത്', description: 'No pretense of independent function outside the home; appears well enough to be taken to functions outside the family home', descriptionMl: 'വീടിന് പുറത്ത് സ്വതന്ത്ര പ്രവർത്തനമില്ല; കുടുംബ വീടിന് പുറത്തുള്ള ചടങ്ങുകളിലേക്ക് കൊണ്ടുപോകാൻ കഴിയും' },
      { score: 3, label: 'Severe', labelMl: 'കഠിനമായത്', description: 'No pretense of independent function outside the home; appears too ill to be taken to functions outside the family home', descriptionMl: 'വീടിന് പുറത്ത് സ്വതന്ത്ര പ്രവർത്തനമില്ല; പുറത്തുള്ള ചടങ്ങുകളിലേക്ക് കൊണ്ടുപോകാൻ കഴിയാത്തവിധം അസുഖം' }
    ]
  },
  {
    id: 'home',
    name: 'Home & Hobbies',
    nameMl: 'വീട് & ഹോബികൾ',
    description: 'Life at home including hobbies and intellectual interests.',
    descriptionMl: 'ഹോബികളും ബൗദ്ധിക താൽപ്പര്യങ്ങളും ഉൾപ്പെടെ വീട്ടിലെ ജീവിതം.',
    ratings: [
      { score: 0, label: 'None', labelMl: 'ഒന്നുമില്ല', description: 'Life at home, hobbies, and intellectual interests well maintained', descriptionMl: 'വീട്ടിലെ ജീവിതം, ഹോബികൾ, ബൗദ്ധിക താൽപ്പര്യങ്ങൾ നന്നായി നിലനിർത്തുന്നു' },
      { score: 0.5, label: 'Questionable', labelMl: 'സംശയാസ്പദം', description: 'Life at home, hobbies, and intellectual interests slightly impaired', descriptionMl: 'വീട്ടിലെ ജീവിതം, ഹോബികൾ, ബൗദ്ധിക താൽപ്പര്യങ്ങൾ ചെറുതായി കുറഞ്ഞു' },
      { score: 1, label: 'Mild', labelMl: 'നേരിയത്', description: 'Mild but definite impairment of function at home; more difficult chores abandoned; more complicated hobbies and interests abandoned', descriptionMl: 'വീട്ടിലെ പ്രവർത്തനത്തിൽ നേരിയതും എന്നാൽ കൃത്യവുമായ കുറവ്; ബുദ്ധിമുട്ടുള്ള ജോലികൾ ഉപേക്ഷിച്ചു' },
      { score: 2, label: 'Moderate', labelMl: 'മിതമായത്', description: 'Only simple chores preserved; very restricted interests, poorly maintained', descriptionMl: 'ലളിതമായ ജോലികൾ മാത്രം ചെയ്യുന്നു; വളരെ പരിമിതമായ താൽപ്പര്യങ്ങൾ' },
      { score: 3, label: 'Severe', labelMl: 'കഠിനമായത്', description: 'No significant function in the home', descriptionMl: 'വീട്ടിൽ കാര്യമായ പ്രവർത്തനമില്ല' }
    ]
  },
  {
    id: 'personalCare',
    name: 'Personal Care',
    nameMl: 'വ്യക്തിപരമായ പരിചരണം',
    description: 'Ability to care for oneself including dressing, hygiene, and grooming.',
    descriptionMl: 'വസ്ത്രധാരണം, ശുചിത്വം, ഗ്രൂമിംഗ് എന്നിവ ഉൾപ്പെടെ സ്വയം പരിചരിക്കാനുള്ള കഴിവ്.',
    ratings: [
      { score: 0, label: 'None', labelMl: 'ഒന്നുമില്ല', description: 'Fully capable of self-care', descriptionMl: 'സ്വയം പരിചരണത്തിന് പൂർണ്ണമായും പ്രാപ്തൻ' },
      { score: 1, label: 'Mild', labelMl: 'നേരിയത്', description: 'Needs prompting', descriptionMl: 'ഓർമ്മപ്പെടുത്തൽ ആവശ്യമാണ്' },
      { score: 2, label: 'Moderate', labelMl: 'മിതമായത്', description: 'Requires assistance in dressing, hygiene, keeping of personal effects', descriptionMl: 'വസ്ത്രധാരണം, ശുചിത്വം, വ്യക്തിഗത സാധനങ്ങൾ സൂക്ഷിക്കൽ എന്നിവയിൽ സഹായം ആവശ്യമാണ്' },
      { score: 3, label: 'Severe', labelMl: 'കഠിനമായത്', description: 'Requires much help with personal care; frequent incontinence', descriptionMl: 'വ്യക്തിപരമായ പരിചരണത്തിൽ വളരെയധികം സഹായം ആവശ്യമാണ്; പലപ്പോഴും മൂത്രമൊഴിക്കൽ നിയന്ത്രണമില്ലായ്മ' }
    ]
  }
];

export const CDR_GLOBAL_INTERPRETATIONS = {
  0: { label: 'Normal', labelMl: 'സാധാരണം', description: 'No dementia', descriptionMl: 'ഡിമെൻഷ്യ ഇല്ല' },
  0.5: { label: 'Questionable Dementia', labelMl: 'സംശയാസ്പദമായ ഡിമെൻഷ്യ', description: 'Very mild cognitive impairment', descriptionMl: 'വളരെ നേരിയ വൈജ്ഞാനിക കുറവ്' },
  1: { label: 'Mild Dementia', labelMl: 'നേരിയ ഡിമെൻഷ്യ', description: 'Mild cognitive impairment with functional limitations', descriptionMl: 'പ്രവർത്തന പരിമിതികളോടെയുള്ള നേരിയ വൈജ്ഞാനിക കുറവ്' },
  2: { label: 'Moderate Dementia', labelMl: 'മിതമായ ഡിമെൻഷ്യ', description: 'Moderate cognitive impairment requiring supervision', descriptionMl: 'മേൽനോട്ടം ആവശ്യമുള്ള മിതമായ വൈജ്ഞാനിക കുറവ്' },
  3: { label: 'Severe Dementia', labelMl: 'കഠിനമായ ഡിമെൻഷ്യ', description: 'Severe cognitive impairment requiring total care', descriptionMl: 'പൂർണ്ണ പരിചരണം ആവശ്യമുള്ള കഠിനമായ വൈജ്ഞാനിക കുറവ്' }
};
