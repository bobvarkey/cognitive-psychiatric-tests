import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Activity, RotateCcw, FileText } from 'lucide-react';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { AssessmentReference } from '@/components/AssessmentReference';
import { cn } from '@/lib/utils';

interface Props { onBack?: () => void }

interface Item { id: number; label: string; options: { v: number; label: string }[] }

// Simpson-Angus (1970) — 10 items, each 0–4. Mean ≥ 0.3 = parkinsonism.
const ITEMS: Item[] = [
  { id: 1, label: 'Gait', options: [
    { v: 0, label: 'Normal' }, { v: 1, label: 'Slight diminution in swing while walking' },
    { v: 2, label: 'Marked diminution in swing with obvious rigidity in arm' },
    { v: 3, label: 'Stiff gait, arms held rigidly before abdomen' },
    { v: 4, label: 'Stooped, shuffling gait with propulsion and retropulsion' } ] },
  { id: 2, label: 'Arm Dropping', options: [
    { v: 0, label: 'Normal free fall with loud slap and rebound' }, { v: 1, label: 'Slightly slowed; less audible contact' },
    { v: 2, label: 'Definite slowing; no rebound' }, { v: 3, label: 'Marked slowing; no slap at all' },
    { v: 4, label: 'Arms fall as if against resistance' } ] },
  { id: 3, label: 'Shoulder Shaking', options: [
    { v: 0, label: 'Normal' }, { v: 1, label: 'Slight stiffness, "give"' },
    { v: 2, label: 'Moderate stiffness' }, { v: 3, label: 'Marked rigidity, difficulty with passive movement' },
    { v: 4, label: 'Extreme stiffness; almost frozen' } ] },
  { id: 4, label: 'Elbow Rigidity', options: [
    { v: 0, label: 'Normal' }, { v: 1, label: 'Slight' }, { v: 2, label: 'Moderate' },
    { v: 3, label: 'Marked, difficult to move' }, { v: 4, label: 'Extreme rigidity' } ] },
  { id: 5, label: 'Wrist Rigidity (or Fixation of Position)', options: [
    { v: 0, label: 'Normal' }, { v: 1, label: 'Slight' }, { v: 2, label: 'Moderate' },
    { v: 3, label: 'Marked' }, { v: 4, label: 'Extreme' } ] },
  { id: 6, label: 'Leg Pendulousness (Knee swing after kick)', options: [
    { v: 0, label: 'Legs swing freely' }, { v: 1, label: 'Slight diminution in swing' },
    { v: 2, label: 'Moderate resistance' }, { v: 3, label: 'Marked resistance, abrupt damping' },
    { v: 4, label: 'Legs fall as if against resistance' } ] },
  { id: 7, label: 'Head Dropping', options: [
    { v: 0, label: 'Head falls completely with audible thump' }, { v: 1, label: 'Slight slowing' },
    { v: 2, label: 'Moderate slowing' }, { v: 3, label: 'Marked slowing, but head reaches pillow' },
    { v: 4, label: 'Head does not reach pillow' } ] },
  { id: 8, label: 'Glabella Tap', options: [
    { v: 0, label: 'Blink response extinguishes after ≤ 5 taps' }, { v: 1, label: '6 blinks' },
    { v: 2, label: '7–10 blinks' }, { v: 3, label: 'Sustained blinking' }, { v: 4, label: 'Continuous blinking, unable to inhibit' } ] },
  { id: 9, label: 'Tremor', options: [
    { v: 0, label: 'Normal' }, { v: 1, label: 'Mild finger tremor, observable on close inspection' },
    { v: 2, label: 'Tremor of hand or arm occurring spasmodically' }, { v: 3, label: 'Persistent tremor of one or more limbs' },
    { v: 4, label: 'Whole-body tremor' } ] },
  { id: 10, label: 'Salivation', options: [
    { v: 0, label: 'Normal' }, { v: 1, label: 'Excess salivation visible in mouth' },
    { v: 2, label: 'Excess salivation that may cause difficulty speaking' },
    { v: 3, label: 'Speaking with difficulty due to excess salivation' },
    { v: 4, label: 'Frank drooling' } ] },
];

export const SimpsonAngusAssessment = ({ onBack }: Props) => {
  const { t } = useLanguage();
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const completed = Object.keys(responses).length;
  const progress = (completed / ITEMS.length) * 100;
  const total = useMemo(() => Object.values(responses).reduce((a, b) => a + b, 0), [responses]);
  const mean = completed > 0 ? total / ITEMS.length : 0;
  const positive = mean >= 0.3;
  const reset = () => { setResponses({}); setShowResults(false); };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button>}
          <Card className="shadow-xl"><CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md mx-auto"><Activity className="h-7 w-7" /></div>
              <h1 className="text-3xl font-bold text-slate-800">Simpson-Angus Results</h1>
              <p className="text-slate-600 text-sm">Simpson-Angus Extrapyramidal Side-Effect Scale (SAS)</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-cyan-50 border-2 border-cyan-200 text-center"><div className="text-3xl font-bold text-cyan-700">{total}<span className="text-base text-slate-500">/40</span></div><div className="text-xs text-slate-600 mt-1">Total</div></div>
              <div className={cn('p-4 rounded-xl border-2 text-center', positive ? 'bg-red-50 border-red-300' : 'bg-emerald-50 border-emerald-300')}><div className={cn('text-3xl font-bold', positive ? 'text-red-700' : 'text-emerald-700')}>{mean.toFixed(2)}</div><div className="text-xs text-slate-600 mt-1">Mean (cutoff ≥ 0.3)</div></div>
            </div>
            <div className="text-center"><Badge className={cn('text-sm', positive ? 'bg-red-100 text-red-800 border-red-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300')}>{positive ? 'Drug-induced parkinsonism likely' : 'Below threshold'}</Badge></div>
            <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-lg border">
              <strong>Interpretation:</strong> Mean score (total / 10). Cutoff ≥ 0.3 indicates clinically significant drug-induced parkinsonism. Consider dose reduction, switch to lower-EPS antipsychotic, or anticholinergic (e.g. trihexyphenidyl).
            </div>
            <div className="flex justify-center gap-3 print:hidden">
              <Button variant="outline" onClick={() => window.print()}><FileText className="mr-2 h-4 w-4" />Print</Button>
              <Button onClick={reset}><RotateCcw className="mr-2 h-4 w-4" />New Assessment</Button>
            </div>
          </CardContent></Card>
          <AssessmentReference assessmentKey="simpsonAngus" />
          {onBack && <div className="flex justify-center pb-6 print:hidden"><Button variant="outline" onClick={onBack} size="lg"><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button></div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button>}
        <PatientInfoForm />
        <Card className="shadow-xl"><CardContent className="p-6 md:p-8 space-y-4">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md"><Activity className="h-6 w-6" /></span>
            Simpson-Angus
          </h1>
          <p className="text-slate-600 text-sm">Simpson-Angus Scale (SAS) — 10-item clinician rating of antipsychotic-induced parkinsonism (gait, rigidity, tremor, salivation, glabella tap).</p>
          <div className="flex justify-between text-sm text-slate-600"><span>Progress</span><span>{completed}/{ITEMS.length}</span></div>
          <Progress value={progress} className="h-2" />
        </CardContent></Card>
        <div className="space-y-3">
          {ITEMS.map(item => (
            <Card key={item.id} className="shadow-md"><CardContent className="p-4 md:p-5 space-y-3">
              <div className="flex gap-3">
                <span className="flex-shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full bg-cyan-100 text-cyan-700 text-sm font-semibold">{item.id}</span>
                <p className="text-sm md:text-base text-slate-800 font-medium">{item.label}</p>
              </div>
              <div className="space-y-2">
                {item.options.map(opt => {
                  const selected = responses[item.id] === opt.v;
                  return (
                    <button key={opt.v} type="button" onClick={() => setResponses(p => ({ ...p, [item.id]: opt.v }))}
                      className={cn('w-full text-left text-sm px-3 py-2 rounded-md border-2 transition-all flex items-start gap-2',
                        selected ? 'bg-cyan-500 border-cyan-600 text-white shadow' : 'bg-white border-slate-200 text-slate-700 hover:border-cyan-400 hover:bg-cyan-50')}>
                      <span className="font-semibold w-6 shrink-0">{opt.v}</span><span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent></Card>
          ))}
        </div>
        <Card className="shadow-lg sticky bottom-4"><CardContent className="p-4">
          <Button onClick={() => setShowResults(true)} disabled={completed !== ITEMS.length} className="w-full" size="lg">
            Calculate Score{completed < ITEMS.length && ` (${completed}/${ITEMS.length})`}
          </Button>
        </CardContent></Card>
        <AssessmentReference assessmentKey="simpsonAngus" />
        {onBack && <div className="flex justify-center pb-6"><Button variant="outline" onClick={onBack} size="lg"><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button></div>}
      </div>
    </div>
  );
};
