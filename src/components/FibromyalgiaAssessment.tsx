import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Activity, CheckCircle2, XCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { AssessmentReference } from '@/components/AssessmentReference';

interface Props {
  onBack?: () => void;
}

// ACR 2010 Widespread Pain Index — 19 body areas
const WPI_AREAS = [
  'Shoulder girdle, left', 'Shoulder girdle, right',
  'Upper arm, left', 'Upper arm, right',
  'Lower arm, left', 'Lower arm, right',
  'Hip (buttock), left', 'Hip (buttock), right',
  'Upper leg, left', 'Upper leg, right',
  'Lower leg, left', 'Lower leg, right',
  'Jaw, left', 'Jaw, right',
  'Chest', 'Abdomen',
  'Neck', 'Upper back', 'Lower back',
];

// ACR 2010 Part 2A — three severity items
const SSS_ITEMS: { id: 'fatigue' | 'unrefreshed' | 'cognitive'; label: string }[] = [
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'unrefreshed', label: 'Waking unrefreshed' },
  { id: 'cognitive', label: 'Cognitive symptoms (memory / thinking)' },
];

const SEVERITY_OPTIONS = [
  { value: 0, label: 'No problem' },
  { value: 1, label: 'Slight or mild — generally mild or intermittent' },
  { value: 2, label: 'Moderate — considerable, often present and/or moderate level' },
  { value: 3, label: 'Severe — pervasive, continuous, life-disturbing' },
];

// Part 2B — somatic symptoms checklist (from the UMass / Wolfe 2010 handout)
const SOMATIC_SYMPTOMS = [
  'Muscle pain', 'Irritable bowel syndrome', 'Fatigue/tiredness', 'Thinking or memory problem',
  'Muscle weakness', 'Headache', 'Pain/cramps in abdomen', 'Numbness/tingling',
  'Dizziness', 'Insomnia', 'Depression', 'Constipation', 'Pain in upper abdomen',
  'Nausea', 'Nervousness', 'Chest pain', 'Blurred vision', 'Fever', 'Diarrhea',
  'Dry mouth', 'Itching', 'Wheezing', "Raynaud's phenomenon", 'Hives/welts',
  'Ringing in ears', 'Vomiting', 'Heartburn', 'Oral ulcers', 'Loss/change in taste',
  'Seizures', 'Dry eyes', 'Shortness of breath', 'Loss of appetite', 'Rash',
  'Sun sensitivity', 'Hearing difficulties', 'Easy bruising', 'Hair loss',
  'Frequent urination', 'Bladder spasms',
];

const somaticBand = (n: number) => (n === 0 ? 0 : n <= 10 ? 1 : n <= 24 ? 2 : 3);
const somaticLabel = (n: number) => {
  const b = somaticBand(n);
  return ['No symptoms', 'Few symptoms', 'A moderate number of symptoms', 'A great deal of symptoms'][b];
};

export const FibromyalgiaAssessment = ({ onBack }: Props) => {
  const { t } = useLanguage();
  const [wpi, setWpi] = useState<Record<string, boolean>>({});
  const [sss, setSss] = useState<Record<string, number | undefined>>({});
  const [somatic, setSomatic] = useState<Record<string, boolean>>({});
  const [threeMonths, setThreeMonths] = useState(false);
  const [otherExplains, setOtherExplains] = useState(false);

  const wpiScore = useMemo(() => Object.values(wpi).filter(Boolean).length, [wpi]);
  const sss2aScore = useMemo(
    () => SSS_ITEMS.reduce((s, i) => s + (sss[i.id] ?? 0), 0),
    [sss],
  );
  const somaticCount = useMemo(() => Object.values(somatic).filter(Boolean).length, [somatic]);
  const sss2bScore = somaticBand(somaticCount);
  const ssTotal = sss2aScore + sss2bScore;

  const allSeverityRated = SSS_ITEMS.every((i) => sss[i.id] !== undefined);
  const conditionA = wpiScore >= 7 && ssTotal >= 5;
  const conditionB = wpiScore >= 3 && wpiScore <= 6 && ssTotal >= 9;
  const meetsAcr = (conditionA || conditionB) && threeMonths && !otherExplains;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToMenu')}
          </Button>
        )}

        <PatientInfoForm />

        <Card className="shadow-xl">
          <CardContent className="p-6 md:p-8 space-y-3">
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md">
                <Activity className="h-6 w-6" />
              </span>
              Fibromyalgia — ACR 2010 Criteria
            </h1>
            <p className="text-slate-600">
              Widespread Pain Index (WPI, 0–19) plus Symptom Severity Scale (SSS, 0–12: Part 2A
              fatigue / unrefreshed / cognitive + Part 2B somatic symptom burden). Diagnostic if
              (WPI ≥ 7 and SS ≥ 5) <em>or</em> (WPI 3–6 and SS ≥ 9), with symptoms ≥ 3 months at a
              similar level and no other disorder explaining the pain.
            </p>
          </CardContent>
        </Card>

        {/* Part 1 — WPI */}
        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">
                Part 1 — Widespread Pain Index (past week)
              </h2>
              <span className="text-sm font-mono bg-rose-100 text-rose-800 px-3 py-1 rounded">
                WPI: {wpiScore}/19
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Tick each body area where the patient has felt pain over the past week.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {WPI_AREAS.map((area) => (
                <label
                  key={area}
                  className="flex items-center gap-2 p-2 rounded border bg-white hover:bg-rose-50 cursor-pointer"
                >
                  <Checkbox
                    checked={!!wpi[area]}
                    onCheckedChange={(v) => setWpi((p) => ({ ...p, [area]: !!v }))}
                  />
                  <span className="text-sm text-slate-700">{area}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Part 2A — Severity */}
        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">
                Part 2A — Symptom Severity (each 0–3)
              </h2>
              <span className="text-sm font-mono bg-amber-100 text-amber-800 px-3 py-1 rounded">
                2A: {sss2aScore}/9
              </span>
            </div>
            <div className="space-y-5">
              {SSS_ITEMS.map((item) => (
                <div key={item.id} className="space-y-2">
                  <p className="font-medium text-slate-800">{item.label}</p>
                  <RadioGroup
                    value={sss[item.id]?.toString() ?? ''}
                    onValueChange={(v) => setSss((p) => ({ ...p, [item.id]: Number(v) }))}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                  >
                    {SEVERITY_OPTIONS.map((opt) => (
                      <Label
                        key={opt.value}
                        className="flex items-start gap-2 p-2 rounded border bg-white hover:bg-amber-50 cursor-pointer"
                      >
                        <RadioGroupItem value={opt.value.toString()} className="mt-0.5" />
                        <span className="text-sm text-slate-700">
                          <strong>{opt.value}</strong> — {opt.label}
                        </span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Part 2B — Somatic */}
        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xl font-semibold text-slate-800">
                Part 2B — Other Somatic Symptoms
              </h2>
              <span className="text-sm font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded">
                Count: {somaticCount} → 2B: {sss2bScore}/3
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Tick each symptom present over the past week. Banded: 0 = none, 1–10 = few (1),
              11–24 = moderate (2), ≥ 25 = great deal (3).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {SOMATIC_SYMPTOMS.map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-2 p-2 rounded border bg-white hover:bg-emerald-50 cursor-pointer"
                >
                  <Checkbox
                    checked={!!somatic[s]}
                    onCheckedChange={(v) => setSomatic((p) => ({ ...p, [s]: !!v }))}
                  />
                  <span className="text-sm text-slate-700">{s}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-slate-500 italic">
              Interpreted as: <strong>{somaticLabel(somaticCount)}</strong>
            </p>
          </CardContent>
        </Card>

        {/* Conditions */}
        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Diagnostic Conditions</h2>
            <div className="flex items-center justify-between gap-4 p-3 rounded border bg-white">
              <Label htmlFor="three-months" className="text-sm text-slate-700 leading-snug">
                Symptoms have been present at a similar level for at least 3 months
              </Label>
              <Switch id="three-months" checked={threeMonths} onCheckedChange={setThreeMonths} />
            </div>
            <div className="flex items-center justify-between gap-4 p-3 rounded border bg-white">
              <Label htmlFor="other-cause" className="text-sm text-slate-700 leading-snug">
                Another disorder would otherwise sufficiently explain the pain
              </Label>
              <Switch id="other-cause" checked={otherExplains} onCheckedChange={setOtherExplains} />
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        <Card className="shadow-xl">
          <CardContent className="p-6 space-y-3">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded bg-rose-50 border border-rose-200">
                <div className="text-xs text-rose-700 uppercase">WPI</div>
                <div className="text-2xl font-bold text-rose-800">{wpiScore}</div>
                <div className="text-xs text-rose-700">/ 19</div>
              </div>
              <div className="p-3 rounded bg-amber-50 border border-amber-200">
                <div className="text-xs text-amber-700 uppercase">SSS (2A + 2B)</div>
                <div className="text-2xl font-bold text-amber-800">{ssTotal}</div>
                <div className="text-xs text-amber-700">/ 12</div>
              </div>
              <div className="p-3 rounded bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-600 uppercase">Severity sum</div>
                <div className="text-2xl font-bold text-slate-800">{wpiScore + ssTotal}</div>
                <div className="text-xs text-slate-600">FS / PSD analog</div>
              </div>
            </div>

            {allSeverityRated && (
              <div
                className={`p-4 rounded-lg border-l-4 ${
                  meetsAcr
                    ? 'bg-emerald-50 border-emerald-600'
                    : 'bg-slate-50 border-slate-400'
                }`}
              >
                <div className="flex items-start gap-2">
                  {meetsAcr ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-700 shrink-0" />
                  ) : (
                    <XCircle className="h-6 w-6 text-slate-500 shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold text-slate-800">
                      {meetsAcr
                        ? 'Meets ACR 2010 preliminary criteria for fibromyalgia.'
                        : 'Does not meet ACR 2010 criteria.'}
                    </p>
                    <ul className="text-xs text-slate-600 mt-1 list-disc ml-5 space-y-0.5">
                      <li>
                        Pain pattern: WPI ≥ 7 & SS ≥ 5 — {conditionA ? 'met' : 'not met'}; or
                        WPI 3–6 & SS ≥ 9 — {conditionB ? 'met' : 'not met'}
                      </li>
                      <li>≥ 3 months at similar level — {threeMonths ? 'yes' : 'no'}</li>
                      <li>
                        No other disorder explains pain —{' '}
                        {otherExplains ? 'fails (other cause endorsed)' : 'yes'}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <AssessmentReference assessmentKey="fibromyalgia" />
      </div>
    </div>
  );
};
