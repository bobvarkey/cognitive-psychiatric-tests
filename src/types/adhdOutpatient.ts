export interface AdhdOutpatientFlow {
  patient: {
    ageYears: number;
    ageGroup: 'adolescent' | 'adult';
    sex: 'male' | 'female' | 'other' | 'unknown';
    hasFormalAdhdDiagnosis: boolean;
    diagnosisSource?: 'child_psychiatrist' | 'adult_psychiatrist' | 'paediatrician' | 'gp_primary_care' | 'other_specialist' | 'unknown';
  };
  symptomsAndImpairment: {
    symptomDomains: ('inattention' | 'hyperactivity' | 'impulsivity')[];
    severity: 'mild' | 'moderate' | 'severe';
    impairmentDomains: ('academic' | 'occupational' | 'social' | 'family' | 'other')[];
    baselineRatingScale?: {
      tool: string;
      score: number;
    };
  };
  comorbidities: {
    anxietyDisorder: boolean;
    depressiveDisorder: boolean;
    bipolarDisorder: boolean;
    psychoticDisorder: boolean;
    substanceUseDisorder: boolean;
    ticDisorder: boolean;
    autismSpectrumDisorder: boolean;
    learningDisorder: boolean;
    sleepDisorder: boolean;
    significantCardiacDisease: boolean;
    otherComorbidities?: string[];
  };
  priorTreatments: {
    psychoeducationCompleted: boolean;
    environmentalModificationsImplemented: boolean;
    schoolOrWorkSupportsInPlace: boolean;
    psychologicalTherapies: ('adhd_focused_cbt' | 'mbct' | 'coaching_skills_training' | 'other')[];
    previousMedications: {
      drugName: 'methylphenidate' | 'lisdexamfetamine' | 'dexamfetamine' | 'atomoxetine' | 'guanfacine' | 'clonidine' | 'bupropion' | 'other';
      response: 'good' | 'partial' | 'none' | 'intolerable_side_effects' | 'unknown';
    }[];
  };
  preferences: {
    willingToConsiderMedication: 'yes' | 'no' | 'unsure';
    prefersOnceDailyRegimen: boolean;
    concernAboutSideEffects: boolean;
  };
  riskScreening: {
    stimulantMisuseRiskHigh: boolean;
    baselineSystolicBp: number;
    baselineDiastolicBp: number;
    baselineHeartRate: number;
  };
  decisionOutputs: {
    needsDiagnosticReferral: boolean;
    nonPharmacologicPlanRecommended: boolean;
    medicationIndicated: boolean;
    stimulantContraindicated: boolean;
    firstLineMedicationChoice: 'none' | 'methylphenidate' | 'lisdexamfetamine' | 'atomoxetine' | 'other_non_stimulant';
    secondLineMedicationChoice: 'none' | 'methylphenidate' | 'lisdexamfetamine' | 'dexamfetamine' | 'atomoxetine' | 'bupropion' | 'other';
    psychologicalAdjunctsRecommended: ('adhd_focused_cbt' | 'mbct' | 'coaching_skills_training' | 'psychoeducation_group' | 'lifestyle_plan' | 'none')[];
    monitoringPlan: {
      initialFollowUpWeeks: number;
      titrationFollowUpFrequencyWeeks: number;
      stableFollowUpFrequencyMonths: number;
      monitoringParameters: (
        | 'bp'
        | 'heart_rate'
        | 'weight'
        | 'height_adolescents'
        | 'sleep'
        | 'appetite'
        | 'mood_suicidality'
        | 'tics'
        | 'psychotic_symptoms'
        | 'substance_use'
        | 'adherence'
        | 'diversion_misuse'
      )[];
    };
  };
}
