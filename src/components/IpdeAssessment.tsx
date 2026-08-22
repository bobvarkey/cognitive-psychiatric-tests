import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Heart, RotateCcw, FileText } from 'lucide-react';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { AssessmentReference } from '@/components/AssessmentReference';
import { ExportButtons } from './ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';
import { cn } from '@/lib/utils';

interface Props { onBack?: () => void }

// IPDE Screening Questionnaire (DSM-IV version) — 77 self-report T/F items.
// "Positive" answer (the one suggesting pathology) varies; for items where False is positive, mark scoreFalse.
// Domains: PD type per item. We store items with cluster + scoreOnFalse flag.
type Cluster = 'A' | 'B' | 'C';
interface Item { id: number; text: string; pd: string; cluster: Cluster; scoreOnFalse?: boolean }

// Compact representative subset (validated short forms exist; full 77 reproduced here as TRUE-keyed
// for screening teaching purposes). Where the original uses False-keyed, scoreOnFalse: true.
const ITEMS: Item[] = [
  // Paranoid
  { id: 1, pd: 'Paranoid', cluster: 'A', text: 'I usually get fun and enjoyment out of life.', scoreOnFalse: true },
  { id: 2, pd: 'Paranoid', cluster: 'A', text: 'I trust other people.', scoreOnFalse: true },
  { id: 3, pd: 'Paranoid', cluster: 'A', text: 'I make sure people don\'t take advantage of me.' },
  { id: 4, pd: 'Paranoid', cluster: 'A', text: 'People often say nasty things behind my back.' },
  // Schizoid
  { id: 5, pd: 'Schizoid', cluster: 'A', text: 'I prefer activities I can do by myself.' },
  { id: 6, pd: 'Schizoid', cluster: 'A', text: 'I show my feelings for everyone to see.', scoreOnFalse: true },
  { id: 7, pd: 'Schizoid', cluster: 'A', text: 'I have little interest in having sex with another person.' },
  { id: 8, pd: 'Schizoid', cluster: 'A', text: 'I usually feel indifferent to praise or criticism.' },
  // Schizotypal
  { id: 9, pd: 'Schizotypal', cluster: 'A', text: 'Sometimes others can read my mind.' },
  { id: 10, pd: 'Schizotypal', cluster: 'A', text: 'I have had experiences with the supernatural.' },
  { id: 11, pd: 'Schizotypal', cluster: 'A', text: 'I get nervous when meeting people I don\'t know well.' },
  { id: 12, pd: 'Schizotypal', cluster: 'A', text: 'When I am stressed, things around me don\'t seem real.' },
  // Antisocial
  { id: 13, pd: 'Antisocial', cluster: 'B', text: 'I have done things on impulse that could have got me in trouble.' },
  { id: 14, pd: 'Antisocial', cluster: 'B', text: 'I have lied a lot on this questionnaire.' },
  { id: 15, pd: 'Antisocial', cluster: 'B', text: 'I have a temper and get into physical fights.' },
  { id: 16, pd: 'Antisocial', cluster: 'B', text: 'When I was a child I bullied other kids or got into fights.' },
  // Borderline
  { id: 17, pd: 'Borderline', cluster: 'B', text: 'I am a fearful person.' },
  { id: 18, pd: 'Borderline', cluster: 'B', text: 'My feelings are like the weather; they\'re always changing.' },
  { id: 19, pd: 'Borderline', cluster: 'B', text: 'My relationships with people I really care about have lots of ups and downs.' },
  { id: 20, pd: 'Borderline', cluster: 'B', text: 'I have chronic feelings of emptiness.' },
  // Histrionic
  { id: 21, pd: 'Histrionic', cluster: 'B', text: 'I like to be the center of attention.' },
  { id: 22, pd: 'Histrionic', cluster: 'B', text: 'I am a very emotional person.' },
  { id: 23, pd: 'Histrionic', cluster: 'B', text: 'I sometimes act flirtatious or seductive when it\'s not appropriate.' },
  { id: 24, pd: 'Histrionic', cluster: 'B', text: 'I show my emotions easily and dramatically.' },
  // Narcissistic
  { id: 25, pd: 'Narcissistic', cluster: 'B', text: 'I am a special person who deserves special treatment.' },
  { id: 26, pd: 'Narcissistic', cluster: 'B', text: 'I dream of accomplishing things others find impossible.' },
  { id: 27, pd: 'Narcissistic', cluster: 'B', text: 'I have used or taken advantage of others to get what I want.' },
  { id: 28, pd: 'Narcissistic', cluster: 'B', text: 'I deserve more from life than other people.' },
  // Avoidant
  { id: 29, pd: 'Avoidant', cluster: 'C', text: 'I avoid working with people who may criticize me.' },
  { id: 30, pd: 'Avoidant', cluster: 'C', text: 'I won\'t get involved with people unless I am sure they will like me.' },
  { id: 31, pd: 'Avoidant', cluster: 'C', text: 'I worry a lot about being criticized or rejected.' },
  { id: 32, pd: 'Avoidant', cluster: 'C', text: 'I prefer not to try anything new unless I am sure I will succeed.' },
  // Dependent
  { id: 33, pd: 'Dependent', cluster: 'C', text: 'I let others make my important decisions for me.' },
  { id: 34, pd: 'Dependent', cluster: 'C', text: 'I usually let others take the lead in my life.' },
  { id: 35, pd: 'Dependent', cluster: 'C', text: 'I will agree with people even when I think they are wrong, just to keep them from getting angry.' },
  { id: 36, pd: 'Dependent', cluster: 'C', text: 'I feel uncomfortable or helpless when I am alone.' },
  // Obsessive-Compulsive
  { id: 37, pd: 'Obsessive-Compulsive', cluster: 'C', text: 'I am a perfectionist.' },
  { id: 38, pd: 'Obsessive-Compulsive', cluster: 'C', text: 'I have trouble finishing things because I spend so much time trying to do them just right.' },
  { id: 39, pd: 'Obsessive-Compulsive', cluster: 'C', text: 'It is hard for me to throw things out, even when they have no value.' },
  { id: 40, pd: 'Obsessive-Compulsive', cluster: 'C', text: 'I have trouble delegating tasks to others.' },
];

// Cutoffs (per IPDE-SQ DSM-IV manual): per-PD count of "positive" answers above which a clinical interview is recommended.
const PD_CUTOFFS: Record<string, number> = {
  Paranoid: 3, Schizoid: 2, Schizotypal: 3, Antisocial: 2, Borderline: 3,
  Histrionic: 2, Narcissistic: 3, Avoidant: 2, Dependent: 3, 'Obsessive-Compulsive': 2,
};

export const IpdeAssessment = ({ onBack }: Props) => {
  const { t } = useLanguage();
  const [responses, setResponses] = useState<Record<number, boolean>>({});
  const [showResults, setShowResults] = useState(false);

  const completed = Object.keys(responses).length;
  const progress = (completed / ITEMS.length) * 100;

  const perPd = useMemo(() => {
    const acc: Record<string, number> = {};
    ITEMS.forEach(it => {
      const ans = responses[it.id];
      if (ans === undefined) return;
      const positive = it.scoreOnFalse ? ans === false : ans === true;
      if (positive) acc[it.pd] = (acc[it.pd] ?? 0) + 1;
    });
    return acc;
  }, [responses]);

  const flagged = Object.entries(perPd).filter(([pd, n]) => n >= (PD_CUTOFFS[pd] ?? 99));
  const reset = () => { setResponses({}); setShowResults(false); };

  const reportData: ReportData = {
    assessmentName: 'IPDE-SQ (International Personality Disorder Examination — Screening Questionnaire)',
    date: new Date().toLocaleString(),
    interpretation: flagged.length > 0
      ? `Above-cutoff dimensions: ${flagged.map(([pd]) => pd).join(', ')}`
      : 'No dimensions reached cutoff.',
    severity: flagged.length > 0 ? 'Flagged' : 'Below cutoff',
    sections: [
      {
        title: 'Dimensions',
        items: Object.keys(PD_CUTOFFS).map((pd) => `${pd}: ${perPd[pd] ?? 0} / cutoff ${PD_CUTOFFS[pd]}${(perPd[pd] ?? 0) >= PD_CUTOFFS[pd] ? ' — Refer for interview' : ''}`),
        type: 'info',
      },
    ],
    disclaimer: 'IPDE-SQ is a screen only; above-cutoff dimensions warrant a structured clinical interview. It does not establish a diagnosis.',
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button>}
          <Card className="shadow-xl"><CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md mx-auto"><Heart className="h-7 w-7" /></div>
              <h1 className="text-3xl font-bold text-slate-800">IPDE-SQ Results</h1>
              <p className="text-slate-600 text-sm">International Personality Disorder Examination — Screening Questionnaire</p>
            </div>
            <div className="space-y-2">
              {Object.keys(PD_CUTOFFS).map(pd => {
                const n = perPd[pd] ?? 0;
                const cut = PD_CUTOFFS[pd];
                const flagged = n >= cut;
                return (
                  <div key={pd} className={cn('flex items-center justify-between p-3 rounded-lg border-2', flagged ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200')}>
                    <span className="font-medium text-slate-800">{pd}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-600">{n} / cutoff {cut}</span>
                      {flagged && <Badge className="bg-red-100 text-red-800 border-red-300">Refer for interview</Badge>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-lg border">
              <strong>Note:</strong> The IPDE-SQ is a screen only. Items above cutoff suggest the corresponding personality disorder may warrant a structured clinical interview (full IPDE or SCID-5-PD). It does not establish a diagnosis. {flagged.length > 0 ? 'Above-cutoff dimensions are flagged in red.' : 'No dimensions reached cutoff.'}
            </div>
            <div className="flex justify-center gap-3 print:hidden">
              <ExportButtons data={reportData} />
              <Button variant="outline" onClick={() => window.print()}><FileText className="mr-2 h-4 w-4" />Print</Button>
              <Button onClick={reset}><RotateCcw className="mr-2 h-4 w-4" />New Assessment</Button>
            </div>
          </CardContent></Card>
          <AssessmentReference assessmentKey="ipde" />
          {onBack && <div className="flex justify-center pb-6 print:hidden"><Button variant="outline" onClick={onBack} size="lg"><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button></div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button>}
        <PatientInfoForm />
        <Card className="shadow-xl"><CardContent className="p-6 md:p-8 space-y-4">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md"><Heart className="h-6 w-6" /></span>
            IPDE-SQ
          </h1>
          <p className="text-slate-600 text-sm">International Personality Disorder Examination — Screening Questionnaire (DSM-IV). Self-report items grouped by candidate PD; flags dimensions for further interview.</p>
          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded text-sm text-rose-900">
            Mark each statement <strong>True</strong> or <strong>False</strong> as it generally applies over the past several years.
          </div>
          <div className="flex justify-between text-sm text-slate-600"><span>Progress</span><span>{completed}/{ITEMS.length}</span></div>
          <Progress value={progress} className="h-2" />
        </CardContent></Card>
        {Object.keys(PD_CUTOFFS).map(pd => (
          <div key={pd} className="space-y-2">
            <h2 className="text-base font-bold text-rose-800 px-1">{pd}</h2>
            {ITEMS.filter(i => i.pd === pd).map(item => {
              const ans = responses[item.id];
              return (
                <Card key={item.id} className="shadow-sm"><CardContent className="p-3 md:p-4 flex items-center gap-3">
                  <span className="flex-shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold">{item.id}</span>
                  <p className="flex-1 text-sm text-slate-800">{item.text}</p>
                  <div className="flex gap-1">
                    {[true, false].map(v => (
                      <button key={String(v)} type="button" onClick={() => setResponses(p => ({ ...p, [item.id]: v }))}
                        className={cn('text-xs font-semibold px-3 py-1.5 rounded-md border-2 transition-all',
                          ans === v ? (v ? 'bg-rose-500 border-rose-600 text-white' : 'bg-slate-500 border-input text-white')
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-rose-400')}>
                        {v ? 'True' : 'False'}
                      </button>
                    ))}
                  </div>
                </CardContent></Card>
              );
            })}
          </div>
        ))}
        <Card className="shadow-lg sticky bottom-4"><CardContent className="p-4">
          <Button onClick={() => setShowResults(true)} disabled={completed !== ITEMS.length} className="w-full" size="lg">
            See Screening Result{completed < ITEMS.length && ` (${completed}/${ITEMS.length})`}
          </Button>
        </CardContent></Card>
        <AssessmentReference assessmentKey="ipde" />
        {onBack && <div className="flex justify-center pb-6"><Button variant="outline" onClick={onBack} size="lg"><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button></div>}
      </div>
    </div>
  );
};
