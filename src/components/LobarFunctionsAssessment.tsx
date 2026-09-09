import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Brain, ArrowLeft, ChevronDown, Stethoscope, ClipboardList, FileText, Activity, Info, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { LOBES, LOBAR_NAVIGATION, LOBAR_SCORING, LOBAR_SCORE_LABELS, getLobeById } from '@/data/lobarFunctions';

interface LobarFunctionsAssessmentProps {
  onBack: () => void;
}

function getScoreColor(value: number): string {
  if (value >= 1.7) return 'bg-emerald-500 text-white';
  if (value >= 1.2) return 'bg-amber-500 text-white';
  return 'bg-rose-500 text-white';
}

function getInterpretation(value: number) {
  return LOBAR_SCORING.interpretation.thresholds.find((t) => value >= t.min) || LOBAR_SCORING.interpretation.thresholds[LOBAR_SCORING.interpretation.thresholds.length - 1];
}

const LOBE_COLORS: Record<string, { active: string; inactive: string; icon: string }> = {
  frontal: {
    active: 'bg-rose-600 text-white shadow-sm',
    inactive: 'bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-900/60',
    icon: 'text-rose-500',
  },
  parietal: {
    active: 'bg-blue-600 text-white shadow-sm',
    inactive: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:hover:bg-blue-900/60',
    icon: 'text-blue-500',
  },
  temporal: {
    active: 'bg-amber-500 text-white shadow-sm',
    inactive: 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:hover:bg-amber-900/60',
    icon: 'text-amber-500',
  },
  occipital: {
    active: 'bg-violet-600 text-white shadow-sm',
    inactive: 'bg-violet-100 text-violet-800 hover:bg-violet-200 dark:bg-violet-950/40 dark:text-violet-200 dark:hover:bg-violet-900/60',
    icon: 'text-violet-500',
  },
};

const VIEW_COLORS: Record<string, { active: string; inactive: string }> = {
  overview: { active: 'bg-emerald-600 text-white', inactive: 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-200' },
  tests: { active: 'bg-sky-600 text-white', inactive: 'bg-sky-50 text-sky-800 hover:bg-sky-100 dark:bg-sky-950/30 dark:text-sky-200' },
  summary: { active: 'bg-amber-500 text-white', inactive: 'bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-200' },
};

export default function LobarFunctionsAssessment({ onBack }: LobarFunctionsAssessmentProps) {
  const { isMl } = useLanguage();
  const [activeLobe, setActiveLobe] = useState(LOBAR_NAVIGATION.defaultLobe);
  const [activeView, setActiveView] = useState(LOBAR_NAVIGATION.views[0].id);
  const [scores, setScores] = useState<Record<string, number>>({});

  const handleScoreChange = (testId: string, value: number) => {
    setScores((prev) => ({ ...prev, [testId]: value }));
  };

  const lobeScores = useMemo(() => {
    const result: Record<string, { score: number; max: number; percentage: number }> = {};
    for (const lobe of LOBES) {
      let total = 0;
      let max = 0;
      for (const test of lobe.tests) {
        const s = scores[test.id];
        if (typeof s === 'number') {
          total += s * test.scoring.weight;
          max += 2 * test.scoring.weight;
        }
      }
      result[lobe.id] = {
        score: max > 0 ? total / (max / 2) * 2 : 0,
        max,
        percentage: max > 0 ? (total / max) * 100 : 0,
      };
    }
    return result;
  }, [scores]);

  const sortedLobes = useMemo(() => {
    return [...LOBES].sort((a, b) => (lobeScores[a.id]?.score ?? 0) - (lobeScores[b.id]?.score ?? 0));
  }, [lobeScores]);

  const reset = () => setScores({});

  const completedCount = useMemo(() => Object.keys(scores).length, [scores]);
  const totalTests = useMemo(() => LOBES.reduce((acc, l) => acc + l.tests.length, 0), []);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {isMl ? 'തിരികെ' : 'Back'}
          </Button>
        </div>

        <PatientInfoForm />

        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md">
                <Brain className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl md:text-3xl">Lobar Functions Mini-App</CardTitle>
                <CardDescription className="mt-1 text-base">
                  Bedside testing and localization of cerebral lobar functions in neurology.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <Badge variant="outline">{completedCount}/{totalTests} tests scored</Badge>
              <Button variant="ghost" size="sm" onClick={reset} className="gap-1">
                <RotateCcw className="h-4 w-4" /> Reset scores
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {LOBAR_NAVIGATION.views.map((v) => {
              const isActive = activeView === v.id;
              const colors = VIEW_COLORS[v.id];
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveView(v.id)}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors min-w-0",
                    isActive ? colors.active : colors.inactive
                  )}
                >
                  {v.id === 'overview' && <Stethoscope className="h-4 w-4 shrink-0" />}
                  {v.id === 'tests' && <ClipboardList className="h-4 w-4 shrink-0" />}
                  {v.id === 'summary' && <FileText className="h-4 w-4 shrink-0" />}
                  <span className="truncate">{v.label}</span>
                </button>
              );
            })}
          </div>

          <TabsContent value="overview" className="space-y-4">
            <Tabs value={activeLobe} onValueChange={setActiveLobe}>
              <div className="flex flex-wrap gap-2 mb-4">
                {LOBAR_NAVIGATION.order.map((id) => {
                  const lobe = getLobeById(id)!;
                  const isActive = activeLobe === id;
                  const colors = LOBE_COLORS[id];
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveLobe(id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors min-w-0 truncate",
                        isActive ? colors.active : colors.inactive
                      )}
                    >
                      {lobe.name}
                    </button>
                  );
                })}
              </div>
              {LOBAR_NAVIGATION.order.map((id) => {
                const lobe = getLobeById(id)!;
                return (
                  <TabsContent key={id} value={id}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Brain className={cn("h-5 w-5", LOBE_COLORS[id].icon)} />
                          {lobe.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-emerald-500" /> Key Functions
                          </h3>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {lobe.key_functions.map((fn, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                                {fn}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Info className="h-4 w-4 text-rose-500" /> Clinical Signs of Lesion
                          </h3>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {lobe.clinical_signs_of_lesion.map((sign, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                                {sign}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                );
              })}
            </Tabs>
          </TabsContent>

          <TabsContent value="tests" className="space-y-4">
            <Tabs value={activeLobe} onValueChange={setActiveLobe}>
              <div className="flex flex-wrap gap-2 mb-4">
                {LOBAR_NAVIGATION.order.map((id) => {
                  const lobe = getLobeById(id)!;
                  const isActive = activeLobe === id;
                  const colors = LOBE_COLORS[id];
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveLobe(id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors min-w-0 truncate",
                        isActive ? colors.active : colors.inactive
                      )}
                    >
                      {lobe.name}
                    </button>
                  );
                })}
              </div>
              {LOBAR_NAVIGATION.order.map((id) => {
                const lobe = getLobeById(id)!;
                return (
                  <TabsContent key={id} value={id} className="space-y-4">
                    {lobe.tests.map((test) => (
                      <Card key={test.id}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center justify-between">
                            <span>{test.name}</span>
                            {scores[test.id] !== undefined && (
                              <Badge className={scores[test.id] === 2 ? 'bg-emerald-500' : scores[test.id] === 1 ? 'bg-amber-500' : 'bg-rose-500'}>
                                {LOBAR_SCORE_LABELS[scores[test.id]]}
                              </Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm">{test.instructions}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3 border border-emerald-200 dark:border-emerald-900">
                              <p className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">Normal</p>
                              <p className="text-muted-foreground">{test.normal_findings}</p>
                            </div>
                            <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 p-3 border border-rose-200 dark:border-rose-900">
                              <p className="font-semibold text-rose-700 dark:text-rose-300 mb-1">Abnormal</p>
                              <p className="text-muted-foreground">{test.abnormal_findings}</p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <Select
                              value={scores[test.id]?.toString() ?? ''}
                              onValueChange={(v) => handleScoreChange(test.id, Number(v))}
                            >
                              <SelectTrigger className="w-full sm:w-56">
                                <SelectValue placeholder="Select score" />
                              </SelectTrigger>
                              <SelectContent>
                                {test.ui.options.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value.toString()}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">{test.ui.helpText}</p>
                          </div>
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto text-xs">
                                <ChevronDown className="h-3 w-3" /> Localization hint
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <p className="text-sm text-muted-foreground mt-2 pl-2 border-l-2 border-indigo-300">
                                {test.localization_hint}
                              </p>
                            </CollapsibleContent>
                          </Collapsible>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                );
              })}
            </Tabs>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Activity className="h-5 w-5" /> Lobar Scores & Localization
                </CardTitle>
                <CardDescription>
                  Lower scores suggest greater likelihood of lobar involvement. Interpret alongside full exam and imaging.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {LOBAR_NAVIGATION.order.map((id) => {
                    const lobe = getLobeById(id)!;
                    const s = lobeScores[id];
                    const interp = getInterpretation(s.score);
                    return (
                      <Card key={id} className="overflow-hidden">
                        <div className={`h-2 ${interp.color === 'green' ? 'bg-emerald-500' : interp.color === 'orange' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{lobe.name}</h3>
                            <Badge className={getScoreColor(s.score)}>{s.score.toFixed(1)} / 2</Badge>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full ${interp.color === 'green' ? 'bg-emerald-500' : interp.color === 'orange' ? 'bg-amber-500' : 'bg-rose-500'}`}
                              style={{ width: `${s.percentage}%` }}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">{interp.label}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Most likely localization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {sortedLobes.length > 0 && lobeScores[sortedLobes[0].id]?.max > 0 ? (
                      <div className="space-y-2">
                        {sortedLobes
                          .filter((l) => lobeScores[l.id].max > 0)
                          .slice(0, 3)
                          .map((l) => (
                            <div key={l.id} className="flex items-center gap-3">
                              <span className="text-sm font-medium w-28">{l.name}</span>
                              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-full ${getScoreColor(lobeScores[l.id].score).replace(' text-white', '')}`}
                                  style={{ width: `${lobeScores[l.id].percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground">{lobeScores[l.id].score.toFixed(1)}</span>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No scores entered yet. Complete bedside tests to generate a localization summary.</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-4">
                      {LOBAR_SCORING.interpretation.note}
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
