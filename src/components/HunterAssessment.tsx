import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, FlaskConical, AlertTriangle, CheckCircle2, XCircle, Info, Pill } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { AssessmentReference } from '@/components/AssessmentReference';

interface HunterAssessmentProps {
  onBack: () => void;
}

// Serotonergic agents grouped by mechanism (Table 1)
const serotonergicAgents: { mechanism: string; drugs: string[] }[] = [
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
    drugs: ['SSRIs', 'SNRIs'],
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

  const meetsAnyCriterion = useMemo(
    () => Object.values(criteria).some(Boolean),
    [criteria]
  );
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

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {isMl ? 'തിരികെ' : 'Back'}
          </Button>
          <LanguageToggle />
        </div>

        <PatientInfoForm />

        {/* Header */}
        <Card className="mb-6 border-l-4 border-l-rose-500">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md">
                <FlaskConical className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl md:text-3xl">
                  Hunter Toxicity Criteria Decision Rules
                </CardTitle>
                <CardDescription className="mt-1">
                  Bedside decision rule for diagnosing serotonin syndrome (sensitivity 84%, specificity 97%).
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Diagnosis requires <strong>recent serotonergic exposure</strong> PLUS{' '}
                <strong>at least one</strong> of the five clinical findings below.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Step 1: Exposure */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Pill className="h-5 w-5 text-rose-600" />
              Step 1 — Recent serotonergic exposure?
            </CardTitle>
            <CardDescription>
              History of recent exposure to a serotonergic drug (see clarifications below).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button
                variant={exposure === true ? 'default' : 'outline'}
                className={exposure === true ? 'bg-rose-600 hover:bg-rose-700' : ''}
                onClick={() => setExposure(true)}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Yes
              </Button>
              <Button
                variant={exposure === false ? 'default' : 'outline'}
                className={exposure === false ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                onClick={() => setExposure(false)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                No
              </Button>
            </div>

            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="text-sm font-semibold mb-2">Exposure clarifications</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {exposureClarifications.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-3 italic">
                Patients on stable, tolerated doses of a serotonergic agent are unlikely to develop
                serotonin syndrome spontaneously.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Clinical criteria */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Step 2 — Clinical criteria (≥ 1 required)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="colorful-questions space-y-3">
              {clinicalCriteria.map((c) => (
                <label
                  key={c.key}
                  htmlFor={c.key}
                  className="flex items-start gap-3 p-4 rounded-lg border bg-card cursor-pointer hover:bg-accent/40 transition-colors"
                >
                  <Checkbox
                    id={c.key}
                    checked={criteria[c.key]}
                    onCheckedChange={() => toggleCriterion(c.key)}
                    className="mt-0.5"
                  />
                  <span className="text-sm font-medium leading-relaxed">{c.label}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {positiveCount} of 5 criteria selected.
            </p>
          </CardContent>
        </Card>

        {/* Implicated agents */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Pill className="h-5 w-5 text-indigo-600" />
              Implicated serotonergic agent(s) — optional
            </CardTitle>
            <CardDescription>
              Major mechanisms of common substances and medications that modulate the serotonergic system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {serotonergicAgents.map((group) => (
                <div key={group.mechanism} className="rounded-lg border p-3 bg-muted/30">
                  <p className="text-sm font-semibold mb-2">{group.mechanism}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.drugs.map((drug) => {
                      const active = implicatedDrugs.has(drug);
                      return (
                        <button
                          key={drug}
                          type="button"
                          onClick={() => toggleDrug(drug)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                            active
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-background hover:bg-accent border-border'
                          }`}
                        >
                          {drug}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {implicatedDrugs.size > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Selected:</span>
                {Array.from(implicatedDrugs).map((d) => (
                  <Badge key={d} variant="secondary">{d}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Result */}
        <Card
          className={`mb-6 border-2 ${
            meetsHunter
              ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30'
              : exposure === false || (exposure === true && !meetsAnyCriterion)
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
              : 'border-muted'
          }`}
        >
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              {meetsHunter ? (
                <>
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                  Hunter Criteria MET — Serotonin Syndrome likely
                </>
              ) : exposure === null ? (
                <>
                  <Info className="h-5 w-5 text-muted-foreground" />
                  Awaiting input
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  Hunter Criteria NOT met
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {meetsHunter ? (
              <>
                <p className="font-semibold">
                  Recent serotonergic exposure + {positiveCount} clinical criterion
                  {positiveCount > 1 ? 'a' : ''} present.
                </p>
                <p className="text-muted-foreground">
                  Discontinue the offending serotonergic agent, provide supportive care
                  (cooling, hydration, benzodiazepines for agitation/clonus). Consider
                  cyproheptadine in moderate–severe cases. Admit for monitoring;
                  hyperthermia &gt; 41 °C is a medical emergency.
                </p>
              </>
            ) : exposure === false ? (
              <p>No recent serotonergic exposure — Hunter Criteria cannot be met. Consider alternative diagnoses (NMS, anticholinergic toxicity, malignant hyperthermia, sympathomimetic toxicity).</p>
            ) : exposure === true && !meetsAnyCriterion ? (
              <p>Recent serotonergic exposure documented but no qualifying clinical criterion present. Continue observation; reassess if features evolve.</p>
            ) : (
              <p className="text-muted-foreground">Indicate exposure and select any clinical criteria present.</p>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleReset} variant="outline" className="flex-1">
            Reset
          </Button>
        </div>
      </div>
      <AssessmentReference assessmentKey="hunter" />

    </div>
  );
};
