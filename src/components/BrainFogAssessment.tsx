import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Brain, AlertTriangle, Copy, RotateCcw, Check } from 'lucide-react';
import { AssessmentReference } from '@/components/AssessmentReference';

interface Props { onBack?: () => void }

type Section = {
  id: string;
  title: string;
  items: string[];
  danger?: boolean;
};

const CONFIRM: string[] = [
  'Difficulty concentrating',
  'Memory impairment',
  'Slowed thinking',
  'Reduced attention',
  'Mental fatigue',
  'Executive dysfunction',
];

const MIMICS: string[] = [
  'Delirium',
  'Dementia',
  'Depression',
  'Sleep deprivation',
  'Medication adverse effects',
];

const RED_FLAGS: string[] = [
  'Acute confusion or delirium',
  'Altered consciousness',
  'New focal neurological deficit',
  'Seizure',
  'Fever or meningism',
  'Severe headache',
  'Rapid cognitive decline',
  'Progressive course over weeks–months',
  'Systemic features (fever, weight loss, rash)',
  'Age >60 with new-onset cognitive decline',
  'CSF or imaging abnormalities',
];

const ONSET = ['Acute', 'Subacute', 'Chronic', 'Fluctuating'];
const TEMPORAL = ['Morning', 'Evening', 'Post-prandial', 'Episodic'];

const ASSOC_NEURO = ['Headache', 'Vertigo', 'Weakness', 'Tremor', 'Sensory symptoms'];
const ASSOC_PSYCH = ['Anxiety', 'Depression', 'Stress', 'ADHD symptoms'];
const ASSOC_SLEEP = ['Snoring', 'Excessive daytime sleepiness', 'Insomnia', 'Shift work'];
const ASSOC_SYS = ['Fatigue', 'Weight loss', 'Fever', 'Joint pain'];

const MEDS: string[] = [
  'Sedatives', 'Anticholinergics', 'Antihistamines', 'Opioids', 'Alcohol',
  'Cannabis', 'Benzodiazepines', 'Antiepileptics', 'Beta-blockers', 'Tenofovir',
];

const CAUSE_CATEGORIES: { key: string; title: string; conditions: string[]; workup?: string[] }[] = [
  {
    key: 'postviral',
    title: 'Infectious / Post-viral',
    conditions: ['Long COVID', 'Post-viral fatigue syndrome', 'ME/CFS (myalgic encephalomyelitis)', 'POTS / dysautonomia', 'Hepatitis C', 'Chronic Lyme / post-treatment Lyme'],
    workup: ['Post-exertional malaise screen', 'Active stand / tilt test for POTS', 'Lyme serology', 'Hepatitis C serology'],
  },
  {
    key: 'sleep',
    title: 'Sleep disorders',
    conditions: ['Obstructive sleep apnea', 'Sleep deprivation', 'Circadian rhythm disorder', 'Narcolepsy', 'Restless legs syndrome'],
    workup: ['Sleep study (polysomnography) if indicated'],
  },
  {
    key: 'metabolic',
    title: 'Metabolic / Endocrine',
    conditions: ['Hypothyroidism', 'Hypoparathyroidism', 'Diabetes', 'Menopausal hormonal shift', 'Low free testosterone', 'Electrolyte imbalance', 'Vitamin B12 deficiency', 'Folate deficiency', 'Iron deficiency', 'Vitamin D deficiency', 'Magnesium deficiency', 'Hyperhomocysteinemia', 'Hepatic disease', 'Renal disease'],
    workup: ['CBC', 'CMP', 'HbA1c', 'TSH + Free T3/T4', 'Holotranscobalamin (or B12)', 'Folate', 'Ferritin', 'Vitamin D', 'RBC magnesium', 'Homocysteine', 'PTH + calcium', 'Free testosterone'],
  },
  {
    key: 'psych',
    title: 'Psychiatric',
    conditions: ['Depression', 'Anxiety', 'Burnout', 'PTSD', 'Somatic symptom disorder'],
    workup: ['PHQ-9', 'GAD-7'],
  },
  {
    key: 'neuro',
    title: 'Neurological',
    conditions: ['Mild cognitive impairment', 'Dementia', 'Multiple sclerosis (check McDonald criteria)', 'Parkinson disease', 'Epilepsy', 'Migraine', 'Autoimmune / NMDAR encephalitis', 'CNS vasculitis', 'Subclavian steal syndrome'],
    workup: ['MRI brain (FLAIR/DWI)', 'EEG', 'CSF studies', 'Neuropsychological testing', 'Carotid / vertebral Doppler'],
  },
  {
    key: 'autoimmune',
    title: 'Systemic / Autoimmune / Inflammatory',
    conditions: ['SLE', 'Sjögren syndrome', 'Sarcoidosis', 'Vasculitis', 'Celiac disease', 'Chronic infection', 'Chemotherapy-related ("chemo-brain")'],
    workup: ['ANA', 'dsDNA', 'ANCA', 'Complement', 'ESR/CRP', 'hsCRP', 'GGT'],
  },
  {
    key: 'drug',
    title: 'Medication / Substance-related',
    conditions: ['Benzodiazepines', 'Anticholinergics', 'Antihistamines', 'Antiepileptics', 'Opioids', 'Alcohol', 'Recreational drugs', 'Drug-induced'],
    workup: ['Review medications and substance exposure'],
  },
  {
    key: 'lifestyle',
    title: 'Lifestyle contributors',
    conditions: ['Chronic stress', 'Sedentary lifestyle', 'Poor nutrition', 'Dehydration', 'Excess caffeine', 'Overwork'],
    workup: ['Lifestyle optimization'],
  },
];

const FIRST_LINE_LABS = ['CBC', 'ESR/CRP', 'Electrolytes', 'Liver function', 'Renal function', 'Calcium', 'PTH', 'Magnesium', 'HbA1c', 'Fasting glucose', 'TSH', 'Free T4', 'Vitamin B12', 'Folate', 'Ferritin', 'Vitamin D'];
const ADDITIONAL_LABS = [
  'Sleep study (polysomnography)',
  'Homocysteine',
  'Carotid / vertebral Doppler (steal phenomenon)',
  'Free testosterone',
  'Free T3',
  'RBC magnesium',
  'hsCRP',
  'GGT',
  'Holotranscobalamin (in place of B12)',
  'Lyme serology',
  'TSH (repeat / reflex)',
  'Magnesium (serum)',
  'HIV',
  'Syphilis',
  'ANA / dsDNA / ANCA / complement',
  'Hepatitis serology',
  'Cortisol (selected cases)',
  'Celiac serology',
  'Active stand / tilt test (POTS)',
  'Post-exertional malaise screen (ME/CFS)',
];

const MANAGEMENT = [
  'Treat the underlying cause',
  'Optimize sleep',
  'Regular exercise',
  'Mediterranean-style diet',
  'Correct vitamin deficiencies',
  'Treat anxiety and depression',
  'Medication optimization',
  'Cognitive rehabilitation if persistent',
];

const REVERSIBLE = [
  'Sleep deprivation or OSA', 'Depression and anxiety', 'Hypothyroidism',
  'Vitamin B12 deficiency', 'Iron deficiency', 'Medication adverse effects',
  'Long COVID', 'Uncontrolled diabetes', 'Drug-induced causes',
  'Excess daytime sleepiness', 'Fibromyalgia', 'Narcolepsy',
  'Inflammatory CV risk factors', 'Subclavian steal syndrome', 'Dementia',
];

const EXCLUDE_FIRST = [
  'Delirium', 'Stroke', 'CNS infection', 'Autoimmune encephalitis',
  'Rapidly progressive dementia', 'Toxic-metabolic encephalopathy',
];

interface CheckGroupProps {
  title: string;
  items: string[];
  selected: Set<string>;
  onToggle: (v: string) => void;
  danger?: boolean;
}

const CheckGroup = ({ title, items, selected, onToggle, danger }: CheckGroupProps) => (
  <div>
    <p className={`text-sm font-semibold mb-2 ${danger ? 'text-red-700' : 'text-slate-900'}`}>{title}</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {items.map((it) => {
        const id = `${title}-${it}`;
        return (
          <label
            key={it}
            htmlFor={id}
            className={`flex items-start gap-2 p-2 rounded-md border cursor-pointer transition-colors ${
              selected.has(it)
                ? danger
                  ? 'border-red-400 bg-red-50'
                  : 'border-primary bg-primary/5'
                : 'border-border bg-white hover:border-primary/30'
            }`}
          >
            <Checkbox
              id={id}
              checked={selected.has(it)}
              onCheckedChange={() => onToggle(it)}
              className="mt-0.5"
            />
            <span className="text-sm text-slate-900">{it}</span>
          </label>
        );
      })}
    </div>
  </div>
);

export const BrainFogAssessment = ({ onBack }: Props) => {
  const [confirm, setConfirm] = useState<Set<string>>(new Set());
  const [mimics, setMimics] = useState<Set<string>>(new Set());
  const [redFlags, setRedFlags] = useState<Set<string>>(new Set());
  const [onset, setOnset] = useState<Set<string>>(new Set());
  const [temporal, setTemporal] = useState<Set<string>>(new Set());
  const [neuro, setNeuro] = useState<Set<string>>(new Set());
  const [psych, setPsych] = useState<Set<string>>(new Set());
  const [sleep, setSleep] = useState<Set<string>>(new Set());
  const [systemic, setSystemic] = useState<Set<string>>(new Set());
  const [meds, setMeds] = useState<Set<string>>(new Set());
  const [causes, setCauses] = useState<Set<string>>(new Set());
  const [labs, setLabs] = useState<Set<string>>(new Set());
  const [addLabs, setAddLabs] = useState<Set<string>>(new Set());
  const [mgmt, setMgmt] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  const toggler = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (v: string) => {
    setter((prev) => {
      const n = new Set(prev);
      n.has(v) ? n.delete(v) : n.add(v);
      return n;
    });
  };

  const reset = () => {
    [setConfirm, setMimics, setRedFlags, setOnset, setTemporal, setNeuro, setPsych,
     setSleep, setSystemic, setMeds, setCauses, setLabs, setAddLabs, setMgmt].forEach(s => s(new Set()));
    setNotes('');
  };

  const exportText = useMemo(() => {
    const lines: string[] = [];
    const push = (title: string, s: Set<string>) => {
      if (s.size) lines.push(`${title}:\n  - ${Array.from(s).join('\n  - ')}`);
    };
    lines.push('BRAIN FOG — STRUCTURED CLINICAL NOTE');
    lines.push(`Date: ${new Date().toLocaleString()}`);
    lines.push('');
    push('Step 1 — Confirmatory features present', confirm);
    push('Step 1 — Mimics considered', mimics);
    if (redFlags.size) {
      lines.push('');
      lines.push('*** RED FLAGS PRESENT — EMERGENCY EVALUATION INDICATED ***');
      push('Red flags', redFlags);
      lines.push('Suggested urgent workup: MRI/CT brain, CBC, electrolytes, glucose, infection workup, LP if indicated.');
    }
    push('Step 3 — Onset', onset);
    push('Step 3 — Temporal pattern', temporal);
    push('Associated — Neurological', neuro);
    push('Associated — Psychiatric', psych);
    push('Associated — Sleep', sleep);
    push('Associated — Systemic', systemic);
    push('Contributing medications / substances', meds);
    push('Step 5 — Suspected cause categories / conditions', causes);
    push('Step 6 — First-line labs ordered', labs);
    push('Step 6 — Additional labs ordered', addLabs);
    push('Step 8 — Management plan', mgmt);
    if (notes.trim()) {
      lines.push('');
      lines.push('Clinical notes:');
      lines.push(notes.trim());
    }
    return lines.join('\n');
  }, [confirm, mimics, redFlags, onset, temporal, neuro, psych, sleep, systemic, meds, causes, labs, addLabs, mgmt, notes]);

  const copy = async () => {
    await navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pt-16">
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-3">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      )}

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-slate-900">
          <Brain className="h-7 w-7 text-primary" /> Brain Fog — Clinical Algorithm
        </h1>
        <p className="text-sm text-slate-700 mt-1">
          Structured stepwise evaluation of brain fog: confirm the symptom, screen for red flags,
          characterize the history, categorize likely cause, and generate an exportable note.
        </p>
      </div>

      {/* Definition & phenomenology */}
      <Card className="mb-4 bg-slate-50">
        <CardHeader><CardTitle className="text-lg">Definition & phenomenology</CardTitle></CardHeader>
        <CardContent className="text-sm text-slate-800 space-y-2">
          <p>
            Brain fog is best characterised subjectively as <strong>difficulty focusing and concentrating</strong>.
            Reversibility and non-neurodegenerative mechanisms are considered necessary criteria — otherwise
            the definition expands indefinitely and clinical relevance is lost.
          </p>
          <p>
            Core symptom clusters: <em>fatigue, memory difficulty, attention deficit, slowed thought,
            word-finding difficulty, non-orthostatic dizziness, muscle pain</em>. Patients use "brain fog" for a
            wide range of subjective phenomena — clarify what the patient means before proceeding.
          </p>
        </CardContent>
      </Card>

      {/* Step 1 */}
      <Card className="mb-4">
        <CardHeader><CardTitle className="text-lg">Step 1 — Confirm the symptom</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <CheckGroup title="Confirmatory features" items={CONFIRM} selected={confirm} onToggle={toggler(setConfirm)} />
          <CheckGroup title="Consider mimics" items={MIMICS} selected={mimics} onToggle={toggler(setMimics)} />
        </CardContent>
      </Card>

      {/* Step 2 */}
      <Card className={`mb-4 ${redFlags.size ? 'border-red-400' : ''}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className={`h-5 w-5 ${redFlags.size ? 'text-red-600' : 'text-amber-500'}`} />
            Step 2 — Red flags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <CheckGroup title="Any of the following present?" items={RED_FLAGS} selected={redFlags} onToggle={toggler(setRedFlags)} danger />
          {redFlags.size > 0 && (
            <div className="p-3 rounded-md bg-red-50 border border-red-300 text-sm text-red-900">
              <p className="font-semibold">Emergency evaluation indicated.</p>
              <p className="mt-1">Suggested workup: MRI or CT brain, CBC, electrolytes, glucose, infection workup, lumbar puncture if indicated.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 3 */}
      <Card className="mb-4">
        <CardHeader><CardTitle className="text-lg">Step 3 — Detailed history</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <CheckGroup title="Onset" items={ONSET} selected={onset} onToggle={toggler(setOnset)} />
          <CheckGroup title="Temporal pattern" items={TEMPORAL} selected={temporal} onToggle={toggler(setTemporal)} />
          <Separator />
          <p className="text-sm font-semibold text-slate-900">Associated symptoms</p>
          <CheckGroup title="Neurological" items={ASSOC_NEURO} selected={neuro} onToggle={toggler(setNeuro)} />
          <CheckGroup title="Psychiatric" items={ASSOC_PSYCH} selected={psych} onToggle={toggler(setPsych)} />
          <CheckGroup title="Sleep" items={ASSOC_SLEEP} selected={sleep} onToggle={toggler(setSleep)} />
          <CheckGroup title="Systemic" items={ASSOC_SYS} selected={systemic} onToggle={toggler(setSystemic)} />
          <Separator />
          <CheckGroup title="Contributing medications / substances" items={MEDS} selected={meds} onToggle={toggler(setMeds)} />
        </CardContent>
      </Card>

      {/* Step 4 hint */}
      <Card className="mb-4">
        <CardHeader><CardTitle className="text-lg">Step 4 — Physical & cognitive exam</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-slate-800">
            Perform general and neurological examination and mental status assessment. Use a targeted
            cognitive battery to document findings:
          </p>
          <ul className="text-sm text-slate-800 list-disc pl-5 space-y-1">
            <li><strong>MoCA</strong> — primary screener (~10 min); most commonly used in long-COVID brain fog studies.</li>
            <li><strong>Mental Clutter Scale</strong> — validated specifically for brain fog.</li>
            <li><strong>Trail Making Test A & B</strong> — processing speed and executive function.</li>
            <li><strong>Digit Span</strong> — working memory.</li>
            <li><strong>Formal neuropsychological testing</strong> if screening is abnormal.</li>
          </ul>
        </CardContent>
      </Card>

      {/* Step 5 */}
      <Card className="mb-4">
        <CardHeader><CardTitle className="text-lg">Step 5 — Categorize the cause</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          {CAUSE_CATEGORIES.map((cat) => (
            <div key={cat.key}>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{cat.title}</Badge>
              </div>
              <CheckGroup title="Conditions" items={cat.conditions} selected={causes} onToggle={toggler(setCauses)} />
              {cat.workup && (
                <p className="text-xs text-slate-600 mt-1 italic">
                  Suggested next step: {cat.workup.join(', ')}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Step 6 */}
      <Card className="mb-4">
        <CardHeader><CardTitle className="text-lg">Step 6 — First-line investigations</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <CheckGroup title="Routine blood tests" items={FIRST_LINE_LABS} selected={labs} onToggle={toggler(setLabs)} />
          <CheckGroup title="Additional tests (selected cases)" items={ADDITIONAL_LABS} selected={addLabs} onToggle={toggler(setAddLabs)} />
        </CardContent>
      </Card>

      {/* Step 7 */}
      <Card className="mb-4">
        <CardHeader><CardTitle className="text-lg">Step 7 — Further investigations</CardTitle></CardHeader>
        <CardContent className="text-sm text-slate-800 space-y-1">
          <p><strong>MRI brain:</strong> demyelination, stroke, tumor, neurodegeneration.</p>
          <p><strong>EEG:</strong> episodic confusion, suspected seizures.</p>
          <p><strong>Polysomnography:</strong> sleep apnea, narcolepsy.</p>
          <p><strong>Lumbar puncture:</strong> infection, autoimmune encephalitis, MS.</p>
          <p><strong>Neuropsychological assessment:</strong> for persistent or complex cognitive complaints.</p>
        </CardContent>
      </Card>

      {/* Step 8 */}
      <Card className="mb-4">
        <CardHeader><CardTitle className="text-lg">Step 8 — Management plan</CardTitle></CardHeader>
        <CardContent>
          <CheckGroup title="Select management components" items={MANAGEMENT} selected={mgmt} onToggle={toggler(setMgmt)} />
        </CardContent>
      </Card>

      {/* Pearls */}
      <Card className="mb-4 bg-blue-50 border-blue-200">
        <CardHeader><CardTitle className="text-lg text-slate-900">Quick clinical pearls</CardTitle></CardHeader>
        <CardContent className="text-sm text-slate-900 space-y-3">
          <div>
            <p className="font-semibold mb-1">Most common reversible causes</p>
            <div className="flex flex-wrap gap-1.5">
              {REVERSIBLE.map((r) => <Badge key={r} variant="outline" className="bg-white">{r}</Badge>)}
            </div>
          </div>
          <div>
            <p className="font-semibold mb-1 text-red-800">Always exclude first</p>
            <div className="flex flex-wrap gap-1.5">
              {EXCLUDE_FIRST.map((r) => <Badge key={r} variant="outline" className="bg-white text-red-700 border-red-300">{r}</Badge>)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="mb-4">
        <CardHeader><CardTitle className="text-lg">Clinical notes</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Free-text observations, plan, follow-up…"
            className="min-h-[100px] bg-white text-slate-900"
          />
        </CardContent>
      </Card>

      {/* Export */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Exportable note</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={reset}>
                <RotateCcw className="h-4 w-4 mr-1" /> Reset
              </Button>
              <Button size="sm" onClick={copy}>
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap text-xs bg-white text-slate-900 border border-border rounded-md p-3 max-h-96 overflow-auto">
{exportText}
          </pre>
        </CardContent>
      </Card>

      <AssessmentReference assessmentKey="brainFog" />
    </div>
  );
};

export default BrainFogAssessment;
