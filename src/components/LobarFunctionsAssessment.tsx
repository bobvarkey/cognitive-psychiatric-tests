import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Brain, ArrowLeft, Stethoscope, RotateCcw, Copy, Check, FileText, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import {
  LOBAR_META,
  LOBAR_TAB_ORDER,
  LOBAR_TAB_COLORS,
  LOBAR_RESPONSE_OPTIONS,
  LOBAR_BASELINE,
  LOBAR_LOBES,
  LOBAR_SUMMARY_RULES,
  LOBAR_REPORT_TEMPLATE,
  type ResponseStatus,
  type Lobe,
  type LobeDomain,
  type LobeTest,
  type BaselineTest,
  type BaselineDomain,
} from '@/data/lobarFunctions';

interface LobarFunctionsAssessmentProps {
  onBack: () => void;
}

interface TestResult {
  status: ResponseStatus;
  observation: string;
  laterality?: string;
}

function statusBadgeClass(status: ResponseStatus): string {
  switch (status) {
    case 'normal':
      return 'bg-emerald-500 hover:bg-emerald-600 text-white';
    case 'abnormal':
      return 'bg-rose-500 hover:bg-rose-600 text-white';
    case 'not_tested':
      return 'bg-slate-400 hover:bg-slate-500 text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function statusLabelClass(status: ResponseStatus): string {
  switch (status) {
    case 'normal':
      return 'text-emerald-700 dark:text-emerald-300';
    case 'abnormal':
      return 'text-rose-700 dark:text-rose-300';
    case 'not_tested':
      return 'text-slate-600 dark:text-slate-400';
    default:
      return 'text-muted-foreground';
  }
}

export default function LobarFunctionsAssessment({ onBack }: LobarFunctionsAssessmentProps) {
  const { isMl } = useLanguage();
  const [activeTab, setActiveTab] = useState(LOBAR_TAB_ORDER[0].id);
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [copied, setCopied] = useState(false);

  const handleStatus = (testId: string, status: ResponseStatus) => {
    setResults((prev) => ({
      ...prev,
      [testId]: { ...(prev[testId] ?? { observation: '' }), status },
    }));
  };

  const handleObservation = (testId: string, observation: string) => {
    setResults((prev) => ({
      ...prev,
      [testId]: { ...(prev[testId] ?? { status: 'not_tested' as ResponseStatus }), observation },
    }));
  };

  const reset = () => {
    setResults({});
    setActiveTab(LOBAR_TAB_ORDER[0].id);
  };

  const allTestIds = useMemo(() => {
    const ids: string[] = [];
    LOBAR_BASELINE.forEach((d) => d.tests.forEach((t) => ids.push(t.id)));
    LOBAR_LOBES.forEach((l) => l.domains.forEach((d) => d.tests.forEach((t) => ids.push(t.id))));
    return ids;
  }, []);

  const completedCount = useMemo(
    () => allTestIds.filter((id) => results[id]?.status && results[id]?.status !== 'not_tested').length,
    [allTestIds, results]
  );

  const abnormalCount = useMemo(
    () => allTestIds.filter((id) => results[id]?.status === 'abnormal').length,
    [allTestIds, results]
  );

  const notTestedCount = useMemo(
    () => allTestIds.filter((id) => results[id]?.status === 'not_tested' || !results[id]?.status).length,
    [allTestIds, results]
  );

  const lobeStats = useMemo(() => {
    const stats: Record<string, { total: number; abnormal: number; tested: number }> = {};
    LOBAR_LOBES.forEach((lobe) => {
      let total = 0;
      let abnormal = 0;
      let tested = 0;
      lobe.domains.forEach((d) =>
        d.tests.forEach((t) => {
          total++;
          const r = results[t.id];
          if (r?.status && r.status !== 'not_tested') tested++;
          if (r?.status === 'abnormal') abnormal++;
        })
      );
      stats[lobe.id] = { total, abnormal, tested };
    });
    return stats;
  }, [results]);

  const abnormalTests = useMemo(() => {
    const out: { lobe: string; domain: string; test: string; observation: string }[] = [];
    LOBAR_LOBES.forEach((lobe) =>
      lobe.domains.forEach((domain) =>
        domain.tests.forEach((test) => {
          const r = results[test.id];
          if (r?.status === 'abnormal') {
            out.push({
              lobe: lobe.name,
              domain: domain.name,
              test: test.name,
              observation: r.observation || '',
            });
          }
        })
      )
    );
    return out;
  }, [results]);

  const summaryPatterns = useMemo(() => {
    const patterns: string[] = [];
    const frontal = lobeStats['frontal'];
    const leftParietal = lobeStats['left_parietal'];
    const rightParietal = lobeStats['right_parietal'];
    const occipital = lobeStats['occipital'];
    const temporal = lobeStats['temporal'];

    if (frontal?.abnormal >= 3) patterns.push(LOBAR_SUMMARY_RULES[0].output);
    if (leftParietal?.abnormal >= 1) patterns.push(LOBAR_SUMMARY_RULES[1].output);
    if (rightParietal?.abnormal >= 1) patterns.push(LOBAR_SUMMARY_RULES[2].output);

    const ventralIds = [
      'apperceptive_matching', 'copying', 'incomplete_letters', 'silhouettes', 'gollin_figures',
      'unusual_view', 'foreshortened_match', 'functional_matching', 'real_unreal', 'pyramids_palm_trees',
      'prosopagnosia_informal', 'benton_face', 'colour_naming', 'colour_matching', 'conceptual_colour',
    ];
    const dorsalIds = [
      'dorsal_simultanagnosia', 'global_local', 'mixed_figures', 'cookie_theft',
      'visual_disorientation_depth', 'circle_center', 'optic_ataxia',
    ];
    const temporalIds = [
      'three_object_recall', 'story_delayed_recall', 'recent_event_memory', 'hidden_objects',
      'paired_associates', 'general_knowledge', 'familiar_routes',
    ];

    const ventralAbnormal = ventralIds.filter((id) => results[id]?.status === 'abnormal').length;
    const dorsalAbnormal = dorsalIds.filter((id) => results[id]?.status === 'abnormal').length;
    const temporalAbnormal = temporalIds.filter((id) => results[id]?.status === 'abnormal').length;

    if (ventralAbnormal >= 2) patterns.push(LOBAR_SUMMARY_RULES[3].output);
    if (dorsalAbnormal >= 2) patterns.push(LOBAR_SUMMARY_RULES[4].output);
    if (temporalAbnormal >= 2) patterns.push(LOBAR_SUMMARY_RULES[5].output);

    return patterns;
  }, [lobeStats, results]);

  const generatedReport = useMemo(() => {
    const lines: string[] = [];
    lines.push(LOBAR_REPORT_TEMPLATE.title);
    lines.push(`Date: ${new Date().toLocaleDateString()}`);
    lines.push('');

    lines.push('Baseline Higher Mental Function');
    LOBAR_BASELINE.forEach((domain) => {
      domain.tests.forEach((test) => {
        const r = results[test.id];
        if (!r || !r.status) {
          lines.push(LOBAR_REPORT_TEMPLATE.notTestedSentence.replace('{testName}', test.name));
        } else if (r.status === 'normal') {
          lines.push(LOBAR_REPORT_TEMPLATE.normalSentence.replace('{testName}', test.name));
        } else if (r.status === 'abnormal') {
          lines.push(
            LOBAR_REPORT_TEMPLATE.abnormalSentence
              .replace('{testName}', test.name)
              .replace('{observation}', r.observation || 'abnormal')
          );
        } else {
          lines.push(LOBAR_REPORT_TEMPLATE.notTestedSentence.replace('{testName}', test.name));
        }
      });
    });
    lines.push('');

    LOBAR_LOBES.forEach((lobe) => {
      lines.push(lobe.title);
      lobe.domains.forEach((domain) => {
        domain.tests.forEach((test) => {
          const r = results[test.id];
          if (!r || !r.status) {
            lines.push(LOBAR_REPORT_TEMPLATE.notTestedSentence.replace('{testName}', test.name));
          } else if (r.status === 'normal') {
            lines.push(LOBAR_REPORT_TEMPLATE.normalSentence.replace('{testName}', test.name));
          } else if (r.status === 'abnormal') {
            lines.push(
              LOBAR_REPORT_TEMPLATE.abnormalSentence
                .replace('{testName}', test.name)
                .replace('{observation}', r.observation || 'abnormal')
            );
          } else {
            lines.push(LOBAR_REPORT_TEMPLATE.notTestedSentence.replace('{testName}', test.name));
          }
        });
      });
      lines.push('');
    });

    const patternSummary =
      summaryPatterns.length > 0
        ? summaryPatterns.join(' ')
        : 'no dominant localizing pattern';
    lines.push(
      LOBAR_REPORT_TEMPLATE.impressionTemplate.replace('{patternSummary}', patternSummary)
    );
    return lines.join('\n');
  }, [results, summaryPatterns]);

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(generatedReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const renderBaselineTest = (test: BaselineTest) => {
    const r = results[test.id] ?? { status: 'not_tested' as ResponseStatus, observation: '' };
    return (
      <Card key={test.id} className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between gap-2">
            <span className="min-w-0">{test.name}</span>
            {r.status && r.status !== 'not_tested' && (
              <Badge className={statusBadgeClass(r.status)}>{r.status}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {test.instruction && (
            <p className="text-sm text-muted-foreground">{test.instruction}</p>
          )}
          {test.subtests && test.subtests.length > 0 && (
            <ul className="text-sm list-disc pl-5 text-muted-foreground space-y-0.5">
              {test.subtests.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-2">
            {LOBAR_RESPONSE_OPTIONS.map((opt) => (
              <Button
                key={opt.id}
                type="button"
                size="sm"
                variant={r.status === opt.id ? 'default' : 'outline'}
                className={cn(
                  'text-xs',
                  r.status === opt.id && statusBadgeClass(opt.id as ResponseStatus)
                )}
                onClick={() => handleStatus(test.id, opt.id as ResponseStatus)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <Textarea
            placeholder="Observation / laterality / notes"
            value={r.observation}
            onChange={(e) => handleObservation(test.id, e.target.value)}
            className="text-sm min-h-[60px]"
          />
        </CardContent>
      </Card>
    );
  };

  const renderLobeTest = (lobe: Lobe, domain: LobeDomain, test: LobeTest) => {
    const r = results[test.id] ?? { status: 'not_tested' as ResponseStatus, observation: '' };
    return (
      <Card key={test.id} className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between gap-2">
            <span className="min-w-0">{test.name}</span>
            {r.status && r.status !== 'not_tested' && (
              <Badge className={statusBadgeClass(r.status)}>{r.status}</Badge>
            )}
          </CardTitle>
          {test.target && (
            <CardDescription className="text-xs">Target: {test.target}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {test.instruction && (
            <p className="text-sm text-muted-foreground">{test.instruction}</p>
          )}
          {test.example && (
            <p className="text-sm text-muted-foreground">Example: {test.example}</p>
          )}
          {test.abnormalFinding && (
            <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 p-3 border border-rose-200 dark:border-rose-900 text-sm">
              <p className="font-semibold text-rose-700 dark:text-rose-300 mb-1">Abnormal finding</p>
              <p>{test.abnormalFinding}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {LOBAR_RESPONSE_OPTIONS.map((opt) => (
              <Button
                key={opt.id}
                type="button"
                size="sm"
                variant={r.status === opt.id ? 'default' : 'outline'}
                className={cn(
                  'text-xs',
                  r.status === opt.id && statusBadgeClass(opt.id as ResponseStatus)
                )}
                onClick={() => handleStatus(test.id, opt.id as ResponseStatus)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <Textarea
            placeholder="Observation / laterality / notes"
            value={r.observation}
            onChange={(e) => handleObservation(test.id, e.target.value)}
            className="text-sm min-h-[60px]"
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {isMl ? 'തിരികെ' : 'Back'}
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={reset} className="gap-1">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            <Button variant="outline" size="sm" onClick={copyReport} className="gap-1">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy report'}
            </Button>
          </div>
        </div>

        <PatientInfoForm />

        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md">
                <Brain className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-2xl md:text-3xl">{LOBAR_META.title}</CardTitle>
                <CardDescription className="mt-1 text-base break-words">
                  {LOBAR_META.purpose}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 text-sm">
              <Badge variant="outline">{completedCount} tested</Badge>
              <Badge className="bg-rose-500 text-white">{abnormalCount} abnormal</Badge>
              <Badge variant="secondary">{notTestedCount} not tested</Badge>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="flex flex-wrap h-auto gap-2 p-2 bg-muted/50">
            {LOBAR_TAB_ORDER.map((tab) => {
              const colors = LOBAR_TAB_COLORS[tab.id];
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    'text-sm font-medium data-[state=active]:shadow-sm min-w-0 truncate',
                    colors.active,
                    colors.inactive
                  )}
                >
                  <span className="truncate">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="baseline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Stethoscope className="h-5 w-5" />
                  Baseline Higher Mental Function
                </CardTitle>
                <CardDescription>
                  Assess general cognitive state before interpreting lobar testing.
                </CardDescription>
              </CardHeader>
            </Card>
            {LOBAR_BASELINE.map((domain) => (
              <div key={domain.id} className="space-y-3">
                <h3 className="font-semibold text-lg">{domain.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {domain.tests.map((test) => renderBaselineTest(test))}
                </div>
              </div>
            ))}
          </TabsContent>

          {LOBAR_LOBES.map((lobe) => (
            <TabsContent key={lobe.id} value={lobe.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{lobe.title}</CardTitle>
                  <CardDescription>{lobe.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/30 p-3 border border-indigo-200 dark:border-indigo-900 text-sm">
                    <p className="font-semibold text-indigo-700 dark:text-indigo-300 mb-1">
                      Localization hint
                    </p>
                    <p>{lobe.localizationHint}</p>
                  </div>
                </CardContent>
              </Card>
              {lobe.domains.map((domain) => (
                <div key={domain.id} className="space-y-3">
                  <h3 className="font-semibold text-lg">{domain.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {domain.tests.map((test) => renderLobeTest(lobe, domain, test))}
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5" />
                  Summary & Report
                </CardTitle>
                <CardDescription>
                  Abnormal counts, localization patterns, and generated report.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {LOBAR_LOBES.map((lobe) => {
                    const s = lobeStats[lobe.id];
                    return (
                      <Card key={lobe.id} className="overflow-hidden">
                        <div
                          className={cn(
                            'h-1.5',
                            s.abnormal > 0 ? 'bg-rose-500' : s.tested > 0 ? 'bg-emerald-500' : 'bg-slate-300'
                          )}
                        />
                        <CardContent className="p-3 space-y-1">
                          <p className="font-medium text-sm truncate">{lobe.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {s.abnormal} abnormal / {s.tested} tested / {s.total} total
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {abnormalTests.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-rose-500" />
                      Abnormal tests ({abnormalTests.length})
                    </h3>
                    <div className="rounded-lg border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left px-3 py-2 font-medium">Lobe</th>
                            <th className="text-left px-3 py-2 font-medium">Domain</th>
                            <th className="text-left px-3 py-2 font-medium">Test</th>
                            <th className="text-left px-3 py-2 font-medium">Observation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {abnormalTests.map((t, idx) => (
                            <tr key={idx} className="border-t">
                              <td className="px-3 py-2 whitespace-nowrap">{t.lobe}</td>
                              <td className="px-3 py-2 whitespace-nowrap">{t.domain}</td>
                              <td className="px-3 py-2">{t.test}</td>
                              <td className="px-3 py-2 text-muted-foreground">
                                {t.observation || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {summaryPatterns.length > 0 && (
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-900">
                    <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-2">
                      Localization patterns
                    </h3>
                    <ul className="space-y-1 text-sm">
                      {summaryPatterns.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Generated report</h3>
                    <Button variant="outline" size="sm" onClick={copyReport} className="gap-1">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                  <pre className="rounded-lg border bg-muted p-4 text-xs whitespace-pre-wrap break-words max-h-[400px] overflow-auto">
                    {generatedReport}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground text-center">
          {LOBAR_META.clinicalDisclaimer}
        </p>
      </div>
    </div>
  );
}
