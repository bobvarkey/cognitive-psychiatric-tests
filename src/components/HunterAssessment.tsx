import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, FlaskConical, AlertTriangle, CheckCircle2, XCircle, Info, Pill, ChevronDown, Copy, Stethoscope } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { AssessmentReference } from '@/components/AssessmentReference';
import { toast } from '@/hooks/use-toast';

interface HunterAssessmentProps {
  onBack: () => void;
}

interface DrugGroup {
  mechanism: string;
  drugs: string[];
  // optional collapsible sub-classes with member medications
  subGroups?: { name: string; members: string[] }[];
}

// Serotonergic agents grouped by mechanism (Table 1)
const serotonergicAgents: DrugGroup[] = [
  { mechanism: 'Increased Serotonin Synthesis', drugs: ['Tryptophan'] },
  {
    mechanism: 'Inhibit Serotonin Metabolism',
    drugs: ['MAO-Inhibitors', "St. John's Wort", 'Linezolid', 'Tedizolid', 'Methylene Blue', 'Procarbazine', 'Syrian Rue'],
  },
  {
    mechanism: 'Increased Serotonin Exocytosis',
    drugs: ['Cocaine', 'Ecstasy (MDMA)', 'Dextromethorphan', 'Opiates'],
  },
  {
    mechanism: 'Increased 5-HT1 Activation',
    drugs: ['Buspirone', 'Triptans', 'Ergot Derivatives', 'LSD', 'Mirtazapine', 'Trazodone', 'Lithium'],
  },
  {
    mechanism: '5-HT2A Antagonism',
    drugs: ['Atypical antipsychotics', 'Chlorpromazine'],
  },
  {
    mechanism: 'Reuptake Inhibition',
    drugs: [],
    subGroups: [
      {
        name: 'SSRIs (Selective Serotonin Reuptake Inhibitors)',
        members: ['Fluoxetine', 'Sertraline', 'Paroxetine', 'Citalopram', 'Escitalopram', 'Fluvoxamine'],
      },
      {
        name: 'SNRIs (Serotonin–Norepinephrine Reuptake Inhibitors)',
        members: ['Venlafaxine', 'Desvenlafaxine', 'Duloxetine', 'Milnacipran', 'Levomilnacipran'],
      },
      {
        name: 'TCAs (Tricyclic Antidepressants)',
        members: ['Clomipramine', 'Imipramine', 'Amitriptyline'],
      },
      {
        name: 'Other reuptake inhibitors',
        members: ['Tramadol', 'Meperidine', 'Tapentadol'],
      },
    ],
  },
];

const exposureClarifications = [
  'Initiation or increase in the dose of a serotonergic agent',
  'Pharmacologic change that decreases the metabolism of a serotonergic agent',
  'Overdose with a serotonergic agent (unless the only agent exposed is a 5-HT receptor agonist)',
  'Drug–drug interactions involving direct serotonin receptor agonists (5-HT activation)',
];

type CriterionKey =
  | 'spontaneousClonus'
  | 'inducibleClonusAgitationOrDiaphoresis'
  | 'ocularClonusAgitationAndDiaphoresis'
  | 'tremorAndHyperreflexia'
  | 'hypertoniaTempClonus';

const clinicalCriteria: { key: CriterionKey; label: string }[] = [
  { key: 'spontaneousClonus', label: 'Spontaneous clonus' },
  { key: 'inducibleClonusAgitationOrDiaphoresis', label: 'Inducible clonus WITH agitation OR diaphoresis' },
  { key: 'ocularClonusAgitationAndDiaphoresis', label: 'Ocular clonus WITH agitation AND diaphoresis' },
  { key: 'tremorAndHyperreflexia', label: 'Tremor AND hyperreflexia' },
  { key: 'hypertoniaTempClonus', label: 'Hypertonia AND temperature > 38 °C AND (ocular OR inducible clonus)' },
];

const treatmentOptions: { severity: string; tone: string; items: string[] }[] = [
  {
    severity: 'All patients — first steps',
    tone: 'text-amber-200',
    items: [
      'Immediately discontinue ALL serotonergic agents',
      'Supportive care: IV fluids, continuous cardiac monitoring, correct vital signs',
      'Identify and document every implicated drug (see selection above)',
    ],
  },
  {
    severity: 'Mild (afebrile, tremor / hyperreflexia)',
    tone: 'text-emerald-200',
    items: [
      'Observation 6–24 hours in monitored setting',
      'Benzodiazepines (e.g., lorazepam 1–2 mg IV) for agitation and tremor',
      'Discharge with clear avoidance counseling once symptoms resolve',
    ],
  },
  {
    severity: 'Moderate (tachycardia, hypertension, T 38–40 °C, clonus)',
    tone: 'text-orange-200',
    items: [
      'Aggressive benzodiazepines for agitation, clonus, and autonomic instability',
      'Active external cooling for hyperthermia',
      'Cyproheptadine 12 mg PO/NG initial, then 2 mg q2h until response (max 32 mg/24 h)',
      'Admit to monitored bed; correct hypertension with short-acting agents (esmolol, nitroprusside)',
    ],
  },
  {
    severity: 'Severe (T > 41 °C, rigidity, rhabdomyolysis, DIC)',
    tone: 'text-rose-200',
    items: [
      'MEDICAL EMERGENCY — ICU admission',
      'Immediate sedation, intubation, and neuromuscular paralysis (non-depolarizing, e.g., vecuronium) — AVOID succinylcholine (hyperkalemia risk)',
      'Aggressive cooling to target < 38.5 °C',
      'Cyproheptadine via NG tube as adjunct',
      'Treat rhabdomyolysis, DIC, metabolic acidosis, and renal failure as they arise',
      'AVOID: bromocriptine, dantrolene, antipyretics, physical restraints (worsen hyperthermia)',
    ],
  },
];

export const HunterAssessment: React.FC<HunterAssessmentProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const isMl = language === 'ml';

  const [exposure, setExposure] = useState<boolean | null>(null);
  const [criteria, setCriteria] = useState<Record<CriterionKey, boolean>>({
    spontaneousClonus: false,
    inducibleClonusAgitationOrDiaphoresis: false,
    ocularClonusAgitationAndDiaphoresis: false,
    tremorAndHyperreflexia: false,
    hypertoniaTempClonus: false,
  });
  const [implicatedDrugs, setImplicatedDrugs] = useState<Set<string>>(new Set());

  const meetsAnyCriterion = useMemo(() => Object.values(criteria).some(Boolean), [criteria]);
  const meetsHunter = exposure === true && meetsAnyCriterion;

  const toggleCriterion = (key: CriterionKey) =>
    setCriteria((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleDrug = (drug: string) =>
    setImplicatedDrugs((prev) => {
      const next = new Set(prev);
      if (next.has(drug)) next.delete(drug);
      else next.add(drug);
      return next;
    });

  const handleReset = () => {
    setExposure(null);
    setCriteria({
      spontaneousClonus: false,
      inducibleClonusAgitationOrDiaphoresis: false,
      ocularClonusAgitationAndDiaphoresis: false,
      tremorAndHyperreflexia: false,
      hypertoniaTempClonus: false,
    });
    setImplicatedDrugs(new Set());
  };

  const positiveCount = Object.values(criteria).filter(Boolean).length;

  const exportText = useMemo(() => {
    const lines: string[] = [];
    lines.push('HUNTER SEROTONIN TOXICITY CRITERIA — ASSESSMENT');
    lines.push('================================================');
    lines.push(`Recent serotonergic exposure: ${exposure === null ? 'Not specified' : exposure ? 'Yes' : 'No'}`);
    lines.push('');
    lines.push('Clinical criteria present:');
    const positives = clinicalCriteria.filter((c) => criteria[c.key]);
    if (positives.length === 0) lines.push('  • None');
    else positives.forEach((c) => lines.push(`  • ${c.label}`));
    lines.push('');
    lines.push('Implicated serotonergic agent(s):');
    if (implicatedDrugs.size === 0) lines.push('  • None selected');
    else Array.from(implicatedDrugs).sort().forEach((d) => lines.push(`  • ${d}`));
    lines.push('');
    lines.push(`Verdict: ${meetsHunter ? 'Hunter Criteria MET — Serotonin Syndrome likely' : 'Hunter Criteria NOT met'}`);
    return lines.join('\n');
  }, [exposure, criteria, implicatedDrugs, meetsHunter]);

  const copyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      toast({ title: 'Copied', description: 'Assessment text copied to clipboard.' });
    } catch {
      toast({ title: 'Copy failed', description: 'Please select and copy manually.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack} className="gap-2 bg-slate-900 border-border text-white hover:bg-slate-800 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            {isMl ? 'തിരികെ' : 'Back'}
          </Button>
          <LanguageToggle />
        </div>

        <PatientInfoForm />

        {/* Header */}
        <Card className="mb-6 bg-slate-900 border-border text-white border-l-4 border-l-rose-500">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md">
                <FlaskConical className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl md:text-3xl text-foreground">
                  Hunter Toxicity Criteria Decision Rules
                </CardTitle>
                <CardDescription className="mt-1 text-slate-300 text-base">
                  Bedside decision rule for diagnosing serotonin syndrome (sensitivity 84%, specificity 97%).
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Alert className="bg-slate-800 border-input text-white">
              <Info className="h-4 w-4 text-rose-700 dark:text-rose-300" />
              <AlertDescription className="text-sm text-foreground">
                Diagnosis requires <strong className="text-rose-700 dark:text-rose-300">recent serotonergic exposure</strong> PLUS{' '}
                <strong className="text-rose-700 dark:text-rose-300">at least one</strong> of the five clinical findings below.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Step 1: Exposure */}
        <Card className="mb-6 bg-slate-900 border-border text-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
              <Pill className="h-5 w-5 text-rose-700 dark:text-rose-400" />
              Step 1 — Recent serotonergic exposure?
            </CardTitle>
            <CardDescription className="text-slate-300 text-base">
              History of recent exposure to a serotonergic drug (see clarifications below).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className={exposure === true ? 'bg-rose-600 hover:bg-rose-700 border-rose-600 text-white' : 'bg-slate-800 border-input text-white hover:bg-slate-700 hover:text-white'}
                onClick={() => setExposure(true)}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Yes
              </Button>
              <Button
                variant="outline"
                className={exposure === false ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white' : 'bg-slate-800 border-input text-white hover:bg-slate-700 hover:text-white'}
                onClick={() => setExposure(false)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                No
              </Button>
            </div>

            <div className="rounded-lg border border-border bg-slate-800/60 p-4">
              <p className="text-sm font-semibold mb-2 text-foreground">Exposure clarifications</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-200">
                {exposureClarifications.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <p className="text-xs text-slate-400 mt-3 italic">
                Patients on stable, tolerated doses of a serotonergic agent are unlikely to develop serotonin syndrome spontaneously.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Clinical criteria */}
        <Card className="mb-6 bg-slate-900 border-border text-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-400" />
              Step 2 — Clinical criteria (≥ 1 required)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clinicalCriteria.map((c) => (
                <label
                  key={c.key}
                  htmlFor={c.key}
                  className="flex items-start gap-3 p-4 rounded-lg border border-border bg-slate-800/60 cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <Checkbox
                    id={c.key}
                    checked={criteria[c.key]}
                    onCheckedChange={() => toggleCriterion(c.key)}
                    className="mt-0.5 border-slate-400 data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600"
                  />
                  <span className="text-base font-medium leading-relaxed text-foreground">{c.label}</span>
                </label>
              ))}
            </div>
            <p className="text-sm text-slate-300 mt-3">{positiveCount} of 5 criteria selected.</p>
          </CardContent>
        </Card>

        {/* Implicated agents */}
        <Card className="mb-6 bg-slate-900 border-border text-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
              <Pill className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
              Implicated serotonergic agent(s) — tick all that apply
            </CardTitle>
            <CardDescription className="text-slate-300 text-base">
              Selections are included in the exported assessment text below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {serotonergicAgents.map((group) => (
              <div key={group.mechanism} className="rounded-lg border border-border p-3 bg-slate-800/40">
                <p className="text-base font-semibold mb-3 text-foreground">{group.mechanism}</p>

                {group.drugs.length > 0 && (
                  <div className="space-y-2">
                    {group.drugs.map((drug) => (
                      <label
                        key={drug}
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-700/50 cursor-pointer"
                      >
                        <Checkbox
                          checked={implicatedDrugs.has(drug)}
                          onCheckedChange={() => toggleDrug(drug)}
                          className="border-slate-400 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        />
                        <span className="text-sm text-foreground">{drug}</span>
                      </label>
                    ))}
                  </div>
                )}

                {group.subGroups && (
                  <div className="space-y-2">
                    {group.subGroups.map((sub) => (
                      <Collapsible key={sub.name}>
                        <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-md bg-slate-800 hover:bg-slate-700 px-3 py-2 text-left">
                          <span className="text-sm font-semibold text-foreground">{sub.name}</span>
                          <ChevronDown className="h-4 w-4 text-slate-300 transition-transform group-data-[state=open]:rotate-180" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 ml-2 space-y-1 border-l-2 border-border pl-3">
                          {sub.members.map((med) => (
                            <label
                              key={med}
                              className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-slate-700/50 cursor-pointer"
                            >
                              <Checkbox
                                checked={implicatedDrugs.has(med)}
                                onCheckedChange={() => toggleDrug(med)}
                                className="border-slate-400 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                              />
                              <span className="text-sm text-foreground">{med}</span>
                            </label>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {implicatedDrugs.size > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 p-3 rounded-md bg-slate-800/60 border border-border">
                <span className="text-sm text-slate-300 w-full mb-1">Selected agents ({implicatedDrugs.size}):</span>
                {Array.from(implicatedDrugs).sort().map((d) => (
                  <Badge key={d} className="bg-indigo-600 text-white hover:bg-indigo-700">{d}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Result */}
        <Card
          className={`mb-6 border-2 text-foreground ${
            meetsHunter
              ? 'border-rose-500 bg-rose-950/60'
              : exposure === false || (exposure === true && !meetsAnyCriterion)
              ? 'border-emerald-500 bg-emerald-950/60'
              : 'border-border bg-slate-900'
          }`}
        >
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-foreground">
              {meetsHunter ? (
                <>
                  <AlertTriangle className="h-5 w-5 text-rose-700 dark:text-rose-300" />
                  Hunter Criteria MET — Serotonin Syndrome likely
                </>
              ) : exposure === null ? (
                <>
                  <Info className="h-5 w-5 text-slate-300" />
                  Awaiting input
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Hunter Criteria NOT met
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-base text-foreground">
            {meetsHunter ? (
              <>
                <p className="font-semibold">
                  Recent serotonergic exposure + {positiveCount} clinical criterion{positiveCount > 1 ? 'a' : ''} present.
                </p>
                <p className="text-slate-200">
                  Discontinue the offending serotonergic agent, provide supportive care (cooling, hydration, benzodiazepines for agitation/clonus). Consider cyproheptadine in moderate–severe cases. Admit for monitoring; hyperthermia &gt; 41 °C is a medical emergency.
                </p>
              </>
            ) : exposure === false ? (
              <p>No recent serotonergic exposure — Hunter Criteria cannot be met. Consider alternative diagnoses (NMS, anticholinergic toxicity, malignant hyperthermia, sympathomimetic toxicity).</p>
            ) : exposure === true && !meetsAnyCriterion ? (
              <p>Recent serotonergic exposure documented but no qualifying clinical criterion present. Continue observation; reassess if features evolve.</p>
            ) : (
              <p className="text-slate-300">Indicate exposure and select any clinical criteria present.</p>
            )}
          </CardContent>
        </Card>

        {/* Treatment options */}
        <Card className="mb-6 bg-slate-900 border-border text-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
              <Stethoscope className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
              Treatment options by severity
            </CardTitle>
            <CardDescription className="text-slate-300 text-base">
              Stepwise management of serotonin syndrome (Boyer & Shannon, NEJM 2005; UpToDate 2024).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {treatmentOptions.map((tier) => (
              <div key={tier.severity} className="rounded-lg border border-border bg-slate-800/60 p-4">
                <p className={`text-base font-semibold mb-2 ${tier.tone}`}>{tier.severity}</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                  {tier.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Export */}
        <Card className="mb-6 bg-slate-900 border-border text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg text-foreground">Export / final text</CardTitle>
            <Button onClick={copyExport} variant="outline" size="sm" className="bg-slate-800 border-input text-white hover:bg-slate-700 hover:text-white gap-2">
              <Copy className="h-4 w-4" /> Copy
            </Button>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap font-mono bg-black border border-border rounded-md p-4 text-slate-100 leading-relaxed">
{exportText}
            </pre>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleReset} variant="outline" className="flex-1 bg-slate-800 border-input text-white hover:bg-slate-700 hover:text-white">
            Reset
          </Button>
        </div>
      </div>
      <AssessmentReference assessmentKey="hunter" />
    </div>
  );
};
