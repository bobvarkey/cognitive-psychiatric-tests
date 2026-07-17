import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Pill, AlertTriangle } from 'lucide-react';

interface Props { onBack?: () => void }

type DrugKey = 'Sertraline' | 'Fluoxetine' | 'Escitalopram' | 'Citalopram' | 'Paroxetine' | 'Fluvoxamine';

const DRUG_RISK: Record<DrugKey, { met: string; gi: string; sex: string; bleed: string }> = {
  Sertraline: { met: 'low-moderate', gi: 'common', sex: 'common', bleed: 'moderate' },
  Fluoxetine: { met: 'low-moderate', gi: 'common', sex: 'common', bleed: 'moderate' },
  Escitalopram: { met: 'low-moderate', gi: 'common', sex: 'common', bleed: 'moderate' },
  Citalopram: { met: 'low-moderate', gi: 'common', sex: 'common', bleed: 'moderate' },
  Paroxetine: { met: 'higher', gi: 'common', sex: 'common', bleed: 'moderate' },
  Fluvoxamine: { met: 'low-moderate', gi: 'common', sex: 'common', bleed: 'moderate' },
};

const MONITORING = [
  { time: 'Baseline', check: 'Weight/BMI, waist, BP, sexual history, bleeding history, meds (NSAIDs/anticoagulants)' },
  { time: '2–6 weeks', check: 'Nausea, dizziness, insomnia, anxiety activation, appetite change' },
  { time: '6–12 weeks', check: 'Weight, sleep, sexual side effects, adherence, HbA1c if risk' },
  { time: '3–6 months', check: 'Weight, waist, metabolic profile if gaining weight or high risk' },
  { time: 'Any time', check: 'GI bleed symptoms, severe agitation, serotonin syndrome, or withdrawal symptoms' },
];

const ADVERSE_EVENTS = [
  'Weight gain, appetite increase, insulin resistance, and metabolic syndrome tendency.',
  'Nausea, dizziness, headache, diarrhea, and early drowsiness.',
  'Low libido, erectile dysfunction, and delayed orgasm/anorgasmia.',
  'Bleeding risk, especially GI bleeding when combined with NSAIDs/anticoagulants.',
  'Insomnia, vivid dreams, emotional blunting, and initial anxiety activation.',
  'Discontinuation symptoms: dizziness, flu-like symptoms, electric shocks, irritability.',
];

const ACTIONS = [
  'Recheck weight/BMI and waist; consider HbA1c and fasting lipids if weight is increasing.',
  'Ask directly about sexual dysfunction, because it is often under-reported.',
  'Review NSAIDs, aspirin, clopidogrel, anticoagulants, and alcohol use if bleeding risk is present.',
  'If stopping, taper gradually to reduce discontinuation syndrome.',
  'Consider dose timing, sleep hygiene, or switching agents if insomnia or activation persists.',
];

const pillColor = (level: string) => {
  const l = level.toLowerCase();
  if (l.includes('higher') || l.includes('high')) return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-200';
  if (l.includes('moderate') || l.includes('common')) return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-200';
  if (l.includes('low') || l.includes('rare')) return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200';
  return 'bg-muted text-muted-foreground border-border';
};

export const SsriAdverseEventsAssessment = ({ onBack }: Props) => {
  const [drug, setDrug] = useState<DrugKey>('Sertraline');
  const [weeks, setWeeks] = useState('6');
  const [wg, setWg] = useState('2.5');
  const [a1c, setA1c] = useState('5.8');
  const [sexfx, setSexfx] = useState('No');
  const [bleed, setBleed] = useState('No');
  const [sweat, setSweat] = useState<'None' | 'Mild' | 'Moderate' | 'Severe'>('None');

  const { risk, metFlag, sexualFlag, bleedFlag, sweatFlag, weeksNum, wgNum, a1cNum } = useMemo(() => {
    const risk = DRUG_RISK[drug];
    const weeksNum = +weeks;
    const wgNum = +wg;
    const a1cNum = +a1c;
    const metFlag = wgNum >= 2 || a1cNum >= 5.7 ? 'metabolic concern' : 'metabolic reassuring';
    const sexualFlag = sexfx === 'Yes' ? 'sexual adverse effect present' : 'no sexual complaint';
    const bleedFlag = bleed === 'Yes' ? 'higher bleeding concern' : 'no extra bleeding concern';
    const sweatFlag =
      sweat === 'Severe' ? 'ADIES — severe sweating' :
      sweat === 'Moderate' ? 'ADIES — moderate sweating' :
      sweat === 'Mild' ? 'ADIES — mild sweating' :
      'no excessive sweating';
    return { risk, metFlag, sexualFlag, bleedFlag, sweatFlag, weeksNum, wgNum, a1cNum };
  }, [drug, weeks, wg, a1c, sexfx, bleed, sweat]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          )}
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">SSRI Adverse Events Tracker</h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Screen metabolic, sexual, bleeding, sleep, and discontinuation effects for common SSRIs.
        </p>

        <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
          <Card>
            <CardHeader><CardTitle className="text-base">Patient & Drug</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>SSRI</Label>
                  <Select value={drug} onValueChange={(v) => setDrug(v as DrugKey)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(DRUG_RISK) as DrugKey[]).map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Weeks on SSRI</Label>
                  <Input type="number" value={weeks} onChange={(e) => setWeeks(e.target.value)} min={0} max={520} />
                </div>
                <div>
                  <Label>Weight change (kg)</Label>
                  <Input type="number" step="0.1" value={wg} onChange={(e) => setWg(e.target.value)} />
                </div>
                <div>
                  <Label>HbA1c (%)</Label>
                  <Input type="number" step="0.1" value={a1c} onChange={(e) => setA1c(e.target.value)} />
                </div>
                <div>
                  <Label>Has sexual symptoms?</Label>
                  <Select value={sexfx} onValueChange={setSexfx}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Has bleeding risk?</Label>
                  <Select value={bleed} onValueChange={setBleed}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Excessive sweating (ADIES)</Label>
                  <Select value={sweat} onValueChange={(v) => setSweat(v as typeof sweat)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Mild">Mild — occasional</SelectItem>
                      <SelectItem value="Moderate">Moderate — daily, bothersome</SelectItem>
                      <SelectItem value="Severe">Severe — soaks clothes / nocturnal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border p-3 bg-muted/40">
                  <div className="text-xs text-muted-foreground">Metabolic</div>
                  <div className="text-lg font-semibold capitalize">{risk.met}</div>
                </div>
                <div className="rounded-lg border p-3 bg-muted/40">
                  <div className="text-xs text-muted-foreground">Sexual</div>
                  <div className="text-lg font-semibold capitalize">{risk.sex}</div>
                </div>
                <div className="rounded-lg border p-3 bg-muted/40">
                  <div className="text-xs text-muted-foreground">Bleeding</div>
                  <div className="text-lg font-semibold capitalize">{risk.bleed}</div>
                </div>
                <div className="rounded-lg border p-3 bg-muted/40">
                  <div className="text-xs text-muted-foreground">Time on drug</div>
                  <div className="text-lg font-semibold">{weeksNum} wks</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <Badge variant="outline" className={metFlag === 'metabolic concern' ? pillColor('high') : pillColor('low')}>
                    Metabolic {metFlag}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">
                    Weight change {wgNum} kg; HbA1c {a1cNum.toFixed(1)}%. Monitor weight, waist, glucose, and lipids if rising.
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <Badge variant="outline" className={bleed === 'Yes' ? pillColor('high') : pillColor('low')}>
                    Bleeding {bleedFlag}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">
                    Risk rises with NSAIDs, aspirin, and anticoagulants. Watch for melena, hematemesis, easy bruising.
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <Badge variant="outline" className={sexfx === 'Yes' ? pillColor('moderate') : pillColor('low')}>
                    {sexualFlag}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">
                    Sexual side effects are often under-reported — ask directly.
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <Badge variant="outline" className={weeksNum <= 3 ? pillColor('moderate') : pillColor('low')}>
                    {weeksNum <= 3 ? 'Early activation/insomnia possible' : 'Activation usually settles'}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">
                    Anxiety activation and insomnia are most common in the first few weeks.
                  </p>
                </div>
                <div className="rounded-lg border p-3 md:col-span-2">
                  <Badge
                    variant="outline"
                    className={
                      sweat === 'Severe' ? pillColor('high') :
                      sweat === 'Moderate' ? pillColor('moderate') :
                      sweat === 'Mild' ? pillColor('moderate') :
                      pillColor('low')
                    }
                  >
                    {sweatFlag}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">
                    Antidepressant-Induced Excessive Sweating (ADIES): dose-related, often diurnal or nocturnal.
                    Rule out infection, hyperthyroidism, menopause, hypoglycaemia, and serotonin syndrome.
                    Options: dose reduction, switch (mirtazapine, bupropion, agomelatine), or add-on
                    (terazosin, cyproheptadine, benztropine, or topical glycopyrrolate) per specialist advice.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Badge variant="outline" className={pillColor('moderate')}>Typical monitoring</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {MONITORING.map((row) => (
                  <div key={row.time} className="py-2 grid grid-cols-[110px_1fr] gap-3 text-sm">
                    <div className="font-medium">{row.time}</div>
                    <div className="text-muted-foreground">{row.check}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Metabolic effects are usually modest but clinically relevant in some patients; sexual dysfunction,
                GI effects, sleep disturbance, and discontinuation symptoms are common practical problems.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Adverse-event flags
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {ADVERSE_EVENTS.map((a) => <li key={a}>{a}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-2">Suggested actions</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {ACTIONS.map((a) => <li key={a}>{a}</li>)}
              </ul>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          This tool is for screening and follow-up support, not diagnosis or emergency management.
        </p>
      </div>
    </div>
  );
};

export default SsriAdverseEventsAssessment;
