import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FlaskConical, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SubstanceAssessmentProps {
  onBack?: () => void;
  initialTab?: 'ciwa' | 'sds';
}

type Bilingual = { en: string; ml: string };
type Option = { value: number; en: string; ml: string };

interface CiwaItem {
  id: string;
  title: Bilingual;
  prompt?: Bilingual;
  options: Option[]; // 0..7 (or 0..4 for orientation)
}

// ─── CIWA-Ar (10 items) ─────────────────────────────────────────────
const SCALE_0_7 = (en: string[], ml: string[]): Option[] =>
  en.map((e, i) => ({ value: i, en: `${i} – ${e}`, ml: `${i} – ${ml[i]}` }));

const CIWA_ITEMS: CiwaItem[] = [
  {
    id: 'nausea',
    title: { en: 'Nausea & vomiting', ml: 'ഓക്കാനം, ഛർദ്ദി' },
    prompt: { en: 'Ask: "Do you feel sick to your stomach? Have you vomited?"', ml: 'ചോദിക്കുക: "വയറ് അസ്വസ്ഥമാണോ? ഛർദ്ദിച്ചോ?"' },
    options: SCALE_0_7(
      ['No nausea, no vomiting', 'Mild nausea, no vomiting', '', '', 'Intermittent nausea with dry heaves', '', '', 'Constant nausea, frequent dry heaves and vomiting'],
      ['ഓക്കാനമോ ഛർദ്ദിയോ ഇല്ല', 'നേരിയ ഓക്കാനം, ഛർദ്ദി ഇല്ല', '', '', 'ഇടവിട്ടുള്ള ഓക്കാനം, വരണ്ട ഛർദ്ദി', '', '', 'നിരന്തര ഓക്കാനം, ആവർത്തിച്ചുള്ള ഛർദ്ദി'],
    ),
  },
  {
    id: 'tremor',
    title: { en: 'Tremor', ml: 'വിറയൽ' },
    prompt: { en: 'Arms extended, fingers spread', ml: 'കൈകൾ നീട്ടി, വിരലുകൾ വിടർത്തുക' },
    options: SCALE_0_7(
      ['No tremor', 'Not visible, felt fingertip to fingertip', '', '', 'Moderate, with arms extended', '', '', 'Severe, even with arms not extended'],
      ['വിറയൽ ഇല്ല', 'കാണാനില്ല, വിരൽത്തുമ്പിൽ അനുഭവപ്പെടുന്നു', '', '', 'ഇടത്തരം, കൈകൾ നീട്ടുമ്പോൾ', '', '', 'കടുത്തത്, കൈകൾ നീട്ടാതെയും'],
    ),
  },
  {
    id: 'sweats',
    title: { en: 'Paroxysmal sweats', ml: 'പെട്ടെന്നുള്ള വിയർപ്പ്' },
    options: SCALE_0_7(
      ['No sweat visible', 'Barely perceptible, palms moist', '', '', 'Beads of sweat obvious on forehead', '', '', 'Drenching sweats'],
      ['വിയർപ്പ് ഇല്ല', 'തെളിയാത്തത്, കൈപ്പത്തി നനവുള്ളത്', '', '', 'നെറ്റിയിൽ വ്യക്തമായ വിയർപ്പുതുള്ളികൾ', '', '', 'പൂർണ്ണമായും വിയർത്ത്'],
    ),
  },
  {
    id: 'anxiety',
    title: { en: 'Anxiety', ml: 'ഉത്കണ്ഠ' },
    prompt: { en: 'Ask: "Do you feel nervous?"', ml: 'ചോദിക്കുക: "നിങ്ങൾക്ക് അസ്വസ്ഥത തോന്നുന്നുണ്ടോ?"' },
    options: SCALE_0_7(
      ['No anxiety, at ease', 'Mildly anxious', '', '', 'Moderately anxious or guarded', '', '', 'Equivalent to acute panic states'],
      ['ഉത്കണ്ഠയില്ല, സുഖകരം', 'നേരിയ ഉത്കണ്ഠ', '', '', 'ഇടത്തരം ഉത്കണ്ഠ', '', '', 'കടുത്ത പാനിക് അവസ്ഥ'],
    ),
  },
  {
    id: 'agitation',
    title: { en: 'Agitation', ml: 'ഉദ്വേഗം' },
    options: SCALE_0_7(
      ['Normal activity', 'Somewhat more than normal activity', '', '', 'Moderately fidgety and restless', '', '', 'Paces back and forth, thrashes about'],
      ['സാധാരണ പ്രവർത്തനം', 'സാധാരണയിൽ കൂടുതൽ', '', '', 'ഇടത്തരം അസ്വസ്ഥത', '', '', 'അങ്ങോട്ടുമിങ്ങോട്ടും നടക്കുന്നു, അസ്വസ്ഥനായി'],
    ),
  },
  {
    id: 'tactile',
    title: { en: 'Tactile disturbances', ml: 'സ്പർശന അസ്വസ്ഥതകൾ' },
    prompt: { en: 'Itching, burning, numbness, bugs crawling on skin?', ml: 'ചൊറിച്ചിൽ, പൊള്ളൽ, മരവിപ്പ്, ചർമ്മത്തിൽ പുഴുക്കൾ?' },
    options: SCALE_0_7(
      ['None', 'Very mild itching, pins & needles', 'Mild', 'Moderate', 'Moderately severe hallucinations', 'Severe hallucinations', 'Extremely severe hallucinations', 'Continuous hallucinations'],
      ['ഇല്ല', 'വളരെ നേരിയ ചൊറിച്ചിൽ', 'നേരിയത്', 'ഇടത്തരം', 'ഇടത്തരം കടുത്ത ഹാല്ലൂസിനേഷൻ', 'കടുത്ത ഹാല്ലൂസിനേഷൻ', 'അതികഠിന ഹാല്ലൂസിനേഷൻ', 'നിരന്തര ഹാല്ലൂസിനേഷൻ'],
    ),
  },
  {
    id: 'auditory',
    title: { en: 'Auditory disturbances', ml: 'ശ്രവണ അസ്വസ്ഥതകൾ' },
    prompt: { en: 'Are you more aware of sounds? Do you hear things that aren\'t there?', ml: 'ഇല്ലാത്ത ശബ്ദങ്ങൾ കേൾക്കുന്നുണ്ടോ?' },
    options: SCALE_0_7(
      ['Not present', 'Very mild harshness', 'Mild', 'Moderate', 'Moderately severe hallucinations', 'Severe hallucinations', 'Extremely severe hallucinations', 'Continuous hallucinations'],
      ['ഇല്ല', 'വളരെ നേരിയ കാഠിന്യം', 'നേരിയത്', 'ഇടത്തരം', 'ഇടത്തരം കടുത്ത ഹാല്ലൂസിനേഷൻ', 'കടുത്ത ഹാല്ലൂസിനേഷൻ', 'അതികഠിന ഹാല്ലൂസിനേഷൻ', 'നിരന്തര ഹാല്ലൂസിനേഷൻ'],
    ),
  },
  {
    id: 'visual',
    title: { en: 'Visual disturbances', ml: 'കാഴ്ച അസ്വസ്ഥതകൾ' },
    prompt: { en: 'Does the light appear too bright? Do you see things that aren\'t there?', ml: 'വെളിച്ചം അമിതമായി തോന്നുന്നുണ്ടോ? ഇല്ലാത്തവ കാണുന്നുണ്ടോ?' },
    options: SCALE_0_7(
      ['Not present', 'Very mild sensitivity', 'Mild', 'Moderate', 'Moderately severe hallucinations', 'Severe hallucinations', 'Extremely severe hallucinations', 'Continuous hallucinations'],
      ['ഇല്ല', 'വളരെ നേരിയ സംവേദനക്ഷമത', 'നേരിയത്', 'ഇടത്തരം', 'ഇടത്തരം കടുത്ത ഹാല്ലൂസിനേഷൻ', 'കടുത്ത ഹാല്ലൂസിനേഷൻ', 'അതികഠിന ഹാല്ലൂസിനേഷൻ', 'നിരന്തര ഹാല്ലൂസിനേഷൻ'],
    ),
  },
  {
    id: 'headache',
    title: { en: 'Headache, fullness in head', ml: 'തലവേദന, തലയിൽ ഭാരം' },
    options: SCALE_0_7(
      ['Not present', 'Very mild', 'Mild', 'Moderate', 'Moderately severe', 'Severe', 'Very severe', 'Extremely severe'],
      ['ഇല്ല', 'വളരെ നേരിയത്', 'നേരിയത്', 'ഇടത്തരം', 'ഇടത്തരം കടുത്തത്', 'കടുത്തത്', 'വളരെ കടുത്തത്', 'അതികഠിനം'],
    ),
  },
  {
    id: 'orientation',
    title: { en: 'Orientation & clouding of sensorium', ml: 'ബോധനില, ദിശാബോധം' },
    prompt: { en: 'Ask: "What day is this? Where are you? Who am I?"', ml: 'ചോദിക്കുക: "ഇന്ന് ഏത് ദിവസം? എവിടെയാണ്? ഞാൻ ആരാണ്?"' },
    options: [
      { value: 0, en: '0 – Oriented and can do serial additions', ml: '0 – ബോധവാൻ, സീരിയൽ കൂട്ടലുകൾ ചെയ്യാം' },
      { value: 1, en: '1 – Cannot do serial additions, uncertain about date', ml: '1 – സീരിയൽ കൂട്ടൽ ചെയ്യാനാവുന്നില്ല, തീയതി അനിശ്ചിതം' },
      { value: 2, en: '2 – Disoriented to date by ≤2 days', ml: '2 – തീയതി ≤2 ദിവസം തെറ്റി' },
      { value: 3, en: '3 – Disoriented to date by >2 days', ml: '3 – തീയതി >2 ദിവസം തെറ്റി' },
      { value: 4, en: '4 – Disoriented to place and/or person', ml: '4 – സ്ഥലവും/അല്ലെങ്കിൽ വ്യക്തിയും തിരിച്ചറിയുന്നില്ല' },
    ],
  },
];

const ciwaSeverity = (total: number) => {
  if (total <= 9) return { en: 'Minimal / no withdrawal', ml: 'കുറഞ്ഞത് / പിൻവാങ്ങൽ ഇല്ല', tone: 'secondary' as const };
  if (total <= 19) return { en: 'Mild–moderate withdrawal', ml: 'നേരിയ–ഇടത്തരം പിൻവാങ്ങൽ', tone: 'default' as const };
  return { en: 'Severe withdrawal — high seizure/DT risk', ml: 'കടുത്ത പിൻവാങ്ങൽ — ഉയർന്ന അപായം', tone: 'destructive' as const };
};

// ─── SDS (5 items) ──────────────────────────────────────────────────
interface SdsItem {
  id: string;
  question: Bilingual;
  options: Option[]; // 0..3
}

const SDS_ITEMS: SdsItem[] = [
  {
    id: 'control',
    question: {
      en: 'Did you think your use of [substance] was out of control?',
      ml: '[ലഹരി] ഉപയോഗം നിയന്ത്രണാതീതമാണെന്ന് തോന്നിയോ?',
    },
    options: [
      { value: 0, en: 'Never / almost never', ml: 'ഒരിക്കലുമില്ല / മിക്കവാറും ഇല്ല' },
      { value: 1, en: 'Sometimes', ml: 'ചിലപ്പോൾ' },
      { value: 2, en: 'Often', ml: 'പലപ്പോഴും' },
      { value: 3, en: 'Always / nearly always', ml: 'എല്ലായ്പോഴും' },
    ],
  },
  {
    id: 'anxious',
    question: {
      en: 'Did the prospect of missing a dose make you anxious or worried?',
      ml: 'ഒരു ഡോസ് മുടങ്ങുമെന്നത് ഉത്കണ്ഠ ഉണ്ടാക്കിയോ?',
    },
    options: [
      { value: 0, en: 'Never / almost never', ml: 'ഒരിക്കലുമില്ല / മിക്കവാറും ഇല്ല' },
      { value: 1, en: 'Sometimes', ml: 'ചിലപ്പോൾ' },
      { value: 2, en: 'Often', ml: 'പലപ്പോഴും' },
      { value: 3, en: 'Always / nearly always', ml: 'എല്ലായ്പോഴും' },
    ],
  },
  {
    id: 'worry',
    question: {
      en: 'Did you worry about your use of [substance]?',
      ml: '[ലഹരി] ഉപയോഗത്തെക്കുറിച്ച് വിഷമിച്ചോ?',
    },
    options: [
      { value: 0, en: 'Not at all', ml: 'ഒട്ടുമില്ല' },
      { value: 1, en: 'A little', ml: 'കുറച്ച്' },
      { value: 2, en: 'Quite a lot', ml: 'വളരെയധികം' },
      { value: 3, en: 'A great deal', ml: 'അത്യധികം' },
    ],
  },
  {
    id: 'wish',
    question: {
      en: 'Did you wish you could stop?',
      ml: 'നിർത്താൻ കഴിഞ്ഞിരുന്നെങ്കിൽ എന്നു ആഗ്രഹിച്ചോ?',
    },
    options: [
      { value: 0, en: 'Never / almost never', ml: 'ഒരിക്കലുമില്ല / മിക്കവാറും ഇല്ല' },
      { value: 1, en: 'Sometimes', ml: 'ചിലപ്പോൾ' },
      { value: 2, en: 'Often', ml: 'പലപ്പോഴും' },
      { value: 3, en: 'Always / nearly always', ml: 'എല്ലായ്പോഴും' },
    ],
  },
  {
    id: 'difficult',
    question: {
      en: 'How difficult would you find it to stop or go without [substance]?',
      ml: '[ലഹരി] നിർത്തുന്നത് എത്ര ബുദ്ധിമുട്ടായിരിക്കും?',
    },
    options: [
      { value: 0, en: 'Not difficult', ml: 'ബുദ്ധിമുട്ടല്ല' },
      { value: 1, en: 'Quite difficult', ml: 'കുറച്ച് ബുദ്ധിമുട്ട്' },
      { value: 2, en: 'Very difficult', ml: 'വളരെ ബുദ്ധിമുട്ട്' },
      { value: 3, en: 'Impossible', ml: 'അസാധ്യം' },
    ],
  },
];

// Validated cut-offs vary by substance (cannabis ≥3, opioids ≥5, cocaine ≥4).
const sdsInterpretation = (total: number) => {
  if (total <= 2) return { en: 'Low likelihood of dependence', ml: 'ആശ്രിതത്വ സാധ്യത കുറവ്', tone: 'secondary' as const };
  if (total <= 4) return { en: 'Possible dependence (cannabis cut-off ≥3)', ml: 'ആശ്രിതത്വം സാധ്യത', tone: 'default' as const };
  return { en: 'Probable dependence (opioid/cocaine cut-off ≥4–5)', ml: 'ആശ്രിതത്വം പ്രബലം', tone: 'destructive' as const };
};

export const SubstanceAssessment = ({ onBack, initialTab = 'ciwa' }: SubstanceAssessmentProps) => {
  const { language } = useLanguage();
  const isMl = language === 'ml';
  const tr = (b: Bilingual) => (isMl ? b.ml : b.en);

  const [ciwa, setCiwa] = useState<Record<string, number | undefined>>({});
  const [sds, setSds] = useState<Record<string, number | undefined>>({});

  const ciwaTotal = useMemo(
    () => Object.values(ciwa).reduce<number>((s, v) => s + (v ?? 0), 0),
    [ciwa],
  );
  const sdsTotal = useMemo(
    () => Object.values(sds).reduce<number>((s, v) => s + (v ?? 0), 0),
    [sds],
  );

  const ciwaSev = ciwaSeverity(ciwaTotal);
  const sdsSev = sdsInterpretation(sdsTotal);

  const resetCiwa = () => setCiwa({});
  const resetSds = () => setSds({});

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                <FlaskConical className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {isMl ? 'പിൻവാങ്ങൽ & ആശ്രിതത്വ സ്കെയിലുകൾ' : 'Withdrawal & Dependence Scales'}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  CIWA-Ar · SDS
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="ciwa">CIWA-Ar</TabsTrigger>
            <TabsTrigger value="sds">SDS</TabsTrigger>
          </TabsList>

          {/* ─── CIWA-Ar ─────────────────────────────────── */}
          <TabsContent value="ciwa" className="space-y-3 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {isMl
                    ? 'CIWA-Ar — ആൽക്കഹോൾ പിൻവാങ്ങൽ വിലയിരുത്തൽ'
                    : 'CIWA-Ar — Clinical Institute Withdrawal Assessment for Alcohol'}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {isMl
                    ? '10 ഇനങ്ങൾ. ഓരോന്നും 0–7 (ഓറിയന്റേഷൻ 0–4). ആകെ പരിധി 0–67.'
                    : '10 items. Each scored 0–7 (orientation 0–4). Total range 0–67.'}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {CIWA_ITEMS.map((item) => (
                  <div key={item.id} className="border-b border-border pb-3 last:border-b-0">
                    <Label className="text-sm font-semibold">{tr(item.title)}</Label>
                    {item.prompt && (
                      <p className="text-xs text-muted-foreground italic mt-0.5">{tr(item.prompt)}</p>
                    )}
                    <RadioGroup
                      value={ciwa[item.id]?.toString() ?? ''}
                      onValueChange={(v) => setCiwa((s) => ({ ...s, [item.id]: Number(v) }))}
                      className="mt-2 grid gap-1"
                    >
                      {item.options
                        .filter((o) => (isMl ? o.ml.replace(/^\d+ – /, '') : o.en.replace(/^\d+ – /, '')))
                        .map((o) => (
                          <div key={o.value} className="flex items-center gap-2">
                            <RadioGroupItem value={o.value.toString()} id={`${item.id}-${o.value}`} />
                            <Label htmlFor={`${item.id}-${o.value}`} className="text-xs font-normal cursor-pointer">
                              {isMl ? o.ml : o.en}
                            </Label>
                          </div>
                        ))}
                    </RadioGroup>
                  </div>
                ))}

                <div className="rounded-xl bg-secondary p-4 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">{isMl ? 'ആകെ സ്കോർ' : 'Total score'}</div>
                    <div className="text-2xl font-bold">{ciwaTotal} <span className="text-sm font-normal text-muted-foreground">/ 67</span></div>
                  </div>
                  <Badge variant={ciwaSev.tone} className="text-xs">{tr({ en: ciwaSev.en, ml: ciwaSev.ml })}</Badge>
                  <Button variant="outline" size="sm" onClick={resetCiwa}>
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />{isMl ? 'പുനഃസജ്ജമാക്കുക' : 'Reset'}
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {isMl
                    ? 'കട്ട്-ഓഫ്: ≤9 കുറഞ്ഞത്; 10–19 ഇടത്തരം; ≥20 കടുത്തത് (ബെൻസോഡയാസിപ്പിൻ ചികിത്സ പരിഗണിക്കുക).'
                    : 'Cut-offs: ≤9 minimal; 10–19 mild–moderate; ≥20 severe (consider benzodiazepine therapy).'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── SDS ─────────────────────────────────────── */}
          <TabsContent value="sds" className="space-y-3 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {isMl ? 'SDS — ആശ്രിതത്വ തീവ്രതാ സ്കെയിൽ' : 'SDS — Severity of Dependence Scale'}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {isMl
                    ? '5 ഇനങ്ങൾ. ഓരോന്നും 0–3. ആകെ പരിധി 0–15. കഴിഞ്ഞ 12 മാസത്തെ ഉപയോഗം.'
                    : '5 items. Each scored 0–3. Total range 0–15. Refers to use in the past 12 months.'}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {SDS_ITEMS.map((item, idx) => (
                  <div key={item.id} className="border-b border-border pb-3 last:border-b-0">
                    <Label className="text-sm font-semibold">{idx + 1}. {tr(item.question)}</Label>
                    <RadioGroup
                      value={sds[item.id]?.toString() ?? ''}
                      onValueChange={(v) => setSds((s) => ({ ...s, [item.id]: Number(v) }))}
                      className="mt-2 grid gap-1"
                    >
                      {item.options.map((o) => (
                        <div key={o.value} className="flex items-center gap-2">
                          <RadioGroupItem value={o.value.toString()} id={`sds-${item.id}-${o.value}`} />
                          <Label htmlFor={`sds-${item.id}-${o.value}`} className="text-xs font-normal cursor-pointer">
                            {o.value} – {isMl ? o.ml : o.en}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}

                <div className="rounded-xl bg-secondary p-4 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">{isMl ? 'ആകെ സ്കോർ' : 'Total score'}</div>
                    <div className="text-2xl font-bold">{sdsTotal} <span className="text-sm font-normal text-muted-foreground">/ 15</span></div>
                  </div>
                  <Badge variant={sdsSev.tone} className="text-xs">{tr({ en: sdsSev.en, ml: sdsSev.ml })}</Badge>
                  <Button variant="outline" size="sm" onClick={resetSds}>
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />{isMl ? 'പുനഃസജ്ജമാക്കുക' : 'Reset'}
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {isMl
                    ? 'സാധൂകരിച്ച കട്ട്-ഓഫുകൾ: കഞ്ചാവ് ≥3; കൊക്കെയ്ൻ ≥4; ഒപിയോയിഡ് ≥5.'
                    : 'Validated cut-offs vary by substance: cannabis ≥3; cocaine ≥4; opioids ≥5 (Gossop et al., 1995).'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {onBack && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              ← {isMl ? 'പ്രധാന മെനുവിലേക്ക്' : 'Back to menu'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
