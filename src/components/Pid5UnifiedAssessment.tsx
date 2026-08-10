import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Brain, AlertTriangle, RotateCcw } from 'lucide-react';
import { ExportButtons } from '@/components/ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';
import {
  PID5_ITEMS, PID5_DOMAINS, PID5_PATTERNS, PID5_CLUSTERS, PID5_RESPONSE_OPTIONS,
  PID5_SAFETY_ITEMS, PID5_MIN_ITEMS, PID5_DOMAIN_MIN_ITEMS, PID5_PATTERN_MIN_ITEMS,
  PID5_COPYRIGHT_NOTE, bandFor,
  type ClusterKey, type PatternKey, type Pid5Domain,
} from '@/data/pid5UnifiedScale';

interface Props { onBack?: () => void }

type Scores = Record<string, number | null>; // null = not assessable

const scoreOf = (keys: string[], responses: Record<string, number>, minItems: number): number | null => {
  let num = 0, den = 0, n = 0;
  for (const k of keys) {
    const v = responses[k];
    if (v === undefined || v === 9) continue;
    const w = PID5_ITEMS.find((i) => i.key === k)?.weight ?? 1;
    num += v * w; den += 3 * w; n += 1;
  }
  if (n < minItems || den === 0) return null;
  return Math.round((100 * num) / den);
};

export const Pid5UnifiedAssessment = ({ onBack }: Props) => {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [safety, setSafety] = useState<Record<string, boolean>>({});
  const [ctx, setCtx] = useState({
    age: '', patternPersistence: 'Unclear', patternPervasiveness: 'Unclear',
    functionalImpact: 'Unknown', culturalContextReviewed: false,
  });
  const [showResults, setShowResults] = useState(false);

  const answered = Object.values(responses).filter((v) => v !== undefined).length;
  const validAnswered = Object.values(responses).filter((v) => v !== 9).length;

  const domainScores = useMemo(() => {
    const out: Scores = {};
    for (const d of PID5_DOMAINS) {
      out[d] = scoreOf(PID5_ITEMS.filter((i) => i.domain === d).map((i) => i.key), responses, PID5_DOMAIN_MIN_ITEMS);
    }
    return out;
  }, [responses]);

  const patternScores = useMemo(() => {
    const out: Scores = {};
    (Object.keys(PID5_PATTERNS) as PatternKey[]).forEach((p) => {
      out[p] = scoreOf(PID5_ITEMS.filter((i) => i.pattern === p).map((i) => i.key), responses, PID5_PATTERN_MIN_ITEMS);
    });
    return out;
  }, [responses]);

  const clusterScores = useMemo(() => {
    const out: Record<ClusterKey, number | null> = { A: null, B: null, C: null };
    (Object.keys(PID5_CLUSTERS) as ClusterKey[]).forEach((c) => {
      const vals = PID5_CLUSTERS[c].patterns.map((p) => patternScores[p]).filter((v): v is number => v !== null);
      out[c] = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
    });
    return out;
  }, [patternScores]);

  const predominantCluster = useMemo(() => {
    const entries = (Object.keys(clusterScores) as ClusterKey[])
      .map((c) => ({ c, v: clusterScores[c] }))
      .filter((e): e is { c: ClusterKey; v: number } => e.v !== null)
      .sort((a, b) => b.v - a.v);
    if (entries.length < 3) return 'Indeterminate';
    if (entries[0].v - entries[1].v >= 10) return entries[0].c;
    return 'Mixed';
  }, [clusterScores]);

  const safetyFlags = useMemo(() => {
    const flags: string[] = [];
    PID5_SAFETY_ITEMS.forEach((s) => { if (safety[s.key]) flags.push(s.label); });
    if ((responses['borderlineSelfHarm'] ?? 0) >= 2 && responses['borderlineSelfHarm'] !== 9) {
      flags.push('Item U24 (recurrent self-harm / suicidal behaviour) rated 2 or higher');
    }
    return flags;
  }, [safety, responses]);

  const reviewPrompts = useMemo(() => {
    const out: string[] = [];
    if ((clusterScores.A ?? 0) >= 50) out.push('Cluster A ≥ 50: review suspiciousness, detachment, eccentricity, unusual beliefs, psychosis-spectrum conditions, trauma, neurodevelopmental factors, and medical or substance causes.');
    if ((clusterScores.B ?? 0) >= 50) out.push('Cluster B ≥ 50: review affective instability, impulsivity, self-harm, interpersonal conflict, empathy, trauma, mood episodes, substance use, and safety.');
    if ((clusterScores.C ?? 0) >= 50) out.push('Cluster C ≥ 50: review anxiety, avoidance, dependency, perfectionism, rigidity, obsessive-compulsive symptoms, and social context.');
    if (predominantCluster === 'Mixed') out.push('Mixed cluster profile: prioritize dimensional trait and personality-functioning formulation.');
    const anyPattern = Object.values(patternScores).some((v) => v !== null && v >= 50);
    if (anyPattern && ['Moderate', 'Marked'].includes(ctx.functionalImpact)) {
      out.push('Pattern score ≥ 50 with moderate/marked functional impact: recommend clinician-led structured assessment confirming persistence, pervasiveness, developmental course, impairment, and alternative explanations.');
    }
    return out;
  }, [clusterScores, predominantCluster, patternScores, ctx.functionalImpact]);

  const domainsSufficient = PID5_DOMAINS.every((d) => domainScores[d] !== null);
  const dataQuality = validAnswered >= PID5_MIN_ITEMS && domainsSufficient ? 'sufficient' : 'insufficient';

  const fmt = (v: number | null) => (v === null ? 'not assessable' : `${v} (${bandFor(v)})`);

  const reportData = (): ReportData => ({
    assessmentName: 'Unified PID-5 Trait and Personality Pattern Screener',
    date: new Date().toLocaleString(),
    totalScore: `${validAnswered}/30 items scored`,
    interpretation: `Predominant cluster: ${predominantCluster}`,
    severity: `Data quality: ${dataQuality}`,
    sections: [
      { title: 'Clinical context', type: 'info', items: [
        `Age: ${ctx.age || 'not stated'}`,
        `Pattern present for several years: ${ctx.patternPersistence}`,
        `Pattern across more than one context: ${ctx.patternPervasiveness}`,
        `Functional impact: ${ctx.functionalImpact}`,
        `Cultural and developmental context reviewed: ${ctx.culturalContextReviewed ? 'Yes' : 'No'}`,
      ]},
      { title: 'Trait domain scores (0-100)', type: 'info', items: PID5_DOMAINS.map((d) => `${d}: ${fmt(domainScores[d])}`) },
      { title: 'Behavioral pattern scores (0-100)', type: 'info', items: (Object.keys(PID5_PATTERNS) as PatternKey[]).map((p) => `${PID5_PATTERNS[p].label}: ${fmt(patternScores[p])}`) },
      { title: 'Cluster profile', type: 'info', items: (Object.keys(PID5_CLUSTERS) as ClusterKey[]).map((c) => `${PID5_CLUSTERS[c].label}: ${fmt(clusterScores[c])} — ${PID5_CLUSTERS[c].description}`) },
      { title: 'Safety flags', type: safetyFlags.length ? 'positive' : 'negative', items: safetyFlags.length ? safetyFlags : ['None identified'] },
      { title: 'Clinical review prompts', type: 'info', items: reviewPrompts.length ? reviewPrompts : ['None triggered'] },
      { title: 'Item responses', type: 'info', items: PID5_ITEMS.map((i) => {
        const v = responses[i.key];
        const lbl = v === undefined ? 'not answered' : PID5_RESPONSE_OPTIONS.find((o) => o.value === v)?.label;
        return `${i.id} ${i.label} — ${lbl}`;
      })},
    ],
    disclaimer: `${PID5_COPYRIGHT_NOTE} Non-diagnostic screening only; weights are heuristic and unvalidated. This tool does not establish a personality-disorder diagnosis.`,
  });

  const reset = () => { setResponses({}); setSafety({}); setShowResults(false); };

  const Bar = ({ label, value }: { label: string; value: number | null }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-foreground">{label}</span>
        <span className="text-muted-foreground">{value === null ? 'not assessable' : `${value} · ${bandFor(value)}`}</span>
      </div>
      <Progress value={value ?? 0} className="h-2" />
    </div>
  );

  if (showResults) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Button variant="ghost" onClick={() => setShowResults(false)}><ArrowLeft className="h-4 w-4 mr-1" />Back to questionnaire</Button>
          <div className="flex items-center gap-2">
            <ExportButtons data={reportData()} />
            <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="h-4 w-4 mr-1" />Reset</Button>
          </div>
        </div>

        {safetyFlags.length > 0 && (
          <Card className="border-destructive">
            <CardHeader className="pb-2"><CardTitle className="text-destructive flex items-center gap-2 text-base"><AlertTriangle className="h-5 w-5" />Urgent safety review</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <ul className="list-disc pl-5">{safetyFlags.map((f) => <li key={f}>{f}</li>)}</ul>
              <p>Stop routine classification. Perform urgent safety and mental-state assessment. Consider emergency referral according to local policy.</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Summary</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>Data quality: <strong>{dataQuality}</strong> ({validAnswered} scorable of 30; minimum {PID5_MIN_ITEMS})</p>
            <p>Predominant cluster: <strong>{predominantCluster}</strong></p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Trait profile (PID-5-style domains)</CardTitle></CardHeader>
          <CardContent className="space-y-3">{PID5_DOMAINS.map((d) => <Bar key={d} label={d} value={domainScores[d]} />)}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Behavioral patterns</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {(Object.keys(PID5_PATTERNS) as PatternKey[]).map((p) => (
              <Bar key={p} label={`${PID5_PATTERNS[p].label} (Cluster ${PID5_PATTERNS[p].cluster})`} value={patternScores[p]} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Cluster profile</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {(Object.keys(PID5_CLUSTERS) as ClusterKey[]).map((c) => (
              <div key={c} className="space-y-1">
                <Bar label={PID5_CLUSTERS[c].label} value={clusterScores[c]} />
                <p className="text-xs text-muted-foreground">{PID5_CLUSTERS[c].description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Clinical review prompts</CardTitle></CardHeader>
          <CardContent className="text-sm">
            {reviewPrompts.length ? <ul className="list-disc pl-5 space-y-1">{reviewPrompts.map((r) => <li key={r}>{r}</li>)}</ul> : <p className="text-muted-foreground">None triggered.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 text-xs text-muted-foreground space-y-2">
            <p>{PID5_COPYRIGHT_NOTE}</p>
            <p>This unified brief screener reports trait and behavioral-pattern elevations only. It does not establish a personality-disorder diagnosis. Weights are heuristic and have not been validated.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-2">
        {onBack && <Button variant="ghost" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" />Back</Button>}
        <div className="flex items-center gap-2 text-primary"><Brain className="h-5 w-5" /><span className="font-semibold">Unified PID-5 Screener</span></div>
      </div>

      <Card>
        <CardContent className="pt-4 text-sm space-y-2">
          <p className="text-foreground">Rate the longstanding pattern across different situations, rather than a single recent episode. Consider the past several years and compare family, intimate, social, occupational, and clinical contexts.</p>
          <p className="text-xs text-muted-foreground">{PID5_COPYRIGHT_NOTE}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Clinical context</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="pid5-age">Age</Label>
            <Input id="pid5-age" type="number" value={ctx.age} onChange={(e) => setCtx({ ...ctx, age: e.target.value })} />
          </div>
          {([
            ['patternPersistence', 'Pattern present for several years', ['Yes', 'No', 'Unclear']],
            ['patternPervasiveness', 'Pattern occurs across more than one context', ['Yes', 'No', 'Unclear']],
            ['functionalImpact', 'Functional impact', ['None identified', 'Mild', 'Moderate', 'Marked', 'Unknown']],
          ] as const).map(([key, label, opts]) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={`pid5-${key}`}>{label}</Label>
              <select
                id={`pid5-${key}`}
                value={(ctx as Record<string, string | boolean>)[key] as string}
                onChange={(e) => setCtx({ ...ctx, [key]: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                {opts.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div className="flex items-center gap-2 sm:col-span-2">
            <Checkbox id="pid5-cultural" checked={ctx.culturalContextReviewed} onCheckedChange={(v) => setCtx({ ...ctx, culturalContextReviewed: v === true })} />
            <Label htmlFor="pid5-cultural">Cultural and developmental context reviewed</Label>
          </div>
        </CardContent>
      </Card>

      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur py-2">
        <Progress value={(answered / PID5_ITEMS.length) * 100} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1">{answered}/30 answered · {validAnswered} scorable (minimum {PID5_MIN_ITEMS})</p>
      </div>

      <div className="space-y-3">
        {PID5_ITEMS.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground">{item.id}. {item.label}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.domain}{item.pattern ? ` · ${PID5_PATTERNS[item.pattern].label} (Cluster ${item.cluster})` : ''} · weight {item.weight}
                  {item.safetyFlag ? ' · safety item' : ''}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {PID5_RESPONSE_OPTIONS.map((o) => (
                  <Button
                    key={o.value}
                    size="sm"
                    variant={responses[item.key] === o.value ? 'default' : 'outline'}
                    onClick={() => setResponses((p) => ({ ...p, [item.key]: o.value }))}
                  >
                    {o.value === 9 ? '?' : o.value} · {o.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" />Safety review</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {PID5_SAFETY_ITEMS.map((s) => (
            <div key={s.key} className="flex items-center gap-2">
              <Checkbox id={`pid5-${s.key}`} checked={!!safety[s.key]} onCheckedChange={(v) => setSafety((p) => ({ ...p, [s.key]: v === true }))} />
              <Label htmlFor={`pid5-${s.key}`}>{s.label}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-2 pb-6">
        <Button className="flex-1" onClick={() => setShowResults(true)}>View profile</Button>
        <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4 mr-1" />Reset</Button>
      </div>
    </div>
  );
};

export default Pid5UnifiedAssessment;
