import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Brain, RotateCcw, AlertTriangle } from 'lucide-react';
import { ExportButtons } from '@/components/ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

interface Props {
  onBack?: () => void;
}

type FlagKey =
  | 'fluctuating_attention_or_consciousness'
  | 'disorientation_present'
  | 'objective_cognitive_decline'
  | 'dementia_diagnosis_present'
  | 'focal_neurological_signs_present'
  | 'new_seizures_or_epilepsy'
  | 'systemic_features_present'
  | 'known_medical_comorbidity_high_risk'
  | 'brain_imaging_structural_lesion'
  | 'substance_or_medication_trigger'
  | 'mood_symptoms_prominent'
  | 'prominent_visual_hallucinations'
  | 'negative_symptoms_present'
  | 'family_history_psychosis_or_mood'
  | 'autoimmune_red_flags_present'
  | 'mri_or_eeg_suggests_encephalitis'
  | 'prominent_cognitive_decline'
  | 'daphne_screen_available'
  | 'bvftd_behavioral_features_present'
  | 'strong_neurodegenerative_suspicion';

const FLAGS: { key: FlagKey; label: string; group: string }[] = [
  { key: 'fluctuating_attention_or_consciousness', label: 'Fluctuating attention or level of consciousness', group: 'Acute / delirium features' },
  { key: 'disorientation_present', label: 'Disorientation present', group: 'Acute / delirium features' },
  { key: 'objective_cognitive_decline', label: 'Objective cognitive decline (documented or caregiver-reported)', group: 'Cognitive features' },
  { key: 'dementia_diagnosis_present', label: 'Existing dementia diagnosis', group: 'Cognitive features' },
  { key: 'prominent_visual_hallucinations', label: 'Prominent visual hallucinations', group: 'Cognitive features' },
  { key: 'focal_neurological_signs_present', label: 'Focal neurological signs', group: 'Organic / secondary features' },
  { key: 'new_seizures_or_epilepsy', label: 'New seizures or epilepsy', group: 'Organic / secondary features' },
  { key: 'systemic_features_present', label: 'Systemic features (fever, weight loss, night sweats, rash)', group: 'Organic / secondary features' },
  { key: 'known_medical_comorbidity_high_risk', label: 'High-risk medical comorbidity (hepatic/renal failure, endocrine, autoimmune)', group: 'Organic / secondary features' },
  { key: 'brain_imaging_structural_lesion', label: 'Structural lesion on brain imaging', group: 'Organic / secondary features' },
  { key: 'substance_or_medication_trigger', label: 'Recent substance or medication change / trigger', group: 'Substance & medication' },
  { key: 'mood_symptoms_prominent', label: 'Prominent mood symptoms (major depression or mania)', group: 'Mood & primary psychotic features' },
  { key: 'negative_symptoms_present', label: 'Negative symptoms (affective flattening, avolition)', group: 'Mood & primary psychotic features' },
  { key: 'family_history_psychosis_or_mood', label: 'Family history of psychosis or mood disorder', group: 'Mood & primary psychotic features' },
  { key: 'autoimmune_red_flags_present', label: 'Autoimmune red flags (seizures, catatonia, dyskinesias, autonomic instability, rapid onset <3\u20136 months)', group: 'Autoimmune & neurodegenerative flags' },
  { key: 'mri_or_eeg_suggests_encephalitis', label: 'MRI or EEG suggests encephalitis (e.g. limbic changes, extreme delta brush, focal slowing)', group: 'Autoimmune & neurodegenerative flags' },
  { key: 'prominent_cognitive_decline', label: 'Prominent or progressive cognitive decline', group: 'Autoimmune & neurodegenerative flags' },
  { key: 'bvftd_behavioral_features_present', label: 'bvFTD behavioural features (disinhibition, apathy, hyperorality, loss of empathy, perseverations)', group: 'Autoimmune & neurodegenerative flags' },
  { key: 'daphne_screen_available', label: 'DAPHNE screen available', group: 'Autoimmune & neurodegenerative flags' },
  { key: 'strong_neurodegenerative_suspicion', label: 'Strong clinician suspicion of neurodegenerative disease', group: 'Autoimmune & neurodegenerative flags' },
];

const DELUSION_TYPES = ['Persecutory', 'Somatic', 'Misidentification', 'Mixed', 'Not specified'];
const PRIOR_HISTORY = ['None', 'Mood disorder', 'Psychosis', 'Other psychiatric', 'Unknown'];

const WORKUP: { id: string; label: string; items: string[] }[] = [
  {
    id: 'history_and_exam',
    label: 'History and examination',
    items: [
      'Detailed psychiatric history: onset, course, nature of hallucinations/delusions, mood symptoms, prior episodes.',
      'Collateral history from family/caregivers to document baseline functioning and cognitive change.',
      'Full physical examination including vital signs, BMI, and signs of systemic disease (endocrine, hepatic, renal, infectious).',
      'Comprehensive neurological examination (cranial nerves, motor/sensory, cerebellar, extrapyramidal signs, gait).',
      'Bedside cognitive screening (e.g., MoCA/CCSA or MMSE) to assess for delirium or dementia.',
    ],
  },
  {
    id: 'basic_laboratory_tests',
    label: 'Basic laboratory tests',
    items: [
      'Complete blood count (CBC).',
      'Comprehensive metabolic panel (electrolytes, renal function, liver enzymes, calcium, glucose).',
      'Thyroid function tests (TSH, free T4).',
      'Vitamin B12 and folate levels.',
      'Inflammatory markers (ESR, CRP).',
      'Fasting lipid profile and HbA1c if not recently done.',
      'Urine drug screen for common substances of abuse.',
      'Serum levels of relevant prescribed psychotropics or antiepileptics, if toxicity suspected.',
    ],
  },
  {
    id: 'targeted_tests',
    label: 'Targeted tests for secondary causes',
    items: [
      'Infectious disease screen: HIV, syphilis serology (RPR/TPHA), consider hepatitis, TB or other infections based on risk.',
      'Autoimmune screen: ANA, ENA, dsDNA, ANCA, complement levels if systemic autoimmune disease suspected.',
      'Endocrine/metabolic: cortisol/ACTH (Cushing\u2019s/Addison\u2019s), parathyroid hormone, calcium/magnesium, ammonia, others as clinically indicated.',
      'Nutritional: thiamine, niacin, vitamin D if risk factors for deficiency or malnutrition.',
      'Heavy metals, porphyria tests, or other specialized labs if clinical suspicion exists.',
    ],
  },
  {
    id: 'neuroimaging_and_neurology',
    label: 'Neuroimaging and neurological investigations',
    items: [
      'Brain CT or MRI for all patients with late-onset psychosis, especially with new neurological signs or atypical features.',
      'EEG if seizures, episodic confusion, or encephalopathy suspected.',
      'Lumbar puncture with CSF analysis (cell count, protein, glucose, cultures/PCR) when encephalitis, autoimmune/paraneoplastic, or prion disease is suspected.',
      'Autoimmune encephalitis and paraneoplastic antibody panels in CSF/serum when indicated.',
      'Formal neuropsychological testing for suspected dementia-related psychosis.',
    ],
  },
  {
    id: 'advanced_biomarkers_and_autoimmune_neurodegeneration',
    label: 'Advanced biomarkers: autoimmune and neurodegenerative',
    items: [
      'Autoimmune neuronal antibodies (serum, with CSF if indicated): order when there are autoimmune red flags (rapid subacute onset, seizures, catatonia, abnormal movements, autonomic instability, fluctuating consciousness, or MRI/EEG evidence of limbic encephalitis). Include neuronal surface antibodies (NMDAR, AMPAR, GABA-B R, LGI1, CASPR2, GABA-A R) and paraneoplastic antibodies (Hu, Ri, Yo, Ma2, CV2/CRMP5, amphiphysin, GAD65).',
      'CSF autoimmune and inflammatory markers: if autoimmune psychosis/encephalitis is suspected, perform lumbar puncture with CSF cell count, protein, glucose, oligoclonal bands, IgG index, and autoimmune/paraneoplastic panels; interpret serum antibody positivity in light of CSF findings and clinical picture.',
      'Alzheimer-type biomarkers (tau/amyloid PET or CSF A\u03b2/tau): consider in late-onset psychosis with prominent or progressive cognitive decline, especially when dementia is suspected but not confirmed. Amyloid PET assesses A\u03b2 deposition; tau PET assesses tau pathology; CSF A\u03b242, total tau and phospho-tau provide complementary information.',
      'Use tau/amyloid PET or CSF biomarkers primarily in tertiary/research or complex diagnostic cases, not as routine screening, to help distinguish dementia-related psychosis from primary schizophrenia-spectrum disorders.',
      'DAPHNE screen (behavioural variant frontotemporal dementia): administer DAPHNE when there are prominent bvFTD-like behavioural changes (disinhibition, apathy, perseverations, hyperorality, loss of empathy, neglect of personal hygiene). High DAPHNE scores support suspicion of bvFTD and justify dedicated neurodegenerative workup (MRI with frontal/temporal atrophy, FDG-PET, genetic testing such as MAPT, GRN, C9orf72).',
      'If autoimmune neuronal antibodies or neurodegenerative biomarkers are positive in the appropriate clinical context, reclassify the psychosis as autoimmune encephalitis/psychosis or dementia-related psychosis, and prioritise immunotherapy or dementia-directed care alongside cautious antipsychotic use.',
    ],
  },
  {
    id: 'risk_assessment_and_management',
    label: 'Risk assessment and initial management',
    items: [
      'Assess risk of suicide, self-harm, and harm to others.',
      'Determine need for inpatient vs outpatient management based on medical and psychiatric risk.',
      'Review current medications and deprescribe or adjust agents that may worsen psychosis (e.g., steroids, anticholinergics, dopaminergic drugs).',
      'Plan non-pharmacologic interventions: orientation strategies, sensory optimization (hearing aids, glasses), environmental modifications.',
      'If antipsychotic medication is indicated, start at low doses and monitor closely for extrapyramidal, metabolic, cardiovascular, and anticholinergic side effects in older adults.',
    ],
  },
];

interface Classification {
  branchId: string;
  label: string;
  classification: string;
  recommendations: string[];
  urgent?: boolean;
}

const DEFAULT_BRANCH: Classification = {
  branchId: 'unclear',
  label: 'Unclear \u2013 mixed or overlapping features',
  classification: 'Unclear \u2013 mixed or overlapping features',
  recommendations: [
    'Continue full medical, neurological, and psychiatric evaluation.',
    'Repeat cognitive testing after stabilization.',
    'Revisit classification once more data are available.',
  ],
};

export function LateOnsetPsychosisAssessment({ onBack }: Props) {
  const [age, setAge] = useState<string>('');
  const [onsetWeeks, setOnsetWeeks] = useState<string>('');
  const [delusionType, setDelusionType] = useState<string>('Not specified');
  const [priorHistory, setPriorHistory] = useState<string>('None');
  const [daphneScore, setDaphneScore] = useState<string>('');
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const f = (k: FlagKey) => !!flags[k];
  const toggleFlag = (k: FlagKey) => setFlags(p => ({ ...p, [k]: !p[k] }));
  const toggleItem = (k: string) => setChecked(p => ({ ...p, [k]: !p[k] }));

  const ageNum = parseFloat(age);

  const classification: Classification = useMemo(() => {
    if (f('fluctuating_attention_or_consciousness') || f('disorientation_present')) {
      return {
        branchId: 'delirium_or_acute_medical',
        label: 'Delirium / acute medical psychosis',
        classification: 'Delirium / acute medical psychosis',
        urgent: true,
        recommendations: [
          'Prioritize evaluation and treatment of acute medical illness (infection, metabolic derangement, drug toxicity).',
          'Avoid or minimize antipsychotics unless urgently required for safety; treat underlying cause.',
          'Consider inpatient medical admission.',
        ],
      };
    }
    if (f('objective_cognitive_decline') || f('dementia_diagnosis_present') || f('prominent_cognitive_decline')) {
      return {
        branchId: 'dementia_related_psychosis',
        label: 'Dementia-related psychosis',
        classification: 'Dementia-related psychosis',
        recommendations: [
          'Evaluate for Alzheimer disease, Lewy body dementia, vascular dementia, or frontotemporal dementia.',
          'Arrange formal neuropsychological assessment if feasible.',
          'Consider cholinesterase inhibitors or other dementia treatments; use antipsychotics very cautiously.',
        ],
      };
    }
    if (
      f('autoimmune_red_flags_present') ||
      f('mri_or_eeg_suggests_encephalitis') ||
      f('brain_imaging_structural_lesion') ||
      f('focal_neurological_signs_present') ||
      f('new_seizures_or_epilepsy') ||
      f('systemic_features_present') ||
      f('known_medical_comorbidity_high_risk')
    ) {
      return {
        branchId: 'secondary_organic_psychosis',
        label: 'Secondary / organic psychosis',
        classification: 'Secondary / organic psychosis',
        recommendations: [
          'Investigate for autoimmune encephalitis, systemic autoimmune disease, endocrine/metabolic, neoplastic, or paraneoplastic causes.',
          'Coordinate with neurology, internal medicine, or oncology as appropriate.',
          'Antipsychotics may be used symptomatically, but primary focus is treatment of the underlying condition.',
        ],
      };
    }
    if (f('substance_or_medication_trigger')) {
      return {
        branchId: 'substance_or_medication_induced',
        label: 'Substance / medication-induced psychosis',
        classification: 'Substance / medication-induced psychosis',
        recommendations: [
          'Identify and discontinue or reduce offending substance or medication when possible.',
          'Provide supportive care, monitor for withdrawal syndromes.',
          'Use short-term antipsychotics if needed; reassess once substance effect has resolved.',
        ],
      };
    }
    if (f('mood_symptoms_prominent')) {
      return {
        branchId: 'mood_disorder_with_psychotic_features',
        label: 'Mood disorder with psychotic features',
        classification: 'Mood disorder with psychotic features',
        recommendations: [
          'Clarify diagnosis (major depressive disorder with psychotic features vs bipolar disorder).',
          'Treat mood disorder with antidepressants or mood stabilizers plus antipsychotics as indicated.',
          'Monitor suicide risk closely, especially in psychotic depression.',
        ],
      };
    }
    if (
      !isNaN(ageNum) && ageNum >= 40 &&
      !f('fluctuating_attention_or_consciousness') &&
      !f('objective_cognitive_decline') &&
      !f('prominent_cognitive_decline') &&
      !f('autoimmune_red_flags_present') &&
      !f('brain_imaging_structural_lesion') &&
      !f('substance_or_medication_trigger')
    ) {
      return {
        branchId: 'late_onset_schizophrenia_spectrum',
        label: 'Late-onset schizophrenia spectrum / delusional disorder',
        classification: 'Primary psychotic disorder (late-onset schizophrenia spectrum or delusional disorder)',
        recommendations: [
          'Consider diagnoses: late-onset schizophrenia (onset >40), very-late-onset schizophrenia-like psychosis (onset >60), or delusional disorder.',
          'Review long-term course, negative symptoms, and family psychiatric history.',
          'Initiate low-dose antipsychotic therapy with careful monitoring for side effects in older adults.',
        ],
      };
    }
    return DEFAULT_BRANCH;
  }, [flags, ageNum]);

  const onsetWeeksNum = parseFloat(onsetWeeks);
  const advancedRules = useMemo(() => {
    const rules: { id: string; label: string; recommendation: string }[] = [];
    if (f('autoimmune_red_flags_present') || f('mri_or_eeg_suggests_encephalitis') || (!isNaN(onsetWeeksNum) && onsetWeeksNum <= 12)) {
      rules.push({
        id: 'recommend_autoimmune_panel',
        label: 'Autoimmune neuronal antibody testing',
        recommendation: 'Order serum neuronal antibody panel and consider CSF autoimmune/paraneoplastic testing for suspected autoimmune psychosis/encephalitis.',
      });
    }
    if (f('prominent_cognitive_decline') || f('strong_neurodegenerative_suspicion')) {
      rules.push({
        id: 'recommend_ad_biomarkers',
        label: 'Alzheimer-type biomarkers',
        recommendation: 'Consider tau/amyloid PET or CSF A\u03b2/tau biomarkers to evaluate for Alzheimer\u2019s disease or related neurodegenerative pathology underlying the psychosis.',
      });
    }
    if (f('bvftd_behavioral_features_present') && f('daphne_screen_available')) {
      rules.push({
        id: 'recommend_daphne_screen',
        label: 'DAPHNE screen (bvFTD)',
        recommendation: 'Administer the DAPHNE behavioural variant frontotemporal dementia screen and, if elevated, pursue bvFTD-oriented imaging and genetic workup.',
      });
    }
    return rules;
  }, [flags, onsetWeeksNum]);

  const completedSections = WORKUP.map(s => ({
    label: s.label,
    done: s.items.filter(i => checked[`${s.id}::${i}`]),
    pending: s.items.filter(i => !checked[`${s.id}::${i}`]),
  }));

  const totalItems = WORKUP.reduce((n, s) => n + s.items.length, 0);
  const totalDone = completedSections.reduce((n, s) => n + s.done.length, 0);

  const reportData: ReportData = {
    assessmentName: 'Late-Onset Psychosis \u2014 Classification & Workup',
    date: new Date().toLocaleString(),
    totalScore: `${totalDone}/${totalItems} workup items completed`,
    severity: classification.label,
    interpretation: classification.classification,
    sections: [
      {
        title: 'Clinical inputs',
        type: 'info',
        items: [
          `Age: ${age || 'not recorded'} years`,
          `Onset duration: ${onsetWeeks || 'not recorded'} weeks`,
          `Delusion type: ${delusionType}`,
          `Prior psychiatric history: ${priorHistory}`,
          `DAPHNE total score: ${daphneScore || 'not recorded'}${daphneScore ? ' / 40' : ''}`,
        ],
      },
      {
        title: 'Positive clinical features',
        type: 'positive',
        items: FLAGS.filter(x => flags[x.key]).map(x => x.label),
      },
      {
        title: 'Features not present',
        type: 'negative',
        items: FLAGS.filter(x => !flags[x.key]).map(x => x.label),
      },
      {
        title: 'Advanced testing recommendations',
        type: 'positive',
        items: advancedRules.length ? advancedRules.map(r => `${r.label}: ${r.recommendation}`) : ['No advanced autoimmune or neurodegenerative testing triggered by current inputs.'],
      },
      {
        title: 'Recommendations',
        type: 'info',
        items: classification.recommendations,
      },
      ...completedSections.map(s => ({
        title: `${s.label} \u2014 completed`,
        type: 'info' as const,
        items: s.done,
      })),
      ...completedSections.map(s => ({
        title: `${s.label} \u2014 pending`,
        type: 'not-assessed' as const,
        items: s.pending,
      })),
    ],
    disclaimer:
      'Decision support only. Late-onset psychosis requires individualized medical, neurological and psychiatric evaluation; classification here does not replace clinical judgement.',
  };

  const reset = () => {
    setAge('');
    setOnsetWeeks('');
    setDelusionType('Not specified');
    setPriorHistory('None');
    setDaphneScore('');
    setFlags({});
    setChecked({});
  };

  const groups = [...new Set(FLAGS.map(x => x.group))];

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        )}
        <div className="flex items-center gap-2">
          <ExportButtons data={reportData} />
          <Button variant="outline" size="sm" onClick={reset} className="flex items-center gap-1.5">
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Brain className="h-5 w-5" /> Late-Onset Psychosis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Diagnostic classification node plus the recommended medical, neurological and psychiatric workup checklist.
          </p>
        </CardHeader>
      </Card>

      {/* Inputs */}
      <Card className="mb-4">
        <CardHeader><CardTitle className="text-lg">Clinical inputs</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="lop-age">Age (years)</Label>
              <Input id="lop-age" type="number" inputMode="numeric" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 68" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lop-onset">Onset duration (weeks)</Label>
              <Input id="lop-onset" type="number" inputMode="numeric" value={onsetWeeks} onChange={e => setOnsetWeeks(e.target.value)} placeholder="e.g. 6" />
            </div>
            <div className="space-y-1.5">
              <Label>Delusion type</Label>
              <div className="flex flex-wrap gap-1.5">
                {DELUSION_TYPES.map(t => (
                  <Button key={t} size="sm" variant={delusionType === t ? 'default' : 'outline'} onClick={() => setDelusionType(t)}>{t}</Button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Prior psychiatric history</Label>
              <div className="flex flex-wrap gap-1.5">
                {PRIOR_HISTORY.map(t => (
                  <Button key={t} size="sm" variant={priorHistory === t ? 'default' : 'outline'} onClick={() => setPriorHistory(t)}>{t}</Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lop-daphne">DAPHNE total score (0\u201340, optional)</Label>
            <Input id="lop-daphne" type="number" inputMode="numeric" value={daphneScore} onChange={e => setDaphneScore(e.target.value)} placeholder="e.g. 18" />
          </div>

          <Separator />

          {groups.map(g => (
            <div key={g} className="space-y-2">
              <p className="text-sm font-semibold">{g}</p>
              {FLAGS.filter(x => x.group === g).map(x => (
                <div key={x.key} className="flex items-center justify-between gap-3 rounded-md border p-2.5">
                  <Label htmlFor={x.key} className="text-sm font-normal leading-snug cursor-pointer">{x.label}</Label>
                  <Switch id={x.key} checked={f(x.key)} onCheckedChange={() => toggleFlag(x.key)} />
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Classification */}
      <Card className={`mb-4 border-2 ${classification.urgent ? 'border-red-400 bg-red-50' : 'border-blue-300 bg-blue-50'}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {classification.urgent && <AlertTriangle className="h-5 w-5 text-red-600" />}
            Classification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Badge variant={classification.urgent ? 'destructive' : 'secondary'} className="text-sm">
            {classification.label}
          </Badge>
          <p className="text-sm font-medium">{classification.classification}</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {classification.recommendations.map(r => <li key={r}>{r}</li>)}
          </ul>
        </CardContent>
      </Card>

      {/* Advanced testing rules */}
      <Card className="mb-4 border-2 border-amber-300 bg-amber-50">
        <CardHeader><CardTitle className="text-lg">Advanced testing recommendations</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {advancedRules.length === 0 ? (
            <p className="text-sm text-muted-foreground">No advanced autoimmune or neurodegenerative testing triggered by current inputs.</p>
          ) : (
            advancedRules.map(r => (
              <div key={r.id} className="space-y-1">
                <Badge variant="secondary" className="text-xs">{r.label}</Badge>
                <p className="text-sm">{r.recommendation}</p>
              </div>
            ))
          )}
          {daphneScore && (
            <p className="text-sm font-medium">
              DAPHNE total: {daphneScore}/40 — higher scores support suspicion of behavioural variant FTD.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Workup */}
      {WORKUP.map(section => {
        const done = section.items.filter(i => checked[`${section.id}::${i}`]).length;
        return (
          <Card key={section.id} className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-lg">{section.label}</CardTitle>
              <Badge variant="outline">{done}/{section.items.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {section.items.map(item => {
                const key = `${section.id}::${item}`;
                return (
                  <div key={key} className="flex items-start gap-2.5">
                    <Checkbox id={key} checked={!!checked[key]} onCheckedChange={() => toggleItem(key)} className="mt-0.5" />
                    <Label htmlFor={key} className="text-sm font-normal leading-snug cursor-pointer">{item}</Label>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-lg">Summary</CardTitle>
          <Badge variant="secondary">{totalDone}/{totalItems} items completed</Badge>
        </CardHeader>
        <CardContent>
          <ExportButtons data={reportData} />
        </CardContent>
      </Card>
    </div>
  );
}

export default LateOnsetPsychosisAssessment;
