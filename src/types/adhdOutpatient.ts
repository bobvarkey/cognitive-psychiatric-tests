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
    addPathway?: {
      isPredominantlyInattentive: boolean;
      preferredPharmacologicStrategy: 'none' | 'long_acting_methylphenidate' | 'lisdexamfetamine' | 'atomoxetine' | 'bupropion' | 'other_non_stimulant';
      addMedicationStrategy: {
        addFirstLine: 'none' | 'long_acting_methylphenidate' | 'lisdexamfetamine';
        addSecondLine: 'none' | 'atomoxetine' | 'viloxazine_er';
        addThirdLine: 'none' | 'bupropion' | 'guanfacine_er' | 'clonidine_er' | 'other_non_stimulant';
        addStrategyRationale?: string | null;
      };
      addSpecificNonPharmacologicPlan: (
        | 'structured_planning_skills'
        | 'time_management_training'
        | 'organizational_coaching'
        | 'digital_tool_support_apps'
        | 'study_skill_program'
        | 'environmental_distraction_reduction'
        | 'sleep_hygiene_focus'
        | 'none'
      )[];
      cognitiveAdjuncts: (
        | 'attention_training_exercises'
        | 'metacognitive_therapy'
        | 'executive_function_coaching'
        | 'mindfulness_for_inattention'
        | 'none'
      )[];
      schoolWorkAccommodations: (
        | 'extended_time_exams'
        | 'reduced_distraction_test_env'
        | 'written_instruction_support'
        | 'task_chunking_and_checklists'
        | 'priority_seating'
        | 'flexible_deadlines'
        | 'none'
      )[];
    };
  };
}
