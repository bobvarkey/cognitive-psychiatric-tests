import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Pill, RotateCcw, FileText } from 'lucide-react';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { AssessmentReference } from '@/components/AssessmentReference';
import { ExportButtons } from './ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';
import { cn } from '@/lib/utils';

interface Props { onBack?: () => void }

interface Opt { v: number; label: string }
interface Item { id: number; label: string; options: Opt[] }

// Wesson & Ling (2003) — Clinical Opiate Withdrawal Scale (COWS), 11 items.
const ITEMS: Item[] = [
  { id: 1, label: 'Resting Pulse Rate (bpm, after 1 min seated)', options: [
    { v: 0, label: '≤ 80' }, { v: 1, label: '81–100' }, { v: 2, label: '101–120' }, { v: 4, label: '> 120' } ] },
  { id: 2, label: 'Sweating (past ½ hour, not from room temp/activity)', options: [
    { v: 0, label: 'No chills/flushing' }, { v: 1, label: 'Subjective chills/flushing' }, { v: 2, label: 'Flushed/observable moisture on face' },
    { v: 3, label: 'Beads of sweat on brow or face' }, { v: 4, label: 'Sweat streaming off face' } ] },
  { id: 3, label: 'Restlessness (during observation)', options: [
    { v: 0, label: 'Able to sit still' }, { v: 1, label: 'Reports difficulty sitting still, but able to' },
    { v: 3, label: 'Frequent shifting / extraneous movements' }, { v: 5, label: 'Unable to sit still for more than a few seconds' } ] },
  { id: 4, label: 'Pupil Size', options: [
    { v: 0, label: 'Pinned or normal for room light' }, { v: 1, label: 'Possibly larger than normal' },
    { v: 2, label: 'Moderately dilated' }, { v: 5, label: 'So dilated only the rim of iris is visible' } ] },
  { id: 5, label: 'Bone or Joint Aches (if pre-existing, only the additional component)', options: [
    { v: 0, label: 'Not present' }, { v: 1, label: 'Mild diffuse discomfort' },
    { v: 2, label: 'Severe diffuse aching of joints/muscles' }, { v: 4, label: 'Patient rubbing joints / unable to sit still' } ] },
  { id: 6, label: 'Runny Nose or Tearing (not from cold/allergies)', options: [
    { v: 0, label: 'Not present' }, { v: 1, label: 'Nasal stuffiness or unusually moist eyes' },
    { v: 2, label: 'Nose running or tearing' }, { v: 4, label: 'Nose constantly running or tears streaming down cheeks' } ] },
  { id: 7, label: 'GI Upset (last ½ hour)', options: [
    { v: 0, label: 'No GI symptoms' }, { v: 1, label: 'Stomach cramps' }, { v: 2, label: 'Nausea or loose stool' },
    { v: 3, label: 'Vomiting or diarrhoea' }, { v: 5, label: 'Multiple episodes of diarrhoea or vomiting' } ] },
  { id: 8, label: 'Tremor (observation of outstretched hands)', options: [
    { v: 0, label: 'No tremor' }, { v: 1, label: 'Tremor can be felt but not observed' },
    { v: 2, label: 'Slight tremor observable' }, { v: 4, label: 'Gross tremor or muscle twitching' } ] },
  { id: 9, label: 'Yawning (during observation)', options: [
    { v: 0, label: 'No yawning' }, { v: 1, label: 'Yawning once or twice during assessment' },
    { v: 2, label: 'Yawning three or more times during assessment' }, { v: 4, label: 'Yawning several times per minute' } ] },
  { id: 10, label: 'Anxiety or Irritability', options: [
    { v: 0, label: 'None' }, { v: 1, label: 'Patient reports increasing irritability or anxiousness' },
    { v: 2, label: 'Patient obviously irritable or anxious' }, { v: 4, label: 'Patient so irritable that participation in assessment is difficult' } ] },
  { id: 11, label: 'Gooseflesh Skin', options: [
    { v: 0, label: 'Skin is smooth' }, { v: 3, label: 'Piloerection of skin can be felt or hairs standing up on arms' },
    { v: 5, label: 'Prominent piloerection' } ] },
];

export const CowsAssessment = ({ onBack }: Props) => {
  const { t } = useLanguage();
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const completed = Object.keys(responses).length;
  const progress = (completed / ITEMS.length) * 100;
  const total = useMemo(() => Object.values(responses).reduce((a, b) => a + b, 0), [responses]);

  const interpret = (s: number) => {
    if (s <= 4) return { label: 'No / minimal withdrawal', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (s <= 12) return { label: 'Mild withdrawal', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    if (s <= 24) return { label: 'Moderate withdrawal', color: 'bg-orange-100 text-orange-800 border-orange-300' };
    if (s <= 36) return { label: 'Moderately severe withdrawal', color: 'bg-red-100 text-red-800 border-red-300' };
    return { label: 'Severe withdrawal', color: 'bg-red-200 text-red-900 border-red-400' };
  };

  const reset = () => { setResponses({}); setShowResults(false); };

  const reportData: ReportData = {
    assessmentName: 'COWS (Clinical Opiate Withdrawal Scale)',
    date: new Date().toLocaleString(),
    totalScore: `${total}/48`,
    interpretation: interpret(total).label,
    severity: interpret(total).label,
    sections: [
      {
        title: 'Item Scores',
        items: ITEMS.map((item) => `Item ${item.id}. ${item.label}: ${responses[item.id] ?? 0}`),
        type: 'info',
      },
      {
        title: 'Cutoffs',
        items: ['5–12 mild · 13–24 moderate · 25–36 moderately severe · >36 severe'],
        type: 'info',
      },
    ],
    disclaimer: 'COWS is a clinician-rated scale; buprenorphine induction typically requires COWS ≥ 8–12 to avoid precipitated withdrawal.',
  };

  if (showResults) {
    const interp = interpret(total);
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button>}
          <Card className="shadow-xl"><CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md mx-auto"><Pill className="h-7 w-7" /></div>
              <h1 className="text-3xl font-bold text-slate-800">COWS Results</h1>
              <p className="text-slate-600 text-sm">Clinical Opiate Withdrawal Scale</p>
            </div>
            <div className="text-center space-y-3 p-6 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
              <div className="text-6xl font-bold text-slate-800">{total}<span className="text-2xl text-slate-500"> / 48</span></div>
              <Progress value={(total / 48) * 100} className="h-2" />
              <Badge className={cn('text-sm', interp.color)}>{interp.label}</Badge>
            </div>
            <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-lg border space-y-1">
              <div><strong>Cutoffs:</strong> 5–12 mild · 13–24 moderate · 25–36 moderately severe · &gt;36 severe.</div>
              <div><strong>Buprenorphine induction:</strong> Most protocols require COWS ≥ 8–12 (typically ≥ 12 for full agonists like methadone) before first dose to avoid precipitated withdrawal.</div>
            </div>
            <div className="flex justify-center gap-3 print:hidden">
              <ExportButtons data={reportData} />
              <Button variant="outline" onClick={() => window.print()}><FileText className="mr-2 h-4 w-4" />Print</Button>
              <Button onClick={reset}><RotateCcw className="mr-2 h-4 w-4" />New Assessment</Button>
            </div>
          </CardContent></Card>
          <AssessmentReference assessmentKey="cows" />
          {onBack && <div className="flex justify-center pb-6 print:hidden"><Button variant="outline" onClick={onBack} size="lg"><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button></div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button>}
        <PatientInfoForm />
        <Card className="shadow-xl"><CardContent className="p-6 md:p-8 space-y-4">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md"><Pill className="h-6 w-6" /></span>
            COWS
          </h1>
          <p className="text-slate-600 text-sm">Clinical Opiate Withdrawal Scale — 11-item clinician rating of opioid withdrawal severity. Used to guide buprenorphine induction.</p>
          <div className="flex justify-between text-sm text-slate-600"><span>Progress</span><span>{completed}/{ITEMS.length}</span></div>
          <Progress value={progress} className="h-2" />
        </CardContent></Card>
        <div className="space-y-3">
          {ITEMS.map(item => (
            <Card key={item.id} className="shadow-md"><CardContent className="p-4 md:p-5 space-y-3">
              <div className="flex gap-3">
                <span className="flex-shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">{item.id}</span>
                <p className="text-sm md:text-base text-slate-800 font-medium">{item.label}</p>
              </div>
              <div className="space-y-2">
                {item.options.map(opt => {
                  const selected = responses[item.id] === opt.v;
                  return (
                    <button key={opt.v} type="button" onClick={() => setResponses(p => ({ ...p, [item.id]: opt.v }))}
                      className={cn('w-full text-left text-sm px-3 py-2 rounded-md border-2 transition-all flex items-start gap-2',
                        selected ? 'bg-orange-500 border-orange-600 text-white shadow' : 'bg-white border-slate-200 text-slate-700 hover:border-orange-400 hover:bg-orange-50')}>
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
        <AssessmentReference assessmentKey="cows" />
        {onBack && <div className="flex justify-center pb-6"><Button variant="outline" onClick={onBack} size="lg"><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button></div>}
      </div>
    </div>
  );
};
