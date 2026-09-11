import { useMemo, useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft, Pill, AlertTriangle, CheckCircle2, Info, RotateCcw, Activity, Utensils,
} from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { ADVERSE_EFFECTS, ADVERSE_EFFECTS_PURPOSE } from '@/data/adverseEffectsData';
import {
  FOOD_NOISE_SCALE,
  FNQ_ITEM_IDS,
  findInterpretationBand,
  calculateTotalScore,
  isComplete,
  calculateDomainScore,
} from '@/data/foodNoiseScale';
import { AssessmentReference } from '@/components/AssessmentReference';
import { ExportButtons } from './ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

interface Props { onBack: () => void }

const CAT_META: Record<string, { chip: string; dot: string }> = {
  antipsychotics: { chip: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-200', dot: 'bg-purple-500' },
  antidepressants: { chip: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-200', dot: 'bg-blue-500' },
  anxiolytics: { chip: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200', dot: 'bg-emerald-500' },
  'mood-stabilizers': { chip: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-200', dot: 'bg-amber-500' },
  serious: { chip: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-200', dot: 'bg-rose-500' },
};

export const AdverseEffectsAssessment = ({ onBack }: Props) => {
  const { language } = useLanguage();
  const isMl = language === 'ml';
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [activeCat, setActiveCat] = useState<string>(ADVERSE_EFFECTS[0].id);
  const [fnqResponses, setFnqResponses] = useState<Record<string, number | null>>({
    fnq1: null, fnq2: null, fnq3: null, fnq4: null, fnq5: null,
  });

  const toggle = (id: string) => setChecked(p => ({ ...p, [id]: !p[id] }));
  const reset = () => setChecked({});
  const resetFnq = () => setFnqResponses({ fnq1: null, fnq2: null, fnq3: null, fnq4: null, fnq5: null });

  const fnqScore = calculateTotalScore(fnqResponses);
  const fnqBand = findInterpretationBand(fnqScore);
  const fnqComplete = isComplete(fnqResponses);

  const positives = useMemo(
    () =>
      ADVERSE_EFFECTS.flatMap(cat =>
        cat.groups.flatMap(g =>
          g.items.filter(i => checked[i.id]).map(i => ({ ...i, catId: cat.id, category: cat.category, heading: g.heading })),
        ),
      ),
    [checked],
  );

  const seriousCount = positives.filter(p => p.catId === 'serious').length;

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    ADVERSE_EFFECTS.forEach(cat => {
      c[cat.id] = cat.groups.reduce(
        (n, g) => n + g.items.filter(i => checked[i.id]).length, 0,
      );
    });
    return c;
  }, [checked]);

  const activeCategory = ADVERSE_EFFECTS.find(c => c.id === activeCat)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              {isMl ? 'തിരികെ' : 'Back'}
            </Button>
            <div className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              <h1 className="text-xl md:text-2xl font-bold">
                {isMl ? 'പാർശ്വഫല ട്രാക്കർ' : 'Adverse Effects Tracker'}
              </h1>
            </div>
          </div>
          <LanguageToggle />
        </div>
        <p className="text-sm text-muted-foreground">{ADVERSE_EFFECTS_PURPOSE}</p>

        {/* Food Noise Scale (FNQ-5) */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-orange-500" />
                <CardTitle className="text-lg">Food Noise Scale (FNQ-5)</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={resetFnq} className="gap-1">
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
            </div>
            <CardDescription>
              {FOOD_NOISE_SCALE.questionnaire.timeframe} · {FOOD_NOISE_SCALE.questionnaire.instructions}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {FOOD_NOISE_SCALE.questionnaire.items.map((item) => (
              <div key={item.id} className="space-y-2">
                <p className="text-sm font-medium">
                  {item.order}. {item.text}
                </p>
                <RadioGroup
                  value={fnqResponses[item.id] !== null ? String(fnqResponses[item.id]) : undefined}
                  onValueChange={(val) => setFnqResponses(p => ({ ...p, [item.id]: Number(val) }))}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-2"
                >
                  {FOOD_NOISE_SCALE.questionnaire.responseOptions.map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(opt.value)} id={`${item.id}-${opt.value}`} />
                      <Label htmlFor={`${item.id}-${opt.value}`} className="text-xs font-normal">{opt.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}

            <div className="rounded-lg bg-muted p-4 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold">{fnqScore}</span>
                <span className="text-lg text-muted-foreground">/ {FOOD_NOISE_SCALE.scoring.maximumScore}</span>
                {fnqComplete && fnqBand && (
                  <Badge className={`text-white ${
                    fnqBand.severityLevel === 0 ? 'bg-emerald-500' :
                    fnqBand.severityLevel === 1 ? 'bg-lime-500' :
                    fnqBand.severityLevel === 2 ? 'bg-yellow-500' :
                    fnqBand.severityLevel === 3 ? 'bg-orange-500' : 'bg-rose-500'
                  }`}>{fnqBand.label}</Badge>
                )}
              </div>
              {!fnqComplete && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  {FOOD_NOISE_SCALE.scoring.missingDataPolicy.message}
                </p>
              )}
              {fnqComplete && fnqBand && (
                <p className="text-sm text-muted-foreground">{fnqBand.summary}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FOOD_NOISE_SCALE.domainAnalysis.domains.map((domain) => (
                  <div key={domain.id} className="rounded-lg border bg-background p-2">
                    <p className="text-xs text-muted-foreground">{domain.label}</p>
                    <p className="text-base font-semibold">
                      {calculateDomainScore(fnqResponses, domain.id)} / {domain.scoreRange.split('-')[1]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3 text-sm">
              {FOOD_NOISE_SCALE.clinicalSafety.messages.map((msg, i) => (
                <p key={i} className="mb-1 last:mb-0">• {msg}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live summary tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg border p-3 bg-muted/40">
            <div className="text-xs text-muted-foreground">{isMl ? 'ആകെ ഫ്ലാഗ്' : 'Total flagged'}</div>
            <div className="text-2xl font-semibold">{positives.length}</div>
          </div>
          <div className="rounded-lg border p-3 bg-muted/40">
            <div className="text-xs text-muted-foreground">Serious</div>
            <div className="text-2xl font-semibold text-rose-600">{seriousCount}</div>
          </div>
          <div className="rounded-lg border p-3 bg-muted/40">
            <div className="text-xs text-muted-foreground">Drug classes affected</div>
            <div className="text-2xl font-semibold">
              {Object.values(counts).filter(n => n > 0).length}
            </div>
          </div>
          <div className="rounded-lg border p-3 bg-muted/40 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="text-sm font-semibold">
                {seriousCount > 0 ? 'Urgent review' : positives.length > 0 ? 'Monitor' : 'Clear'}
              </div>
            </div>
            <Activity className={`h-6 w-6 ${seriousCount > 0 ? 'text-rose-500' : positives.length > 0 ? 'text-amber-500' : 'text-emerald-500'}`} />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          {/* Category selector */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{isMl ? 'ഡ്രഗ് ക്ലാസ്' : 'Drug class'}</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="flex lg:flex-col gap-1 overflow-x-auto">
                {ADVERSE_EFFECTS.map(cat => {
                  const meta = CAT_META[cat.id];
                  const active = cat.id === activeCat;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCat(cat.id)}
                      className={`flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors whitespace-nowrap ${
                        active ? 'bg-primary/10 border border-primary/30 font-medium' : 'hover:bg-accent/50 border border-transparent'
                      }`}
                    >
                      <span className={`inline-block h-2 w-2 rounded-full ${meta.dot}`} />
                      <span className="flex-1">{cat.category}</span>
                      {counts[cat.id] > 0 && (
                        <Badge variant="outline" className={meta.chip}>{counts[cat.id]}</Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Active category detail */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${CAT_META[activeCat].dot}`} />
                    {activeCategory.category}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{activeCategory.examples}</p>
                </div>
                <Badge variant="outline" className={CAT_META[activeCat].chip}>
                  {counts[activeCat]} flagged
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeCategory.groups.map(g => (
                <div key={g.heading}>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    {g.heading}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {g.items.map(item => (
                      <label
                        key={item.id}
                        htmlFor={item.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          checked[item.id] ? 'bg-primary/5 border-primary/40' : 'bg-card hover:bg-accent/50'
                        }`}
                      >
                        <Checkbox
                          id={item.id}
                          checked={!!checked[item.id]}
                          onCheckedChange={() => toggle(item.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-tight">{item.label}</p>
                          {item.detail && (
                            <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Live flag summary */}
        <Card
          className={`border-2 ${
            seriousCount > 0
              ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30'
              : positives.length > 0
              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
              : 'border-muted'
          }`}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {seriousCount > 0 ? (
                <><AlertTriangle className="h-5 w-5 text-rose-600" /> Serious adverse reaction flagged</>
              ) : positives.length > 0 ? (
                <><Info className="h-5 w-5 text-amber-600" /> {positives.length} adverse effect(s) documented</>
              ) : (
                <><CheckCircle2 className="h-5 w-5 text-muted-foreground" /> Nothing selected yet</>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {seriousCount > 0 && (
              <Alert className="border-rose-500/50">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <AlertDescription className="text-sm">
                  {isMl
                    ? 'ഗുരുതരമായ പാർശ്വഫലം. അടിയന്തിര വൈദ്യ വിലയിരുത്തൽ.'
                    : 'A serious adverse effect has been flagged. Consider urgent medical review and possible discontinuation of the implicated agent.'}
                </AlertDescription>
              </Alert>
            )}
            {positives.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {positives.map(p => (
                  <Badge key={p.id} variant="outline" className={CAT_META[p.catId].chip}>
                    {p.label}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Tick items in the drug-class panels above to build a live adverse-effect profile.
              </p>
            )}
          </CardContent>
        </Card>

        {positives.length > 0 && (
          <ExportButtons
            className="justify-start"
            data={{
              assessmentName: 'Adverse Effects Tracker',
              date: new Date().toLocaleString(),
              totalScore: `${positives.length} flagged · ${seriousCount} serious`,
              interpretation: seriousCount > 0 ? 'Urgent review' : positives.length > 0 ? 'Monitor' : 'Clear',
              sections: [
                ...(seriousCount > 0
                  ? [
                      {
                        title: 'Serious Adverse Effects',
                        items: positives.filter(p => p.catId === 'serious').map(p => p.label),
                        type: 'positive' as const,
                      },
                    ]
                  : []),
                {
                  title: 'All Flagged Adverse Effects',
                  items: positives.map(p => `${p.category} › ${p.heading} › ${p.label}`),
                  type: 'positive' as const,
                },
              ],
              disclaimer: 'Clinician reference only — not a diagnostic or emergency tool.',
            } as ReportData}
          />
        )}

        <div className="flex gap-3">
          <Button onClick={reset} variant="outline" className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            {isMl ? 'പുനഃക്രമീകരിക്കുക' : 'Reset'}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Clinician reference only — not a diagnostic or emergency tool.
        </p>

        <AssessmentReference assessmentKey="adverseEffects" />
      </div>
    </div>
  );
};
