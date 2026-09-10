export interface ModuleMeta {
  title: string;
  version: string;
  platform: string;
  type: string;
  description: string;
  clinicalUse: string;
  standardizedTestWarning: string;
}

export interface RenderingEngine {
  strategy: string;
  supportedRenderers: string[];
  defaultCanvas: { width: number; height: number; viewBox: string; background: string };
  responsive: boolean;
  randomization: { enabled: boolean; seedPerSession: boolean; avoidImmediateRepeat: boolean };
}

export interface ScoreOption {
  id: string;
  label: string;
}

export interface TestModule {
  id: string;
  title: string;
  clinicalTarget?: string;
  pathway?: string;
  renderer: string;
  generator?: string;
  generatorConfig?: Record<string, unknown>;
  stimuli?: Record<string, unknown>[];
  assetCollection?: string;
  requiredAssets?: string[];
  variantsPerObject?: number;
  completionLevels?: number[];
  assetStyle?: Record<string, string>;
  objects?: (string | Record<string, string>)[];
  items?: Record<string, unknown>[];
  categories?: string[];
  unrealGenerationRules?: string[];
  dataset?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
  sequenceEngine?: Record<string, unknown>;
  stimulusSets?: Record<string, unknown>[];
  objectPool?: string[];
  scenes?: Record<string, unknown>[];
  tasks?: string[];
  record?: Record<string, string[]>;
  questionTypes?: string[];
  imageRequired?: boolean;
  interaction?: Record<string, unknown>;
  scoring?: Record<string, unknown>;
  scoreOptions?: string[];
  copyrightRule?: string;
  instruction?: string;
}

export interface AssetManifest {
  requiresGeneratedImageAssets: boolean;
  collections: Record<string, number>;
  estimatedExternalAssets: number;
  generatedAtRuntime: string[];
}

export interface LocalizationRule {
  pattern: string;
  requires?: string[];
  requiresAny?: string[];
  text: string;
}

export const OCCIPITAL_META: ModuleMeta = {
  title: "Occipital Lobe Visual Testing",
  version: "2.0.0",
  platform: "Lovable / React / TypeScript",
  type: "interactive_neurocognitive_assessment",
  description: "Hybrid visual stimulus engine for bedside assessment of occipital and higher visual cortical functions.",
  clinicalUse: "Screening and structured bedside examination",
  standardizedTestWarning:
    "Original bedside stimuli. Do not present these stimuli as validated versions of proprietary or standardized neuropsychological tests.",
};

export const OCCIPITAL_RENDERING_ENGINE: RenderingEngine = {
  strategy: "hybrid",
  supportedRenderers: ["svg", "css", "image_asset", "interactive_svg"],
  defaultCanvas: { width: 800, height: 600, viewBox: "0 0 800 600", background: "#FFFFFF" },
  responsive: true,
  randomization: { enabled: true, seedPerSession: true, avoidImmediateRepeat: true },
};

export const OCCIPITAL_MODULES: TestModule[] = [
  {
    id: "visual_matching",
    title: "Visual Form Matching",
    clinicalTarget: "Apperceptive visual agnosia",
    pathway: "ventral",
    renderer: "svg",
    generator: "shape_matching",
    generatorConfig: {
      targetPosition: "top_center",
      choices: 4,
      randomizeChoicePositions: true,
      shapeFamilies: ["irregular_polygon", "asymmetric_outline", "compound_geometric", "abstract_line_form"],
      distractorMethods: ["rotation", "mirror", "missing_segment", "added_segment", "proportion_change"],
    },
    interaction: { type: "single_choice", instruction: "Select the figure identical to the target.", tapTargets: true },
    scoring: { correct: 1, incorrect: 0, recordLatency: true },
  },
  {
    id: "figure_copying",
    title: "Figure Copying",
    clinicalTarget: "Apperceptive visual processing / construction",
    renderer: "svg",
    stimuli: [
      { id: "COPY01", generator: "overlapping_polygons", parameters: { polygonA: 5, polygonB: 5, overlap: 0.32 } },
      { id: "COPY02", generator: "wire_cube", parameters: { perspective: "oblique" } },
      { id: "COPY03", generator: "compound_geometric", parameters: { complexity: 3 } },
    ],
    interaction: { type: "examiner_scored", allowDrawingCanvas: true },
    scoreOptions: ["normal", "minor_errors", "major_distortion", "unable"],
  },
  {
    id: "incomplete_objects",
    title: "Incomplete Object Recognition",
    clinicalTarget: "Perceptual categorization",
    pathway: "ventral",
    renderer: "image_asset",
    assetCollection: "incomplete_objects",
    requiredAssets: [
      "elephant", "bicycle", "umbrella", "teapot", "airplane", "fish", "shoe", "chair", "key", "scissors", "cup", "flower",
    ],
    variantsPerObject: 3,
    completionLevels: [35, 50, 70],
    interaction: { type: "spoken_response", examinerRecords: ["correct", "incorrect", "not_recognized"] },
  },
  {
    id: "silhouette_recognition",
    title: "Silhouette Recognition",
    clinicalTarget: "Visual object recognition",
    renderer: "image_asset",
    assetStyle: { foreground: "#000000", background: "#FFFFFF", detail: "silhouette_only" },
    objects: ["elephant", "rooster", "bicycle", "scissors", "umbrella", "fish", "teapot", "shoe", "airplane", "chair", "flower", "key"],
    interaction: { type: "examiner_scored_naming" },
  },
  {
    id: "progressive_fragments",
    title: "Progressive Fragment Recognition",
    clinicalTarget: "Perceptual integration",
    renderer: "image_asset",
    sequenceEngine: {
      levels: 5,
      completionPercent: [20, 40, 60, 80, 100],
      advanceButton: true,
      stopWhenRecognized: true,
    },
    objects: ["fish", "chair", "airplane", "umbrella", "bicycle", "teapot"],
    scoring: { recordRecognitionLevel: true, lowerLevelIsBetter: true },
  },
  {
    id: "unusual_views",
    title: "Unusual View Object Recognition",
    clinicalTarget: "Perceptual categorization",
    renderer: "image_asset",
    objects: [
      { object: "cup", view: "from_below" },
      { object: "shoe", view: "sole" },
      { object: "bottle", view: "top_down" },
      { object: "spoon", view: "end_on" },
      { object: "scissors", view: "end_on" },
    ],
  },
  {
    id: "functional_matching",
    title: "Functional Object Matching",
    clinicalTarget: "Associative visual agnosia",
    renderer: "image_asset",
    interaction: { type: "single_choice", instruction: "Select the picture most closely associated with the target." },
    items: [
      { target: "key", correct: "lock", distractors: ["comb", "glass", "spoon"] },
      { target: "toothbrush", correct: "toothpaste", distractors: ["shoe", "hammer", "cup"] },
      { target: "needle", correct: "thread", distractors: ["key", "plate", "ball"] },
      { target: "shoe", correct: "sock", distractors: ["fork", "clock", "pencil"] },
    ],
  },
  {
    id: "real_unreal",
    title: "Real / Unreal Object Test",
    clinicalTarget: "Associative visual processing",
    renderer: "image_asset",
    interaction: { type: "binary_choice", prompt: "Could this object exist normally?" },
    categories: ["animals", "tools", "household_objects", "vehicles"],
    unrealGenerationRules: [
      "impossible_part_attachment",
      "missing_functional_component",
      "duplicated_component",
      "structurally_impossible_configuration",
    ],
  },
  {
    id: "semantic_association",
    title: "Picture Semantic Association",
    clinicalTarget: "Visual semantic access",
    renderer: "image_asset",
    interaction: { type: "two_choice_association" },
    items: [
      { target: "bird", correct: "nest", distractor: "boat" },
      { target: "bee", correct: "flower", distractor: "chair" },
      { target: "camel", correct: "desert", distractor: "snow" },
      { target: "fish", correct: "water", distractor: "tree" },
      { target: "dog", correct: "bone", distractor: "pencil" },
    ],
    copyrightRule: "Use original stimuli rather than reproducing standardized Pyramids and Palm Trees materials.",
  },
  {
    id: "face_matching",
    title: "Face Matching",
    clinicalTarget: "Prosopagnosia / face perception",
    renderer: "image_asset",
    dataset: {
      identityType: "synthetic_fictional",
      identityCount: 12,
      viewsPerIdentity: 4,
      views: ["frontal", "three_quarter_left", "three_quarter_right", "lighting_variation"],
      standardization: {
        expression: "neutral",
        background: "plain",
        crop: "head_shoulders",
        removeAccessories: true,
        removeText: true,
      },
    },
    interaction: { type: "match_target_face", choices: 6 },
    copyrightRule: "Do not call this the Benton Facial Recognition Test.",
  },
  {
    id: "colour_naming",
    title: "Colour Naming",
    clinicalTarget: "Cerebral colour processing",
    renderer: "svg",
    generator: "colour_tiles",
    parameters: {
      rows: 2,
      columns: 4,
      randomizePositions: true,
      colours: [
        { name: "red", hex: "#D32F2F" },
        { name: "blue", hex: "#1976D2" },
        { name: "green", hex: "#388E3C" },
        { name: "yellow", hex: "#FBC02D" },
        { name: "orange", hex: "#F57C00" },
        { name: "purple", hex: "#7B1FA2" },
        { name: "brown", hex: "#795548" },
        { name: "black", hex: "#000000" },
      ],
    },
    interaction: { type: "examiner_scored_naming" },
  },
  {
    id: "colour_pointing",
    title: "Colour Pointing",
    renderer: "interactive_svg",
    generator: "colour_tiles",
    interaction: { type: "tap_colour", examinerPrompt: true, randomizePrompt: true, autoScore: true },
  },
  {
    id: "colour_matching",
    title: "Colour Matching",
    renderer: "interactive_svg",
    generator: "colour_matching",
    parameters: { targetCount: 4, choiceCount: 4, randomize: true },
    interaction: { type: "tap_match", autoScore: true },
  },
  {
    id: "conceptual_colour",
    title: "Conceptual Colour Knowledge",
    renderer: "hybrid",
    items: [
      { objectAsset: "banana_outline", answer: "yellow" },
      { objectAsset: "leaf_outline", answer: "green" },
      { objectAsset: "ripe_tomato_outline", answer: "red" },
    ],
  },
  {
    id: "letter_cancellation",
    title: "Modified Letter Cancellation",
    clinicalTarget: "Dorsal simultanagnosia",
    renderer: "interactive_svg",
    generator: "letter_cancellation",
    parameters: {
      width: 800,
      height: 600,
      rows: 8,
      columns: 10,
      targetLetter: "A",
      targetCount: 12,
      distractorLetters: ["B", "C", "D", "E", "F", "H", "N", "R"],
      largeDistractorCount: 3,
      randomize: true,
    },
    interaction: { type: "multi_target_tap", highlightSelection: true },
    scoring: {
      targetsFound: true,
      omissions: true,
      falsePositives: true,
      leftOmissions: true,
      rightOmissions: true,
      completionTime: true,
    },
  },
  {
    id: "global_local",
    title: "Global-Local Letter Test",
    clinicalTarget: "Dorsal simultanagnosia",
    renderer: "svg",
    generator: "navon_letter",
    items: [
      { global: "C", local: "S" },
      { global: "H", local: "T" },
      { global: "E", local: "F" },
      { global: "A", local: "M" },
      { global: "S", local: "E" },
      { global: "F", local: "H" },
    ],
    parameters: {
      canvasWidth: 700,
      canvasHeight: 700,
      localFontSize: 22,
      spacing: 3,
      fontFamily: "Arial",
      foreground: "#000000",
      background: "#FFFFFF",
    },
    interaction: {
      steps: [
        { prompt: "What is the large letter?", answerField: "global" },
        { prompt: "What are the small letters?", answerField: "local" },
      ],
    },
    scoring: { globalAccuracy: true, localAccuracy: true, latency: true },
  },
  {
    id: "overlapping_objects",
    title: "Overlapping Object Recognition",
    clinicalTarget: "Ventral simultanagnosia",
    renderer: "image_asset",
    stimulusSets: [
      { difficulty: "easy", objectCount: 3 },
      { difficulty: "moderate", objectCount: 5 },
      { difficulty: "hard", objectCount: 7 },
    ],
    objectPool: [
      "scissors", "bottle", "shoe", "spoon", "umbrella", "key", "cup", "fish", "pencil", "glasses", "flower", "hammer", "banana", "comb",
    ],
    interaction: { type: "examiner_marks_objects_identified" },
    scoring: { objectsCorrect: true, objectsMissed: true, intrusions: true },
  },
  {
    id: "complex_scene",
    title: "Complex Scene Interpretation",
    clinicalTarget: "Ventral simultanagnosia",
    renderer: "image_asset",
    scenes: [
      {
        id: "SCENE01",
        asset: "original_kitchen_scene",
        expectedElements: [
          "child reaching for container",
          "unstable stool",
          "second child",
          "adult washing dishes",
          "overflowing sink",
          "falling object",
        ],
      },
      {
        id: "SCENE02",
        asset: "original_park_scene",
        expectedElements: ["dog chasing ball", "cyclist approaching", "child dropping ice cream", "person reading", "bird taking food"],
      },
    ],
    interaction: { type: "examiner_observation" },
    scoring: { elementsIdentified: true, integratedDescription: true, singleObjectResponses: true },
    copyrightRule: "Use original scenes rather than reproducing the Cookie Theft stimulus.",
  },
  {
    id: "circle_center",
    title: "Centre-of-Circle Test",
    clinicalTarget: "Visual disorientation",
    renderer: "interactive_svg",
    generator: "circle_center",
    parameters: {
      canvasWidth: 700,
      canvasHeight: 600,
      circleRadius: 210,
      strokeWidth: 4,
      stroke: "#000000",
      background: "#FFFFFF",
    },
    instruction: "Touch the centre of the circle.",
    interaction: { type: "coordinate_tap", singleTap: true, showMarkerAfterTap: true },
    scoring: {
      trueCenter: true,
      tapCoordinate: true,
      distancePixels: true,
      distancePercentRadius: true,
      horizontalError: true,
      verticalError: true,
    },
  },
  {
    id: "spatial_localization",
    title: "Spatial Localization",
    clinicalTarget: "Visual disorientation",
    renderer: "interactive_svg",
    generator: "spatial_objects",
    parameters: { objectCount: 2, randomPositions: true, minimumSeparation: 150 },
    questionTypes: ["which_is_nearer", "which_is_farther", "which_is_left", "which_is_right", "which_is_above", "which_is_below"],
    interaction: { type: "single_choice", autoScore: true },
  },
  {
    id: "optic_ataxia",
    title: "Optic Ataxia",
    clinicalTarget: "Dorsal visual stream",
    renderer: "bedside_task",
    imageRequired: false,
    tasks: [
      "Touch the examiner's ear",
      "Touch your own ear",
      "Reach for a target presented in the left visual field",
      "Reach for a target presented in the right visual field",
    ],
    record: {
      hand: ["left", "right"],
      visualField: ["left", "right", "central"],
      accuracy: ["normal", "mild_misreaching", "marked_misreaching", "unable"],
    },
  },
];

export const OCCIPITAL_ASSET_MANIFEST: AssetManifest = {
  requiresGeneratedImageAssets: true,
  collections: {
    incomplete_objects: 36,
    silhouettes: 12,
    progressive_fragments: 30,
    unusual_views: 12,
    functional_matching: 20,
    real_unreal: 24,
    semantic_association: 15,
    synthetic_faces: 48,
    overlapping_objects: 8,
    complex_scenes: 4,
  },
  estimatedExternalAssets: 209,
  generatedAtRuntime: [
    "visual_matching",
    "figure_copying",
    "colour_naming",
    "colour_pointing",
    "colour_matching",
    "letter_cancellation",
    "global_local",
    "circle_center",
    "spatial_localization",
  ],
};

export const OCCIPITAL_SUMMARY_DOMAINS = [
  "apperceptive",
  "associative",
  "face_processing",
  "colour_processing",
  "dorsal_stream",
  "ventral_stream",
  "visual_disorientation",
  "optic_ataxia",
];

export const OCCIPITAL_LOCALIZATION_RULES: LocalizationRule[] = [
  {
    pattern: "apperceptive_visual_dysfunction",
    requires: ["visual_matching_abnormal", "copying_abnormal"],
    text: "Impaired visual perceptual integration is demonstrated.",
  },
  {
    pattern: "associative_visual_dysfunction",
    requiresAny: ["functional_matching_abnormal", "semantic_association_abnormal", "real_unreal_abnormal"],
    text: "Impaired visual-semantic association is demonstrated.",
  },
  {
    pattern: "dorsal_stream_dysfunction",
    requiresAny: ["global_local_abnormal", "visual_disorientation_abnormal", "optic_ataxia_abnormal"],
    text: "Findings raise the possibility of dorsal visual-stream dysfunction.",
  },
  {
    pattern: "ventral_stream_dysfunction",
    requiresAny: ["object_recognition_abnormal", "face_processing_abnormal", "visual_semantic_abnormal"],
    text: "Findings raise the possibility of ventral visual-stream dysfunction.",
  },
];

export const OCCIPITAL_BUILD_INSTRUCTIONS = {
  framework: "React TypeScript",
  instruction: "Build the visual tests from this JSON configuration rather than hard-coding each test page.",
  components: [
    "OccipitalAssessment",
    "TestNavigator",
    "StimulusRenderer",
    "SVGStimulusRenderer",
    "ImageStimulusRenderer",
    "InteractiveSVG",
    "ExaminerControls",
    "ResponseRecorder",
    "DomainSummary",
    "ClinicalReport",
  ],
  svgGenerators: [
    "ShapeMatchingGenerator",
    "WireCubeGenerator",
    "PolygonGenerator",
    "ColourTileGenerator",
    "CancellationGenerator",
    "NavonGenerator",
    "CircleCenterGenerator",
    "SpatialObjectGenerator",
  ],
  routes: ["/occipital", "/occipital/test/:testId", "/occipital/results"],
  requirements: [
    "Render SVG stimuli dynamically from JSON parameters.",
    "Randomize stimulus order where configured.",
    "Randomize distractor positions without changing the answer key.",
    "Use large touch targets on iPhone and iPad.",
    "Provide examiner mode and patient stimulus mode.",
    "Do not expose correct answers on the patient stimulus screen.",
    "Store every response with stimulus ID.",
    "Record omissions and false-positive selections where applicable.",
    "Calculate centre-of-circle error automatically.",
    "Calculate cancellation asymmetry automatically.",
    "Generate a domain-level clinical summary.",
    "Do not diagnose or anatomically localize from a single failed item.",
  ],
};

export const OCCIPITAL_SCORE_OPTIONS: ScoreOption[] = [
  { id: "normal", label: "Normal" },
  { id: "abnormal", label: "Abnormal" },
  { id: "not_tested", label: "Not Tested" },
  { id: "minor_errors", label: "Minor errors" },
  { id: "major_distortion", label: "Major distortion" },
  { id: "unable", label: "Unable" },
  { id: "correct", label: "Correct" },
  { id: "incorrect", label: "Incorrect" },
  { id: "not_recognized", label: "Not recognized" },
  { id: "mild_misreaching", label: "Mild misreaching" },
  { id: "marked_misreaching", label: "Marked misreaching" },
];
