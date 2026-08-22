import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Activity, RotateCcw, FileText } from 'lucide-react';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { AssessmentReference } from '@/components/AssessmentReference';
import { ExportButtons } from './ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';
import { cn } from '@/lib/utils';

interface Props { onBack?: () => void }

// Y-BOCS — 10 items, each 0 (none) – 4 (extreme). Items 1-5 obsessions, 6-10 compulsions.
const YBOCS_ITEMS = [
  { id: 1, group: 'Obsessions', label: 'Time occupied by obsessive thoughts' },
  { id: 2, group: 'Obsessions', label: 'Interference due to obsessive thoughts' },
  { id: 3, group: 'Obsessions', label: 'Distress associated with obsessive thoughts' },
  { id: 4, group: 'Obsessions', label: 'Resistance against obsessions' },
  { id: 5, group: 'Obsessions', label: 'Degree of control over obsessive thoughts' },
  { id: 6, group: 'Compulsions', label: 'Time spent performing compulsive behaviours' },
  { id: 7, group: 'Compulsions', label: 'Interference due to compulsive behaviours' },
  { id: 8, group: 'Compulsions', label: 'Distress associated with compulsive behaviours' },
  { id: 9, group: 'Compulsions', label: 'Resistance against compulsions' },
  { id: 10, group: 'Compulsions', label: 'Degree of control over compulsive behaviours' },
];

const ANCHORS = [
  { v: 0, label: 'None' },
  { v: 1, label: 'Mild' },
  { v: 2, label: 'Moderate' },
  { v: 3, label: 'Severe' },
  { v: 4, label: 'Extreme' },
];

export const YbocsAssessment = ({ onBack }: Props) => {
  const { t } = useLanguage();
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const completed = Object.keys(responses).length;
  const progress = (completed / YBOCS_ITEMS.length) * 100;
  const obsessions = useMemo(() => [1,2,3,4,5].reduce((s,i)=>s+(responses[i]??0),0), [responses]);
  const compulsions = useMemo(() => [6,7,8,9,10].reduce((s,i)=>s+(responses[i]??0),0), [responses]);
  const total = obsessions + compulsions;

  const interpret = (s: number) => {
    if (s <= 7) return { label: 'Subclinical', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (s <= 15) return { label: 'Mild', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    if (s <= 23) return { label: 'Moderate', color: 'bg-orange-100 text-orange-800 border-orange-300' };
    if (s <= 31) return { label: 'Severe', color: 'bg-red-100 text-red-800 border-red-300' };
    return { label: 'Extreme', color: 'bg-red-200 text-red-900 border-red-400' };
  };

  const reset = () => { setResponses({}); setShowResults(false); };

  const reportData: ReportData = {
    assessmentName: 'Y-BOCS (Yale-Brown Obsessive Compulsive Scale)',
    date: new Date().toLocaleString(),
    totalScore: `${total}/40`,
    interpretation: `${interpret(total).label} — Obsessions ${obsessions}/20, Compulsions ${compulsions}/20`,
    severity: interpret(total).label,
    sections: [
      {
        title: 'Item Scores',
        items: YBOCS_ITEMS.map((item) => `${item.id}. [${item.group}] ${item.label}: ${responses[item.id] ?? 0}`),
        type: 'info',
      },
      {
        title: 'Cutoffs (total)',
        items: ['0–7 subclinical · 8–15 mild · 16–23 moderate · 24–31 severe · 32–40 extreme'],
        type: 'info',
      },
    ],
    disclaimer: 'Y-BOCS measures OCD symptom severity over the past week; clinical diagnosis requires comprehensive evaluation.',
  };

  if (showResults) {
    const interp = interpret(total);
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button>}
          <Card className="shadow-xl"><CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md mx-auto"><Activity className="h-7 w-7" /></div>
              <h1 className="text-3xl font-bold text-slate-800">Y-BOCS Results</h1>
              <p className="text-slate-600 text-sm">Yale-Brown Obsessive Compulsive Scale</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-violet-50 border-2 border-violet-200 text-center"><div className="text-3xl font-bold text-violet-700">{obsessions}<span className="text-base text-slate-500">/20</span></div><div className="text-xs text-slate-600 mt-1">Obsessions</div></div>
              <div className="p-4 rounded-xl bg-fuchsia-50 border-2 border-fuchsia-200 text-center"><div className="text-3xl font-bold text-fuchsia-700">{compulsions}<span className="text-base text-slate-500">/20</span></div><div className="text-xs text-slate-600 mt-1">Compulsions</div></div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-purple-300 text-center"><div className="text-3xl font-bold text-purple-700">{total}<span className="text-base text-slate-500">/40</span></div><div className="text-xs text-slate-600 mt-1">Total</div></div>
            </div>
            <div className="text-center"><Badge className={cn('text-sm', interp.color)}>{interp.label}</Badge></div>
            <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-lg border">
              <strong>Cutoffs (total):</strong> 0–7 subclinical · 8–15 mild · 16–23 moderate · 24–31 severe · 32–40 extreme. Score the worst symptoms over the past week.
            </div>
            <div className="flex justify-center gap-3 print:hidden">
              <ExportButtons data={reportData} />
              <Button variant="outline" onClick={() => window.print()}><FileText className="mr-2 h-4 w-4" />Print</Button>
              <Button onClick={reset}><RotateCcw className="mr-2 h-4 w-4" />New Assessment</Button>
            </div>
          </CardContent></Card>
          <AssessmentReference assessmentKey="ybocs" />
          {onBack && <div className="flex justify-center pb-6 print:hidden"><Button variant="outline" onClick={onBack} size="lg"><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button></div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button>}
        <PatientInfoForm />
        <Card className="shadow-xl"><CardContent className="p-6 md:p-8 space-y-4">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md"><Activity className="h-6 w-6" /></span>
            Y-BOCS
          </h1>
          <p className="text-slate-600 text-sm">Yale-Brown Obsessive Compulsive Scale — 10 clinician-rated items measuring severity of OCD symptoms over the past week.</p>
          <div className="flex justify-between text-sm text-slate-600"><span>Progress</span><span>{completed}/{YBOCS_ITEMS.length}</span></div>
          <Progress value={progress} className="h-2" />
        </CardContent></Card>
        {(['Obsessions','Compulsions'] as const).map(group => (
          <div key={group} className="space-y-3">
            <h2 className="text-lg font-bold text-purple-800 px-1">{group}</h2>
            {YBOCS_ITEMS.filter(i => i.group === group).map(item => (
              <Card key={item.id} className="shadow-md"><CardContent className="p-4 md:p-5 space-y-3">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">{item.id}</span>
                  <p className="text-sm md:text-base text-slate-800 font-medium">{item.label}</p>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {ANCHORS.map(a => {
                    const selected = responses[item.id] === a.v;
                    return (
                      <button key={a.v} type="button" onClick={() => setResponses(p => ({ ...p, [item.id]: a.v }))}
                        className={cn('text-xs px-2 py-2 rounded-md border-2 transition-all text-center',
                          selected ? 'bg-purple-500 border-purple-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:border-purple-400 hover:bg-purple-50')}>
                        <div className="font-semibold">{a.v}</div><div className="text-[11px] mt-0.5 leading-tight">{a.label}</div>
                      </button>
                    );
                  })}
                </div>
              </CardContent></Card>
            ))}
          </div>
        ))}
        <Card className="shadow-lg sticky bottom-4"><CardContent className="p-4">
          <Button onClick={() => setShowResults(true)} disabled={completed !== YBOCS_ITEMS.length} className="w-full" size="lg">
            Calculate Score{completed < YBOCS_ITEMS.length && ` (${completed}/${YBOCS_ITEMS.length})`}
          </Button>
        </CardContent></Card>
        <AssessmentReference assessmentKey="ybocs" />
        {onBack && <div className="flex justify-center pb-6"><Button variant="outline" onClick={onBack} size="lg"><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button></div>}
      </div>
    </div>
  );
};
