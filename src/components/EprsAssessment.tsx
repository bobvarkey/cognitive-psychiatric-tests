import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Zap, RotateCcw, FileText } from 'lucide-react';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { AssessmentReference } from '@/components/AssessmentReference';
import { cn } from '@/lib/utils';

interface Props { onBack?: () => void }

// Extrapyramidal Symptom Rating Scale (ESRS / EPRS) — Chouinard & Margolese, 2005.
// We implement the brief clinician global impression form (8 items, 0–6) covering the 4 EPS dimensions.
interface Item { id: number; domain: 'Parkinsonism' | 'Akathisia' | 'Dystonia' | 'Dyskinesia'; label: string }

const ITEMS: Item[] = [
  { id: 1, domain: 'Parkinsonism', label: 'Bradykinesia / hypokinesia (slowed movement, masked face)' },
  { id: 2, domain: 'Parkinsonism', label: 'Rigidity (cogwheel / lead-pipe)' },
  { id: 3, domain: 'Parkinsonism', label: 'Tremor (rest, postural, or action)' },
  { id: 4, domain: 'Parkinsonism', label: 'Sialorrhoea / drooling' },
  { id: 5, domain: 'Akathisia', label: 'Subjective restlessness + observed motor restlessness' },
  { id: 6, domain: 'Dystonia', label: 'Acute dystonia (oculogyric, torticollis, lingual, opisthotonos)' },
  { id: 7, domain: 'Dyskinesia', label: 'Tardive dyskinesia — orofacial (lip-smacking, tongue, jaw)' },
  { id: 8, domain: 'Dyskinesia', label: 'Tardive dyskinesia — limbs / trunk (choreoathetoid)' },
];

const ANCHORS = [
  { v: 0, label: 'Absent' }, { v: 1, label: 'Borderline' }, { v: 2, label: 'Mild' },
  { v: 3, label: 'Moderate' }, { v: 4, label: 'Moderately severe' }, { v: 5, label: 'Severe' }, { v: 6, label: 'Extremely severe' },
];

const DOMAINS: Item['domain'][] = ['Parkinsonism', 'Akathisia', 'Dystonia', 'Dyskinesia'];

export const EprsAssessment = ({ onBack }: Props) => {
  const { t } = useLanguage();
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const completed = Object.keys(responses).length;
  const progress = (completed / ITEMS.length) * 100;
  const total = useMemo(() => Object.values(responses).reduce((a, b) => a + b, 0), [responses]);

  const domainScores = useMemo(() => {
    const acc: Record<string, number> = {};
    ITEMS.forEach(it => { acc[it.domain] = (acc[it.domain] ?? 0) + (responses[it.id] ?? 0); });
    return acc;
  }, [responses]);

  const reset = () => { setResponses({}); setShowResults(false); };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button>}
          <Card className="shadow-xl"><CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-md mx-auto"><Zap className="h-7 w-7" /></div>
              <h1 className="text-3xl font-bold text-slate-800">EPRS Results</h1>
              <p className="text-slate-600 text-sm">Extrapyramidal Symptom Rating Scale (brief CGI form)</p>
            </div>
            <div className="grid sm:grid-cols-4 gap-3">
              {DOMAINS.map(d => (
                <div key={d} className="p-3 rounded-xl bg-amber-50 border-2 border-amber-200 text-center">
                  <div className="text-2xl font-bold text-amber-800">{domainScores[d] ?? 0}</div>
                  <div className="text-xs text-slate-600 mt-1">{d}</div>
                </div>
              ))}
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200">
              <div className="text-4xl font-bold text-slate-800">{total}<span className="text-base text-slate-500"> / 48</span></div>
              <div className="text-xs text-slate-600 mt-1">Total</div>
              <Badge className="mt-3 bg-amber-100 text-amber-800 border-amber-300">
                {total === 0 ? 'No EPS' : total <= 8 ? 'Mild' : total <= 20 ? 'Moderate' : 'Marked'}
              </Badge>
            </div>
            <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-lg border">
              <strong>Note:</strong> Each domain scored independently. Any score ≥ 3 in a domain warrants intervention: anticholinergic for parkinsonism / dystonia; β-blocker or benzodiazepine for akathisia; consider VMAT-2 inhibitor (valbenazine, deutetrabenazine) or dose reduction / switch for tardive dyskinesia.
            </div>
            <div className="flex justify-center gap-3 print:hidden">
              <Button variant="outline" onClick={() => window.print()}><FileText className="mr-2 h-4 w-4" />Print</Button>
              <Button onClick={reset}><RotateCcw className="mr-2 h-4 w-4" />New Assessment</Button>
            </div>
          </CardContent></Card>
          <AssessmentReference assessmentKey="eprs" />
          {onBack && <div className="flex justify-center pb-6 print:hidden"><Button variant="outline" onClick={onBack} size="lg"><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button></div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button>}
        <PatientInfoForm />
        <Card className="shadow-xl"><CardContent className="p-6 md:p-8 space-y-4">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-md"><Zap className="h-6 w-6" /></span>
            EPRS
          </h1>
          <p className="text-slate-600 text-sm">Extrapyramidal Symptom Rating Scale (Chouinard) — clinician global impression of severity (0–6) across the four EPS dimensions: parkinsonism, akathisia, dystonia, and dyskinesia.</p>
          <div className="flex justify-between text-sm text-slate-600"><span>Progress</span><span>{completed}/{ITEMS.length}</span></div>
          <Progress value={progress} className="h-2" />
        </CardContent></Card>
        {DOMAINS.map(d => (
          <div key={d} className="space-y-2">
            <h2 className="text-base font-bold text-amber-800 px-1">{d}</h2>
            {ITEMS.filter(i => i.domain === d).map(item => (
              <Card key={item.id} className="shadow-md"><CardContent className="p-4 md:p-5 space-y-3">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">{item.id}</span>
                  <p className="text-sm md:text-base text-slate-800 font-medium">{item.label}</p>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {ANCHORS.map(a => {
                    const selected = responses[item.id] === a.v;
                    return (
                      <button key={a.v} type="button" onClick={() => setResponses(p => ({ ...p, [item.id]: a.v }))}
                        className={cn('text-[11px] px-1 py-2 rounded-md border-2 transition-all text-center',
                          selected ? 'bg-amber-500 border-amber-600 text-white shadow' : 'bg-white border-slate-200 text-slate-700 hover:border-amber-400')}>
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
        <AssessmentReference assessmentKey="eprs" />
        {onBack && <div className="flex justify-center pb-6"><Button variant="outline" onClick={onBack} size="lg"><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button></div>}
      </div>
    </div>
  );
};
