export type ResponseStatus = "normal" | "abnormal" | "not_tested";

export interface ResponseOption {
  id: ResponseStatus;
  label: string;
}

export interface BaselineTest {
  id: string;
  name: string;
  instruction?: string;
  subtests?: string[];
  responseType?: string;
}

export interface BaselineDomain {
  id: string;
  name: string;
  tests: BaselineTest[];
}

export interface LobeTest {
  id: string;
  name: string;
  instruction?: string;
  abnormalFinding?: string;
  target?: string;
  example?: string;
  subtests?: string[];
}

export interface LobeDomain {
  id: string;
  name: string;
  instruction?: string;
  tests: LobeTest[];
}

export interface Lobe {
  id: string;
  name: string;
  title: string;
  description: string;
  localizationHint: string;
  domains: LobeDomain[];
}

export const LOBAR_META = {
  title: "Lobar Function Bedside Assessment",
  shortTitle: "Lobar Testing",
  version: "1.0.0",
  category: "Neurology",
  subCategory: "Higher Mental Function Examination",
  audience: [
    "Neurologists",
    "Neurosurgeons",
    "Physicians",
    "Neurology Residents",
    "Medical Students",
  ],
  purpose: "Structured bedside assessment of higher cortical functions organized by cerebral lobe.",
  clinicalDisclaimer:
    "This application is an examination aid. Findings must be interpreted with the complete neurological examination and clinical context.",
  source: {
    title: "Higher Mental Function Examination",
    framework: "Clinico-anatomical lobar assessment",
    sourceType: "Uploaded reference chapter",
  },
};

export const LOBAR_APP = {
  type: "clinical_assessment",
  navigation: "tabs",
  primaryTabs: [
    "baseline",
    "frontal",
    "left_parietal",
    "right_parietal",
    "occipital",
    "temporal",
    "summary",
  ],
  features: {
    autoSummary: true,
    abnormalityCounter: true,
    clinicalNotes: true,
    localizationHints: true,
    copyReport: true,
    resetAssessment: true,
    allowNotTested: true,
    scoreEnabled: false,
  },
};

export const LOBAR_RESPONSE_OPTIONS: ResponseOption[] = [
  { id: "normal", label: "Normal" },
  { id: "abnormal", label: "Abnormal" },
  { id: "not_tested", label: "Not Tested" },
];

export const LOBAR_BASELINE: BaselineDomain[] = [
  {
    id: "consciousness",
    name: "Level of Consciousness",
    tests: [
      {
        id: "consciousness_level",
        name: "Level of Consciousness",
        instruction: "Document alertness and responsiveness.",
        responseType: "clinical_status",
      },
    ],
  },
  {
    id: "orientation",
    name: "Orientation",
    tests: [
      {
        id: "orientation_time",
        name: "Orientation to Time",
        instruction: "Ask year, season, month, day and date.",
      },
      {
        id: "orientation_place",
        name: "Orientation to Place",
        instruction: "Ask country, state, city, hospital and floor.",
      },
      {
        id: "orientation_person",
        name: "Orientation to Person",
        instruction: "Assess awareness of self and relevant persons.",
      },
    ],
  },
  {
    id: "attention",
    name: "Attention and Concentration",
    tests: [
      {
        id: "tap_a",
        name: "Tap A Test",
        instruction:
          "Read a series of letters. Ask the patient to tap whenever the letter A is heard.",
      },
      {
        id: "letter_cancellation",
        name: "Random Letter Cancellation",
        instruction:
          "Ask the patient to cancel target letters among distractors within a fixed time.",
      },
    ],
  },
  {
    id: "memory",
    name: "Memory",
    tests: [
      {
        id: "immediate_memory",
        name: "Immediate Memory",
        instruction: "Assess immediate registration and short-term retention.",
      },
      {
        id: "digit_forward",
        name: "Digit Span Forward",
        instruction: "Ask the patient to repeat progressively longer digit sequences.",
      },
      {
        id: "recent_memory",
        name: "Recent Memory",
        instruction: "Ask the patient to recall three objects after 3 to 5 minutes.",
      },
      {
        id: "recent_context",
        name: "Recent Contextual Recall",
        instruction: "Ask details such as breakfast or admission date.",
      },
      {
        id: "story_recall",
        name: "Delayed Story Recall",
        instruction: "Present a brief story and request recall after 3 to 5 minutes.",
      },
      {
        id: "visual_memory",
        name: "Visual Memory",
        instruction:
          "Hide familiar objects after observation, distract the patient, then ask for retrieval.",
      },
      {
        id: "paired_associate",
        name: "Paired Association Memory",
        instruction: "Present paired items and later cue recall of the associated item.",
      },
      {
        id: "remote_memory",
        name: "Remote Memory",
        instruction:
          "Ask established autobiographical details such as schooling or examination history.",
      },
      {
        id: "semantic_memory",
        name: "Semantic Memory",
        instruction: "Assess knowledge of familiar facts, concepts and general information.",
      },
    ],
  },
  {
    id: "language",
    name: "Language Examination",
    tests: [
      {
        id: "spontaneous_speech",
        name: "Spontaneous Speech",
        subtests: [
          "Fluency",
          "Prosody",
          "Grammar and syntax",
          "Phrase length",
          "Paraphasia",
          "Circumlocution",
          "Word-finding difficulty",
          "Initiation",
          "Content",
        ],
      },
      {
        id: "comprehension",
        name: "Comprehension",
            instruction: "Give commands of increasing complexity and observe whether the patient carries them out accurately without gestural cues.",
        subtests: ["One-step command", "Two-step command", "Three-step command", "Complex command"],
      },
      { id: "repetition", name: "Repetition" },
      { id: "naming", name: "Naming" },
      {
        id: "reading",
        name: "Reading",
            instruction: "Ask the patient to read aloud and to follow written commands. Test symbol recognition if aphasia is suspected.",
        subtests: ["Reading aloud", "Reading comprehension", "Reading symbols"],
      },
      { id: "writing", name: "Writing" },
      { id: "automatic_speech", name: "Automatic Speech" },
    ],
  },
];

export const LOBAR_LOBES: Lobe[] = [
  {
    id: "frontal",
    name: "Frontal Lobe",
    title: "Frontal Lobe Testing",
    description:
      "Executive function, planning, inhibition, set shifting, fluency, sequencing, abstraction, attention, working memory and intentional motor control.",
    localizationHint:
      "Multiple abnormalities support a frontal-executive dysfunction pattern. Interpret results in relation to attention, language, education and motor performance.",
    domains: [
      {
        id: "planning",
        name: "Planning",
        tests: [
          {
            id: "tower_of_london",
            name: "Tower of London",
            instruction:
              "Ask the patient to reproduce a target arrangement using the fewest possible moves while moving only one piece at a time.",
            abnormalFinding: "Inefficient planning, excessive moves, rule violations or inability to formulate a strategy.",
          },
        ],
      },
      {
        id: "response_inhibition",
        name: "Response Inhibition",
        tests: [
          {
            id: "go_no_go",
            name: "Go-No-Go Test",
            instruction: "One tap: raise two fingers. Two taps: remain still.",
            abnormalFinding: "Failure to inhibit a prepotent response.",
          },
          {
            id: "stroop",
            name: "Stroop Test",
            instruction: "Ask the patient to name the ink colour rather than read the colour word.",
            abnormalFinding: "Difficulty suppressing the automatic reading response.",
          },
        ],
      },
      {
        id: "mental_flexibility",
        name: "Mental Flexibility / Set Shifting",
        tests: [
          {
            id: "trail_making_b",
            name: "Trail Making Test B",
            instruction: "Alternate sequentially between numbers and letters.",
            abnormalFinding: "Set loss, perseveration, sequencing errors or marked slowing.",
          },
          {
            id: "wisconsin_card_sorting",
            name: "Wisconsin Card Sorting Test",
            instruction: "Assess ability to infer and shift sorting rules according to colour, number or shape.",
            abnormalFinding: "Perseveration or inability to shift conceptual set.",
          },
        ],
      },
      {
        id: "fluency",
        name: "Fluency",
        tests: [
          {
            id: "fas",
            name: "Phonemic Fluency - FAS",
            instruction: "Generate as many words as possible beginning with F, A and S, usually one minute per letter.",
          },
          {
            id: "semantic_fluency",
            name: "Semantic Fluency",
            instruction: "Generate as many items as possible from a semantic category such as animals.",
          },
          {
            id: "design_fluency",
            name: "Design Fluency",
            instruction: "Generate as many novel designs as possible within a fixed time.",
          },
        ],
      },
      {
        id: "sequencing",
        name: "Sequencing",
        tests: [
          {
            id: "luria_graphic_sequence",
            name: "Luria Graphic Sequencing",
            instruction: "Ask the patient to continue an alternating graphic sequence.",
          },
          {
            id: "fist_edge_palm",
            name: "Fist-Edge-Palm",
            instruction: "Ask the patient to repeat the sequence fist, edge and palm.",
          },
          {
            id: "fist_ring",
            name: "Fist-Ring Sequence",
            instruction: "Ask the patient to alternate a fist with a ring formed by thumb and forefinger.",
          },
        ],
      },
      {
        id: "conceptual_series",
        name: "Conceptual Series Completion",
        tests: [
          { id: "numeric_series", name: "Numeric Series", example: "1, 3, 5, ..." },
          { id: "word_series", name: "Word Pattern",
            instruction: "Present a word pattern and ask the patient to continue it (e.g., cat-tac, man-nam, big-…).", example: "Cat-tac, man-nam, big..." },
          { id: "alphanumeric_series", name: "Alphanumeric Series",
            instruction: "Present an alphanumeric series and ask for the next item (e.g., A1, B2, C3, D4…).", example: "A1, B2, C3, ..." },
        ],
      },
      {
        id: "abstraction",
        name: "Abstract Thinking",
        tests: [
          { id: "proverbs", name: "Proverb Interpretation" },
          {
            id: "similarities",
            name: "Similarities and Differences",
            instruction: "Ask how two objects are alike (e.g., cow and goat; orange and banana). Note level of abstraction.",
            example: "Compare a cow and a goat.",
          },
        ],
      },
      {
        id: "working_memory",
        name: "Working Memory",
        tests: [
          { id: "digits_backward", name: "Digit Span Backward" },
          {
            id: "letter_number_span",
            name: "Letter-Number Span",
            instruction:
              "Present mixed letters and numbers. Ask the patient to repeat numbers in ascending order followed by letters alphabetically.",
          },
        ],
      },
      {
        id: "intentional_motor",
        name: "Intentional Motor System",
        tests: [
          {
            id: "motor_impersistence",
            name: "Motor Impersistence",
            instruction: "Ask the patient to sustain an instructed motor act such as keeping the eyes closed.",
          },
          {
            id: "motor_perseveration",
            name: "Motor Perseveration",
            instruction: "Look for inappropriate continuation or repetition of a motor response.",
          },
          {
            id: "echopraxia",
            name: "Echopraxia",
            instruction:
              "Examiner shows one finger and patient should show two; examiner shows two and patient should show none. Observe for automatic imitation.",
          },
        ],
      },
    ],
  },
  {
    id: "left_parietal",
    name: "Left Parietal Lobe",
    title: "Dominant Parietal Lobe Testing",
    description: "Praxis, calculation, finger gnosis and right-left orientation.",
    localizationHint:
      "Combined acalculia, finger agnosia and right-left disorientation may indicate dominant parietal dysfunction when supported by the remainder of the examination.",
    domains: [
      {
        id: "apraxia",
        name: "Apraxia",
        tests: [
          {
            id: "conceptual_apraxia_tool_selection",
            name: "Tool Selection Task",
            instruction: "Select the correct tool for a familiar task, for example a hammer for a partially driven nail.",
          },
          {
            id: "alternative_tool_selection",
            name: "Alternative Tool Selection",
            instruction: "Select a suitable substitute when the normal tool is unavailable.",
          },
          {
            id: "gesture_recognition",
            name: "Gesture Recognition",
            instruction: "Name or identify gestures performed by the examiner.",
          },
          {
            id: "ideational_apraxia",
            name: "Ideational Apraxia",
            instruction: "Ask the patient to prepare a letter for mailing.",
          },
          {
            id: "ideomotor_transitive",
            name: "Transitive Movement",
            instruction: "Pantomime use of an object such as a hammer or screwdriver.",
          },
          {
            id: "ideomotor_intransitive",
            name: "Intransitive Movement",
            instruction: "Perform commands such as waving goodbye or touching the nose.",
          },
          {
            id: "movement_imitation",
            name: "Movement Imitation",
            instruction: "Imitate meaningful and meaningless movements, postures and sequences.",
          },
          { id: "actual_tool_use", name: "Actual Tool Use" },
          {
            id: "limb_kinetic_apraxia",
            name: "Limb-Kinetic Praxis",
            instruction: "Oppose thumb rapidly to index, middle, ring and little fingers in succession.",
          },
        ],
      },
      {
        id: "calculation",
        name: "Calculation",
        tests: [
          { id: "counting", name: "Forward and Backward Counting" },
          {
            id: "symbolic_transcoding",
            name: "Symbolic Transcoding",
            instruction: "Convert numerals to verbal form and verbal numbers to numerals.",
          },
          {
            id: "arithmetic_signs",
            name: "Arithmetic Signs",
            instruction: "Read and write arithmetic signs.",
          },
          {
            id: "mental_calculation",
            name: "Mental Calculation",
            instruction: "Addition, subtraction, multiplication and division.",
          },
          { id: "written_calculation", name: "Written Calculation" },
          {
            id: "column_alignment",
            name: "Column Alignment",
            instruction: "Assess correct spatial alignment of multidigit arithmetic.",
          },
          { id: "planned_arithmetic", name: "Arithmetic Requiring Planning" },
        ],
      },
      {
        id: "finger_gnosis",
        name: "Finger Gnosis",
        tests: [
          {
            id: "finger_visible",
            name: "Finger Identification - Visible Hand",
            instruction: "Touch a finger and ask the patient to localize and identify it.",
          },
          {
            id: "finger_hidden",
            name: "Finger Identification - Hidden Hand",
            instruction: "Repeat with the hand hidden from view.",
          },
        ],
      },
      {
        id: "right_left_orientation",
        name: "Right-Left Orientation",
        tests: [
          { id: "own_body", name: "Orientation to Own Body" },
          {
            id: "crossed_commands",
            name: "Crossed Commands",
            instruction: "Give crossed commands such as 'Touch your right ear with your left hand' or 'Touch your left knee with your right hand'.",
            example: "Touch the right ear with the left hand.",
          },
          { id: "examiner_body", name: "Orientation to Examiner" },
          { id: "combined_orientation", name: "Combined Self-Examiner Orientation" },
        ],
      },
    ],
  },
  {
    id: "right_parietal",
    name: "Right Parietal Lobe",
    title: "Right Parietal Lobe Testing",
    description: "Hemispatial attention, construction, dressing and topographic orientation.",
    localizationHint:
      "Asymmetric omissions, line-bisection deviation, impaired construction or dressing and topographic disturbance support a right parietal dysfunction pattern.",
    domains: [
      {
        id: "hemineglect",
        name: "Hemispatial Neglect",
        tests: [
          {
            id: "target_cancellation",
            name: "Target Cancellation",
            instruction: "Cancel targets among distractors and inspect for asymmetric omissions.",
          },
          {
            id: "line_bisection",
            name: "Horizontal Line Bisection",
            instruction: "Ask the patient to mark the midpoint of a horizontal line.",
          },
          {
            id: "clock_drawing",
            name: "Clock Drawing",
            instruction: "Draw a clock and inspect number placement and spatial organization.",
          },
          {
            id: "spatial_localization",
            name: "Spatial Localization",
            instruction: "Assess location of objects relative to the patient.",
          },
        ],
      },
      {
        id: "construction",
        name: "Constructional Praxis",
        tests: [
          { id: "necker_cube", name: "Necker Cube Copy" },
          { id: "overlapping_pentagons", name: "Overlapping Pentagons" },
          { id: "clock_construction", name: "Clock Construction" },
        ],
      },
      {
        id: "dressing",
        name: "Dressing Praxis",
        tests: [
          {
            id: "jacket_test",
            name: "Jacket Dressing Task",
            instruction:
              "Ask the patient to put on a jacket whose sleeves have been deliberately turned inside out and whose orientation has been reversed.",
          },
        ],
      },
      {
        id: "topography",
        name: "Topographic Function",
        tests: [
          {
            id: "object_locations",
            name: "Immediate Spatial Locations",
            instruction: "Determine spatial locations of nearby objects.",
          },
          { id: "familiar_landmarks", name: "Familiar Landmark Recognition" },
          {
            id: "familiar_map",
            name: "Map of Familiar Place",
            instruction: "Ask the patient to draw a map of a familiar place.",
          },
          {
            id: "new_route",
            name: "Describe New Route",
            instruction: "Ask the patient to describe a recently learned route.",
          },
        ],
      },
    ],
  },
  {
    id: "occipital",
    name: "Occipital and Visual Association Cortex",
    title: "Occipital Lobe Testing",
    description: "Primary vision and higher ventral and dorsal visual processing.",
    localizationHint:
      "Always assess basic visual fields before interpreting higher visual processing abnormalities.",
    domains: [
      {
        id: "primary_visual",
        name: "Primary Visual Cortex",
        tests: [
          {
            id: "visual_fields",
            name: "Visual Fields",
            instruction: "Screen for visual field defects.",
          },
        ],
      },
      {
        id: "ventral_stream",
        name: "Ventral Stream",
        tests: [
          { id: "apperceptive_matching", name: "Visual Matching", target: "Apperceptive visual agnosia" },
          { id: "copying", name: "Copying",
            instruction: "Ask the patient to copy line drawings of increasing complexity. Watch for rotation, omission and spatial distortion.", target: "Apperceptive visual agnosia" },
          { id: "incomplete_letters", name: "Incomplete Letter Test",
            instruction: "Show letters with missing parts and ask the patient to identify them.", target: "Perceptual categorization" },
          { id: "silhouettes", name: "Silhouettes",
            instruction: "Show black silhouettes of common objects and ask the patient to name them.", target: "Perceptual categorization" },
          { id: "gollin_figures", name: "Gollin Figures",
            instruction: "Present a series of increasingly complete fragments of a single object and ask the patient to identify it as early as possible.", target: "Perceptual categorization" },
          { id: "unusual_view", name: "Usual / Unusual View Test",
            instruction: "Show photographs of objects from unfamiliar angles and ask the patient to name them.", target: "Perceptual categorization" },
          { id: "foreshortened_match", name: "Foreshortened Match",
            instruction: "Show foreshortened views of objects and ask the patient to match them to canonical views.", target: "Perceptual categorization" },
          { id: "functional_matching", name: "Functional Object Matching",
            instruction: "Show a target object and ask the patient to select the object most closely associated with it in use.", target: "Associative visual agnosia" },
          { id: "real_unreal", name: "Real and Unreal Object Test",
            instruction: "Show realistic and physically impossible objects; ask whether each object could normally exist.", target: "Associative visual agnosia" },
          { id: "pyramids_palm_trees", name: "Pyramids and Palm Trees",
            instruction: "Show a target picture and two choice pictures; ask the patient to choose the semantically related choice.", target: "Visual semantic association" },
          { id: "prosopagnosia_informal", name: "Familiar Face Recognition",
            instruction: "Show photographs of familiar people and ask the patient to name them or judge familiarity.", target: "Prosopagnosia" },
          { id: "benton_face", name: "Benton Facial Recognition Concept",
            instruction: "Show a target face and several choice faces; ask the patient to select the matching identity across different views.", target: "Face perception" },
        ],
      },
      {
        id: "colour_processing",
        name: "Cerebral Colour Processing",
        tests: [
          { id: "ishihara", name: "Ishihara Screening" },
          { id: "colour_naming", name: "Colour Naming" },
          { id: "colour_pointing", name: "Colour Pointing" },
          { id: "colour_matching", name: "Colour Matching" },
          { id: "colour_sorting", name: "Colour Sorting" },
          { id: "conceptual_colour", name: "Conceptual Colour Naming" },
          { id: "colour_painting", name: "Colour Painting" },
        ],
      },
      {
        id: "dorsal_stream",
        name: "Dorsal Stream",
        tests: [
          {
            id: "dorsal_simultanagnosia",
            name: "Modified Letter Cancellation",
            target: "Dorsal simultanagnosia",
          },
          {
            id: "global_local",
            name: "Global-Local Letter Test",
            instruction: "Present a large global letter composed of smaller local letters.",
          },
          { id: "mixed_figures", name: "Mixed Figure Test",
            instruction: "Show overlapping or embedded figures and ask the patient to identify and count each object.", target: "Ventral simultanagnosia" },
          {
            id: "cookie_theft",
            name: "Complex Scene Description",
            instruction: "Show a complex scene and ask the patient to describe what is happening. Note whether only isolated objects are described.",
            example: "Cookie Theft picture",
            target: "Ventral simultanagnosia",
          },
          {
            id: "visual_disorientation_depth",
            name: "Near-Far Object Localization",
            instruction: "Place two objects at different distances and ask which is nearer or farther; observe visually guided reaching.",
            target: "Visual disorientation",
          },
          { id: "circle_center", name: "Centre-of-Circle Test",
            instruction: "Show a circle and ask the patient to mark the centre. Measure deviation.", target: "Visual disorientation" },
          {
            id: "optic_ataxia",
            name: "Visually Guided Reaching",
            instruction: "Ask the patient to touch the examiner's ear and then the patient's own ear.",
            target: "Optic ataxia",
          },
        ],
      },
    ],
  },
  {
    id: "temporal",
    name: "Temporal Lobe",
    title: "Temporal Lobe Function",
    description:
      "Recent episodic memory, integrated topographic memory, visual identification, semantic memory and language.",
    localizationHint:
      "The reference source summarizes temporal functions rather than presenting a separate extensive temporal battery.",
    domains: [
      {
        id: "episodic_memory",
        name: "Recent Episodic Memory",
        tests: [
          {
            id: "three_object_recall",
            name: "Three-Object Delayed Recall",
            instruction: "Ask the patient to recall three objects after 3 to 5 minutes.",
          },
          { id: "story_delayed_recall", name: "Delayed Story Recall" },
          { id: "recent_event_memory", name: "Recent Event Memory" },
        ],
      },
      {
        id: "visual_memory",
        name: "Visual Memory",
            instruction: "Allow the patient to inspect three common objects, then hide them; after a distraction task, ask the patient to retrieve or name them.",
        tests: [{ id: "hidden_objects", name: "Hidden Object Recall" }],
      },
      {
        id: "associative_memory",
        name: "Associative Memory",
        tests: [{ id: "paired_associates", name: "Paired Associate Memory" }],
      },
      {
        id: "semantic_memory",
        name: "Semantic Memory",
            instruction: "Ask general knowledge questions appropriate to the patient's background (e.g., capitals, historical events, famous persons).",
        tests: [{ id: "general_knowledge", name: "General Knowledge" }],
      },
      {
        id: "topographic_memory",
        name: "Integrated Topographic Memory",
        tests: [{ id: "familiar_routes", name: "Familiar Routes and Places" }],
      },
      {
        id: "visual_identification",
        name: "Visual Identification",
        tests: [
          { id: "face_identification", name: "Face Identification" },
          { id: "letter_identification", name: "Letter Identification" },
          { id: "symbol_identification", name: "Symbol Identification" },
        ],
      },
      {
        id: "language_semantics",
        name: "Language and Semantic Access",
        tests: [
          { id: "object_naming", name: "Object Naming" },
          { id: "semantic_access", name: "Semantic Access" },
          { id: "language_comprehension", name: "Language Comprehension" },
        ],
      },
    ],
  },
];

export const LOBAR_TAB_ORDER = [
  { id: "baseline", label: "Baseline", subtitle: "Higher Mental Function" },
  { id: "frontal", label: "Frontal", subtitle: "Executive" },
  { id: "left_parietal", label: "Left Parietal", subtitle: "Praxis · Calculation" },
  { id: "right_parietal", label: "Right Parietal", subtitle: "Spatial · Neglect" },
  { id: "occipital", label: "Occipital", subtitle: "Visual Processing" },
  { id: "temporal", label: "Temporal", subtitle: "Memory · Semantics" },
  { id: "summary", label: "Summary", subtitle: "Report" },
];

export const LOBAR_TAB_COLORS: Record<
  string,
  { active: string; inactive: string; icon: string }
> = {
  baseline: {
    active: "bg-slate-600 text-white shadow-sm",
    inactive: "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:bg-slate-900/60",
    icon: "text-slate-500",
  },
  frontal: {
    active: "bg-rose-600 text-white shadow-sm",
    inactive: "bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-900/60",
    icon: "text-rose-500",
  },
  left_parietal: {
    active: "bg-blue-600 text-white shadow-sm",
    inactive: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:hover:bg-blue-900/60",
    icon: "text-blue-500",
  },
  right_parietal: {
    active: "bg-cyan-600 text-white shadow-sm",
    inactive: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-200 dark:hover:bg-cyan-900/60",
    icon: "text-cyan-500",
  },
  occipital: {
    active: "bg-violet-600 text-white shadow-sm",
    inactive: "bg-violet-100 text-violet-800 hover:bg-violet-200 dark:bg-violet-950/40 dark:text-violet-200 dark:hover:bg-violet-900/60",
    icon: "text-violet-500",
  },
  temporal: {
    active: "bg-amber-500 text-white shadow-sm",
    inactive: "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:hover:bg-amber-900/60",
    icon: "text-amber-500",
  },
  summary: {
    active: "bg-emerald-600 text-white shadow-sm",
    inactive: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:hover:bg-emerald-900/60",
    icon: "text-emerald-500",
  },
};

export const LOBAR_SUMMARY_RULES = [
  {
    id: "frontal_pattern",
    condition: "multiple_abnormal_tests_in_frontal_domain",
    output: "Findings indicate a frontal-executive dysfunction pattern.",
  },
  {
    id: "dominant_parietal_pattern",
    condition: "abnormal_calculation_or_finger_gnosis_or_right_left_orientation_or_praxis",
    output: "Findings suggest dominant parietal dysfunction.",
  },
  {
    id: "right_parietal_pattern",
    condition: "abnormal_neglect_or_construction_or_dressing_or_topography",
    output: "Findings suggest right parietal visuospatial dysfunction.",
  },
  {
    id: "ventral_visual_pattern",
    condition: "abnormal_object_face_semantic_or_colour_recognition",
    output: "Findings suggest ventral visual-stream dysfunction.",
  },
  {
    id: "dorsal_visual_pattern",
    condition: "abnormal_simultanagnosia_visual_disorientation_or_optic_ataxia",
    output: "Findings suggest dorsal visual-stream dysfunction.",
  },
  {
    id: "temporal_pattern",
    condition: "abnormal_episodic_or_semantic_memory",
    output: "Findings suggest temporal memory-system dysfunction.",
  },
];

export const LOBAR_REPORT_TEMPLATE = {
  title: "Higher Mental Function and Lobar Assessment",
  sections: [
    "Baseline cognition",
    "Frontal lobe",
    "Left parietal lobe",
    "Right parietal lobe",
    "Occipital and visual association cortex",
    "Temporal lobe",
    "Clinical impression",
  ],
  normalSentence: "{testName}: Normal.",
  abnormalSentence: "{testName}: Abnormal. {observation}",
  notTestedSentence: "{testName}: Not tested.",
  impressionTemplate:
    "The examination demonstrates {patternSummary}. Findings should be correlated with the complete neurological examination, language function, visual fields, sensory and motor deficits, educational background and clinical context.",
};
