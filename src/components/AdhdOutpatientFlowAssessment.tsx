import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Brain, ArrowLeft, ArrowRight, RotateCcw, ClipboardList, AlertCircle, HeartPulse, Pill, User, Stethoscope, Briefcase, Activity } from 'lucide-react';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { ProgressIndicator } from './ProgressIndicator';
import { AdhdOutpatientFlow } from '@/types/adhdOutpatient';
import { toast } from 'sonner';

interface AdhdOutpatientFlowProps {
  onBack?: () => void;
}

type Step = 'patient' | 'symptoms' | 'comorbidities' | 'treatments' | 'preferences' | 'risk' | 'results';

export const AdhdOutpatientFlowAssessment = ({ onBack }: AdhdOutpatientFlowProps) => {
  const { language, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<Step>('patient');
  
  const [formData, setFormData] = useState<Partial<AdhdOutpatientFlow>>({
    patient: {
      ageYears: 18,
      ageGroup: 'adult',
      sex: 'unknown',
      hasFormalAdhdDiagnosis: false,
    },
    symptomsAndImpairment: {
      symptomDomains: [],
      severity: 'mild',
      impairmentDomains: [],
    },
    comorbidities: {
      anxietyDisorder: false,
      depressiveDisorder: false,
      bipolarDisorder: false,
      psychoticDisorder: false,
      substanceUseDisorder: false,
      ticDisorder: false,
      autismSpectrumDisorder: false,
      learningDisorder: false,
      sleepDisorder: false,
      significantCardiacDisease: false,
      otherComorbidities: [],
    },
    priorTreatments: {
      psychoeducationCompleted: false,
      environmentalModificationsImplemented: false,
      schoolOrWorkSupportsInPlace: false,
      psychologicalTherapies: [],
      previousMedications: [],
    },
    preferences: {
      willingToConsiderMedication: 'unsure',
      prefersOnceDailyRegimen: true,
      concernAboutSideEffects: false,
    },
    riskScreening: {
      stimulantMisuseRiskHigh: false,
      baselineSystolicBp: 120,
      baselineDiastolicBp: 80,
      baselineHeartRate: 72,
    }
  });

  const updateFormData = (section: keyof AdhdOutpatientFlow, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        ...data
      }
    }));
  };

  const steps: Step[] = ['patient', 'symptoms', 'comorbidities', 'treatments', 'preferences', 'risk', 'results'];
  const currentStepIndex = steps.indexOf(currentStep);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
      window.scrollTo(0, 0);
    }
  };

  const decisionOutputs = useMemo(() => {
    if (!formData.patient || !formData.symptomsAndImpairment || !formData.comorbidities || !formData.riskScreening) return null;

    const needsDiagnosticReferral = !formData.patient.hasFormalAdhdDiagnosis;
    const stimulantContraindicated = 
      formData.comorbidities.psychoticDisorder || 
      formData.comorbidities.bipolarDisorder || 
      formData.comorbidities.significantCardiacDisease || 
      formData.riskScreening.stimulantMisuseRiskHigh;

    const medicationIndicated = 
      formData.patient.hasFormalAdhdDiagnosis && 
      (formData.symptomsAndImpairment.severity === 'moderate' || formData.symptomsAndImpairment.severity === 'severe');

    const firstLineMedicationChoice: any = medicationIndicated 
      ? (stimulantContraindicated ? 'atomoxetine' : (formData.patient.ageGroup === 'adult' ? 'lisdexamfetamine' : 'methylphenidate'))
      : 'none';

    const nonPharmacologicPlanRecommended = true;

    // Logic to choose pathway
    const hasHyperOrImpulsive = formData.symptomsAndImpairment.symptomDomains.includes('hyperactivity') ||
                              formData.symptomsAndImpairment.symptomDomains.includes('impulsivity');
    
    const isPredominantlyInattentive = !hasHyperOrImpulsive && formData.symptomsAndImpairment.symptomDomains.includes('inattention');

    let addPathway = undefined;
    if (isPredominantlyInattentive) {
      addPathway = {
        isPredominantlyInattentive: true,
        addSpecificNonPharmacologicPlan: ['structured_planning_skills', 'time_management_training', 'environmental_distraction_reduction'] as any,
        preferredPharmacologicStrategy: (formData.patient.ageGroup === 'adult' ? 'lisdexamfetamine' : 'long_acting_methylphenidate') as any,
        addMedicationStrategy: {
          addFirstLine: (formData.patient.ageGroup === 'adult' ? 'lisdexamfetamine' : 'long_acting_methylphenidate') as any,
          addSecondLine: 'atomoxetine' as any,
          addThirdLine: 'bupropion' as any,
          addStrategyRationale: stimulantContraindicated ? 'Stimulant contraindications present; non-stimulant focus.' : null
        },
        cognitiveAdjuncts: ['executive_function_coaching', 'mindfulness_for_inattention'] as any,
        schoolWorkAccommodations: ['extended_time_exams', 'written_instruction_support', 'task_chunking_and_checklists'] as any
      };
    }

    return {
      needsDiagnosticReferral,
      nonPharmacologicPlanRecommended,
      medicationIndicated,
      stimulantContraindicated,
      firstLineMedicationChoice,
      secondLineMedicationChoice: 'none' as any,
      psychologicalAdjunctsRecommended: ['adhd_focused_cbt', 'psychoeducation_group'] as any,
      monitoringPlan: {
        initialFollowUpWeeks: 4,
        titrationFollowUpFrequencyWeeks: 2,
        stableFollowUpFrequencyMonths: 6,
        monitoringParameters: ['bp', 'heart_rate', 'appetite', 'sleep'] as any
      },
      addPathway
    };
  }, [formData]);

  const renderStep = () => {
    switch (currentStep) {
      case 'patient':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age (Years)</Label>
                <Input 
                  type="number" 
                  value={formData.patient?.ageYears} 
                  onChange={e => {
                    const age = parseInt(e.target.value);
                    updateFormData('patient', { 
                      ageYears: age,
                      ageGroup: age >= 18 ? 'adult' : 'adolescent'
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Sex</Label>
                <Select 
                  value={formData.patient?.sex} 
                  onValueChange={v => updateFormData('patient', { sex: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="formal-diagnosis" 
                  checked={formData.patient?.hasFormalAdhdDiagnosis}
                  onCheckedChange={checked => updateFormData('patient', { hasFormalAdhdDiagnosis: !!checked })}
                />
                <Label htmlFor="formal-diagnosis">Has Formal ADHD Diagnosis?</Label>
              </div>

              {formData.patient?.hasFormalAdhdDiagnosis && (
                <div className="space-y-2 pl-6">
                  <Label>Diagnosis Source</Label>
                  <Select 
                    value={formData.patient?.diagnosisSource} 
                    onValueChange={v => updateFormData('patient', { diagnosisSource: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Who made the diagnosis?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="child_psychiatrist">Child Psychiatrist</SelectItem>
                      <SelectItem value="adult_psychiatrist">Adult Psychiatrist</SelectItem>
                      <SelectItem value="paediatrician">Paediatrician</SelectItem>
                      <SelectItem value="gp_primary_care">GP / Primary Care</SelectItem>
                      <SelectItem value="other_specialist">Other Specialist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        );

      case 'symptoms':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Core Symptom Domains Present</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['inattention', 'hyperactivity', 'impulsivity'].map(domain => (
                  <div key={domain} className="flex items-center space-x-2 bg-muted/30 p-3 rounded-md border">
                    <Checkbox 
                      id={`domain-${domain}`}
                      checked={formData.symptomsAndImpairment?.symptomDomains.includes(domain as any)}
                      onCheckedChange={checked => {
                        const domains = [...(formData.symptomsAndImpairment?.symptomDomains || [])];
                        if (checked) domains.push(domain as any);
                        else {
                          const index = domains.indexOf(domain as any);
                          if (index > -1) domains.splice(index, 1);
                        }
                        updateFormData('symptomsAndImpairment', { symptomDomains: domains });
                      }}
                    />
                    <Label htmlFor={`domain-${domain}`} className="capitalize">{domain}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-base font-semibold">Global ADHD Severity</Label>
              <RadioGroup 
                value={formData.symptomsAndImpairment?.severity} 
                onValueChange={v => updateFormData('symptomsAndImpairment', { severity: v })}
                className="grid grid-cols-3 gap-3"
              >
                {['mild', 'moderate', 'severe'].map(s => (
                  <div key={s} className="flex items-center space-x-2 bg-muted/30 p-3 rounded-md border">
                    <RadioGroupItem value={s} id={`severity-${s}`} />
                    <Label htmlFor={`severity-${s}`} className="capitalize">{s}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-base font-semibold">Impairment Domains</Label>
              <div className="grid grid-cols-2 gap-3">
                {['academic', 'occupational', 'social', 'family', 'other'].map(domain => (
                  <div key={domain} className="flex items-center space-x-2 bg-muted/30 p-3 rounded-md border">
                    <Checkbox 
                      id={`impairment-${domain}`}
                      checked={formData.symptomsAndImpairment?.impairmentDomains.includes(domain as any)}
                      onCheckedChange={checked => {
                        const domains = [...(formData.symptomsAndImpairment?.impairmentDomains || [])];
                        if (checked) domains.push(domain as any);
                        else {
                          const index = domains.indexOf(domain as any);
                          if (index > -1) domains.splice(index, 1);
                        }
                        updateFormData('symptomsAndImpairment', { impairmentDomains: domains });
                      }}
                    />
                    <Label htmlFor={`impairment-${domain}`} className="capitalize">{domain}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'comorbidities':
        const comorbList = [
          { id: 'anxietyDisorder', label: 'Anxiety Disorder' },
          { id: 'depressiveDisorder', label: 'Depressive Disorder' },
          { id: 'bipolarDisorder', label: 'Bipolar Disorder' },
          { id: 'psychoticDisorder', label: 'Psychotic Disorder' },
          { id: 'substanceUseDisorder', label: 'Substance Use Disorder' },
          { id: 'ticDisorder', label: 'Tic Disorder' },
          { id: 'autismSpectrumDisorder', label: 'Autism Spectrum Disorder' },
          { id: 'learningDisorder', label: 'Learning Disorder' },
          { id: 'sleepDisorder', label: 'Sleep Disorder' },
          { id: 'significantCardiacDisease', label: 'Significant Cardiac Disease' },
        ];
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comorbList.map(item => (
              <div key={item.id} className="flex items-center space-x-2 bg-muted/30 p-3 rounded-md border">
                <Checkbox 
                  id={`comorb-${item.id}`}
                  checked={(formData.comorbidities as any)?.[item.id]}
                  onCheckedChange={checked => updateFormData('comorbidities', { [item.id]: !!checked })}
                />
                <Label htmlFor={`comorb-${item.id}`}>{item.label}</Label>
              </div>
            ))}
          </div>
        );

      case 'treatments':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="psycho-ed"
                  checked={formData.priorTreatments?.psychoeducationCompleted}
                  onCheckedChange={checked => updateFormData('priorTreatments', { psychoeducationCompleted: !!checked })}
                />
                <Label htmlFor="psycho-ed">Psychoeducation Completed?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="env-mod"
                  checked={formData.priorTreatments?.environmentalModificationsImplemented}
                  onCheckedChange={checked => updateFormData('priorTreatments', { environmentalModificationsImplemented: !!checked })}
                />
                <Label htmlFor="env-mod">Environmental Modifications Implemented?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="supports"
                  checked={formData.priorTreatments?.schoolOrWorkSupportsInPlace}
                  onCheckedChange={checked => updateFormData('priorTreatments', { schoolOrWorkSupportsInPlace: !!checked })}
                />
                <Label htmlFor="supports">School/Work Supports in Place?</Label>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Willing to Consider Medication?</Label>
              <RadioGroup 
                value={formData.preferences?.willingToConsiderMedication} 
                onValueChange={v => updateFormData('preferences', { willingToConsiderMedication: v })}
                className="grid grid-cols-3 gap-3"
              >
                {['yes', 'no', 'unsure'].map(o => (
                  <div key={o} className="flex items-center space-x-2 bg-muted/30 p-3 rounded-md border">
                    <RadioGroupItem value={o} id={`pref-${o}`} />
                    <Label htmlFor={`pref-${o}`} className="capitalize">{o}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="once-daily"
                  checked={formData.preferences?.prefersOnceDailyRegimen}
                  onCheckedChange={checked => updateFormData('preferences', { prefersOnceDailyRegimen: !!checked })}
                />
                <Label htmlFor="once-daily">Prefers Once-Daily Regimen?</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="side-effect-concern"
                  checked={formData.preferences?.concernAboutSideEffects}
                  onCheckedChange={checked => updateFormData('preferences', { concernAboutSideEffects: !!checked })}
                />
                <Label htmlFor="side-effect-concern">High Concern about Side Effects?</Label>
              </div>
            </div>
          </div>
        );

      case 'risk':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 bg-red-500/10 p-4 rounded-md border border-red-500/20">
              <Checkbox 
                id="misuse-risk"
                checked={formData.riskScreening?.stimulantMisuseRiskHigh}
                onCheckedChange={checked => updateFormData('riskScreening', { stimulantMisuseRiskHigh: !!checked })}
              />
              <Label htmlFor="misuse-risk" className="text-red-700 font-semibold">Stimulant Misuse / Diversion Risk High?</Label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Systolic BP (mmHg)</Label>
                <Input 
                  type="number" 
                  value={formData.riskScreening?.baselineSystolicBp}
                  onChange={e => updateFormData('riskScreening', { baselineSystolicBp: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Diastolic BP (mmHg)</Label>
                <Input 
                  type="number" 
                  value={formData.riskScreening?.baselineDiastolicBp}
                  onChange={e => updateFormData('riskScreening', { baselineDiastolicBp: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Heart Rate (bpm)</Label>
                <Input 
                  type="number" 
                  value={formData.riskScreening?.baselineHeartRate}
                  onChange={e => updateFormData('riskScreening', { baselineHeartRate: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
        );

      case 'results':
        if (!decisionOutputs) return null;
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Decisions */}
              <Card className="border-2 border-indigo-100 shadow-md">
                <CardHeader className="bg-indigo-50/50">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-indigo-600" />
                    <CardTitle className="text-lg">Clinical Decisions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
                    <span className="font-medium">Diagnostic Referral Needed?</span>
                    <Badge variant={decisionOutputs.needsDiagnosticReferral ? "destructive" : "outline"}>
                      {decisionOutputs.needsDiagnosticReferral ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
                    <span className="font-medium">Medication Indicated?</span>
                    <Badge variant={decisionOutputs.medicationIndicated ? "default" : "outline"}>
                      {decisionOutputs.medicationIndicated ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
                    <span className="font-medium">Stimulant Contraindicated?</span>
                    <Badge variant={decisionOutputs.stimulantContraindicated ? "destructive" : "outline"}>
                      {decisionOutputs.stimulantContraindicated ? "Yes" : "No"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Treatment Choice */}
              <Card className="border-2 border-emerald-100 shadow-md">
                <CardHeader className="bg-emerald-50/50">
                  <div className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-emerald-600" />
                    <CardTitle className="text-lg">Recommended Treatment</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-200 text-center">
                    <p className="text-sm text-emerald-800 font-medium mb-1">First-line Choice</p>
                    <p className="text-xl font-bold text-emerald-900 capitalize">
                      {decisionOutputs.firstLineMedicationChoice === 'none' ? 'Non-pharmacologic only' : decisionOutputs.firstLineMedicationChoice}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Psychological Adjuncts</p>
                    <div className="flex flex-wrap gap-2">
                      {decisionOutputs.psychologicalAdjunctsRecommended.map((adj: string) => (
                        <Badge key={adj} variant="secondary" className="capitalize">
                          {adj.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monitoring Plan */}
            <Card className="border-2 border-blue-100 shadow-md">
              <CardHeader className="bg-blue-50/50">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Monitoring & Follow-up Plan</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{decisionOutputs.monitoringPlan.initialFollowUpWeeks}</p>
                    <p className="text-sm text-muted-foreground">Initial Follow-up (Weeks)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{decisionOutputs.monitoringPlan.titrationFollowUpFrequencyWeeks}</p>
                    <p className="text-sm text-muted-foreground">Titration Frequency (Weeks)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{decisionOutputs.monitoringPlan.stableFollowUpFrequencyMonths}</p>
                    <p className="text-sm text-muted-foreground">Stable Follow-up (Months)</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    Parameters to Monitor
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {decisionOutputs.monitoringPlan.monitoringParameters.map((param: string) => (
                      <div key={param} className="flex items-center gap-2 p-2 rounded bg-muted/50 text-sm border">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="capitalize">{param.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ADD Specific Management (if applicable) */}
            {decisionOutputs.addPathway && (
              <Card className="border-2 border-purple-100 shadow-md">
                <CardHeader className="bg-purple-50/50">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-lg">Predominantly Inattentive (ADD) Strategy</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Preferred Medication Strategy</p>
                      <p className="text-lg font-bold text-purple-900 capitalize">
                        {decisionOutputs.addPathway.preferredPharmacologicStrategy.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Non-Pharmacologic Focus</p>
                      <div className="flex flex-wrap gap-2">
                        {decisionOutputs.addPathway.addSpecificNonPharmacologicPlan.map((plan: string) => (
                          <Badge key={plan} variant="secondary" className="capitalize">
                            {plan.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Cognitive Adjuncts</p>
                      <ul className="space-y-1">
                        {decisionOutputs.addPathway.cognitiveAdjuncts.map((adj: string) => (
                          <li key={adj} className="text-sm flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-purple-400" />
                            <span className="capitalize">{adj.replace(/_/g, ' ')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">School/Work Accommodations</p>
                      <ul className="space-y-1">
                        {decisionOutputs.addPathway.schoolWorkAccommodations.map((acc: string) => (
                          <li key={acc} className="text-sm flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-purple-400" />
                            <span className="capitalize">{acc.replace(/_/g, ' ')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-center pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentStep('patient');
                  setFormData({
                    patient: { ageYears: 18, ageGroup: 'adult', sex: 'unknown', hasFormalAdhdDiagnosis: false },
                    symptomsAndImpairment: { symptomDomains: [], severity: 'mild', impairmentDomains: [] },
                    comorbidities: { anxietyDisorder: false, depressiveDisorder: false, bipolarDisorder: false, psychoticDisorder: false, substanceUseDisorder: false, ticDisorder: false, autismSpectrumDisorder: false, learningDisorder: false, sleepDisorder: false, significantCardiacDisease: false, otherComorbidities: [] },
                    priorTreatments: { psychoeducationCompleted: false, environmentalModificationsImplemented: false, schoolOrWorkSupportsInPlace: false, psychologicalTherapies: [], previousMedications: [] },
                    preferences: { willingToConsiderMedication: 'unsure', prefersOnceDailyRegimen: true, concernAboutSideEffects: false },
                    riskScreening: { stimulantMisuseRiskHigh: false, baselineSystolicBp: 120, baselineDiastolicBp: 80, baselineHeartRate: 72 }
                  });
                }}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Start New Assessment
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepLabels: Record<Step, { title: string; subtitle: string; icon: any }> = {
    patient: { title: 'Patient Profile', subtitle: 'Basic demographics and diagnosis', icon: User },
    symptoms: { title: 'Symptoms & Impairment', subtitle: 'Domains, severity, and functional impact', icon: Brain },
    comorbidities: { title: 'Comorbidities', subtitle: 'Psychiatric and physical conditions', icon: AlertCircle },
    treatments: { title: 'Prior Treatments', subtitle: 'Psychoeducation and environmental mods', icon: ClipboardList },
    preferences: { title: 'Preferences', subtitle: 'Treatment goals and medication views', icon: HeartPulse },
    risk: { title: 'Risk Screening', subtitle: 'Misuse risk and baseline vitals', icon: Activity },
    results: { title: 'Treatment Flow Results', subtitle: 'Recommended plan and monitoring', icon: Stethoscope },
  };

  const progress = (currentStepIndex / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 pt-16">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToMenu')}
          </Button>
        )}

        <PatientInfoForm />

        <Card className="border-none shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">ADHD Outpatient Flow</CardTitle>
                <CardDescription className="text-blue-100 text-base">Adolescent & Adult Treatment Algorithm</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <div className="h-1.5 w-full bg-slate-100">
            <div 
              className="h-full bg-blue-500 transition-all duration-500 ease-in-out" 
              style={{ width: `${progress}%` }}
            />
          </div>

          <CardContent className="p-6 md:p-10">
            {currentStep !== 'results' && (
              <div className="flex items-center gap-4 mb-10 pb-6 border-b">
                <div className="p-3 bg-blue-50 rounded-lg">
                  {(() => {
                    const Icon = stepLabels[currentStep].icon;
                    return <Icon className="h-6 w-6 text-blue-600" />;
                  })()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{stepLabels[currentStep].title}</h2>
                  <p className="text-slate-500">{stepLabels[currentStep].subtitle}</p>
                </div>
              </div>
            )}

            {renderStep()}

            {currentStep !== 'results' && (
              <div className="flex justify-between items-center pt-10 mt-10 border-t">
                <Button 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={currentStepIndex === 0}
                  className="px-6"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button 
                  onClick={nextStep} 
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                >
                  {currentStepIndex === steps.length - 2 ? 'Generate Plan' : 'Next'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="text-center text-xs text-slate-400 pb-10">
          Source: Clinical decision support algorithm based on adolescent and adult ADHD treatment guidelines.
        </div>
      </div>
    </div>
  );
};
