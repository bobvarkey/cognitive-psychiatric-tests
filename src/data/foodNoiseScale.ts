export const FOOD_NOISE_SCALE = {
  app: {
    id: "food-noise-fnq5",
    name: "Food Noise Scale",
    shortName: "FNQ-5",
    version: "1.0.0",
    type: "clinical_score_calculator",
    description:
      "A scoreable mini-app for assessing food-related cognitive preoccupation using the 5-item Food Noise Questionnaire framework, with baseline and follow-up comparison.",
    clinicalNote:
      "Higher scores indicate greater food-noise burden. Published validation supports use as a continuous measure. The interpretation bands in this app are pragmatic display categories and are not validated diagnostic cutoffs.",
  },

  questionnaire: {
    name: "Food Noise Questionnaire",
    abbreviation: "FNQ-5",
    timeframe: "Past 2 weeks",
    instructions:
      "Thinking about the past 2 weeks, indicate how strongly you agree or disagree with each statement.",
    items: [
      {
        id: "fnq1",
        order: 1,
        text: "I find myself constantly thinking about food throughout the day.",
        required: true,
      },
      {
        id: "fnq2",
        order: 2,
        text: "My thoughts about food feel uncontrollable.",
        required: true,
      },
      {
        id: "fnq3",
        order: 3,
        text: "I spend too much time thinking about food.",
        required: true,
      },
      {
        id: "fnq4",
        order: 4,
        text: "My thoughts about food have negative effects on me and/or my life.",
        required: true,
      },
      {
        id: "fnq5",
        order: 5,
        text: "My thoughts about food distract me from what I need to do.",
        required: true,
      },
    ],

    responseOptions: [
      { label: "Strongly disagree", value: 0 },
      { label: "Disagree", value: 1 },
      { label: "Neither agree nor disagree", value: 2 },
      { label: "Agree", value: 3 },
      { label: "Strongly agree", value: 4 },
    ],
  },

  scoring: {
    method: "sum",
    minimumScore: 0,
    maximumScore: 20,
    formula: "fnq1 + fnq2 + fnq3 + fnq4 + fnq5",
    missingDataPolicy: {
      allowIncompleteScore: false,
      message: "Please answer all 5 items before calculating the FNQ-5 score.",
    },
  },

  interpretation: {
    higherScoreMeaning: "Greater food-related cognitive preoccupation and food-noise burden.",
    validatedClinicalCutoffsAvailable: false,
    displayBands: [
      { min: 0, max: 4, label: "Very low", severityLevel: 0, summary: "Minimal food-related cognitive preoccupation." },
      { min: 5, max: 8, label: "Low", severityLevel: 1, summary: "Some food-related thoughts are present, with relatively limited overall burden." },
      { min: 9, max: 12, label: "Moderate", severityLevel: 2, summary: "Noticeable food-related cognitive preoccupation that may warrant clinical discussion." },
      { min: 13, max: 16, label: "High", severityLevel: 3, summary: "Substantial food-noise burden with frequent or intrusive food-related thoughts." },
      { min: 17, max: 20, label: "Very high", severityLevel: 4, summary: "Marked food-related cognitive preoccupation with substantial perceived burden." },
    ],
    disclaimer:
      "Severity bands are pragmatic descriptive categories for app display and longitudinal tracking. They are not validated diagnostic thresholds.",
  },

  assessmentModes: [
    { id: "baseline", label: "Baseline", description: "Assessment before starting or changing treatment." },
    { id: "followup", label: "Follow-up", description: "Assessment after treatment or lifestyle intervention." },
  ],

  comparison: {
    enabled: true,
    requiresBaseline: true,
    requiresFollowup: true,

    absoluteChange: {
      label: "Absolute change",
      formula: "followupScore - baselineScore",
      interpretation: { negative: "Improvement", zero: "No change", positive: "Worsening" },
    },

    absoluteReduction: {
      label: "Absolute reduction",
      formula: "baselineScore - followupScore",
      minimum: -20,
      maximum: 20,
    },

    percentageReduction: {
      label: "Percentage reduction in food noise",
      formula: "((baselineScore - followupScore) / baselineScore) * 100",
      roundTo: 1,
      specialCases: [
        {
          condition: "baselineScore == 0 && followupScore == 0",
          result: null,
          display: "Not applicable",
          reason: "Percentage reduction cannot be calculated from a baseline score of zero.",
        },
        {
          condition: "baselineScore == 0 && followupScore > 0",
          result: null,
          display: "Not calculable",
          reason: "Baseline score was zero; percentage increase should be described using absolute change.",
        },
      ],
    },

    percentageChange: {
      label: "Percentage change",
      formula: "((followupScore - baselineScore) / baselineScore) * 100",
      roundTo: 1,
      specialCase: "Do not calculate when baselineScore == 0.",
    },

    scoreRatio: {
      label: "Follow-up score as percentage of baseline",
      formula: "(followupScore / baselineScore) * 100",
      roundTo: 1,
      specialCase: "Do not calculate when baselineScore == 0.",
    },
  },

  treatmentResponse: {
    method: "descriptive_percentage_reduction",
    validatedThresholds: false,
    categories: [
      { condition: "percentageReduction < 0", label: "Worsened", summary: "Food-noise score increased compared with baseline." },
      { condition: "percentageReduction >= 0 && percentageReduction < 20", label: "Minimal change", summary: "Less than 20% reduction from baseline." },
      { condition: "percentageReduction >= 20 && percentageReduction < 30", label: "Modest improvement", summary: "20% to 29.9% reduction from baseline." },
      { condition: "percentageReduction >= 30 && percentageReduction < 50", label: "Meaningful improvement", summary: "30% to 49.9% reduction from baseline." },
      { condition: "percentageReduction >= 50 && percentageReduction < 75", label: "Major improvement", summary: "50% to 74.9% reduction from baseline." },
      { condition: "percentageReduction >= 75", label: "Marked improvement", summary: "At least 75% reduction from baseline." },
    ],
    disclaimer:
      "Treatment-response categories are pragmatic longitudinal descriptors and have not been established as validated FNQ-5 minimal clinically important difference thresholds.",
  },

  domainAnalysis: {
    enabled: true,
    note: "These domains are conceptual groupings for clinical display and are not independently validated FNQ subscales.",
    domains: [
      { id: "preoccupation", label: "Food preoccupation", items: ["fnq1", "fnq3"], scoreRange: "0-8" },
      { id: "loss_of_control", label: "Perceived uncontrollability", items: ["fnq2"], scoreRange: "0-4" },
      { id: "functional_impact", label: "Functional impact", items: ["fnq4", "fnq5"], scoreRange: "0-8" },
    ],
  },

  clinicalSafety: {
    notDiagnostic: true,
    messages: [
      "The FNQ-5 measures food-related cognitive preoccupation and should not be used alone to diagnose an eating disorder.",
      "Interpret results alongside clinical history, eating behaviour, nutritional status, weight trajectory, medications and psychological factors.",
      "High scores or substantial functional impact may justify further clinical assessment.",
    ],
  },
};

export type FnqItemId = "fnq1" | "fnq2" | "fnq3" | "fnq4" | "fnq5";

export const FNQ_ITEM_IDS: FnqItemId[] = ["fnq1", "fnq2", "fnq3", "fnq4", "fnq5"];

export function findInterpretationBand(score: number) {
  return FOOD_NOISE_SCALE.interpretation.displayBands.find((b) => score >= b.min && score <= b.max);
}

export function calculateDomainScore(responses: Record<FnqItemId, number | null>, domainId: string) {
  const domain = FOOD_NOISE_SCALE.domainAnalysis.domains.find((d) => d.id === domainId);
  if (!domain) return 0;
  return domain.items.reduce((sum, itemId) => sum + (responses[itemId as FnqItemId] ?? 0), 0);
}

export function calculateTotalScore(responses: Record<FnqItemId, number | null>) {
  return FNQ_ITEM_IDS.reduce((sum, id) => sum + (responses[id] ?? 0), 0);
}

export function isComplete(responses: Record<FnqItemId, number | null>) {
  return FNQ_ITEM_IDS.every((id) => responses[id] !== null && responses[id] !== undefined);
}

export function getTreatmentResponseCategory(percentageReduction: number | null) {
  if (percentageReduction === null || percentageReduction === undefined) return null;
  if (percentageReduction < 0) return FOOD_NOISE_SCALE.treatmentResponse.categories[0];
  if (percentageReduction < 20) return FOOD_NOISE_SCALE.treatmentResponse.categories[1];
  if (percentageReduction < 30) return FOOD_NOISE_SCALE.treatmentResponse.categories[2];
  if (percentageReduction < 50) return FOOD_NOISE_SCALE.treatmentResponse.categories[3];
  if (percentageReduction < 75) return FOOD_NOISE_SCALE.treatmentResponse.categories[4];
  return FOOD_NOISE_SCALE.treatmentResponse.categories[5];
}

export function calculateComparison(baselineScore: number, followupScore: number) {
  const absoluteChange = followupScore - baselineScore;
  const absoluteReduction = baselineScore - followupScore;
  let percentageReduction: number | null = null;
  let percentageReductionDisplay = "";

  if (baselineScore === 0 && followupScore === 0) {
    percentageReduction = null;
    percentageReductionDisplay = "Not applicable";
  } else if (baselineScore === 0 && followupScore > 0) {
    percentageReduction = null;
    percentageReductionDisplay = "Not calculable";
  } else if (baselineScore > 0) {
    percentageReduction = parseFloat((((baselineScore - followupScore) / baselineScore) * 100).toFixed(1));
    percentageReductionDisplay = `${percentageReduction}%`;
  }

  const responseCategory = getTreatmentResponseCategory(percentageReduction);

  return {
    absoluteChange,
    absoluteReduction,
    percentageReduction,
    percentageReductionDisplay,
    responseCategory,
    percentageChange: baselineScore > 0 ? parseFloat((((followupScore - baselineScore) / baselineScore) * 100).toFixed(1)) : null,
    scoreRatio: baselineScore > 0 ? parseFloat(((followupScore / baselineScore) * 100).toFixed(1)) : null,
  };
}
