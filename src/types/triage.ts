export interface PsychiatricTriageData {
  patient: {
    ageYears: number;
  };
  safetyPsychosis: {
    suicidalThoughtsFrequency: "none" | "occasional" | "frequent";
    suicidalPlanOrIntent: boolean;
    homicidalThoughts: boolean;
    recentViolenceOrWeapons: boolean;
    psychosisHallucinations: boolean;
    psychosisDelusions: boolean;
    psychoticExperiencesClearlyReal: boolean;
  };
  mood: {
    depressionPresence: "none" | "moderate" | "severe";
    bipolarScreenPositive: boolean;
  };
  anxietyTraumaOcd: {
    anxietyLevel: "none" | "moderate" | "severe";
    ptsdScreenPositive: boolean;
    ocdSymptomsProminent: boolean;
  };
  adhd: {
    inattentionLevel: "none" | "moderate" | "severe";
    adhdSinceChildhood: boolean;
    adhdFunctionalImpact: "none" | "moderate" | "severe";
  };
  personality: {
    longstandingInterpersonalProblems: boolean;
    unstableIntenseRelationships: boolean;
    chronicImpulsivity: boolean;
  };
  substance: {
    hazardousAlcoholUse: "likely" | "unlikely";
    hazardousDrugUse: "likely" | "unlikely";
  };
  cognitive: {
    cognitiveConcerns: "none" | "moderate" | "severe";
  };
}

export type TriagePrimaryCategory = 
  | "emergency_risk"
  | "psychosis_or_psychosis_risk"
  | "unipolar_mood_disorder"
  | "bipolar_mood_disorder"
  | "anxiety_trauma_or_oCD"
  | "ADHD_add_spectrum"
  | "substance_use_disorder"
  | "cognitive_disorder_MCI_dementia"
  | "none_or_unclear";

export type TriageComorbidCategory = 
  | "personality_disorder_traits"
  | "substance_use_disorder"
  | "ADHD_add_spectrum"
  | "anxiety_trauma_or_oCD"
  | "cognitive_disorder_MCI_dementia";

export type TriageRiskLevel = "low" | "moderate" | "high";

export type TriageRecommendedRoute = 
  | "urgent_psychiatry_or_ED"
  | "routine_psychiatry"
  | "primary_care_management"
  | "psychology_or_therapy"
  | "substance_use_services"
  | "neurocognitive_workup"
  | "monitor_and_reassess";

export interface TriageResult {
  primaryCategory: TriagePrimaryCategory;
  comorbidCategories: TriageComorbidCategory[];
  riskLevel: TriageRiskLevel;
  recommendedRoute: TriageRecommendedRoute;
  clinicalNotes: string[];
}
