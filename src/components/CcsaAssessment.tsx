import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Brain, RotateCcw } from 'lucide-react';
import { ProgressIndicator } from './ProgressIndicator';
import { ExportButtons } from './ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

interface CcsaAssessmentProps {
  onBack?: () => void;
}


type SectionKey = 'orientation' | 'immediate' | 'digitFwd' | 'digitBwd' | 'vigilance' | 'serial7' | 'abstraction' | 'sequencing' | 'naming' | 'repetition' | 'fluency' | 'copy' | 'clock' | 'recall';

const ORIENTATION_ITEMS = [
  'Year', 'Month', 'Day of week', 'City', 'Type of place (hospital/clinic/home)', 'Time of day (morning/afternoon/evening)',
];
const WORDS = ['River', 'Mirror', 'Mango', 'Engine', 'Pillow'];
const NAMING_ITEMS = ['Compass', 'Ladder'];

export const CcsaAssessment = ({ onBack }: CcsaAssessmentProps) => {
  const [orientation, setOrientation] = useState<boolean[]>(Array(6).fill(false));
  const [immediate, setImmediate] = useState<boolean[]>(Array(5).fill(false));
  const [digitFwd, setDigitFwd] = useState(false); // 1 pt
  const [digitBwd, setDigitBwd] = useState(false); // 1 pt
  const [vigilance, setVigilance] = useState(false); // 1 pt
  const [serial7, setSerial7] = useState<boolean[]>(Array(4).fill(false)); // 0.5 each
  const [abstraction, setAbstraction] = useState<boolean[]>(Array(2).fill(false));
  const [sequencing, setSequencing] = useState<string>('0'); // 0/1/2
  const [naming, setNaming] = useState<boolean[]>(Array(2).fill(false));
  const [repetition, setRepetition] = useState(false);
  const [fluency, setFluency] = useState(false);
  const [copy, setCopy] = useState<string>('0'); // 0/1/2
  const [clock, setClock] = useState(false);
  const [recall, setRecall] = useState<boolean[]>(Array(5).fill(false));

  const scores = useMemo(() => {
    const or = orientation.filter(Boolean).length;
    const im = immediate.filter(Boolean).length;
    const att = (digitFwd ? 1 : 0) + (digitBwd ? 1 : 0) + (vigilance ? 1 : 0) + serial7.filter(Boolean).length * 0.5;
    const exec = abstraction.filter(Boolean).length + parseInt(sequencing);
    const lang = naming.filter(Boolean).length + (repetition ? 1 : 0) + (fluency ? 1 : 0);
    const vis = parseInt(copy) + (clock ? 1 : 0);
    const rec = Math.min(3, recall.filter(Boolean).length); // scored on first 3 as per spec
    return {
      orientation: or, immediate: im, attention: att, executive: exec,
      language: lang, visuospatial: vis, recall: rec,
      total: or + im + att + exec + lang + vis + rec,
    };
  }, [orientation, immediate, digitFwd, digitBwd, vigilance, serial7, abstraction, sequencing, naming, repetition, fluency, copy, clock, recall]);

  const interp = useMemo(() => {
    const t = scores.total;
    if (t >= 27) return { label: 'Within expected range', tone: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30' };
    if (t >= 24) return { label: 'Mild cognitive concern', tone: 'bg-amber-500/10 text-amber-700 border-amber-500/30' };
    if (t >= 20) return { label: 'Moderate impairment possible', tone: 'bg-orange-500/10 text-orange-700 border-orange-500/30' };
    return { label: 'Significant cognitive impairment possible', tone: 'bg-red-500/10 text-red-700 border-red-500/30' };
  }, [scores.total]);

  const reset = () => {
    setOrientation(Array(6).fill(false));
    setImmediate(Array(5).fill(false));
    setDigitFwd(false); setDigitBwd(false); setVigilance(false);
    setSerial7(Array(4).fill(false));
    setAbstraction(Array(2).fill(false));
    setSequencing('0');
    setNaming(Array(2).fill(false));
    setRepetition(false); setFluency(false);
    setCopy('0'); setClock(false);
    setRecall(Array(5).fill(false));
  };

  const reportData: ReportData = {
    assessmentName: 'Comprehensive Cognitive Screening Assessment (CCSA)',
    date: new Date().toLocaleString(),
    totalScore: `${scores.total}/30`,
    interpretation: interp.label,
    sections: [
      {
        title: 'Domain Scores',
        items: [
          `Orientation: ${scores.orientation}/6`,
          `Immediate memory: ${scores.immediate}/5`,
          `Attention: ${scores.attention}/5`,
          `Executive function: ${scores.executive}/4`,
          `Language: ${scores.language}/4`,
          `Visuospatial: ${scores.visuospatial}/3`,
          `Delayed recall: ${scores.recall}/3`,
        ],
        type: 'info',
      },
    ],
    disclaimer: 'Original screening prototype; not clinically validated.',
  };

  const toggle = (arr: boolean[], setArr: (v: boolean[]) => void, i: number) => {
    const next = [...arr]; next[i] = !next[i]; setArr(next);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pt-16">
      <ProgressIndicator 
        sections={[
          { id: 'sec-orientation', label: 'Orientation' },
          { id: 'sec-immediate', label: 'Immediate Memory' },
          { id: 'sec-attention', label: 'Attention' },
          { id: 'sec-executive', label: 'Executive' },
          { id: 'sec-language', label: 'Language' },
          { id: 'sec-visuospatial', label: 'Visuospatial' },
          { id: 'sec-delayed', label: 'Delayed Recall' },
        ]} 
      />
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Comprehensive Cognitive Screening Assessment</h1>
              <p className="text-sm text-muted-foreground">CCSA — original 30-point cognitive screen (~10–12 min)</p>
            </div>
          </div>

          <Badge variant="secondary" className="gap-1"><Brain className="h-3.5 w-3.5" /> Prototype tool</Badge>
        </div>

        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="p-4 text-sm text-amber-900 dark:text-amber-200">
            This is an <span className="font-semibold">original screening prototype</span> that measures
            the same cognitive domains as the MoCA without copying its items, wording, layout or scoring.
            It is <span className="font-semibold">not clinically validated</span> and must not be used for
            diagnostic decisions until validation studies (content validity, reliability, sensitivity /
            specificity vs MoCA / MMSE / ACE-III) have been completed.
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-medical-primary/5 p-6 rounded-2xl border border-medical-primary/10 shadow-sm gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-sm font-bold uppercase tracking-widest text-medical-primary mb-1">Live Clinical Score</h2>
            <div className="flex items-baseline gap-2 justify-center sm:justify-start">
              <span className="text-5xl font-black text-medical-primary tabular-nums">{scores.total}</span>
              <span className="text-xl font-bold text-medical-primary/40">/ 30</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center sm:items-end gap-2">
            <Badge variant="outline" className={`px-4 py-1.5 text-sm font-bold shadow-sm ${interp.tone}`}>
              {interp.label}
            </Badge>
            <div className="flex gap-2 mt-2">
              <ExportButtons data={reportData} className="h-9" />
              <Button onClick={reset} size="sm" variant="ghost" className="h-9 px-4 font-bold text-muted-foreground hover:text-destructive">
                <RotateCcw className="h-4 w-4 mr-2" /> Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Live score breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Domain Breakdown</span>
              <span className="text-sm font-normal text-muted-foreground">Detailed Score Matrix</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                ['Orientation', scores.orientation, 6],
                ['Immediate mem', scores.immediate, 5],
                ['Attention', scores.attention, 5],
                ['Executive', scores.executive, 4],
                ['Language', scores.language, 4],
                ['Visuospatial', scores.visuospatial, 3],
                ['Delayed recall', scores.recall, 3],
              ].map(([n, s, m]) => (
                <div key={n as string} className="rounded border border-border p-2 text-center">
                  <div className="text-muted-foreground mb-0.5">{n}</div>
                  <div className="font-bold text-medical-primary text-base">{s as number} / {m as number}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 1. Orientation */}
        <Card id="sec-orientation">
          <CardHeader><CardTitle className="text-lg">1. Orientation <span className="text-sm text-muted-foreground font-normal">(6 pts — 1 each)</span></CardTitle></CardHeader>

          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Ask each item. Tick the correct answers.</p>
            {ORIENTATION_ITEMS.map((q, i) => (
              <label key={q} className="flex items-center gap-2 text-sm">
                <Checkbox checked={orientation[i]} onCheckedChange={() => toggle(orientation, setOrientation, i)} />
                <span>{q}</span>
              </label>
            ))}
          </CardContent>
        </Card>

        {/* 2. Immediate memory */}
        <Card id="sec-immediate">
          <CardHeader><CardTitle className="text-lg">2. Immediate Memory <span className="text-sm text-muted-foreground font-normal">(5 pts)</span></CardTitle></CardHeader>

          <CardContent className="space-y-2">
            <p className="text-sm">Read the five words once, then ask the patient to repeat. Tell them to remember for later.</p>
            <p className="font-mono text-sm bg-muted rounded p-2">{WORDS.join(' – ')}</p>
            {WORDS.map((w, i) => (
              <label key={w} className="flex items-center gap-2 text-sm">
                <Checkbox checked={immediate[i]} onCheckedChange={() => toggle(immediate, setImmediate, i)} />
                <span>{w}</span>
              </label>
            ))}
          </CardContent>
        </Card>

        {/* 3. Attention */}
        <Card id="sec-attention">
          <CardHeader><CardTitle className="text-lg">3. Attention <span className="text-sm text-muted-foreground font-normal">(5 pts)</span></CardTitle></CardHeader>

          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-medium mb-1">A. Digit span (2 pts)</p>
              <p className="font-mono bg-muted rounded p-2">Forward: 7 – 1 – 9 – 4 – 2</p>
              <label className="flex items-center gap-2 mt-2">
                <Checkbox checked={digitFwd} onCheckedChange={(v) => setDigitFwd(!!v)} /> Correct forward (1 pt)
              </label>
              <p className="font-mono bg-muted rounded p-2 mt-2">Backward: 5 – 8 – 2</p>
              <label className="flex items-center gap-2 mt-2">
                <Checkbox checked={digitBwd} onCheckedChange={(v) => setDigitBwd(!!v)} /> Correct backward (1 pt)
              </label>
            </div>
            <div>
              <p className="font-medium mb-1">B. Vigilance (1 pt)</p>
              <p className="text-muted-foreground">Read slowly. Patient taps on every <b>S</b>. Award 1 pt if ≤ 1 error.</p>
              <p className="font-mono bg-muted rounded p-2 mt-1">B S F T S L M S P K</p>
              <label className="flex items-center gap-2 mt-2">
                <Checkbox checked={vigilance} onCheckedChange={(v) => setVigilance(!!v)} /> ≤ 1 error (1 pt)
              </label>
            </div>
            <div>
              <p className="font-medium mb-1">C. Serial 7s from 90 (2 pts)</p>
              <p className="text-muted-foreground">0.5 pt for each correct answer: 83, 76, 69, 62.</p>
              <div className="flex flex-wrap gap-3 mt-2">
                {[83, 76, 69, 62].map((n, i) => (
                  <label key={n} className="flex items-center gap-2">
                    <Checkbox checked={serial7[i]} onCheckedChange={() => toggle(serial7, setSerial7, i)} /> {n}
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Executive */}
        <Card id="sec-executive">
          <CardHeader><CardTitle className="text-lg">4. Executive Function <span className="text-sm text-muted-foreground font-normal">(4 pts)</span></CardTitle></CardHeader>

          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-medium mb-1">A. Verbal abstraction (2 pts)</p>
              <p className="text-muted-foreground">"How are these alike?" — accept conceptual answers.</p>
              <label className="flex items-center gap-2 mt-2">
                <Checkbox checked={abstraction[0]} onCheckedChange={() => toggle(abstraction, setAbstraction, 0)} /> Piano and guitar (1 pt)
              </label>
              <label className="flex items-center gap-2">
                <Checkbox checked={abstraction[1]} onCheckedChange={() => toggle(abstraction, setAbstraction, 1)} /> Apple and banana (1 pt)
              </label>
            </div>
            <div>
              <p className="font-medium mb-1">B. Sequencing — months backward from December (2 pts)</p>
              <RadioGroup value={sequencing} onValueChange={setSequencing} className="space-y-1">
                <label className="flex items-center gap-2"><RadioGroupItem value="2" /> Perfect (2 pts)</label>
                <label className="flex items-center gap-2"><RadioGroupItem value="1" /> Minor error (1 pt)</label>
                <label className="flex items-center gap-2"><RadioGroupItem value="0" /> Unable (0 pts)</label>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* 5. Language */}
        <Card id="sec-language">
          <CardHeader><CardTitle className="text-lg">5. Language <span className="text-sm text-muted-foreground font-normal">(4 pts)</span></CardTitle></CardHeader>

          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-medium mb-1">A. Naming (2 pts)</p>
              {NAMING_ITEMS.map((n, i) => (
                <label key={n} className="flex items-center gap-2">
                  <Checkbox checked={naming[i]} onCheckedChange={() => toggle(naming, setNaming, i)} /> {n} (1 pt)
                </label>
              ))}
            </div>
            <div>
              <p className="font-medium mb-1">B. Sentence repetition (1 pt)</p>
              <p className="italic bg-muted rounded p-2">"The small green bird landed beside the quiet lake."</p>
              <label className="flex items-center gap-2 mt-2">
                <Checkbox checked={repetition} onCheckedChange={(v) => setRepetition(!!v)} /> Repeated verbatim (1 pt)
              </label>
            </div>
            <div>
              <p className="font-medium mb-1">C. Animal fluency (1 pt)</p>
              <p className="text-muted-foreground">≥ 15 animals in 1 minute.</p>
              <label className="flex items-center gap-2 mt-2">
                <Checkbox checked={fluency} onCheckedChange={(v) => setFluency(!!v)} /> ≥ 15 animals (1 pt)
              </label>
            </div>
          </CardContent>
        </Card>

        {/* 6. Visuospatial */}
        <Card id="sec-visuospatial">
          <CardHeader><CardTitle className="text-lg">6. Visuospatial Skills <span className="text-sm text-muted-foreground font-normal">(3 pts)</span></CardTitle></CardHeader>

          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-medium mb-1">A. Copy an original geometric figure (2 pts)</p>
              <p className="text-muted-foreground">Present an original design (e.g. two overlapping pentagons with an internal triangle) — do NOT reuse MoCA or MMSE figures.</p>
              <RadioGroup value={copy} onValueChange={setCopy} className="space-y-1 mt-2">
                <label className="flex items-center gap-2"><RadioGroupItem value="2" /> Accurate (2 pts)</label>
                <label className="flex items-center gap-2"><RadioGroupItem value="1" /> Minor distortion (1 pt)</label>
                <label className="flex items-center gap-2"><RadioGroupItem value="0" /> Incorrect (0 pts)</label>
              </RadioGroup>
            </div>
            <div>
              <p className="font-medium mb-1">B. Clock reading (1 pt)</p>
              <p className="text-muted-foreground">Show a printed clock face at 2:35 and ask the time.</p>
              <label className="flex items-center gap-2 mt-2">
                <Checkbox checked={clock} onCheckedChange={(v) => setClock(!!v)} /> Read correctly (1 pt)
              </label>
            </div>
          </CardContent>
        </Card>

        {/* 7. Delayed recall */}
        <Card id="sec-delayed">
          <CardHeader><CardTitle className="text-lg">7. Delayed Recall <span className="text-sm text-muted-foreground font-normal">(3 pts — first 3 spontaneous)</span></CardTitle></CardHeader>

          <CardContent className="space-y-2 text-sm">
            <p className="text-muted-foreground">Ask the patient to recall the five earlier words spontaneously. Score 1 pt each for the first three recalled (max 3).</p>
            {WORDS.map((w, i) => (
              <label key={w} className="flex items-center gap-2">
                <Checkbox checked={recall[i]} onCheckedChange={() => toggle(recall, setRecall, i)} /> {w}
              </label>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Interpretation (provisional)</CardTitle></CardHeader>
          <CardContent className="text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                ['27 – 30', 'Within expected range'],
                ['24 – 26', 'Mild cognitive concern'],
                ['20 – 23', 'Moderate impairment possible'],
                ['< 20', 'Significant cognitive impairment possible'],
              ].map(([r, l]) => (
                <div key={r} className="flex items-center justify-between rounded border border-border px-3 py-2">
                  <span className="font-mono">{r}</span><span>{l}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Ranges are provisional. Validation vs MoCA / MMSE / ACE-III is required before clinical use.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
