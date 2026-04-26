import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, FlaskConical, RotateCcw, FileText } from 'lucide-react';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { AssessmentReference } from '@/components/AssessmentReference';
import { cn } from '@/lib/utils';

interface Props { onBack?: () => void }

const ITEMS = [
  { id: 1, letter: 'C', text: 'Have you ever felt you should Cut down on your drinking?' },
  { id: 2, letter: 'A', text: 'Have people Annoyed you by criticizing your drinking?' },
  { id: 3, letter: 'G', text: 'Have you ever felt bad or Guilty about your drinking?' },
  { id: 4, letter: 'E', text: 'Have you ever had a drink first thing in the morning to steady your nerves or get rid of a hangover (Eye-opener)?' },
];

export const CageAssessment = ({ onBack }: Props) => {
  const { t } = useLanguage();
  const [responses, setResponses] = useState<Record<number, boolean>>({});
  const [showResults, setShowResults] = useState(false);

  const completed = Object.keys(responses).length;
  const score = Object.values(responses).filter(Boolean).length;
  const positive = score >= 2;
  const reset = () => { setResponses({}); setShowResults(false); };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button>}
          <Card className="shadow-xl"><CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md mx-auto"><FlaskConical className="h-7 w-7" /></div>
              <h1 className="text-3xl font-bold text-slate-800">CAGE Results</h1>
            </div>
            <div className="text-center space-y-3 p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
              <div className={cn('text-6xl font-bold', positive ? 'text-red-600' : 'text-emerald-600')}>{score}<span className="text-2xl text-slate-500"> / 4</span></div>
              <Badge className={cn('text-sm', positive ? 'bg-red-100 text-red-800 border-red-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300')}>
                {positive ? 'Positive screen' : 'Negative screen'}
              </Badge>
            </div>
            <div className="text-sm text-slate-700 bg-amber-50 p-4 rounded-lg border border-amber-200">
              <strong>Interpretation:</strong> A score of <strong>≥ 2</strong> is clinically significant and warrants further evaluation for an alcohol use disorder. Even one positive answer should prompt discussion.
            </div>
            <div className="flex justify-center gap-3 print:hidden">
              <Button variant="outline" onClick={() => window.print()}><FileText className="mr-2 h-4 w-4" />Print</Button>
              <Button onClick={reset}><RotateCcw className="mr-2 h-4 w-4" />New Assessment</Button>
            </div>
          </CardContent></Card>
          <AssessmentReference assessmentKey="cage" />
          {onBack && <div className="flex justify-center pb-6 print:hidden"><Button variant="outline" onClick={onBack} size="lg"><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button></div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button>}
        <PatientInfoForm />
        <Card className="shadow-xl"><CardContent className="p-6 md:p-8 space-y-4">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md"><FlaskConical className="h-6 w-6" /></span>
            CAGE
          </h1>
          <p className="text-slate-600 text-sm">CAGE — 4-item alcohol use disorder screen (Ewing 1984). Score ≥ 2 = clinically significant.</p>
        </CardContent></Card>
        <div className="space-y-3">
          {ITEMS.map(item => {
            const ans = responses[item.id];
            return (
              <Card key={item.id} className="shadow-md"><CardContent className="p-4 md:p-5 space-y-3">
                <div className="flex gap-3 items-start">
                  <span className="flex-shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-700 text-base font-bold">{item.letter}</span>
                  <p className="flex-1 text-sm md:text-base text-slate-800">{item.text}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[true, false].map(v => (
                    <button key={String(v)} type="button" onClick={() => setResponses(p => ({ ...p, [item.id]: v }))}
                      className={cn('text-sm font-semibold px-3 py-2 rounded-md border-2 transition-all',
                        ans === v ? (v ? 'bg-red-500 border-red-600 text-white' : 'bg-emerald-500 border-emerald-600 text-white')
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-amber-400')}>
                      {v ? 'Yes' : 'No'}
                    </button>
                  ))}
                </div>
              </CardContent></Card>
            );
          })}
        </div>
        <Card className="shadow-lg"><CardContent className="p-4">
          <Button onClick={() => setShowResults(true)} disabled={completed !== ITEMS.length} className="w-full" size="lg">
            See Result{completed < ITEMS.length && ` (${completed}/${ITEMS.length})`}
          </Button>
        </CardContent></Card>
        <AssessmentReference assessmentKey="cage" />
        {onBack && <div className="flex justify-center pb-6"><Button variant="outline" onClick={onBack} size="lg"><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button></div>}
      </div>
    </div>
  );
};
