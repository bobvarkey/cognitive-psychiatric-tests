import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ConsciousnessAssessmentProps {
  onBack?: () => void;
}

type Bilingual = { en: string; ml: string };
type Option = { value: number; en: string; ml: string };

// ─── GCS ─────────────────────────────────────────────────────────────
const GCS_EYE: Option[] = [
  { value: 4, en: 'Spontaneous', ml: 'സ്വയം തുറക്കുന്നു' },
  { value: 3, en: 'To speech', ml: 'ശബ്ദത്തിന് പ്രതികരിക്കുന്നു' },
  { value: 2, en: 'To pain', ml: 'വേദനയ്ക്ക് പ്രതികരിക്കുന്നു' },
  { value: 1, en: 'None', ml: 'പ്രതികരണമില്ല' },
];
const GCS_VERBAL: Option[] = [
  { value: 5, en: 'Oriented', ml: 'ബോധവാനാണ്, വ്യക്തമായ സംസാരം' },
  { value: 4, en: 'Confused conversation', ml: 'ആശയക്കുഴപ്പമുള്ള സംസാരം' },
  { value: 3, en: 'Inappropriate words', ml: 'അനുയോജ്യമല്ലാത്ത വാക്കുകൾ' },
  { value: 2, en: 'Incomprehensible sounds', ml: 'അവ്യക്തമായ ശബ്ദങ്ങൾ' },
  { value: 1, en: 'None', ml: 'പ്രതികരണമില്ല' },
];
const GCS_MOTOR: Option[] = [
  { value: 6, en: 'Obeys commands', ml: 'നിർദ്ദേശങ്ങൾ അനുസരിക്കുന്നു' },
  { value: 5, en: 'Localises pain', ml: 'വേദനയുടെ സ്ഥാനം തിരിച്ചറിയുന്നു' },
  { value: 4, en: 'Withdraws from pain', ml: 'വേദനയിൽ നിന്ന് പിന്മാറുന്നു' },
  { value: 3, en: 'Abnormal flexion (decorticate)', ml: 'അസാധാരണ വളവ് (ഡികോർട്ടിക്കേറ്റ്)' },
  { value: 2, en: 'Extension (decerebrate)', ml: 'നീട്ടൽ (ഡിസെറിബ്രേറ്റ്)' },
  { value: 1, en: 'None', ml: 'പ്രതികരണമില്ല' },
];

const GCS_SEVERITY: Record<'mild' | 'moderate' | 'severe', Bilingual> = {
  mild: { en: 'Mild', ml: 'നേരിയത്' },
  moderate: { en: 'Moderate', ml: 'മിതമായത്' },
  severe: { en: 'Severe', ml: 'കടുത്തത്' },
};

const gcsSeverity = (total: number) => {
  if (total >= 13) return { key: 'mild' as const, tone: 'secondary' as const };
  if (total >= 9) return { key: 'moderate' as const, tone: 'default' as const };
  return { key: 'severe' as const, tone: 'destructive' as const };
};

// ─── FOUR Score ──────────────────────────────────────────────────────
const FOUR_EYE: Option[] = [
  { value: 4, en: 'Eyelids open or opened, tracking, or blinking to command', ml: 'കണ്ണുകൾ തുറന്നിരിക്കുന്നു, ചലനം പിന്തുടരുന്നു അല്ലെങ്കിൽ നിർദ്ദേശപ്രകാരം കണ്ണ് ചിമ്മുന്നു' },
  { value: 3, en: 'Eyelids open but not tracking', ml: 'കണ്ണുകൾ തുറന്നിരിക്കുന്നു, പക്ഷേ ചലനം പിന്തുടരുന്നില്ല' },
  { value: 2, en: 'Eyelids closed but open to loud voice', ml: 'കണ്ണുകൾ അടഞ്ഞിരിക്കുന്നു, ഉച്ചത്തിലുള്ള ശബ്ദത്തിൽ തുറക്കുന്നു' },
  { value: 1, en: 'Eyelids closed but open to pain', ml: 'കണ്ണുകൾ അടഞ്ഞിരിക്കുന്നു, വേദനയ്ക്ക് തുറക്കുന്നു' },
  { value: 0, en: 'Eyelids remain closed with pain', ml: 'വേദനയ്ക്കും കണ്ണുകൾ തുറക്കുന്നില്ല' },
];
const FOUR_MOTOR: Option[] = [
  { value: 4, en: 'Thumbs-up, fist or peace sign to command', ml: 'നിർദ്ദേശപ്രകാരം തംപ്സ്-അപ്പ്, മുഷ്ടി അല്ലെങ്കിൽ പീസ് ചിഹ്നം കാണിക്കുന്നു' },
  { value: 3, en: 'Localising to pain', ml: 'വേദനയുടെ സ്ഥാനം തിരിച്ചറിയുന്നു' },
  { value: 2, en: 'Flexion response to pain', ml: 'വേദനയ്ക്ക് വളവ് പ്രതികരണം' },
  { value: 1, en: 'Extension response to pain', ml: 'വേദനയ്ക്ക് നീട്ടൽ പ്രതികരണം' },
  { value: 0, en: 'No response to pain or generalised myoclonus status', ml: 'വേദനയ്ക്ക് പ്രതികരണമില്ല അല്ലെങ്കിൽ പൊതുവായ മയോക്ലോണസ്' },
];
const FOUR_BRAINSTEM: Option[] = [
  { value: 4, en: 'Pupil and corneal reflexes present', ml: 'പ്യൂപ്പിൾ, കോർണിയൽ റിഫ്ലക്സുകൾ ഉണ്ട്' },
  { value: 3, en: 'One pupil wide and fixed', ml: 'ഒരു പ്യൂപ്പിൾ വിശാലവും സ്ഥിരവുമാണ്' },
  { value: 2, en: 'Pupil OR corneal reflexes absent', ml: 'പ്യൂപ്പിൾ അല്ലെങ്കിൽ കോർണിയൽ റിഫ്ലക്സ് ഇല്ല' },
  { value: 1, en: 'Pupil AND corneal reflexes absent', ml: 'പ്യൂപ്പിളും കോർണിയൽ റിഫ്ലക്സും ഇല്ല' },
  { value: 0, en: 'Absent pupil, corneal AND cough reflex', ml: 'പ്യൂപ്പിൾ, കോർണിയൽ, ചുമ റിഫ്ലക്സുകൾ ഇല്ല' },
];
const FOUR_RESPIRATION: Option[] = [
  { value: 4, en: 'Not intubated, regular breathing pattern', ml: 'ഇൻട്യൂബേറ്റ് ചെയ്തിട്ടില്ല, സാധാരണ ശ്വസനം' },
  { value: 3, en: 'Not intubated, Cheyne-Stokes breathing pattern', ml: 'ഇൻട്യൂബേറ്റ് ചെയ്തിട്ടില്ല, ഷെയ്ൻ-സ്റ്റോക്സ് ശ്വസന രീതി' },
  { value: 2, en: 'Not intubated, irregular breathing', ml: 'ഇൻട്യൂബേറ്റ് ചെയ്തിട്ടില്ല, ക്രമരഹിത ശ്വസനം' },
  { value: 1, en: 'Breathes above ventilator rate', ml: 'വെന്റിലേറ്റർ നിരക്കിന് മുകളിൽ ശ്വസിക്കുന്നു' },
  { value: 0, en: 'Breathes at ventilator rate or apnoea', ml: 'വെന്റിലേറ്റർ നിരക്കിൽ ശ്വസിക്കുന്നു അല്ലെങ്കിൽ ശ്വാസതടസ്സം' },
];

// ─── RASS ────────────────────────────────────────────────────────────
const RASS_LEVELS: { value: number; label: Bilingual; desc: Bilingual }[] = [
  { value: 4, label: { en: 'Combative', ml: 'അക്രമാസക്തം' }, desc: { en: 'Overtly combative or violent; immediate danger to staff', ml: 'പ്രകടമായി അക്രമാസക്തനാണ്; ജീവനക്കാർക്ക് ഉടനടി അപകടം' } },
  { value: 3, label: { en: 'Very agitated', ml: 'വളരെ പ്രക്ഷുബ്ധം' }, desc: { en: 'Pulls or removes tube(s) or catheter(s); aggressive', ml: 'ട്യൂബുകളോ കത്തീറ്ററുകളോ വലിച്ചൂരുന്നു; ആക്രമണാത്മകൻ' } },
  { value: 2, label: { en: 'Agitated', ml: 'പ്രക്ഷുബ്ധം' }, desc: { en: 'Frequent non-purposeful movement or patient–ventilator dyssynchrony', ml: 'ലക്ഷ്യമില്ലാത്ത ചലനങ്ങൾ അല്ലെങ്കിൽ വെന്റിലേറ്ററിനൊപ്പം പൊരുത്തക്കേട്' } },
  { value: 1, label: { en: 'Restless', ml: 'അസ്വസ്ഥം' }, desc: { en: 'Anxious, apprehensive, but movements not aggressive or vigorous', ml: 'ഉത്കണ്ഠയും ആശങ്കയും ഉണ്ട്, പക്ഷേ ചലനങ്ങൾ ആക്രമണാത്മകമല്ല' } },
  { value: 0, label: { en: 'Alert and calm', ml: 'ജാഗ്രതയോടെ ശാന്തം' }, desc: { en: '', ml: '' } },
  { value: -1, label: { en: 'Drowsy', ml: 'മയക്കം' }, desc: { en: 'Not fully alert; sustained (>10s) eye opening / contact to voice', ml: 'പൂർണ്ണ ജാഗ്രതയില്ല; ശബ്ദത്തിന് 10 സെക്കൻഡിൽ കൂടുതൽ കണ്ണ് തുറക്കൽ' } },
  { value: -2, label: { en: 'Light sedation', ml: 'നേരിയ സെഡേഷൻ' }, desc: { en: 'Briefly (<10s) awakens with eye contact to voice', ml: 'ശബ്ദത്തിന് കുറച്ച് സമയം (<10 സെ) കണ്ണ് സമ്പർക്കത്തോടെ ഉണരുന്നു' } },
  { value: -3, label: { en: 'Moderate sedation', ml: 'മിതമായ സെഡേഷൻ' }, desc: { en: 'Movement or eye opening to voice (no eye contact)', ml: 'ശബ്ദത്തിന് ചലനം അല്ലെങ്കിൽ കണ്ണ് തുറക്കൽ (കണ്ണ് സമ്പർക്കമില്ല)' } },
  { value: -4, label: { en: 'Deep sedation', ml: 'ആഴത്തിലുള്ള സെഡേഷൻ' }, desc: { en: 'No response to voice; movement or eye opening to physical stimulation', ml: 'ശബ്ദത്തിന് പ്രതികരണമില്ല; ശാരീരിക ഉത്തേജനത്തിന് ചലനം അല്ലെങ്കിൽ കണ്ണ് തുറക്കൽ' } },
  { value: -5, label: { en: 'Unarousable', ml: 'ഉണർത്താനാവാത്തത്' }, desc: { en: 'No response to voice or physical stimulation', ml: 'ശബ്ദത്തിനോ ശാരീരിക ഉത്തേജനത്തിനോ പ്രതികരണമില്ല' } },
];

const rassInterpretation = (v: number, isMl: boolean): string => {
  if (v >= 1) return isMl
    ? 'പ്രക്ഷുബ്ധത — സെഡേഷൻ ലക്ഷ്യം പുനർമൂല്യനിർണ്ണയം ചെയ്യുക; നോൺ-ഫാർമക്കോളജിക്കൽ നടപടികൾ പരിഗണിക്കുക, റിവേഴ്സിബിൾ കാരണങ്ങൾ ചികിത്സിക്കുക, പിന്നീട് ടൈട്രേറ്റ് ചെയ്യുക.'
    : 'Agitation — re-assess sedation goal; consider non-pharmacological measures, treat reversible causes, then titrate.';
  if (v === 0) return isMl
    ? 'മിക്ക ഐസിയു രോഗികൾക്കുമുള്ള ലക്ഷ്യം — ജാഗ്രതയോടെ ശാന്തം.'
    : 'Target for most ICU patients — alert and calm.';
  if (v >= -2) return isMl
    ? 'നേരിയ സെഡേഷൻ — സെഡേഷൻ ആവശ്യമുള്ളപ്പോൾ (ഉദാ. മെക്കാനിക്കൽ വെന്റിലേഷൻ) സാധാരണ ലക്ഷ്യം.'
    : 'Light sedation — typical target when sedation is required (e.g. mechanical ventilation).';
  if (v >= -3) return isMl
    ? 'മിതമായ സെഡേഷൻ — ആവശ്യം പുനർമൂല്യനിർണ്ണയം ചെയ്യുക; സെഡേഷൻ കുറയ്ക്കുന്നത് പരിഗണിക്കുക (SAT/SBT).'
    : 'Moderate sedation — re-evaluate need; consider lightening sedation (SAT/SBT).';
  return isMl
    ? 'ആഴത്തിലുള്ള സെഡേഷൻ / ഉണർത്താനാവാത്തത് — ഡെലിറിയത്തിന്റെയും നീണ്ട വെന്റിലേഷന്റെയും ഉയർന്ന അപകടസാധ്യത; ക്ലിനിക്കലി വിപരീതമല്ലെങ്കിൽ ലഘൂകരിക്കുക.'
    : 'Deep sedation / unarousable — high risk of delirium and prolonged ventilation; lighten unless clinically contraindicated.';
};

// ─── ABS (Agitated Behavior Scale) ───────────────────────────────────
type AbsSubscale = 'Disinhibition' | 'Aggression' | 'Lability';
const ABS_ITEMS: { id: number; subscale: AbsSubscale; en: string; ml: string }[] = [
  { id: 1, subscale: 'Disinhibition', en: 'Short attention span, easy distractibility, inability to concentrate', ml: 'കുറഞ്ഞ ശ്രദ്ധാ കാലം, എളുപ്പത്തിൽ ശ്രദ്ധ വ്യതിചലിക്കൽ, ഏകാഗ്രതയില്ലായ്മ' },
  { id: 2, subscale: 'Disinhibition', en: 'Impulsive, impatient, low tolerance for pain or frustration', ml: 'ധിറുതി, ക്ഷമയില്ലായ്മ, വേദനയോ നിരാശയോ സഹിക്കാനുള്ള കുറഞ്ഞ കഴിവ്' },
  { id: 3, subscale: 'Aggression', en: 'Uncooperative, resistant to care or demanding', ml: 'സഹകരിക്കാത്ത, പരിചരണത്തെ എതിർക്കുന്ന അല്ലെങ്കിൽ ആവശ്യപ്പെടുന്ന' },
  { id: 4, subscale: 'Aggression', en: 'Violent and/or threatening violence toward people or property', ml: 'ആളുകൾക്കോ വസ്തുവകകൾക്കോ നേരേ അക്രമമോ അക്രമഭീഷണിയോ' },
  { id: 5, subscale: 'Aggression', en: 'Explosive or unpredictable anger', ml: 'പൊട്ടിത്തെറിക്കുന്നതോ പ്രവചനാതീതമോ ആയ ദേഷ്യം' },
  { id: 6, subscale: 'Disinhibition', en: 'Rocking, rubbing, moaning or other self-stimulating behaviour', ml: 'ആടൽ, തടവൽ, ഞരക്കം അല്ലെങ്കിൽ മറ്റ് സ്വയം ഉത്തേജക സ്വഭാവം' },
  { id: 7, subscale: 'Disinhibition', en: 'Pulling at tubes or restraints', ml: 'ട്യൂബുകളോ നിയന്ത്രണങ്ങളോ വലിക്കൽ' },
  { id: 8, subscale: 'Disinhibition', en: 'Wandering from treatment areas', ml: 'ചികിത്സാ പ്രദേശങ്ങളിൽ നിന്ന് അലഞ്ഞുനടക്കൽ' },
  { id: 9, subscale: 'Disinhibition', en: 'Restlessness, pacing, or excessive movement', ml: 'അസ്വസ്ഥത, അങ്ങോട്ടുമിങ്ങോട്ടും നടക്കൽ, അമിത ചലനം' },
  { id: 10, subscale: 'Disinhibition', en: 'Repetitive behaviours (motor or verbal)', ml: 'ആവർത്തന സ്വഭാവങ്ങൾ (ചലനപരമോ വാക്കാലുള്ളതോ)' },
  { id: 11, subscale: 'Disinhibition', en: 'Rapid, loud or excessive talking', ml: 'വേഗത്തിലുള്ള, ഉച്ചത്തിലുള്ള അല്ലെങ്കിൽ അമിതമായ സംസാരം' },
  { id: 12, subscale: 'Lability', en: 'Sudden changes of mood', ml: 'പെട്ടെന്നുള്ള മാനസികാവസ്ഥയിലെ മാറ്റങ്ങൾ' },
  { id: 13, subscale: 'Lability', en: 'Excessive crying or laughing', ml: 'അമിത കരച്ചിലോ ചിരിയോ' },
  { id: 14, subscale: 'Aggression', en: 'Self-abusiveness (physical or verbal)', ml: 'സ്വയം ഉപദ്രവം (ശാരീരികമോ വാക്കാലോ)' },
];

const ABS_SCORE_OPTIONS: Option[] = [
  { value: 1, en: 'Absent', ml: 'ഇല്ല' },
  { value: 2, en: 'Slight — does not prevent appropriate behaviour', ml: 'ലഘു — ഉചിതമായ പെരുമാറ്റം തടയുന്നില്ല' },
  { value: 3, en: 'Moderate — requires redirection from agitated to appropriate behaviour', ml: 'മിതം — പ്രക്ഷുബ്ധതയിൽ നിന്ന് ഉചിതമായ പെരുമാറ്റത്തിലേക്ക് നയിക്കേണ്ടതുണ്ട്' },
  { value: 4, en: 'Extreme — agitation persists despite redirection', ml: 'അതിതീവ്രം — നയിക്കാൻ ശ്രമിച്ചിട്ടും പ്രക്ഷുബ്ധത തുടരുന്നു' },
];

const ABS_SUBSCALE_LABEL: Record<AbsSubscale, Bilingual> = {
  Disinhibition: { en: 'Disinhibition', ml: 'നിയന്ത്രണരാഹിത്യം' },
  Aggression: { en: 'Aggression', ml: 'ആക്രമണാത്മകത' },
  Lability: { en: 'Lability', ml: 'വൈകാരിക അസ്ഥിരത' },
};

const absSubscaleColor: Record<AbsSubscale, string> = {
  Disinhibition: 'bg-amber-100 text-amber-800 border-amber-200',
  Aggression: 'bg-red-100 text-red-800 border-red-200',
  Lability: 'bg-blue-100 text-blue-800 border-blue-200',
};

const absInterpretation = (total: number) => {
  if (total <= 21) return {
    key: 'normal' as const,
    tone: 'secondary' as const,
    label: { en: 'Normal behaviour', ml: 'സാധാരണ പെരുമാറ്റം' },
    note: { en: '≤21 — within normal limits.', ml: '≤21 — സാധാരണ പരിധിക്കുള്ളിൽ.' },
  };
  if (total <= 28) return {
    key: 'mild' as const,
    tone: 'secondary' as const,
    label: { en: 'Mild agitation', ml: 'നേരിയ പ്രക്ഷുബ്ധത' },
    note: { en: '22–28 — mild agitation; environmental measures often sufficient.', ml: '22–28 — നേരിയ പ്രക്ഷുബ്ധത; പരിസ്ഥിതി നടപടികൾ പലപ്പോഴും മതിയാകും.' },
  };
  if (total <= 35) return {
    key: 'moderate' as const,
    tone: 'default' as const,
    label: { en: 'Moderate agitation', ml: 'മിതമായ പ്രക്ഷുബ്ധത' },
    note: { en: '29–35 — moderate agitation; consider behavioural strategies and review precipitants.', ml: '29–35 — മിതമായ പ്രക്ഷുബ്ധത; പെരുമാറ്റ തന്ത്രങ്ങൾ പരിഗണിക്കുകയും കാരണങ്ങൾ പുനരവലോകനം ചെയ്യുകയും ചെയ്യുക.' },
  };
  return {
    key: 'severe' as const,
    tone: 'destructive' as const,
    label: { en: 'Severe agitation', ml: 'കടുത്ത പ്രക്ഷുബ്ധത' },
    note: { en: '36–56 — severe agitation; ensure safety, exclude delirium causes, consider pharmacological management.', ml: '36–56 — കടുത്ത പ്രക്ഷുബ്ധത; സുരക്ഷ ഉറപ്പാക്കുക, ഡെലിറിയം കാരണങ്ങൾ ഒഴിവാക്കുക, ഔഷധ ചികിത്സ പരിഗണിക്കുക.' },
  };
};

// ─── UI strings ───────────────────────────────────────────────────────
const T = {
  pageTitle: { en: 'Coma & Consciousness Scales', ml: 'കോമ & ബോധനില സ്കെയിലുകൾ' },
  pageSubtitle: { en: 'GCS · FOUR Score · RASS · ABS', ml: 'GCS · FOUR സ്കോർ · RASS · ABS' },
  gcsTitle: { en: 'Glasgow Coma Scale', ml: 'ഗ്ലാസ്ഗോ കോമ സ്കെയിൽ' },
  gcsSubtitle: { en: 'Best eye (E) + verbal (V) + motor (M). Range 3–15.', ml: 'മികച്ച കണ്ണ് (E) + വാക്കാലുള്ള (V) + ചലനം (M). പരിധി 3–15.' },
  gcsEye: { en: 'Eye opening (E)', ml: 'കണ്ണ് തുറക്കൽ (E)' },
  gcsVerbal: { en: 'Verbal response (V)', ml: 'വാക്കാലുള്ള പ്രതികരണം (V)' },
  gcsMotor: { en: 'Motor response (M)', ml: 'ചലന പ്രതികരണം (M)' },
  gcsBands: {
    en: 'Mild 13–15 · Moderate 9–12 · Severe ≤8 (consider intubation if ≤8 and unable to protect airway).',
    ml: 'നേരിയത് 13–15 · മിതമായത് 9–12 · കടുത്തത് ≤8 (≤8 ഉം എയർവേ സംരക്ഷിക്കാൻ കഴിയാത്തവരുമാണെങ്കിൽ ഇൻട്യൂബേഷൻ പരിഗണിക്കുക).',
  },
  fourTitle: { en: 'FOUR Score', ml: 'FOUR സ്കോർ' },
  fourSubtitle: {
    en: 'Full Outline of UnResponsiveness — eye, motor, brainstem, respiration. Range 0–16. Useful in intubated patients (no verbal component).',
    ml: 'പ്രതികരണരാഹിത്യത്തിന്റെ പൂർണ്ണ രൂപരേഖ — കണ്ണ്, ചലനം, ബ്രെയിൻസ്റ്റം, ശ്വസനം. പരിധി 0–16. ഇൻട്യൂബേറ്റ് ചെയ്ത രോഗികളിൽ ഉപയോഗപ്രദം (വാക്കാലുള്ള ഘടകമില്ല).',
  },
  fourEye: { en: 'Eye response', ml: 'കണ്ണ് പ്രതികരണം' },
  fourMotor: { en: 'Motor response', ml: 'ചലന പ്രതികരണം' },
  fourBrainstem: { en: 'Brainstem reflexes', ml: 'ബ്രെയിൻസ്റ്റം റിഫ്ലക്സുകൾ' },
  fourResp: { en: 'Respiration', ml: 'ശ്വസനം' },
  fourFooter: {
    en: 'Score 0 across all four components is suggestive of brain death and warrants formal brainstem testing.',
    ml: 'നാല് ഘടകങ്ങളിലും 0 സ്കോർ ബ്രെയിൻ ഡെത്ത് സൂചിപ്പിക്കുന്നു; ഔപചാരിക ബ്രെയിൻസ്റ്റം പരിശോധന ആവശ്യമാണ്.',
  },
  rassTitle: { en: 'Richmond Agitation–Sedation Scale', ml: 'റിച്ച്മണ്ട് അജിറ്റേഷൻ–സെഡേഷൻ സ്കെയിൽ' },
  rassSubtitle: { en: 'Single 10-point scale (-5 to +4) for agitation and sedation depth.', ml: 'പ്രക്ഷുബ്ധതയ്ക്കും സെഡേഷൻ ആഴത്തിനുമുള്ള 10-പോയിന്റ് സ്കെയിൽ (-5 മുതൽ +4 വരെ).' },
  absTitle: { en: 'Agitated Behavior Scale (ABS)', ml: 'അജിറ്റേറ്റഡ് ബിഹേവിയർ സ്കെയിൽ (ABS)' },
  absSubtitle: {
    en: '14-item agitation rating after traumatic brain injury (Corrigan, 1989). Range 14–56.',
    ml: 'ട്രൗമാറ്റിക് ബ്രെയിൻ ഇഞ്ച്വറിക്ക് ശേഷമുള്ള 14-ഇനം പ്രക്ഷുബ്ധതാ റേറ്റിംഗ് (കോറിഗൻ, 1989). പരിധി 14–56.',
  },
  absInstructions: {
    en: 'Rate each behaviour over the observation period (typically an 8-hour shift). Use the highest level observed.',
    ml: 'നിരീക്ഷണ കാലയളവിൽ (സാധാരണയായി 8-മണിക്കൂർ ഷിഫ്റ്റ്) ഓരോ പെരുമാറ്റവും റേറ്റ് ചെയ്യുക. നിരീക്ഷിച്ച ഏറ്റവും ഉയർന്ന തലം ഉപയോഗിക്കുക.',
  },
  absResult: { en: 'Result', ml: 'ഫലം' },
  absBands: {
    en: 'Cut-offs: ≤21 normal · 22–28 mild · 29–35 moderate · 36–56 severe.',
    ml: 'കട്ട്-ഓഫുകൾ: ≤21 സാധാരണ · 22–28 നേരിയത് · 29–35 മിതം · 36–56 കടുത്തത്.',
  },
};

const Section = ({
  title,
  options,
  value,
  onChange,
  isMl,
}: {
  title: string;
  options: Option[];
  value: number;
  onChange: (v: number) => void;
  isMl: boolean;
}) => (
  <div className="space-y-2">
    <h4 className="font-semibold text-sm text-foreground">{title}</h4>
    <RadioGroup value={value.toString()} onValueChange={(v) => onChange(parseInt(v))}>
      {options.map((o) => (
        <div key={o.value} className="flex items-start space-x-2 p-2 rounded hover:bg-muted/50">
          <RadioGroupItem value={o.value.toString()} id={`${title}-${o.value}`} className="mt-1" />
          <Label htmlFor={`${title}-${o.value}`} className="cursor-pointer flex-1 font-normal">
            <span className="font-mono font-semibold mr-2">{o.value}</span>
            {isMl ? o.ml : o.en}
          </Label>
        </div>
      ))}
    </RadioGroup>
  </div>
);

export const ConsciousnessAssessment = ({ onBack }: ConsciousnessAssessmentProps) => {
  const { language } = useLanguage();
  const isMl = language === 'ml';
  const tr = (b: Bilingual) => (isMl ? b.ml : b.en);

  // GCS state
  const [gcsE, setGcsE] = useState(4);
  const [gcsV, setGcsV] = useState(5);
  const [gcsM, setGcsM] = useState(6);
  const gcsTotal = gcsE + gcsV + gcsM;
  const gcsSev = gcsSeverity(gcsTotal);

  // FOUR state
  const [fourE, setFourE] = useState(4);
  const [fourM, setFourM] = useState(4);
  const [fourB, setFourB] = useState(4);
  const [fourR, setFourR] = useState(4);
  const fourTotal = fourE + fourM + fourB + fourR;

  // RASS state
  const [rass, setRass] = useState(0);
  const rassItem = useMemo(() => RASS_LEVELS.find((r) => r.value === rass)!, [rass]);

  // ABS state
  const [absScores, setAbsScores] = useState<Record<number, number>>(
    () => Object.fromEntries(ABS_ITEMS.map((i) => [i.id, 1]))
  );
  const absTotal = useMemo(
    () => Object.values(absScores).reduce((a, b) => a + b, 0),
    [absScores]
  );
  const absSubtotals = useMemo(() => {
    const out: Record<AbsSubscale, number> = { Disinhibition: 0, Aggression: 0, Lability: 0 };
    ABS_ITEMS.forEach((it) => { out[it.subscale] += absScores[it.id] ?? 1; });
    return out;
  }, [absScores]);
  const absResult = absInterpretation(absTotal);

  const resetGcs = () => { setGcsE(4); setGcsV(5); setGcsM(6); };
  const resetFour = () => { setFourE(4); setFourM(4); setFourB(4); setFourR(4); };
  const resetRass = () => setRass(0);
  const resetAbs = () => setAbsScores(Object.fromEntries(ABS_ITEMS.map((i) => [i.id, 1])));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4 md:p-8 pt-20">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <Activity className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">{tr(T.pageTitle)}</h1>
            <p className="text-sm text-muted-foreground">{tr(T.pageSubtitle)}</p>
          </div>
        </div>

        <Tabs defaultValue="gcs" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gcs">GCS</TabsTrigger>
            <TabsTrigger value="four">FOUR Score</TabsTrigger>
            <TabsTrigger value="rass">RASS</TabsTrigger>
            <TabsTrigger value="abs">ABS</TabsTrigger>
          </TabsList>

          {/* ─── GCS ───────────────────────────────── */}
          <TabsContent value="gcs">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{tr(T.gcsTitle)}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{tr(T.gcsSubtitle)}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetGcs}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Section title={tr(T.gcsEye)} options={GCS_EYE} value={gcsE} onChange={setGcsE} isMl={isMl} />
                <Section title={tr(T.gcsVerbal)} options={GCS_VERBAL} value={gcsV} onChange={setGcsV} isMl={isMl} />
                <Section title={tr(T.gcsMotor)} options={GCS_MOTOR} value={gcsM} onChange={setGcsM} isMl={isMl} />

                <div className="rounded-lg border bg-muted/40 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      E{gcsE} V{gcsV} M{gcsM}
                    </span>
                    <Badge variant={gcsSev.tone}>{tr(GCS_SEVERITY[gcsSev.key])}</Badge>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">{gcsTotal}</span>
                    <span className="text-sm text-muted-foreground">/ 15</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{tr(T.gcsBands)}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── FOUR ──────────────────────────────── */}
          <TabsContent value="four">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{tr(T.fourTitle)}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{tr(T.fourSubtitle)}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetFour}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Section title={tr(T.fourEye)} options={FOUR_EYE} value={fourE} onChange={setFourE} isMl={isMl} />
                <Section title={tr(T.fourMotor)} options={FOUR_MOTOR} value={fourM} onChange={setFourM} isMl={isMl} />
                <Section title={tr(T.fourBrainstem)} options={FOUR_BRAINSTEM} value={fourB} onChange={setFourB} isMl={isMl} />
                <Section title={tr(T.fourResp)} options={FOUR_RESPIRATION} value={fourR} onChange={setFourR} isMl={isMl} />

                <div className="rounded-lg border bg-muted/40 p-4 space-y-2">
                  <span className="text-sm text-muted-foreground">
                    E{fourE} M{fourM} B{fourB} R{fourR}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">{fourTotal}</span>
                    <span className="text-sm text-muted-foreground">/ 16</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{tr(T.fourFooter)}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── RASS ──────────────────────────────── */}
          <TabsContent value="rass">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{tr(T.rassTitle)}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{tr(T.rassSubtitle)}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetRass}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={rass.toString()} onValueChange={(v) => setRass(parseInt(v))}>
                  {RASS_LEVELS.map((lvl) => (
                    <div
                      key={lvl.value}
                      className={`flex items-start space-x-2 p-2 rounded border ${
                        rass === lvl.value ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted/50'
                      }`}
                    >
                      <RadioGroupItem value={lvl.value.toString()} id={`rass-${lvl.value}`} className="mt-1" />
                      <Label htmlFor={`rass-${lvl.value}`} className="cursor-pointer flex-1 font-normal">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold w-8 ${lvl.value > 0 ? 'text-destructive' : lvl.value < 0 ? 'text-blue-600' : 'text-primary'}`}>
                            {lvl.value > 0 ? `+${lvl.value}` : lvl.value}
                          </span>
                          <span className="font-semibold">{tr(lvl.label)}</span>
                        </div>
                        {tr(lvl.desc) && <p className="text-xs text-muted-foreground ml-10 mt-0.5">{tr(lvl.desc)}</p>}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="rounded-lg border bg-muted/40 p-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      RASS {rass > 0 ? `+${rass}` : rass}
                    </Badge>
                    <span className="font-semibold">{tr(rassItem.label)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{rassInterpretation(rass, isMl)}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── ABS ───────────────────────────────── */}
          <TabsContent value="abs">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{tr(T.absTitle)}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{tr(T.absSubtitle)}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetAbs}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">{tr(T.absInstructions)}</p>

                {ABS_ITEMS.map((item) => (
                  <div key={item.id} className="rounded-lg border bg-card p-3 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium leading-snug flex-1">
                        <span className="font-mono text-muted-foreground mr-2">{item.id}.</span>
                        {isMl ? item.ml : item.en}
                      </p>
                      <Badge variant="outline" className={absSubscaleColor[item.subscale]}>
                        {tr(ABS_SUBSCALE_LABEL[item.subscale])}
                      </Badge>
                    </div>
                    <RadioGroup
                      value={(absScores[item.id] ?? 1).toString()}
                      onValueChange={(v) =>
                        setAbsScores((s) => ({ ...s, [item.id]: parseInt(v) }))
                      }
                      className="grid sm:grid-cols-2 gap-1"
                    >
                      {ABS_SCORE_OPTIONS.map((o) => (
                        <div key={o.value} className="flex items-start space-x-2 p-1.5 rounded hover:bg-muted/50">
                          <RadioGroupItem value={o.value.toString()} id={`abs-${item.id}-${o.value}`} className="mt-0.5" />
                          <Label
                            htmlFor={`abs-${item.id}-${o.value}`}
                            className="cursor-pointer flex-1 font-normal text-xs"
                          >
                            <span className="font-mono font-semibold mr-1">{o.value}</span>
                            {isMl ? o.ml : o.en}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}

                <div className="sticky bottom-2 rounded-lg border-2 border-primary/30 bg-card shadow-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{tr(T.absResult)}</span>
                    <Badge variant={absResult.tone}>{tr(absResult.label)}</Badge>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">{absTotal}</span>
                    <span className="text-sm text-muted-foreground">/ 56</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['Disinhibition', 'Aggression', 'Lability'] as const).map((s) => (
                      <div key={s} className="rounded border bg-muted/40 p-2">
                        <div className="text-muted-foreground">{tr(ABS_SUBSCALE_LABEL[s])}</div>
                        <div className="font-mono font-semibold text-foreground">{absSubtotals[s]}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{tr(absResult.note)}</p>
                  <p className="text-[11px] text-muted-foreground italic">{tr(T.absBands)}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
