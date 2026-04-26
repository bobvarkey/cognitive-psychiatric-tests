import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Sparkles, RotateCcw, FileText } from 'lucide-react';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { AssessmentReference } from '@/components/AssessmentReference';
import { cn } from '@/lib/utils';

interface Props { onBack?: () => void }

type Subscale = 'P' | 'N' | 'G';
interface Item { id: string; sub: Subscale; label: string }

// Kay, Fiszbein, Opler 1987 — PANSS, 30 items, each 1–7.
const ITEMS: Item[] = [
  { id: 'P1', sub: 'P', label: 'Delusions' },
  { id: 'P2', sub: 'P', label: 'Conceptual disorganisation' },
  { id: 'P3', sub: 'P', label: 'Hallucinatory behaviour' },
  { id: 'P4', sub: 'P', label: 'Excitement' },
  { id: 'P5', sub: 'P', label: 'Grandiosity' },
  { id: 'P6', sub: 'P', label: 'Suspiciousness / persecution' },
  { id: 'P7', sub: 'P', label: 'Hostility' },
  { id: 'N1', sub: 'N', label: 'Blunted affect' },
  { id: 'N2', sub: 'N', label: 'Emotional withdrawal' },
  { id: 'N3', sub: 'N', label: 'Poor rapport' },
  { id: 'N4', sub: 'N', label: 'Passive / apathetic social withdrawal' },
  { id: 'N5', sub: 'N', label: 'Difficulty in abstract thinking' },
  { id: 'N6', sub: 'N', label: 'Lack of spontaneity & flow of conversation' },
  { id: 'N7', sub: 'N', label: 'Stereotyped thinking' },
  { id: 'G1', sub: 'G', label: 'Somatic concern' },
  { id: 'G2', sub: 'G', label: 'Anxiety' },
  { id: 'G3', sub: 'G', label: 'Guilt feelings' },
  { id: 'G4', sub: 'G', label: 'Tension' },
  { id: 'G5', sub: 'G', label: 'Mannerisms & posturing' },
  { id: 'G6', sub: 'G', label: 'Depression' },
  { id: 'G7', sub: 'G', label: 'Motor retardation' },
  { id: 'G8', sub: 'G', label: 'Uncooperativeness' },
  { id: 'G9', sub: 'G', label: 'Unusual thought content' },
  { id: 'G10', sub: 'G', label: 'Disorientation' },
  { id: 'G11', sub: 'G', label: 'Poor attention' },
  { id: 'G12', sub: 'G', label: 'Lack of judgement & insight' },
  { id: 'G13', sub: 'G', label: 'Disturbance of volition' },
  { id: 'G14', sub: 'G', label: 'Poor impulse control' },
  { id: 'G15', sub: 'G', label: 'Preoccupation' },
  { id: 'G16', sub: 'G', label: 'Active social avoidance' },
];

const ANCHORS = [
  { v: 1, label: 'Absent' }, { v: 2, label: 'Minimal' }, { v: 3, label: 'Mild' },
  { v: 4, label: 'Moderate' }, { v: 5, label: 'Mod-severe' }, { v: 6, label: 'Severe' }, { v: 7, label: 'Extreme' },
];

const SUBSCALE_NAMES: Record<Subscale, string> = { P: 'Positive', N: 'Negative', G: 'General Psychopathology' };

export const PanssAssessment = ({ onBack }: Props) => {
  const { t } = useLanguage();
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const completed = Object.keys(responses).length;
  const progress = (completed / ITEMS.length) * 100;

  const sub = useMemo(() => {
    const acc: Record<Subscale, number> = { P: 0, N: 0, G: 0 };
    ITEMS.forEach(it => { acc[it.sub] += responses[it.id] ?? 0; });
    return acc;
  }, [responses]);
  const total = sub.P + sub.N + sub.G;
  const composite = sub.P - sub.N;

  const reset = () => { setResponses({}); setShowResults(false); };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button>}
          <Card className="shadow-xl"><CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-md mx-auto"><Sparkles className="h-7 w-7" /></div>
              <h1 className="text-3xl font-bold text-slate-800">PANSS Results</h1>
              <p className="text-slate-600 text-sm">Positive and Negative Syndrome Scale</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-200 text-center"><div className="text-3xl font-bold text-rose-700">{sub.P}<span className="text-base text-slate-500">/49</span></div><div className="text-xs text-slate-600 mt-1">Positive (7–49)</div></div>
              <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200 text-center"><div className="text-3xl font-bold text-blue-700">{sub.N}<span className="text-base text-slate-500">/49</span></div><div className="text-xs text-slate-600 mt-1">Negative (7–49)</div></div>
              <div className="p-4 rounded-xl bg-purple-50 border-2 border-purple-200 text-center"><div className="text-3xl font-bold text-purple-700">{sub.G}<span className="text-base text-slate-500">/112</span></div><div className="text-xs text-slate-600 mt-1">General (16–112)</div></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-100 to-fuchsia-100 border-2 border-fuchsia-300 text-center"><div className="text-3xl font-bold text-fuchsia-800">{total}<span className="text-base text-slate-500">/210</span></div><div className="text-xs text-slate-600 mt-1">Total (30–210)</div></div>
              <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-300 text-center"><div className={cn('text-3xl font-bold', composite > 0 ? 'text-rose-700' : composite < 0 ? 'text-blue-700' : 'text-slate-700')}>{composite > 0 ? '+' : ''}{composite}</div><div className="text-xs text-slate-600 mt-1">Composite (P − N)</div></div>
            </div>
            <div className="text-center"><Badge className="text-sm bg-purple-100 text-purple-800 border-purple-300">
              {total <= 58 ? 'Mildly ill' : total <= 75 ? 'Moderately ill' : total <= 95 ? 'Markedly ill' : 'Severely ill'}
            </Badge></div>
            <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-lg border">
              <strong>Reference (Leucht 2005, equipercentile linking to CGI-S):</strong> ~58 ≈ mildly ill · ~75 ≈ moderately ill · ~95 ≈ markedly ill · ~116 ≈ severely ill. Composite score &gt; 0 favours positive symptoms; &lt; 0 favours negative.
            </div>
            <div className="flex justify-center gap-3 print:hidden">
              <Button variant="outline" onClick={() => window.print()}><FileText className="mr-2 h-4 w-4" />Print</Button>
              <Button onClick={reset}><RotateCcw className="mr-2 h-4 w-4" />New Assessment</Button>
            </div>
          </CardContent></Card>
          <AssessmentReference assessmentKey="panss" />
          {onBack && <div className="flex justify-center pb-6 print:hidden"><Button variant="outline" onClick={onBack} size="lg"><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button></div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button>}
        <PatientInfoForm />
        <Card className="shadow-xl"><CardContent className="p-6 md:p-8 space-y-4">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-md"><Sparkles className="h-6 w-6" /></span>
            PANSS
          </h1>
          <p className="text-slate-600 text-sm">Positive and Negative Syndrome Scale (Kay 1987) — 30 items, each 1 (absent) to 7 (extreme), rated for the past week from a structured clinical interview (SCI-PANSS recommended).</p>
          <div className="flex justify-between text-sm text-slate-600"><span>Progress</span><span>{completed}/{ITEMS.length}</span></div>
          <Progress value={progress} className="h-2" />
        </CardContent></Card>
        {(['P', 'N', 'G'] as Subscale[]).map(s => (
          <div key={s} className="space-y-2">
            <h2 className="text-base font-bold text-purple-800 px-1">{SUBSCALE_NAMES[s]}</h2>
            {ITEMS.filter(i => i.sub === s).map(item => (
              <Card key={item.id} className="shadow-md"><CardContent className="p-4 md:p-5 space-y-3">
                <div className="flex gap-3 items-baseline">
                  <span className="flex-shrink-0 inline-flex items-center justify-center h-7 px-2 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">{item.id}</span>
                  <p className="text-sm md:text-base text-slate-800 font-medium">{item.label}</p>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {ANCHORS.map(a => {
                    const selected = responses[item.id] === a.v;
                    return (
                      <button key={a.v} type="button" onClick={() => setResponses(p => ({ ...p, [item.id]: a.v }))}
                        className={cn('text-[11px] px-1 py-2 rounded-md border-2 transition-all text-center',
                          selected ? 'bg-purple-500 border-purple-600 text-white shadow' : 'bg-white border-slate-200 text-slate-700 hover:border-purple-400')}>
                        <div className="font-semibold">{a.v}</div><div className="text-[10px] mt-0.5 leading-tight">{a.label}</div>
                      </button>
                    );
                  })}
                </div>
              </CardContent></Card>
            ))}
          </div>
        ))}
        <Card className="shadow-lg sticky bottom-4"><CardContent className="p-4">
          <Button onClick={() => setShowResults(true)} disabled={completed !== ITEMS.length} className="w-full" size="lg">
            Calculate Score{completed < ITEMS.length && ` (${completed}/${ITEMS.length})`}
          </Button>
        </CardContent></Card>
        <AssessmentReference assessmentKey="panss" />
        {onBack && <div className="flex justify-center pb-6"><Button variant="outline" onClick={onBack} size="lg"><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button></div>}
      </div>
    </div>
  );
};
