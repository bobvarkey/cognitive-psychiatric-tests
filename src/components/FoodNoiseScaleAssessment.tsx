import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, RotateCcw, Copy, Check, Info, Utensils, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import {
  FOOD_NOISE_SCALE,
  FNQ_ITEM_IDS,
  findInterpretationBand,
  calculateTotalScore,
  isComplete,
  calculateDomainScore,
  calculateComparison,
  type FnqItemId,
} from '@/data/foodNoiseScale';

interface FoodNoiseScaleAssessmentProps {
  onBack: () => void;
}

export default function FoodNoiseScaleAssessment({ onBack }: FoodNoiseScaleAssessmentProps) {
  const { isMl } = useLanguage();
  const [mode, setMode] = useState<'baseline' | 'followup'>('baseline');
  const [baselineResponses, setBaselineResponses] = useState<Record<FnqItemId, number | null>>({
    fnq1: null, fnq2: null, fnq3: null, fnq4: null, fnq5: null,
  });
  const [followupResponses, setFollowupResponses] = useState<Record<FnqItemId, number | null>>({
    fnq1: null, fnq2: null, fnq3: null, fnq4: null, fnq5: null,
  });
  const [copied, setCopied] = useState(false);
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');

  const activeResponses = mode === 'baseline' ? baselineResponses : followupResponses;
  const setActiveResponses = mode === 'baseline' ? setBaselineResponses : setFollowupResponses;

  const handleResponse = (itemId: FnqItemId, value: number) => {
    setActiveResponses((prev) => ({ ...prev, [itemId]: value }));
  };

  const reset = () => {
    const empty = { fnq1: null, fnq2: null, fnq3: null, fnq4: null, fnq5: null };
    setBaselineResponses(empty);
    setFollowupResponses(empty);
    setTreatment('');
    setNotes('');
    setMode('baseline');
  };

  const baselineScore = useMemo(() => calculateTotalScore(baselineResponses), [baselineResponses]);
  const followupScore = useMemo(() => calculateTotalScore(followupResponses), [followupResponses]);
  const baselineComplete = useMemo(() => isComplete(baselineResponses), [baselineResponses]);
  const followupComplete = useMemo(() => isComplete(followupResponses), [followupResponses]);

  const baselineBand = useMemo(() => findInterpretationBand(baselineScore), [baselineScore]);
  const followupBand = useMemo(() => findInterpretationBand(followupScore), [followupScore]);

  const comparison = useMemo(() => {
    if (!baselineComplete || !followupComplete) return null;
    return calculateComparison(baselineScore, followupScore);
  }, [baselineComplete, followupComplete, baselineScore, followupScore]);

  const currentScore = mode === 'baseline' ? baselineScore : followupScore;
  const currentBand = mode === 'baseline' ? baselineBand : followupBand;
  const currentComplete = mode === 'baseline' ? baselineComplete : followupComplete;

  const severityColor = (level: number) => {
    const colors = [
      'bg-emerald-500',
      'bg-lime-500',
      'bg-yellow-500',
      'bg-orange-500',
      'bg-rose-500',
    ];
    return colors[level] || 'bg-slate-500';
  };

  const summaryText = useMemo(() => {
    if (mode === 'baseline' || !baselineComplete || !followupComplete || !comparison) {
      return `FNQ-5 ${mode === 'baseline' ? 'baseline' : 'follow-up'} score: ${currentScore}/20 (${currentBand?.label ?? ''} food-noise burden). ${FOOD_NOISE_SCALE.interpretation.higherScoreMeaning}`;
    }
    if (comparison.percentageReduction === null) {
      return `Baseline FNQ-5 was 0/20. Follow-up score is ${followupScore}/20. Percentage reduction cannot be calculated because the baseline score was zero.`;
    }
    if (comparison.absoluteChange > 0) {
      return `FNQ-5 increased from ${baselineScore}/20 at baseline to ${followupScore}/20 at follow-up, an increase of ${Math.abs(comparison.absoluteChange)} points. Food-noise burden has increased compared with baseline.`;
    }
    return `FNQ-5 decreased from ${baselineScore}/20 at baseline to ${followupScore}/20 at follow-up, an absolute reduction of ${comparison.absoluteReduction} points and a ${comparison.percentageReduction}% reduction from baseline. This represents ${comparison.responseCategory?.label ?? ''} using descriptive longitudinal response categories.`;
  }, [mode, baselineComplete, followupComplete, comparison, currentScore, currentBand, baselineScore, followupScore]);

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {isMl ? 'തിരികെ' : 'Back'}
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={reset} className="gap-1">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            <Button variant="outline" size="sm" onClick={copySummary} className="gap-1">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy summary'}
            </Button>
          </div>
        </div>

        <PatientInfoForm />

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-md">
                <Utensils className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-2xl md:text-3xl">{FOOD_NOISE_SCALE.app.name}</CardTitle>
                <CardDescription className="mt-1 text-base break-words">
                  {FOOD_NOISE_SCALE.app.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{FOOD_NOISE_SCALE.app.clinicalNote}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assessment mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {FOOD_NOISE_SCALE.assessmentModes.map((m) => (
                <Button
                  key={m.id}
                  variant={mode === (m.id as 'baseline' | 'followup') ? 'default' : 'outline'}
                  onClick={() => setMode(m.id as 'baseline' | 'followup')}
                >
                  {m.label}
                </Button>
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {FOOD_NOISE_SCALE.assessmentModes.find((m) => m.id === mode)?.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{FOOD_NOISE_SCALE.questionnaire.name}</CardTitle>
            <CardDescription>
              {FOOD_NOISE_SCALE.questionnaire.timeframe} · {FOOD_NOISE_SCALE.questionnaire.instructions}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {FOOD_NOISE_SCALE.questionnaire.items.map((item) => (
              <div key={item.id} className="space-y-3">
                <p className="font-medium">
                  {item.order}. {item.text}
                </p>
                <RadioGroup
                  value={activeResponses[item.id as FnqItemId] !== null ? String(activeResponses[item.id as FnqItemId]) : undefined}
                  onValueChange={(val) => handleResponse(item.id as FnqItemId, Number(val))}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-2"
                >
                  {FOOD_NOISE_SCALE.questionnaire.responseOptions.map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(opt.value)} id={`${item.id}-${opt.value}`} />
                      <Label htmlFor={`${item.id}-${opt.value}`} className="text-sm font-normal">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </CardContent>
        </Card>

        {mode === 'followup' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Follow-up details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="treatment" className="text-sm">Treatment / intervention</Label>
                <input
                  id="treatment"
                  type="text"
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  placeholder="e.g. semaglutide, tirzepatide, behavioural intervention"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="notes" className="text-sm">Notes</Label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[60px]"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold">{currentScore}</span>
              <span className="text-xl text-muted-foreground">/ {FOOD_NOISE_SCALE.scoring.maximumScore}</span>
              {currentComplete && currentBand && (
                <Badge className={cn('text-white', severityColor(currentBand.severityLevel))}>
                  {currentBand.label}
                </Badge>
              )}
            </div>

            {!currentComplete && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                {FOOD_NOISE_SCALE.scoring.missingDataPolicy.message}
              </p>
            )}

            {currentComplete && currentBand && (
              <p className="text-sm text-muted-foreground">{currentBand.summary}</p>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium">Domain scores</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FOOD_NOISE_SCALE.domainAnalysis.domains.map((domain) => {
                  const score = calculateDomainScore(
                    mode === 'baseline' ? baselineResponses : followupResponses,
                    domain.id
                  );
                  return (
                    <div key={domain.id} className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">{domain.label}</p>
                      <p className="text-lg font-semibold">
                        {score} <span className="text-sm font-normal text-muted-foreground">/ {domain.scoreRange.split('-')[1]}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {comparison && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {comparison.absoluteReduction > 0 ? <TrendingDown className="h-5 w-5 text-emerald-500" /> : comparison.absoluteReduction < 0 ? <TrendingUp className="h-5 w-5 text-rose-500" /> : <Minus className="h-5 w-5" />}
                Baseline vs follow-up
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Baseline</p>
                  <p className="text-lg font-semibold">{baselineScore} / 20</p>
                  <p className="text-xs text-muted-foreground">{baselineBand?.label}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Follow-up</p>
                  <p className="text-lg font-semibold">{followupScore} / 20</p>
                  <p className="text-xs text-muted-foreground">{followupBand?.label}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Absolute reduction</p>
                  <p className={cn('text-lg font-semibold', comparison.absoluteReduction >= 0 ? 'text-emerald-600' : 'text-rose-600')}>
                    {comparison.absoluteReduction}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">% reduction</p>
                  <p className="text-lg font-semibold">
                    {comparison.percentageReductionDisplay}
                  </p>
                </div>
              </div>

              {comparison.responseCategory && (
                <div className={cn(
                  'rounded-lg border p-3',
                  comparison.absoluteReduction >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900' : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
                )}>
                  <p className="font-semibold">{comparison.responseCategory.label}</p>
                  <p className="text-sm">{comparison.responseCategory.summary}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5" />
              Clinical summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{summaryText}</p>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3 text-sm space-y-1">
              {FOOD_NOISE_SCALE.clinicalSafety.messages.map((msg, i) => (
                <p key={i}>• {msg}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
