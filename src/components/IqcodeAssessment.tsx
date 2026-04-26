import { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Brain, RotateCcw, FileText, AlertTriangle, CheckCircle2, Save } from 'lucide-react';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { AssessmentReference } from '@/components/AssessmentReference';
import { IQCODE_ITEMS, IQCODE_OPTIONS } from '@/data/iqcodeScale';
import { cn } from '@/lib/utils';

interface IqcodeAssessmentProps {
  onBack?: () => void;
}

type Score = 1 | 2 | 3 | 4 | 5;

const STORAGE_KEY = 'cognito.iqcode.draft.v1';

interface IqcodeDraft {
  responses: Record<number, Score>;
  yearsAgo: string;
  savedAt: number;
}

const readDraft = (): IqcodeDraft | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.responses) return parsed as IqcodeDraft;
    return null;
  } catch {
    return null;
  }
};

export const IqcodeAssessment = ({ onBack }: IqcodeAssessmentProps) => {
  const { t, language } = useLanguage();
  const initialDraft = useRef<IqcodeDraft | null>(readDraft());
  const [responses, setResponses] = useState<Record<number, Score>>(() => initialDraft.current?.responses ?? {});
  const [showResults, setShowResults] = useState(false);
  const [yearsAgo, setYearsAgo] = useState(() => initialDraft.current?.yearsAgo ?? '10');
  const [savedAt, setSavedAt] = useState<number | null>(() => initialDraft.current?.savedAt ?? null);
  const [resumed, setResumed] = useState(() => !!initialDraft.current && Object.keys(initialDraft.current.responses).length > 0);

  // Auto-save draft on changes (skip when results are shown)
  useEffect(() => {
    if (showResults) return;
    const hasData = Object.keys(responses).length > 0 || yearsAgo !== '10';
    if (!hasData) return;
    const handle = setTimeout(() => {
      try {
        const draft: IqcodeDraft = { responses, yearsAgo, savedAt: Date.now() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        setSavedAt(draft.savedAt);
      } catch {
        /* ignore quota */
      }
    }, 400);
    return () => clearTimeout(handle);
  }, [responses, yearsAgo, showResults]);

  const clearDraft = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
    setSavedAt(null);
    setResumed(false);
  };

  const handleResponse = (itemId: number, score: Score) => {
    setResponses(prev => ({ ...prev, [itemId]: score }));
  };

  const completed = Object.keys(responses).length;
  const progress = (completed / IQCODE_ITEMS.length) * 100;

  const result = useMemo(() => {
    const values = Object.values(responses);
    if (values.length === 0) return { mean: 0, sum: 0, n: 0 };
    const sum = values.reduce((a, b) => a + b, 0);
    return { mean: sum / values.length, sum, n: values.length };
  }, [responses]);

  const interpretMean = (mean: number) => {
    if (mean >= 3.31) {
      return {
        en: 'Score ≥3.31 — suggests cognitive decline. Cutoffs commonly used: 3.31 (more sensitive) to 3.38 (more specific). Recommend further evaluation for dementia.',
        ml: 'സ്കോർ ≥3.31 — വൈജ്ഞാനിക തളർച്ച സൂചിപ്പിക്കുന്നു. ഡിമെൻഷ്യയ്ക്കായുള്ള കൂടുതൽ വിലയിരുത്തൽ ശുപാർശ ചെയ്യുന്നു.',
        severity: 'positive' as const,
        label: { en: 'Positive Screen', ml: 'പോസിറ്റീവ് സ്ക്രീൻ' },
      };
    }
    return {
      en: 'Score <3.31 — no significant cognitive decline reported by informant compared to baseline. Continue monitoring if clinical concerns persist.',
      ml: 'സ്കോർ <3.31 — അടിസ്ഥാന നിലയുമായി താരതമ്യം ചെയ്യുമ്പോൾ ഗണ്യമായ വൈജ്ഞാനിക തളർച്ച റിപ്പോർട്ട് ചെയ്തിട്ടില്ല.',
      severity: 'negative' as const,
      label: { en: 'Negative Screen', ml: 'നെഗറ്റീവ് സ്ക്രീൻ' },
    };
  };

  const handleSubmit = () => {
    if (completed === IQCODE_ITEMS.length) {
      setShowResults(true);
      clearDraft();
    }
  };

  const handleReset = () => {
    setResponses({});
    setShowResults(false);
    clearDraft();
  };

  if (showResults) {
    const interp = interpretMean(result.mean);
    const isPositive = interp.severity === 'positive';

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToMenu')}
            </Button>
          )}

          <Card className="shadow-xl">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md mx-auto">
                  <Brain className="h-7 w-7" />
                </div>
                <h1 className="text-3xl font-bold text-slate-800">
                  {language === 'en' ? 'Short IQCODE Results' : 'ഷോർട്ട് IQCODE ഫലങ്ങൾ'}
                </h1>
                <p className="text-slate-600 text-sm">
                  {language === 'en'
                    ? 'Informant Questionnaire on Cognitive Decline in the Elderly'
                    : 'പ്രായമായവരിലെ വൈജ്ഞാനിക തളർച്ചയ്ക്കുള്ള ഇൻഫോർമന്റ് ചോദ്യാവലി'}
                </p>
              </div>

              <div className="text-center space-y-3 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                <div className={cn(
                  'text-6xl font-bold',
                  isPositive ? 'text-red-600' : 'text-emerald-600'
                )}>
                  {result.mean.toFixed(2)}
                </div>
                <div className="text-sm text-slate-600">
                  {language === 'en' ? 'Mean score (1.0–5.0)' : 'ശരാശരി സ്കോർ (1.0–5.0)'}
                </div>
                <Progress value={((result.mean - 1) / 4) * 100} className="h-2" />
                <Badge className={cn(
                  'text-sm',
                  isPositive
                    ? 'bg-red-100 text-red-800 border-red-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                )}>
                  {language === 'en' ? interp.label.en : interp.label.ml}
                </Badge>
                <div className="text-xs text-slate-500">
                  {language === 'en'
                    ? `Total: ${result.sum} / 80 across ${result.n} items`
                    : `മൊത്തം: ${result.sum} / 80, ${result.n} ഇനങ്ങളിൽ`}
                </div>
              </div>

              <div className="p-5 rounded-lg bg-amber-50 border-2 border-amber-200">
                <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                  {isPositive ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                  {language === 'en' ? 'Clinical Interpretation' : 'ക്ലിനിക്കൽ വ്യാഖ്യാനം'}
                </h4>
                <p className="text-sm text-amber-900 leading-relaxed">
                  {language === 'en' ? interp.en : interp.ml}
                </p>
              </div>

              <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-lg border">
                <strong>{language === 'en' ? 'Note:' : 'ശ്രദ്ധിക്കുക:'}</strong>{' '}
                {language === 'en'
                  ? 'IQCODE is informant-rated, comparing the person now vs. a baseline (typically 10 years ago). It is a screening tool — not a diagnosis. Cutoffs vary by population (3.31–3.38).'
                  : 'IQCODE ഇൻഫോർമന്റ് റേറ്റിംഗാണ് — ഇത് ഒരു സ്ക്രീനിംഗ് ഉപകരണം മാത്രമാണ്, രോഗനിർണയമല്ല.'}
              </div>

              <div className="flex justify-center gap-3 print:hidden">
                <Button variant="outline" onClick={() => window.print()}>
                  <FileText className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Print' : 'പ്രിന്റ്'}
                </Button>
                <Button onClick={handleReset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'New Assessment' : 'പുതിയ വിലയിരുത്തൽ'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <AssessmentReference assessmentKey="iqcode" />

          {onBack && (
            <div className="flex justify-center pt-2 pb-6 print:hidden">
              <Button variant="outline" onClick={onBack} size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('backToMenu')}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToMenu')}
          </Button>
        )}

        {resumed && completed > 0 && (
          <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-3 flex items-center justify-between gap-3 text-sm text-blue-900">
            <div className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              <span>
                {language === 'en'
                  ? `Resumed your saved draft (${completed}/${IQCODE_ITEMS.length} answered).`
                  : `സംരക്ഷിച്ച ഡ്രാഫ്റ്റ് പുനരാരംഭിച്ചു (${completed}/${IQCODE_ITEMS.length} ഉത്തരം).`}
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { setResponses({}); setYearsAgo('10'); clearDraft(); }}
            >
              {language === 'en' ? 'Start fresh' : 'പുതുതായി തുടങ്ങുക'}
            </Button>
          </div>
        )}

        <PatientInfoForm />

        <Card className="shadow-xl">
          <CardContent className="p-6 md:p-8 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                  <Brain className="h-6 w-6" />
                </span>
                {language === 'en' ? 'Short IQCODE' : 'ഷോർട്ട് IQCODE'}
              </h1>
              <p className="text-slate-600 text-sm">
                {language === 'en'
                  ? 'Short Form of the Informant Questionnaire on Cognitive Decline in the Elderly (Jorm) — 16 items, informant-rated.'
                  : '16 ഇനങ്ങൾ, ഇൻഫോർമന്റ് റേറ്റിംഗ് — പ്രായമായവരിലെ വൈജ്ഞാനിക തളർച്ച വിലയിരുത്തൽ.'}
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-sm text-blue-900 space-y-2">
              <p>
                <strong>{language === 'en' ? 'Instructions:' : 'നിർദ്ദേശങ്ങൾ:'}</strong>{' '}
                {language === 'en'
                  ? 'Ask an informant (relative/friend) to compare the person now vs. how they were'
                  : 'ഒരു ഇൻഫോർമന്റിനോട് (ബന്ധു/സുഹൃത്ത്) വ്യക്തിയെ ഇപ്പോൾ vs. മുമ്പ് താരതമ്യം ചെയ്യാൻ ആവശ്യപ്പെടുക'}{' '}
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={yearsAgo}
                  onChange={(e) => setYearsAgo(e.target.value)}
                  className="inline-block w-16 px-2 py-0.5 mx-1 border border-blue-300 rounded text-center"
                />{' '}
                {language === 'en' ? 'years ago.' : 'വർഷം മുമ്പ്.'}
              </p>
              <p>
                {language === 'en'
                  ? 'For each situation, indicate whether the person has improved, stayed the same, or got worse.'
                  : 'ഓരോ സാഹചര്യത്തിലും, വ്യക്തി മെച്ചപ്പെട്ടോ, അതേപടി തുടരുകയാണോ, അതോ മോശമായോ എന്ന് സൂചിപ്പിക്കുക.'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm text-slate-600">
                <span>{t('progress') || 'Progress'}</span>
                <div className="flex items-center gap-3">
                  {savedAt && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                      <Save className="h-3 w-3" />
                      {language === 'en' ? 'Saved' : 'സംരക്ഷിച്ചു'} {new Date(savedAt).toLocaleTimeString()}
                    </span>
                  )}
                  <span>{completed}/{IQCODE_ITEMS.length}</span>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {IQCODE_ITEMS.map((item) => {
            const current = responses[item.id];
            return (
              <Card key={item.id} className="shadow-md">
                <CardContent className="p-4 md:p-5 space-y-3">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                      {item.id}
                    </span>
                    <p className="text-sm md:text-base text-slate-800 font-medium">
                      {language === 'en'
                        ? `Compared with ${yearsAgo || '10'} years ago, how is this person at: ${item.question}?`
                        : `${yearsAgo || '10'} വർഷം മുമ്പുമായി താരതമ്യം ചെയ്യുമ്പോൾ: ${item.questionMl}?`}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {IQCODE_OPTIONS.map((opt) => {
                      const selected = current === opt.score;
                      return (
                        <button
                          key={opt.score}
                          type="button"
                          onClick={() => handleResponse(item.id, opt.score)}
                          className={cn(
                            'text-xs px-3 py-2 rounded-md border-2 transition-all text-center',
                            selected
                              ? opt.score >= 4
                                ? 'bg-red-500 border-red-600 text-white shadow-md'
                                : opt.score === 3
                                  ? 'bg-amber-500 border-amber-600 text-white shadow-md'
                                  : 'bg-emerald-500 border-emerald-600 text-white shadow-md'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50'
                          )}
                        >
                          <div className="font-semibold">{opt.score}</div>
                          <div className="text-[11px] mt-0.5 leading-tight">
                            {language === 'en' ? opt.label : opt.labelMl}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="shadow-lg sticky bottom-4">
          <CardContent className="p-4">
            <Button
              onClick={handleSubmit}
              disabled={completed !== IQCODE_ITEMS.length}
              className="w-full"
              size="lg"
            >
              {language === 'en' ? 'Calculate Score' : 'സ്കോർ കണക്കാക്കുക'}
              {completed < IQCODE_ITEMS.length && ` (${completed}/${IQCODE_ITEMS.length})`}
            </Button>
          </CardContent>
        </Card>

        <AssessmentReference assessmentKey="iqcode" />

        {onBack && (
          <div className="flex justify-center pt-2 pb-6">
            <Button variant="outline" onClick={onBack} size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToMenu')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
