export interface LobarTestOption {
  value: number;
  label: string;
}

export interface LobarTest {
  id: string;
  name: string;
  instructions: string;
  normal_findings: string;
  abnormal_findings: string;
  localization_hint: string;
  ui: {
    inputType: string;
    options: LobarTestOption[];
    helpText: string;
  };
  scoring: {
    weight: number;
    domain: string;
  };
}

export interface Lobe {
  id: string;
  name: string;
  icon: string;
  key_functions: string[];
  clinical_signs_of_lesion: string[];
  tests: LobarTest[];
}

export const LOBAR_META = {
  title: "Lobar Functions Mini-App",
  version: "1.1.0",
  platform: "React + TypeScript",
  purpose: "Bedside testing and localization of cerebral lobar functions in neurology",
  sources: [
    "Cleveland Clinic: Cerebral Cortex Functions",
    "StatPearls: Physiology, Cerebral Cortex Functions",
    "Queensland Brain Institute: Lobes of the Brain",
    "BIAUSA: Functions of the Brain",
    "Oxford Textbook of Neurological Surgery: Clinical assessment",
    "Neurological Examination Made Practical (BM-Publisher)",
    "Lobar Function Tests (Scribd/teaching slides)",
  ],
};

export const LOBAR_NAVIGATION = {
  defaultLobe: "frontal",
  order: ["frontal", "parietal", "temporal", "occipital"],
  views: [
    { id: "overview", label: "Overview", description: "Key functions and clinical signs for each lobe" },
    { id: "tests", label: "Bedside Tests", description: "Interactive test cards with scoring" },
    { id: "summary", label: "Summary & Localization", description: "Lobar scores and likely localization" },
  ],
};

export const LOBES: Lobe[] = [
  {
    id: "frontal",
    name: "Frontal Lobe",
    icon: "brain-front",
    key_functions: [
      "Executive functions (planning, reasoning, problem-solving)",
      "Attention and concentration",
      "Personality, behavior, and emotional regulation",
      "Motor planning and initiation (primary motor cortex)",
      "Expressive language (Broca area, dominant hemisphere)",
      "Judgment, insight, and inhibition",
    ],
    clinical_signs_of_lesion: [
      "Executive dysfunction, poor planning/set-shifting",
      "Personality change, disinhibition, apathy/abulia",
      "Contralateral weakness (face/arm > leg if premotor/motor)",
      "Expressive (Broca) aphasia if dominant inferior frontal",
      "Primitive reflexes (grasp, snout), gait apraxia (medial frontal)",
    ],
    tests: [
      {
        id: "frontal_executive",
        name: "Executive Function & Planning",
        instructions: "Ask patient to plan a simple task (e.g., 'How would you go to the market?'), perform trail-making or verbal fluency (name as many animals as possible in 60 s).",
        normal_findings: "Coherent, sequential plan; ≥12 animals in 60 s; completes trail-making without major errors.",
        abnormal_findings: "Perseveration, concrete thinking, poor sequencing, reduced verbal fluency.",
        localization_hint: "Dorsolateral prefrontal and superior frontal regions.",
        ui: {
          inputType: "select",
          options: [
            { value: 2, label: "Normal" },
            { value: 1, label: "Borderline" },
            { value: 0, label: "Abnormal" },
          ],
          helpText: "Use verbal fluency (animals in 60 s) and planning quality to guide scoring.",
        },
        scoring: { weight: 1, domain: "executive" },
      },
      {
        id: "frontal_motor",
        name: "Motor Cortex / Premotor",
        instructions: "Test strength in face, arm, leg; look for pronator drift; assess fine finger movements and rapid alternating movements.",
        normal_findings: "Symmetric strength, no drift, normal rapid alternating movements.",
        abnormal_findings: "Contralateral weakness, pronator drift, clumsy fine movements.",
        localization_hint: "Primary motor and premotor cortex (precentral gyrus).",
        ui: {
          inputType: "select",
          options: [
            { value: 2, label: "Normal" },
            { value: 1, label: "Borderline" },
            { value: 0, label: "Abnormal" },
          ],
          helpText: "Score based on presence and degree of contralateral weakness or drift.",
        },
        scoring: { weight: 1, domain: "motor" },
      },
      {
        id: "frontal_language",
        name: "Expressive Language (Broca)",
        instructions: "Ask patient to describe a picture, repeat sentences, and name objects; observe effortful, non-fluent speech with relatively preserved comprehension.",
        normal_findings: "Fluent, grammatically correct speech; normal repetition and naming.",
        abnormal_findings: "Non-fluent, effortful speech; agrammatism; impaired repetition/naming with relatively good comprehension.",
        localization_hint: "Dominant (usually left) inferior frontal gyrus.",
        ui: {
          inputType: "select",
          options: [
            { value: 2, label: "Normal" },
            { value: 1, label: "Borderline" },
            { value: 0, label: "Abnormal" },
          ],
          helpText: "Focus on fluency, grammar, and effort; comprehension usually preserved.",
        },
        scoring: { weight: 1, domain: "language" },
      },
      {
        id: "frontal_behavior",
        name: "Behavior, Judgment & Inhibition",
        instructions: "Ask social-judgment questions ('What would you do if you found a stamped letter on the street?'), assess impulse control, observe affect and appropriateness.",
        normal_findings: "Reasonable, socially appropriate answers; stable affect.",
        abnormal_findings: "Poor judgment, disinhibition, emotional lability, apathy.",
        localization_hint: "Orbitofrontal and medial frontal regions.",
        ui: {
          inputType: "select",
          options: [
            { value: 2, label: "Normal" },
            { value: 1, label: "Borderline" },
            { value: 0, label: "Abnormal" },
          ],
          helpText: "Use history and bedside behavior; consider caregiver input if available.",
        },
        scoring: { weight: 1, domain: "behavior" },
      },
      {
        id: "frontal_primitive",
        name: "Primitive Reflexes & Gait",
        instructions: "Check for grasp, snout, palmomental reflexes; observe gait (magnetic/gait apraxia).",
        normal_findings: "Absent primitive reflexes; normal gait initiation and pattern.",
        abnormal_findings: "Re-emergent primitive reflexes; magnetic gait, difficulty initiating steps.",
        localization_hint: "Medial frontal and supplementary motor areas.",
        ui: {
          inputType: "select",
          options: [
            { value: 2, label: "Normal" },
            { value: 1, label: "Borderline" },
            { value: 0, label: "Abnormal" },
          ],
          helpText: "Any clear re-emergent primitive reflex or magnetic gait → abnormal.",
        },
        scoring: { weight: 1, domain: "motor" },
      },
    ],
  },
  {
    id: "parietal",
    name: "Parietal Lobe",
    icon: "brain-side",
    key_functions: [
      "Somatosensory processing (touch, pain, temperature, vibration, proprioception)",
      "Sensory integration and stereognosis",
      "Spatial perception and visuospatial orientation",
      "Right–left orientation, constructional abilities",
      "Dominant parietal: language-related functions (reading, writing, calculation)",
    ],
    clinical_signs_of_lesion: [
      "Contralateral cortical sensory loss (astereognosis, agraphesthesia, extinction)",
      "Neglect (non-dominant, usually right)",
      "Gerstmann syndrome (dominant parietal): agraphia, acalculia, finger agnosia, left–right disorientation",
      "Constructional apraxia, dressing apraxia",
      "Superior quadrantanopia (inferior parietal/optic radiations)",
    ],
    tests: [
      {
        id: "parietal_primary_sensory",
        name: "Primary Sensory Modalities",
        instructions: "Test light touch, pinprick, temperature, vibration, and joint position sense in all limbs; compare sides.",
        normal_findings: "Symmetric perception of all modalities.",
        abnormal_findings: "Reduced or absent sensation contralateral to lesion.",
        localization_hint: "Postcentral gyrus and thalamocortical projections.",
        ui: {
          inputType: "select",
          options: [
            { value: 2, label: "Normal" },
            { value: 1, label: "Borderline" },
            { value: 0, label: "Abnormal" },
          ],
          helpText: "Score per side; mark abnormal if clear contralateral deficit.",
        },
        scoring: { weight: 1, domain: "sensory" },
      },
      {
        id: "parietal_cortical_sensory",
        name: "Cortical Sensory Functions",
        instructions: "Stereognosis (identify objects in hand with eyes closed), graphesthesia (identify numbers traced on palm), two-point discrimination, double simultaneous stimulation.",
        normal_findings: "Accurate object/number identification; normal two-point discrimination; no extinction.",
        abnormal_findings: "Astereognosis, agraphesthesia, extinction on double stimulation.",
        localization_hint: "Superior and inferior parietal lobules (sensory association cortex).",
        ui: {
          inputType: "select",
          options: [
            { value: 2, label: "Normal" },
            { value: 1, label: "Borderline" },
            { value: 0, label: "Abnormal" },
          ],
          helpText: "Any clear cortical sensory loss → abnormal.",
        },
        scoring: { weight: 1, domain: "sensory" },
      },
      {
        id: "parietal_spatial",
        name: "Visuospatial & Construction",
        instructions: "Ask patient to copy a cube or intersecting pentagons, draw a clock, and perform line bisection.",
        normal_findings: "Accurate drawings, normal line bisection, intact spatial orientation.",
        abnormal_findings: "Distorted drawings, neglect of one side, mis-bisection.",
        localization_hint: "Non-dominant (right) parietal for spatial/neglect; dominant for construction with language components.",
        ui: {
          inputType: "select",
          options: [
            { value: 2, label: "Normal" },
            { value: 1, label: "Borderline" },
            { value: 0, label: "Abnormal" },
          ],
          helpText: "Look for neglect, distortion, or consistent side errors.",
        },
        scoring: { weight: 1, domain: "visuospatial" },
      },
      {
        id: "parietal_orientation",
        name: "Right–Left Orientation & Finger Agnosia",
        instructions: "Ask patient to show right/left hands, ears, etc.; test finger identification (name touched finger with eyes closed).",
        normal_findings: "Accurate right–left identification and finger naming.",
        abnormal_findings: "Left–right confusion, finger agnosia.",
        localization_hint: "Dominant inferior parietal (Gerstmann syndrome).",
        ui: {
          inputType: "select",
          options: [
            { value: 2, label: "Normal" },
            { value: 1, label: "Borderline" },
            { value: 0, label: "Abnormal" },
          ],
          helpText: "Errors in right–left or finger naming → abnormal.",
        },
        scoring: { weight: 1, domain: "orientation" },
      },
      {
        id: "parietal_language_related",
        name: "Reading, Writing, Calculation",
        instructions: "Ask patient to read a sentence, write a sentence, and perform simple calculations.",
        normal_findings: "Normal reading, writing, and arithmetic.",
        abnormal_findings: "Alexia, agraphia, acalculia out of proportion to primary motor/sensory deficits.",
        localization_hint: "Dominant parietal (angular and supramarginal gyri).",
        ui: {
          inputType: "select",
          options: [
            { value: 2, label: "Normal" },
            { value: 1, label: "Borderline" },
            { value: 0, label: "Abnormal" },
          ],
          helpText: "Mark abnormal if deficits exceed what primary sensory/motor issues explain.",
        },
        scoring: { weight: 1, domain: "language" },
      },
    ],
  },
  {
    id: "temporal",
    name: "Temporal Lobe",
    icon: "brain-temporal",
    key_functions: [
      "Auditory processing (primary auditory cortex)",
      "Language comprehension (Wernicke area, dominant)",
      "Memory (hippocampus, medial temporal)",
      "Emotion and behavior (amygdala)",
      "Visual object and face recognition (inferotemporal)",
    ],
    clinical_signs_of_lesion: [
      "Receptive (Wernicke) aphasia if dominant superior temporal",
      "Memory impairment (especially recent/episodic)",
      "Auditory or visual hallucinations, olfactory/gustatory phenomena",
      "Emotional/behavioral changes (fear, aggression)",
      "Superior quadrantanopia ('pie in the sky') from Meyer's loop involvement",
    ],
    tests: [
      {
        id: "temporal_auditory",
        name: "Auditory Processing",
        instructions: "Check hearing acuity; ask patient to repeat words and sentences; assess sound localization if possible.",
        normal_findings: "Normal hearing thresholds; accurate repetition and localization.",
        abnormal_findings: "Impaired discrimination or localization; cortical deafness patterns with preserved brainstem reflexes.",
        localization_hint: "Superior temporal gyrus (Heschl's gyrus).",
        ui: {
          inputType: "select",
          options: [
            { value: 2, label: "Normal" },
            { value: 1, label: "Borderline" },
            { value: 0, label: "Abnormal" },
          ],
          helpText: "Differentiate peripheral hearing loss from cortical processing issues.",
        },
        scoring: { weight: 1, domain: "auditory" },
      },
      {
        id: "temporal_language_comprehension",
        name: "Language Comprehension (Wernicke)",
        instructions: "Give multi-step commands ('Touch your left ear with your right hand'), ask patient to explain a proverb or picture.",
        normal_findings: "Accurate execution of commands; appropriate explanations.",
        abnormal_findings: "Fluent but meaningless speech, poor comprehension, paraphasic errors.",
        localization_hint: "Dominant posterior superior temporal gyrus.",
        ui: {
          inputType: "select",
          options: [
            { value: 2, label: "Normal" },
            { value: 1, label: "Borderline" },
            { value: 0, label: "Abnormal" },
          ],
          helpText: "Focus on comprehension and meaningfulness of speech.",
        },
        scoring: { weight: 1, domain: "language" },
      },
      {
        id: "temporal_memory",
        name: "Memory (Recent & Remote)",
        instructions: "Test recent memory (3-5 unrelated words and ask patient to recall them immediately and after a delay); test episodic recall of recent events.",
        normal_findings: "Recalls ≥4/5 words after delay; coherent recent memory.",
        abnormal_findings: "Rapid forgetting, poor encoding, confabulation, or semantic intrusions.",
        localization_hint: "Hippocampus and medial temporal structures (bilateral or dominant).",
        ui: {
          inputType: "select",
          options: [
            { value: 2, label: "Normal" },
            { value: 1, label: "Borderline" },
            { value: 0, label: "Abnormal" },
          ],
          helpText: "Score delayed recall; use standardized words or MoCA/memory tests if available.",
        },
        scoring: { weight: 1, domain: "memory" },
      },
      {
        id: "temporal_emotion_behavior",
        name: "Emotion & Behavior",
        instructions: "Explore history of fear, aggression, déjà vu, olfactory/gustatory auras; observe affect.",
        normal_findings: "Stable mood, no aura phenomena.",
        abnormal_findings: "Episodic fear, olfactory/gustatory hallucinations, behavioral changes.",
        localization_hint: "Amygdala and anterior temporal regions.",
        ui: {
          inputType: "select",
          options: [
            { value: 2, label: "Normal" },
            { value: 1, label: "Borderline" },
            { value: 0, label: "Abnormal" },
          ],
          helpText: "Use history and observed affect; consider seizure history.",
        },
        scoring: { weight: 1, domain: "behavior" },
      },
      {
        id: "temporal_visual_recognition",
        name: "Visual Object & Face Recognition",
        instructions: "Ask patient to name common objects and familiar faces; test for prosopagnosia if suspected.",
        normal_findings: "Accurate naming of objects and faces.",
        abnormal_findings: "Visual agnosia or prosopagnosia.",
        localization_hint: "Inferotemporal and fusiform regions.",
        ui: {
          inputType: "select",
          options: [
            { value: 2, label: "Normal" },
            { value: 1, label: "Borderline" },
            { value: 0, label: "Abnormal" },
          ],
          helpText: "Mark abnormal if object/face naming fails despite intact vision.",
        },
        scoring: { weight: 1, domain: "visuospatial" },
      },
    ],
  },
  {
    id: "occipital",
    name: "Occipital Lobe",
    icon: "eye",
    key_functions: [
      "Primary visual processing",
      "Visual field interpretation",
      "Color, motion, and form perception",
      "Object and facial recognition pathways (with temporal)",
    ],
    clinical_signs_of_lesion: [
      "Contralateral homonymous visual field defects",
      "Cortical blindness with preserved pupillary reflexes",
      "Visual agnosia, alexia without agraphia (dominant occipital + splenium)",
      "Color anomia, motion perception deficits",
    ],
    tests: [
      {
        id: "occipital_visual_fields",
        name: "Visual Field Testing",
        instructions: "Perform confrontation visual fields in all quadrants; note any homonymous defects.",
        normal_findings: "Full visual fields bilaterally.",
        abnormal_findings: "Contralateral homonymous hemianopia or quadrantanopia.",
        localization_hint: "Primary visual cortex and optic radiations.",
        ui: {
          inputType: "select",
          options: [
            { value: 2, label: "Normal" },
            { value: 1, label: "Borderline / Equivocal" },
            { value: 0, label: "Abnormal" },
          ],
          helpText: "Use finger counting or red target in each quadrant; be systematic.",
        },
        scoring: { weight: 1, domain: "visual" },
      },
      {
        id: "occipital_visual_acuity",
        name: "Visual Acuity & Cortical Vision",
        instructions: "Check Snellen acuity; assess for cortical blindness (patient reports blindness with normal pupillary reflexes and fundus).",
        normal_findings: "Normal acuity; appropriate visual behavior.",
        abnormal_findings: "Reduced acuity or cortical blindness patterns.",
        localization_hint: "Occipital cortex and geniculocalcarine pathways.",
        ui: {
          inputType: "select",
          options: [
            { value: 2, label: "Normal" },
            { value: 1, label: "Borderline" },
            { value: 0, label: "Abnormal" },
          ],
          helpText: "Consider cortical blindness if acuity poor but pupils/fundus normal.",
        },
        scoring: { weight: 1, domain: "visual" },
      },
      {
        id: "occipital_color_form",
        name: "Color, Form, and Motion Perception",
        instructions: "Ask patient to name colors, identify shapes, and describe moving objects.",
        normal_findings: "Accurate color naming, shape identification, and motion perception.",
        abnormal_findings: "Color anomia, form or motion perception deficits.",
        localization_hint: "Extrastriate visual areas (V2–V5).",
        ui: {
          inputType: "select",
          options: [
            { value: 2, label: "Normal" },
            { value: 1, label: "Borderline" },
            { value: 0, label: "Abnormal" },
          ],
          helpText: "Mark abnormal if specific modality (color/form/motion) is impaired.",
        },
        scoring: { weight: 1, domain: "visual" },
      },
      {
        id: "occipital_reading",
        name: "Reading & Visual Word Form",
        instructions: "Ask patient to read words and sentences; distinguish alexia without agraphia.",
        normal_findings: "Normal reading ability.",
        abnormal_findings: "Alexia with preserved writing (dominant occipital + splenial lesions).",
        localization_hint: "Dominant occipital and splenium of corpus callosum.",
        ui: {
          inputType: "select",
          options: [
            { value: 2, label: "Normal" },
            { value: 1, label: "Borderline" },
            { value: 0, label: "Abnormal" },
          ],
          helpText: "Suspect alexia without agraphia if reading impaired but writing preserved.",
        },
        scoring: { weight: 1, domain: "language" },
      },
    ],
  },
];

export const LOBAR_SCORING = {
  scale: {
    min: 0,
    max: 2,
    labels: {
      0: "Abnormal",
      1: "Borderline",
      2: "Normal",
    },
  },
  aggregation: {
    method: "weighted_mean",
    defaultWeight: 1,
    perLobe: true,
    perDomain: true,
  },
  interpretation: {
    thresholds: [
      { min: 1.7, label: "Likely normal", color: "green" },
      { min: 1.2, label: "Possible involvement", color: "orange" },
      { min: 0, label: "Likely lobar involvement", color: "red" },
    ],
    note: "Use as an adjunct to full neurological exam and imaging; not diagnostic on its own.",
  },
};

export const LOBAR_UI = {
  testCard: {
    showLocalizationHint: true,
    showNormalAbnormalFindings: true,
    defaultExpanded: false,
  },
  lobeSummary: {
    showKeyFunctions: true,
    showClinicalSigns: true,
    showScoreHeatmap: true,
  },
};

export const LOBAR_USAGE_NOTES = [
  "Adapt test wording to local language and literacy levels.",
  "Always interpret in context of full neurological exam and imaging.",
  "Dominant hemisphere is usually left in right-handed individuals.",
];

export const LOBAR_SCORE_LABELS: Record<number, string> = {
  2: "Normal",
  1: "Borderline",
  0: "Abnormal",
};

export function getLobeById(id: string): Lobe | undefined {
  return LOBES.find((l) => l.id === id);
}

export function getTestById(id: string): { lobe: Lobe; test: LobarTest } | undefined {
  for (const lobe of LOBES) {
    const test = lobe.tests.find((t) => t.id === id);
    if (test) return { lobe, test };
  }
  return undefined;
}
