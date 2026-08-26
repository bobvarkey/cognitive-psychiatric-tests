import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Pill, AlertTriangle } from 'lucide-react';
import { ExportButtons } from './ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

interface Props { onBack?: () => void }

type DrugKey =
  | 'Clozapine' | 'Olanzapine' | 'Quetiapine' | 'Risperidone/Paliperidone'
  | 'Haloperidol' | 'Aripiprazole' | 'Lurasidone' | 'Ziprasidone' | 'Other';

const RISK_MAP: Record<DrugKey, { met: string; card: string; qtc: string; notes: string }> = {
  'Clozapine': { met: 'very high', card: 'moderate', qtc: 'moderate', notes: 'Highest weight-gain and diabetes risk; myocarditis vigilance.' },
  'Olanzapine': { met: 'very high', card: 'low-moderate', qtc: 'low-moderate', notes: 'High metabolic burden; frequent weight and glucose checks.' },
  'Quetiapine': { met: 'high', card: 'moderate', qtc: 'moderate', notes: 'Metabolic risk plus QTc caution.' },
  'Risperidone/Paliperidone': { met: 'moderate', card: 'low-moderate', qtc: 'low-moderate', notes: 'Intermediate metabolic risk.' },
  'Haloperidol': { met: 'low-moderate', card: 'moderate', qtc: 'moderate-high', notes: 'Less metabolic burden, more QTc concern.' },
  'Aripiprazole': { met: 'low', card: 'low', qtc: 'low', notes: 'Preferred when metabolic risk matters.' },
  'Lurasidone': { met: 'low', card: 'low', qtc: 'low', notes: 'Lower cardiometabolic risk option.' },
  'Ziprasidone': { met: 'low', card: 'low-moderate', qtc: 'moderate', notes: 'Watch QTc despite low metabolic risk.' },
  'Other': { met: 'unknown', card: 'unknown', qtc: 'unknown', notes: 'Check product-specific profile.' },
};

const MONITORING = [
  { time: 'Baseline', check: 'Weight, BMI, waist, BP, fasting glucose/HbA1c, lipids, QTc if risk' },
  { time: '4–12 weeks', check: 'Weight, BMI, waist, BP; glucose if high risk or rapid gain' },
  { time: '3 months', check: 'Weight, BMI, waist, BP, glucose/HbA1c, lipids' },
  { time: '6 months', check: 'Repeat if abnormal or high risk; review dose and lifestyle' },
  { time: 'Yearly', check: 'Weight/BMI, waist, BP, glucose/HbA1c, lipids, cardiovascular review' },
];

const ADVERSE_EVENTS = [
  'Weight gain, waist expansion, and appetite increase.',
  'Hyperglycemia, new diabetes, or rapid HbA1c rise.',
  'Dyslipidemia, especially triglycerides and low HDL.',
  'QTc prolongation, syncope, palpitations, or torsades risk.',
  'Myocarditis warning signs for clozapine: chest pain, dyspnea, fever, tachycardia.',
];

const ACTIONS = [
  'Reinforce diet, activity, and smoking cessation.',
  'Repeat weight/BP monthly for early phase; glucose and lipids at 3 months.',
  'Consider switch to lower-risk agent if clinically feasible.',
  'Order ECG when QT-risk drugs, symptoms, or interacting meds are present.',
  'Escalate urgent review for chest pain, syncope, severe hyperglycemia, or marked weight gain.',
];

const pillColor = (level: string) => {
  const l = level.toLowerCase();
  if (l.includes('very high') || l.includes('high')) return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-200';
  if (l.includes('moderate')) return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-200';
  if (l.includes('low')) return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200';
  return 'bg-muted text-muted-foreground border-border';
};

export const AntipsychoticMetabolicAssessment = ({ onBack }: Props) => {
  const [age, setAge] = useState('42');
  const [sex, setSex] = useState('Male');
  const [height, setHeight] = useState('168');
  const [waist, setWaist] = useState('92');
  const [weight, setWeight] = useState('78');
  const [drug, setDrug] = useState<DrugKey>('Clozapine');

  const { bmi, whtr, bmiBand, whtrCentral, risk } = useMemo(() => {
    const h = +height, wa = +waist, w = +weight;
    const bmi = h > 0 ? w / ((h / 100) * (h / 100)) : 0;
    const whtr = h > 0 ? wa / h : 0;
    const bmiBand = bmi >= 25 ? 'obesity range' : bmi >= 23 ? 'overweight range' : 'below Indian overweight threshold';
    const whtrCentral = whtr > 0.5;
    return { bmi, whtr, bmiBand, whtrCentral, risk: RISK_MAP[drug] };
  }, [height, waist, weight, drug]);

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
            <h1 className="text-2xl font-bold">Antipsychotic Metabolic Syndrome Tracker</h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Quick risk triage, monitoring schedule, and adverse-event flags for outpatient use.
        </p>

        <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
          <Card>
            <CardHeader><CardTitle className="text-base">Patient & Drug</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Age</Label>
                  <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} min={10} max={120} />
                </div>
                <div>
                  <Label>Sex</Label>
                  <Select value={sex} onValueChange={setSex}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Height (cm)</Label>
                  <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} min={100} max={250} />
                </div>
                <div>
                  <Label>Waist (cm)</Label>
                  <Input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} min={40} max={200} />
                </div>
                <div>
                  <Label>Weight (kg)</Label>
                  <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} min={20} max={300} />
                </div>
                <div>
                  <Label>Antipsychotic</Label>
                  <Select value={drug} onValueChange={(v) => setDrug(v as DrugKey)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(RISK_MAP) as DrugKey[]).map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border p-3 bg-muted/40">
                  <div className="text-xs text-muted-foreground">BMI</div>
                  <div className="text-2xl font-bold">{bmi.toFixed(1)}</div>
                </div>
                <div className="rounded-lg border p-3 bg-muted/40">
                  <div className="text-xs text-muted-foreground">WHtR</div>
                  <div className="text-2xl font-bold">{whtr.toFixed(2)}</div>
                </div>
                <div className="rounded-lg border p-3 bg-muted/40">
                  <div className="text-xs text-muted-foreground">Metabolic risk</div>
                  <div className="text-lg font-semibold capitalize">{risk.met}</div>
                </div>
                <div className="rounded-lg border p-3 bg-muted/40">
                  <div className="text-xs text-muted-foreground">Cardiac risk</div>
                  <div className="text-lg font-semibold capitalize">{risk.card}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <Badge variant="outline" className={whtrCentral ? pillColor('high') : pillColor('low')}>
                    WHtR {whtrCentral ? 'central obesity' : 'acceptable'}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">
                    Waist/height ratio {whtr.toFixed(2)}; {whtrCentral ? 'higher central adiposity risk' : 'within safe range'}.
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <Badge
                    variant="outline"
                    className={bmi >= 25 ? pillColor('high') : bmi >= 23 ? pillColor('moderate') : pillColor('low')}
                  >
                    BMI {bmiBand}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">BMI {bmi.toFixed(1)} using Indian thresholds.</p>
                </div>
              </div>

              <div className="rounded-lg border p-3 bg-muted/30">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">{drug} profile</span>
                  <Badge variant="outline" className={pillColor(risk.met)}>Metabolic: {risk.met}</Badge>
                  <Badge variant="outline" className={pillColor(risk.card)}>Cardiac: {risk.card}</Badge>
                  <Badge variant="outline" className={pillColor(risk.qtc)}>QTc: {risk.qtc}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{risk.notes}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Badge variant="outline" className={pillColor('moderate')}>Monitoring</Badge>
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
                High-risk agents (especially clozapine and olanzapine) merit tighter monitoring. New dyspnea, chest
                pain, syncope, or palpitations = urgent review triggers.
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
              <h3 className="text-base font-semibold mb-2">Action suggestions</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {ACTIONS.map((a) => <li key={a}>{a}</li>)}
              </ul>
            </div>
          </CardContent>
        </Card>

        <ExportButtons
          className="justify-start"
          data={{
            assessmentName: 'Antipsychotic Metabolic Syndrome Tracker',
            date: new Date().toLocaleString(),
            totalScore: `BMI ${bmi.toFixed(1)} · WHtR ${whtr.toFixed(2)}`,
            interpretation: `${drug}: metabolic ${risk.met}, cardiac ${risk.card}, QTc ${risk.qtc}`,
            sections: [
              {
                title: 'Patient & Drug',
                items: [
                  `Age: ${age}`,
                  `Sex: ${sex}`,
                  `Height: ${height} cm`,
                  `Weight: ${weight} kg`,
                  `Waist: ${waist} cm`,
                  `Antipsychotic: ${drug}`,
                ],
                type: 'info',
              },
              {
                title: 'Calculated Risk',
                items: [
                  `BMI: ${bmi.toFixed(1)} (${bmiBand})`,
                  `WHtR: ${whtr.toFixed(2)} (${whtrCentral ? 'central obesity' : 'acceptable'})`,
                  `Metabolic risk: ${risk.met}`,
                  `Cardiac risk: ${risk.card}`,
                  `QTc risk: ${risk.qtc}`,
                  risk.notes,
                ],
                type: risk.met.includes('high') ? 'positive' : 'negative',
              },
              {
                title: 'Monitoring Schedule',
                items: MONITORING.map(row => `${row.time}: ${row.check}`),
                type: 'info',
              },
              {
                title: 'Adverse-event Flags',
                items: ADVERSE_EVENTS,
                type: 'positive',
              },
              {
                title: 'Action Suggestions',
                items: ACTIONS,
                type: 'info',
              },
            ],
            disclaimer: 'WHtR > 0.5 flags central obesity. This tool is for screening and follow-up support, not diagnosis.',
          } as ReportData}
        />

        <p className="text-xs text-muted-foreground">
          WHtR &gt; 0.5 flags central obesity. This tool is for screening and follow-up support, not diagnosis.
        </p>
      </div>
    </div>
  );
};

export default AntipsychoticMetabolicAssessment;
