import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Frown, RotateCcw, FileText } from 'lucide-react';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { AssessmentReference } from '@/components/AssessmentReference';
import { cn } from '@/lib/utils';

interface Props { onBack?: () => void }

// BDI-II — 21 items, each scored 0-3. (Beck, Steer, Brown 1996.)
// Item options abbreviated to scoring anchors (0-3).
const BDI_ITEMS: { id: number; label: string; options: string[] }[] = [
  { id: 1, label: 'Sadness', options: ['I do not feel sad.', 'I feel sad much of the time.', 'I am sad all the time.', 'I am so sad or unhappy that I can\'t stand it.'] },
  { id: 2, label: 'Pessimism', options: ['I am not discouraged about my future.', 'I feel more discouraged about my future than I used to be.', 'I do not expect things to work out for me.', 'I feel my future is hopeless and will only get worse.'] },
  { id: 3, label: 'Past Failure', options: ['I do not feel like a failure.', 'I have failed more than I should have.', 'As I look back, I see a lot of failures.', 'I feel I am a total failure as a person.'] },
  { id: 4, label: 'Loss of Pleasure', options: ['I get as much pleasure as I ever did from things I enjoy.', 'I don\'t enjoy things as much as I used to.', 'I get very little pleasure from the things I used to enjoy.', 'I can\'t get any pleasure from the things I used to enjoy.'] },
  { id: 5, label: 'Guilty Feelings', options: ['I don\'t feel particularly guilty.', 'I feel guilty over many things I have done or should have done.', 'I feel quite guilty most of the time.', 'I feel guilty all of the time.'] },
  { id: 6, label: 'Punishment Feelings', options: ['I don\'t feel I am being punished.', 'I feel I may be punished.', 'I expect to be punished.', 'I feel I am being punished.'] },
  { id: 7, label: 'Self-Dislike', options: ['I feel the same about myself as ever.', 'I have lost confidence in myself.', 'I am disappointed in myself.', 'I dislike myself.'] },
  { id: 8, label: 'Self-Criticalness', options: ['I don\'t criticize or blame myself more than usual.', 'I am more critical of myself than I used to be.', 'I criticize myself for all of my faults.', 'I blame myself for everything bad that happens.'] },
  { id: 9, label: 'Suicidal Thoughts/Wishes', options: ['I don\'t have any thoughts of killing myself.', 'I have thoughts of killing myself, but I would not carry them out.', 'I would like to kill myself.', 'I would kill myself if I had the chance.'] },
  { id: 10, label: 'Crying', options: ['I don\'t cry any more than I used to.', 'I cry more than I used to.', 'I cry over every little thing.', 'I feel like crying, but I can\'t.'] },
  { id: 11, label: 'Agitation', options: ['I am no more restless or wound up than usual.', 'I feel more restless or wound up than usual.', 'I am so restless or agitated that it\'s hard to stay still.', 'I am so restless or agitated that I have to keep moving or doing something.'] },
  { id: 12, label: 'Loss of Interest', options: ['I have not lost interest in other people or activities.', 'I am less interested in other people or things than before.', 'I have lost most of my interest in other people or things.', 'It\'s hard to get interested in anything.'] },
  { id: 13, label: 'Indecisiveness', options: ['I make decisions about as well as ever.', 'I find it more difficult to make decisions than usual.', 'I have much greater difficulty in making decisions than I used to.', 'I have trouble making any decisions.'] },
  { id: 14, label: 'Worthlessness', options: ['I do not feel I am worthless.', 'I don\'t consider myself as worthwhile and useful as I used to.', 'I feel more worthless as compared to other people.', 'I feel utterly worthless.'] },
  { id: 15, label: 'Loss of Energy', options: ['I have as much energy as ever.', 'I have less energy than I used to have.', 'I don\'t have enough energy to do very much.', 'I don\'t have enough energy to do anything.'] },
  { id: 16, label: 'Changes in Sleeping Pattern', options: ['I have not experienced any change in my sleeping pattern.', 'I sleep somewhat more / less than usual.', 'I sleep a lot more / less than usual.', 'I sleep most of the day / wake 1–2 hrs early and can\'t get back to sleep.'] },
  { id: 17, label: 'Irritability', options: ['I am no more irritable than usual.', 'I am more irritable than usual.', 'I am much more irritable than usual.', 'I am irritable all the time.'] },
  { id: 18, label: 'Changes in Appetite', options: ['I have not experienced any change in my appetite.', 'My appetite is somewhat less / greater than usual.', 'My appetite is much less / greater than before.', 'I have no appetite at all / crave food all the time.'] },
  { id: 19, label: 'Concentration Difficulty', options: ['I can concentrate as well as ever.', 'I can\'t concentrate as well as usual.', 'It\'s hard to keep my mind on anything for very long.', 'I find I can\'t concentrate on anything.'] },
  { id: 20, label: 'Tiredness or Fatigue', options: ['I am no more tired or fatigued than usual.', 'I get more tired or fatigued more easily than usual.', 'I am too tired or fatigued to do a lot of the things I used to do.', 'I am too tired or fatigued to do most of the things I used to do.'] },
  { id: 21, label: 'Loss of Interest in Sex', options: ['I have not noticed any recent change in my interest in sex.', 'I am less interested in sex than I used to be.', 'I am much less interested in sex now.', 'I have lost interest in sex completely.'] },
];

export const BdiAssessment = ({ onBack }: Props) => {
  const { t, language: _language } = useLanguage();
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const completed = Object.keys(responses).length;
  const progress = (completed / BDI_ITEMS.length) * 100;
  const total = useMemo(() => Object.values(responses).reduce((a, b) => a + b, 0), [responses]);

  const interpret = (s: number) => {
    if (s <= 13) return { label: 'Minimal depression', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (s <= 19) return { label: 'Mild depression', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    if (s <= 28) return { label: 'Moderate depression', color: 'bg-orange-100 text-orange-800 border-orange-300' };
    return { label: 'Severe depression', color: 'bg-red-100 text-red-800 border-red-300' };
  };

  const reset = () => { setResponses({}); setShowResults(false); };

  if (showResults) {
    const interp = interpret(total);
    const item9 = responses[9] ?? 0;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button>}
          <Card className="shadow-xl"><CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md mx-auto"><Frown className="h-7 w-7" /></div>
              <h1 className="text-3xl font-bold text-slate-800">BDI-II Results</h1>
              <p className="text-slate-600 text-sm">Beck Depression Inventory — Second Edition</p>
            </div>
            <div className="text-center space-y-3 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="text-6xl font-bold text-slate-800">{total}<span className="text-2xl text-slate-500"> / 63</span></div>
              <Progress value={(total / 63) * 100} className="h-2" />
              <Badge className={cn('text-sm', interp.color)}>{interp.label}</Badge>
            </div>
            {item9 >= 1 && (
              <div className="p-4 rounded-lg bg-red-50 border-2 border-red-300 text-sm text-red-900">
                <strong>⚠️ Suicidality flag:</strong> Item 9 scored {item9}. Conduct a focused suicide risk assessment and ensure safety planning.
              </div>
            )}
            <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-lg border">
              <strong>Cutoffs:</strong> 0–13 minimal · 14–19 mild · 20–28 moderate · 29–63 severe. The BDI-II is a screening tool, not diagnostic.
            </div>
            <div className="flex justify-center gap-3 print:hidden">
              <Button variant="outline" onClick={() => window.print()}><FileText className="mr-2 h-4 w-4" />Print</Button>
              <Button onClick={reset}><RotateCcw className="mr-2 h-4 w-4" />New Assessment</Button>
            </div>
          </CardContent></Card>
          <AssessmentReference assessmentKey="bdi" />
          {onBack && <div className="flex justify-center pb-6 print:hidden"><Button variant="outline" onClick={onBack} size="lg"><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button></div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button>}
        <PatientInfoForm />
        <Card className="shadow-xl"><CardContent className="p-6 md:p-8 space-y-4">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md"><Frown className="h-6 w-6" /></span>
            BDI-II
          </h1>
          <p className="text-slate-600 text-sm">Beck Depression Inventory–II — 21 items rating depressive symptoms over the past two weeks (including today).</p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-sm text-blue-900">
            For each group, pick the statement that best describes how you have felt during the past two weeks, including today.
          </div>
          <div className="flex justify-between text-sm text-slate-600"><span>Progress</span><span>{completed}/{BDI_ITEMS.length}</span></div>
          <Progress value={progress} className="h-2" />
        </CardContent></Card>
        <div className="space-y-3">
          {BDI_ITEMS.map((item) => (
            <Card key={item.id} className="shadow-md"><CardContent className="p-4 md:p-5 space-y-3">
              <div className="flex gap-3">
                <span className="flex-shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">{item.id}</span>
                <p className="text-sm md:text-base text-slate-800 font-semibold">{item.label}</p>
              </div>
              <div className="space-y-2">
                {item.options.map((opt, idx) => {
                  const selected = responses[item.id] === idx;
                  return (
                    <button key={idx} type="button" onClick={() => setResponses(p => ({ ...p, [item.id]: idx }))}
                      className={cn('w-full text-left text-sm px-3 py-2 rounded-md border-2 transition-all flex items-start gap-2',
                        selected ? 'bg-blue-500 border-blue-600 text-white shadow' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50')}>
                      <span className="font-semibold w-5 shrink-0">{idx}</span><span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent></Card>
          ))}
        </div>
        <Card className="shadow-lg sticky bottom-4"><CardContent className="p-4">
          <Button onClick={() => setShowResults(true)} disabled={completed !== BDI_ITEMS.length} className="w-full" size="lg">
            Calculate Score{completed < BDI_ITEMS.length && ` (${completed}/${BDI_ITEMS.length})`}
          </Button>
        </CardContent></Card>
        <AssessmentReference assessmentKey="bdi" />
        {onBack && <div className="flex justify-center pb-6"><Button variant="outline" onClick={onBack} size="lg"><ArrowLeft className="mr-2 h-4 w-4" />{t('backToMenu')}</Button></div>}
      </div>
    </div>
  );
};
