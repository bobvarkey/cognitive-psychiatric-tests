import React from 'react';

interface ExplanationProps {
  procedure?: React.ReactNode;
  interpretation?: React.ReactNode;
  significance?: React.ReactNode;
  intro?: React.ReactNode;
}

const Block: React.FC<ExplanationProps> = ({ intro, procedure, interpretation, significance }) => (
  <div className="space-y-3 text-xs text-muted-foreground">
    {intro && <p>{intro}</p>}
    {procedure && (
      <div>
        <p className="font-semibold text-foreground">Procedure</p>
        <div className="mt-1">{procedure}</div>
      </div>
    )}
    {interpretation && (
      <div>
        <p className="font-semibold text-foreground">Interpretation</p>
        <div className="mt-1">{interpretation}</div>
      </div>
    )}
    {significance && (
      <div>
        <p className="font-semibold text-foreground">Clinical significance</p>
        <div className="mt-1">{significance}</div>
      </div>
    )}
  </div>
);

const UL: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ul className="list-disc pl-5 space-y-1">{items.map((it, i) => <li key={i}>{it}</li>)}</ul>
);

export const mseExplanations: Record<string, React.ReactNode> = {
  // ── Level of consciousness ──────────────────────────────────────────────
  'loc-alert': (
    <Block
      intro="Alertness reflects the patient's baseline arousal — eyes open spontaneously, attends to environment, responds appropriately."
      procedure="Observe on approach: spontaneous eye opening, orientation to voice, normal response latency."
      interpretation="Normal = fully awake and engaged. Reduced alertness suggests a global encephalopathic process before any cortical test is meaningful."
      significance="Arousal must be intact before higher cortical testing — a drowsy patient cannot be validly assessed for memory or language."
    />
  ),
  'loc-drowsy': (
    <Block
      intro="Drowsy / lethargic — patient falls asleep when not stimulated but is rousable to voice."
      procedure="Call name in normal voice; note whether eyes open and engagement is sustained."
      interpretation="Persistent drowsiness without sedation suggests metabolic, toxic, infectious or structural causes (delirium, raised ICP, hypoxia)."
      significance="Common early sign of delirium; mandates a search for reversible causes before cognitive scoring."
    />
  ),
  'loc-stupor': (
    <Block
      intro="Stupor — unresponsive to voice; rouses only to vigorous or noxious stimulation, then quickly relapses."
      procedure="Apply trapezius squeeze or sternal pressure; note motor response and eye opening (use GCS)."
      interpretation="Indicates a serious depression of arousal — diffuse cortical, brainstem reticular, or severe metabolic derangement."
      significance="Medical emergency; precludes any cognitive examination."
    />
  ),
  'loc-coma': (
    <Block
      intro="Coma — eyes closed, no purposeful response to any stimulus, no sleep–wake cycle."
      procedure="Assess GCS, brainstem reflexes (pupils, oculocephalic, corneal, gag) and motor posturing."
      interpretation="Reflects bihemispheric dysfunction or brainstem reticular activating system involvement."
      significance="Requires immediate resuscitation, imaging and intensive care; cognitive testing is not applicable."
    />
  ),

  // ── Orientation ─────────────────────────────────────────────────────────
  'or-time': (
    <Block
      intro="Time orientation is the most sensitive bedside test — typically the first orientation domain to fail."
      procedure="Ask year, season, month, day of week and date. Score each correct."
      interpretation="Errors of 1 day acceptable; large errors (wrong year/month) suggest delirium, dementia or severe amnesia."
      significance="Disorientation to time precedes disorientation to place and person in most progressive disorders."
    />
  ),
  'or-place': (
    <Block
      intro="Place orientation tests environmental awareness from broad to specific."
      procedure="Ask country, state, city, building/hospital and floor or ward."
      interpretation="Inability to name current building strongly suggests amnestic or confusional state."
      significance="Usually impaired after time orientation; loss is characteristic of moderate dementia and acute delirium."
    />
  ),
  'or-person': (
    <Block
      intro="Person orientation — knowing one's own identity — is the most preserved domain."
      procedure="Ask the patient their full name, age and date of birth."
      interpretation="Loss of personal identity is rare in organic disease and may suggest dissociative/functional aetiology, severe dementia or acute psychosis."
      significance="Disorientation to self late in the disease, or out of proportion to other deficits, is a red flag for non-organic cause."
    />
  ),

  // ── Attention ───────────────────────────────────────────────────────────
  'att-cancel': (
    <Block
      intro="Random letter cancellation is a paper-and-pencil sustained-attention task."
      procedure="Give a sheet of randomly arranged letters; ask the patient to cross out every target letter (e.g. every 'A') within 1 minute."
      interpretation={
        <UL items={[
          'Omissions = inattention / vigilance failure.',
          'Asymmetric omissions on one side of page = visual hemineglect.',
          'Commissions (wrong letters) = impulsivity / disinhibition.',
        ]} />
      }
      significance="Sensitive to delirium, frontal-subcortical dysfunction and unilateral spatial neglect."
    />
  ),
  'att-serial7': (
    <Block
      intro="Serial 7s and months-of-the-year backward test working memory and concentration."
      procedure="Ask the patient to subtract 7 from 100 serially (5 trials), or recite months/days of the week in reverse."
      interpretation="≥4/5 correct on serial 7s is normal. Months-backward errors are typical in delirium and moderate dementia."
      significance="A core MMSE/MoCA attention item; failure suggests working-memory/executive impairment when language and arithmetic are intact."
    />
  ),

  // ── Memory: immediate / working ─────────────────────────────────────────
  'mem-digit-fwd': (
    <Block
      intro="Digit span forward measures immediate auditory attention span (phonological loop)."
      procedure="Read digits at 1/second; patient repeats in same order. Increase length until 2 consecutive failures at the same span."
      interpretation="Normal span ≈ 7 ± 2 digits. <5 is abnormal in adults."
      significance="Reduced span suggests impaired attention, encoding or left-hemisphere/temporal dysfunction."
    />
  ),
  'mem-digit-bwd': (
    <Block
      intro="Digit span backward taxes the central executive component of working memory."
      procedure="Read digits; patient repeats in reverse order. Begin with 3 digits."
      interpretation="Normal ≈ forward span − 1. <4 backward digits is generally abnormal."
      significance="Sensitive to dorsolateral prefrontal dysfunction and global confusional states."
    />
  ),

  // ── Memory: recent ──────────────────────────────────────────────────────
  'mem-3obj': (
    <Block
      intro="Three-word delayed recall is the standard bedside test of episodic memory consolidation."
      procedure="State three unrelated words (e.g. apple–penny–table); patient repeats. After a 3–5 min distraction, ask recall."
      interpretation="<2/3 free recall is abnormal. Improvement with semantic cue suggests a retrieval (frontal-subcortical) deficit; failure to improve with cueing suggests true encoding/storage failure (medial temporal, e.g. Alzheimer's)."
      significance="Differentiates cortical (Alzheimer-type) amnesia from subcortical/frontal forgetting."
    />
  ),
  'mem-breakfast': (
    <Block
      intro="Asking about recent personal events tests autobiographical recent memory."
      procedure="Ask what the patient ate for breakfast, when they were admitted and why."
      interpretation="Vague, confabulated or absent answers suggest recent-memory deficit. Cross-check with informant."
      significance="Useful in patients who 'pass' formal word lists but show real-world memory failure (early Alzheimer's, Korsakoff)."
    />
  ),
  'mem-story': (
    <Block
      intro="Story recall (e.g. Wechsler Logical Memory paragraph) tests contextual verbal episodic memory."
      procedure="Read a short paragraph (~25 idea units); ask immediate then 30-min delayed recall."
      interpretation="Loss of >50% of idea units at delay is abnormal."
      significance="More ecologically valid than word lists; sensitive to medial temporal lobe damage."
    />
  ),
  'mem-visual': (
    <Block
      intro="Hidden-objects task tests non-verbal episodic memory."
      procedure="Hide 5 objects in the room while the patient watches; after 5 min, ask them to find/recall them."
      interpretation="<3/5 located is abnormal."
      significance="Right hippocampal/visual memory probe; complements verbal recall."
    />
  ),
  'mem-paired': (
    <Block
      intro="Paired-associate learning measures the ability to form new verbal associations."
      procedure="Read word pairs (book–page, school–tape, mountain–river). Cue with first word; patient supplies the second across trials."
      interpretation="Easy pairs (semantically related) are usually preserved; hard (unrelated) pairs fail early in amnesia."
      significance="Classic Wechsler subtest; very sensitive to hippocampal/medial temporal dysfunction."
    />
  ),

  // ── Memory: remote & semantic ───────────────────────────────────────────
  'mem-school': (
    <Block
      intro="Remote memory probes biographical events well-prior to current illness."
      procedure="Ask schooling, exam years, marriage date, retirement, names of children."
      interpretation="Remote memory is typically preserved long after recent memory fails (Ribot's law)."
      significance="Preserved remote with impaired recent → typical Alzheimer pattern. Loss of remote with preserved recent → semantic dementia."
    />
  ),
  'mem-sem-facts': (
    <Block
      intro="Semantic memory is general knowledge of facts, words and concepts independent of personal experience."
      procedure="Ask culturally appropriate facts: first PM of India, colour of an elephant, days in a week, capital of the country."
      interpretation="Loss of common facts (especially with normal episodic memory) suggests semantic dementia (anterior temporal atrophy)."
      significance="Distinguishes semantic dementia from Alzheimer's disease."
    />
  ),

  // ── Language: spontaneous speech ────────────────────────────────────────
  'lang-fluency': (
    <Block
      intro="Fluency is the rate, ease and length of spoken output."
      procedure="Listen to 1 minute of conversational speech; estimate words per minute and phrase length."
      interpretation="Non-fluent (<50 wpm, short effortful phrases) suggests Broca's/anterior aphasia. Fluent but empty/paraphasic speech suggests posterior (Wernicke's) aphasia."
      significance="Fluency is the first branch in the bedside aphasia algorithm."
    />
  ),
  'lang-prosody': (
    <Block
      intro="Prosody = the melody, rhythm and emotional intonation of speech."
      procedure="Note pitch variation, stress and emotional colouring in spontaneous speech and on request ('say it angrily')."
      interpretation="Aprosodia (flat, monotone speech) is typical of right frontal lesions and parkinsonian syndromes."
      significance="Right-hemisphere homologue of Broca's area governs expressive prosody."
    />
  ),
  'lang-grammar': (
    <Block
      intro="Agrammatism — loss of grammatical morphemes and simplified sentence structure."
      procedure="Listen for omitted articles, prepositions, verb endings; ask patient to describe a picture."
      interpretation="Telegraphic, agrammatic speech suggests Broca's aphasia or progressive non-fluent aphasia."
      significance="Localises to left inferior frontal cortex."
    />
  ),
  'lang-paraphasia': (
    <Block
      intro="Paraphasias are word-level errors during fluent speech."
      procedure="Note errors during conversation and naming."
      interpretation={
        <UL items={[
          'Phonemic (literal): sound substitutions ("pable" for table).',
          'Semantic: related-word substitutions ("chair" for table).',
          'Neologistic: invented words.',
        ]} />
      }
      significance="Phonemic = conduction/Wernicke's; semantic = posterior temporal/semantic dementia; neologisms = severe Wernicke's."
    />
  ),
  'lang-circum': (
    <Block
      intro="Circumlocution = talking around a word the patient cannot retrieve."
      procedure="Note 'the thing you write with' for pen, lengthy description in place of the target."
      interpretation="Suggests anomia / word-finding difficulty."
      significance="Common in early Alzheimer's, semantic dementia and any anomic aphasia."
    />
  ),

  // ── Language: comprehension ─────────────────────────────────────────────
  'lang-1step': (
    <Block
      intro="Single-step commands test basic auditory comprehension."
      procedure="'Close your eyes', 'Show me your tongue.' Avoid gestural cues."
      interpretation="Failure suggests severe receptive aphasia or global comprehension loss."
      significance="If 1-step fails, do not proceed to multi-step until aphasia is characterised."
    />
  ),
  'lang-2step': (
    <Block
      intro="Two-step commands probe sequential comprehension and working memory."
      procedure="'Touch your nose, then your ear.'"
      interpretation="Failure with intact 1-step suggests mild comprehension or working-memory deficit."
      significance="Sensitive screen for posterior left-hemisphere lesions."
    />
  ),
  'lang-3step': (
    <Block
      intro="The classic MMSE 3-step command tests comprehension + sequencing + motor execution."
      procedure="'Take this paper in your right hand, fold it in half, and put it on the floor.'"
      interpretation="Each step scored separately. Failure of all 3 = receptive aphasia or severe attentional/apraxic deficit."
      significance="Standard cognitive-screen item."
    />
  ),

  // ── Language: other ─────────────────────────────────────────────────────
  'lang-rep': (
    <Block
      intro="Repetition tests the integrity of the perisylvian language loop (arcuate fasciculus)."
      procedure="Ask repetition of progressively complex phrases ending with 'No ifs, ands or buts'."
      interpretation="Disproportionate repetition failure with preserved comprehension and fluency = conduction aphasia. Preserved repetition with poor comprehension = transcortical sensory aphasia."
      significance="Key branch point in classifying aphasias."
    />
  ),
  'lang-naming': (
    <Block
      intro="Confrontation naming probes lexical retrieval."
      procedure="Show common (watch, pen) and low-frequency objects/parts (knuckle, lapel, stem)."
      interpretation="Anomia is the most sensitive language deficit; present in nearly every aphasia."
      significance="Low-frequency items reveal early anomia missed by common objects."
    />
  ),
  'lang-read-aloud': (
    <Block
      intro="Reading aloud tests the orthography → phonology route."
      procedure="Have the patient read sentences and irregular words ('yacht', 'colonel')."
      interpretation="Impaired reading of irregular words = surface dyslexia (semantic dementia). Impaired non-words = phonological dyslexia."
      significance="Helps localise dyslexia subtype."
    />
  ),
  'lang-read-comp': (
    <Block
      intro="Reading comprehension may dissociate from reading aloud."
      procedure="Give a written command ('Close your eyes') and check execution."
      interpretation="Impaired comprehension with preserved reading aloud suggests pure word-deafness for the visual word form."
      significance="Important in alexia syndromes."
    />
  ),
  'lang-symbols': (
    <Block
      intro="Reading non-linguistic symbols (numerals, road signs, logos) tests visual semantic access independent of letters."
      procedure="Show numbers, traffic signs, logos."
      interpretation="Preserved symbol recognition with impaired word reading suggests pure alexia."
      significance="Distinguishes pure alexia from broader visual agnosia."
    />
  ),
  'lang-writing': (
    <Block
      intro="Writing assesses spelling, grapho-motor planning and language output."
      procedure="Spontaneous sentence, dictation and copy."
      interpretation="Aphasic agraphia parallels the patient's spoken-language pattern. Pure agraphia (with intact speech and reading) suggests dominant parietal lesion."
      significance="Often the most sensitive sign of mild aphasia or callosal disconnection (left-hand agraphia)."
    />
  ),
  'lang-automatic': (
    <Block
      intro="Automatic / overlearned speech (counting 1–20, days of the week, prayer)."
      procedure="Ask the patient to count, recite the alphabet or a familiar prayer."
      interpretation="Often preserved in non-fluent aphasia even when propositional speech is lost."
      significance="Shows residual right-hemisphere or basal-ganglia language capability."
    />
  ),

  // ── Frontal: planning, inhibition, flexibility ──────────────────────────
  'fr-tol': (
    <Block
      intro="Tower of London / Hanoi tests planning, look-ahead and goal management."
      procedure="Patient must move beads/discs from a start to a goal configuration in a minimum number of moves, following rules."
      interpretation="Excessive moves, rule violations, impulsive starts indicate planning failure."
      significance="Sensitive to dorsolateral prefrontal cortex dysfunction."
    />
  ),
  'fr-gng': (
    <Block
      intro="Go / no-go tests response inhibition."
      procedure="Instruct: 'Tap once when I tap once; do not tap when I tap twice.' 10–20 trials, mixed."
      interpretation="Inability to suppress the prepotent response (taps to no-go) = frontal disinhibition."
      significance="Classical sign of orbitofrontal / medial frontal dysfunction."
    />
  ),
  'fr-stroop': (
    <Block
      intro="Stroop test measures selective attention and inhibition of an automatic response."
      procedure="Three cards: read colour words, name colour patches, then name the ink colour of incongruent colour words (RED printed in blue ink → say 'blue')."
      interpretation="Interference time/errors on the third card index inhibitory control."
      significance="Sensitive to anterior cingulate and dorsolateral PFC dysfunction; impaired in many psychiatric and neurological conditions."
    />
  ),
  'fr-trailb': (
    <Block
      intro="Trail Making B tests set-shifting and divided attention."
      procedure="Patient connects alternating numbers and letters (1–A–2–B–3–C…) as fast as possible without lifting the pencil."
      interpretation="Time and errors compared to age norms; relative to Trail A controls for psychomotor speed."
      significance="Strong measure of executive flexibility; impaired in frontal lesions, dementia, TBI."
    />
  ),
  'fr-wcst': (
    <Block
      intro="Wisconsin Card Sorting Test measures concept formation and set-shifting."
      procedure="Patient sorts cards by an unstated rule (colour, shape, number); rule changes after 10 correct sorts. Examiner gives only right/wrong feedback."
      interpretation="Perseverative errors (continuing the old rule) are the hallmark of frontal dysfunction."
      significance="Gold-standard test of cognitive flexibility; sensitive to dorsolateral PFC."
    />
  ),

  // ── Frontal: fluency ────────────────────────────────────────────────────
  'fr-fas': (
    <Block
      intro="Phonemic (FAS) verbal fluency — generate words beginning with F, then A, then S."
      procedure="60 seconds per letter. Exclude proper nouns and repetitions."
      interpretation="Normal ≈ ≥11 words per letter (education-adjusted). Low output = frontal/executive impairment."
      significance="Left dorsolateral PFC task; impaired early in frontotemporal dementia."
    />
  ),
  'fr-sem': (
    <Block
      intro="Semantic (category) fluency — name as many animals as possible in 60 s."
      procedure="60 seconds; record total unique items."
      interpretation="Normal ≈ ≥15 animals. Disproportionate semantic > phonemic loss suggests semantic dementia / Alzheimer's; reverse pattern suggests frontal disease."
      significance="Comparing semantic vs phonemic fluency localises pathology."
    />
  ),
  'fr-design': (
    <Block
      intro="Design fluency — non-verbal counterpart of verbal fluency."
      procedure="Ask the patient to draw as many different novel designs as possible in 60 s, connecting dots without repeating shapes."
      interpretation="Few or repeated designs = frontal/right-hemisphere dysfunction."
      significance="Right frontal probe complementing verbal fluency."
    />
  ),

  // ── Frontal: sequencing ─────────────────────────────────────────────────
  'fr-graphic': (
    <Block
      intro="Graphic sequencing (alternating series, e.g. mmnnmmnn… or VVVVV?)"
      procedure="Show a written alternating pattern; ask the patient to continue it across the page."
      interpretation="Loss of alternation, perseveration of one element = frontal dysfunction."
      significance="Quick bedside frontal probe."
    />
  ),
  'fr-fep': (
    <Block
      intro="Luria fist–edge–palm test of motor sequencing."
      procedure="Demonstrate the 3-step hand sequence (fist → edge → palm on thigh) several times; patient performs it ≥6 cycles, first with examiner, then alone."
      interpretation="Inability to maintain sequence, perseveration of one posture, or motor impersistence = frontal/premotor dysfunction."
      significance="Highly sensitive bedside frontal-lobe sign."
    />
  ),
  'fr-fr': (
    <Block
      intro="Fist–ring (or similar bimanual reciprocal task)."
      procedure="One hand makes a fist while the other makes a ring (thumb–index); alternate rapidly and reciprocally."
      interpretation="Mirror movements or inability to dissociate hands = callosal or frontal dysfunction."
      significance="Tests interhemispheric motor coordination."
    />
  ),

  // ── Frontal: series, abstraction, motor signs ───────────────────────────
  'fr-num': (
    <Block
      intro="Number-series completion tests inductive reasoning."
      procedure="Present sequences (1, 3, 5, …; 2, 4, 8, 16, …); ask the next number(s)."
      interpretation="Failure with intact arithmetic suggests abstract/executive deficit."
      significance="Quick non-verbal abstraction probe."
    />
  ),
  'fr-letter': (
    <Block
      intro="Letter / word-pattern series (e.g., cat–tac, dog–god)."
      procedure="Demonstrate a transformation; ask patient to apply it to new items."
      interpretation="Failure = poor abstraction or rule extraction."
      significance="Verbal counterpart of number series."
    />
  ),
  'fr-prov': (
    <Block
      intro="Proverb interpretation tests abstract/symbolic thinking."
      procedure="Ask the meaning of culture-appropriate proverbs ('Don't cry over spilt milk')."
      interpretation="Concrete or literal interpretations ('the milk is wasted') suggest impaired abstraction; bizarre ones may suggest psychosis."
      significance="Influenced by education — interpret cautiously."
    />
  ),
  'fr-sim': (
    <Block
      intro="Similarities — how are two items alike?"
      procedure="Ask: how are an apple and orange alike? a cow and a goat? a poem and a statue?"
      interpretation="Superordinate answer ('both fruit', 'both animals') = abstract. Concrete ('both round', 'both eat grass') = impaired abstraction."
      significance="Core abstraction test (also a WAIS subtest)."
    />
  ),
  'fr-imp': (
    <Block
      intro="Motor impersistence — inability to sustain a willed act."
      procedure="Ask patient to keep eyes closed, tongue out, or grip your fingers for 20 seconds."
      interpretation="Premature release indicates impersistence."
      significance="Right frontal sign; common after right MCA stroke."
    />
  ),
  'fr-pers': (
    <Block
      intro="Perseveration — abnormal continuation of a response after the task has changed."
      procedure="Observe in any task: drawing loops, alternating sequences, fluency."
      interpretation="Stuck-in-set behaviour = frontal-subcortical dysfunction."
      significance="Hallmark of frontal lobe / basal ganglia disease."
    />
  ),
  'fr-echo': (
    <Block
      intro="Echopraxia — automatic imitation of the examiner's gestures despite no instruction (or against instruction)."
      procedure="Quietly perform a gesture during conversation; or instruct 'Do not copy me.'"
      interpretation="Imitation suggests loss of frontal inhibition (environmental dependency)."
      significance="Seen in frontal lobe disease, autism, Tourette syndrome, catatonia."
    />
  ),

  // ── Left parietal: apraxia ──────────────────────────────────────────────
  'lp-concept': (
    <Block
      intro="Conceptual apraxia — loss of knowledge about tool function and tool–action–object associations."
      procedure="Ask the patient to choose the correct tool for a task (which tool to drive a nail?), or an alternative tool (no hammer available)."
      interpretation="Wrong tool selection or inability to suggest alternatives = conceptual apraxia."
      significance="Localises to left parietal/temporo-parietal cortex; common in corticobasal syndrome and Alzheimer's."
    />
  ),
  'lp-ideational': (
    <Block
      intro="Ideational apraxia — failure of multi-step action sequences."
      procedure="Letter-mailing: give an envelope, paper, pen and stamp; ask the patient to write, fold, insert, seal, address and stamp the letter."
      interpretation="Steps performed out of order or omitted = ideational apraxia."
      significance="Left parietal lesion; impacts activities of daily living."
    />
  ),
  'lp-ideomotor': (
    <Block
      intro="Ideomotor apraxia — loss of skilled gesture on command despite intact strength and coordination."
      procedure="Ask transitive ('Show me how you would use a comb') and intransitive ('Wave goodbye, salute') gestures; then ask imitation if pantomime fails."
      interpretation="Spatial errors, body-part-as-tool, hesitancy. Improvement on imitation but failure on command suggests disconnection between concept and motor system."
      significance="Left inferior parietal / arcuate fasciculus lesions."
    />
  ),
  'lp-limbk': (
    <Block
      intro="Limb-kinetic apraxia — loss of fine, precise finger movements."
      procedure="Rapid finger–thumb opposition, picking up a coin from a flat surface."
      interpretation="Clumsy, slow, dyscoordinated movements out of proportion to weakness."
      significance="Contralateral premotor/motor cortex lesion; classic in corticobasal syndrome."
    />
  ),

  // ── Left parietal: calculation ──────────────────────────────────────────
  'lp-counting': (
    <Block
      intro="Forward and backward counting probes basic numerical sequencing."
      procedure="Count 1–20 forward, then 20–1 backward."
      interpretation="Impaired backward counting with intact forward = working-memory or sequencing deficit."
      significance="Screening item for acalculia and attention."
    />
  ),
  'lp-trans': (
    <Block
      intro="Transcoding — converting between numeral forms (verbal ↔ Arabic ↔ written)."
      procedure="Dictation ('write three hundred and twenty-five'), reading aloud (325), writing what you say."
      interpretation="Errors despite intact arithmetic suggest a number-form deficit (parietal)."
      significance="Distinguishes number-processing from calculation impairment."
    />
  ),
  'lp-signs': (
    <Block
      intro="Recognition of arithmetic operation signs (+, −, ×, ÷)."
      procedure="Show signs and ask their meaning; ask the patient to apply them."
      interpretation="Sign confusion = symbolic acalculia."
      significance="Left angular-gyrus/parietal lesion (Gerstmann components)."
    />
  ),
  'lp-mental': (
    <Block
      intro="Mental arithmetic — single-digit and 2-digit operations without paper."
      procedure="Ask 7+8, 13−5, 4×7, 56÷7."
      interpretation="Errors despite preserved transcoding suggest primary acalculia."
      significance="Left parietal (intraparietal sulcus)."
    />
  ),
  'lp-written': (
    <Block
      intro="Written multi-digit calculation tests procedural arithmetic."
      procedure="Long multiplication or subtraction with carrying (e.g. 234 × 17, 1003 − 487)."
      interpretation="Procedural errors (carrying, borrowing) localise to dominant parietal cortex."
      significance="Often impaired in Gerstmann syndrome."
    />
  ),
  'lp-column': (
    <Block
      intro="Column alignment in written arithmetic tests spatial organisation of numbers."
      procedure="Ask patient to set out and solve a long addition column."
      interpretation="Misalignment with intact arithmetic = visuospatial acalculia."
      significance="Often a right-parietal (spatial) component."
    />
  ),

  // ── Left parietal: finger gnosis & R/L ──────────────────────────────────
  'lp-fid-vis': (
    <Block
      intro="Finger identification with the hand visible."
      procedure="Examiner touches a finger; patient names it (thumb, index, etc.) or points to the corresponding finger of the examiner."
      interpretation="Errors despite normal vision and naming suggest finger agnosia."
      significance="Component of Gerstmann syndrome (left angular gyrus)."
    />
  ),
  'lp-fid-hid': (
    <Block
      intro="Finger identification with the hand hidden (or eyes closed)."
      procedure="Patient's hand placed under a screen or eyes closed; examiner touches a finger; patient names it or shows on the other hand."
      interpretation="More sensitive to finger agnosia than the visible version."
      significance="Confirms Gerstmann finger-agnosia component."
    />
  ),
  'lp-bodyparts': (
    <Block
      intro="Body-part identification (autotopagnosia screen)."
      procedure="Ask patient to point to named body parts on self and examiner (elbow, knee, chin, eyebrow)."
      interpretation="Failure with intact naming = autotopagnosia."
      significance="Left parietal lesions."
    />
  ),
  'lp-crossed': (
    <Block
      intro="Crossed right–left commands — tests right–left orientation plus body schema."
      procedure="'Touch your right ear with your left hand.' 'Place your left hand on my right shoulder.'"
      interpretation="Errors = right–left disorientation (a Gerstmann component)."
      significance="Left angular gyrus."
    />
  ),

  // ── Right parietal: hemineglect ─────────────────────────────────────────
  'rp-cancel': (
    <Block
      intro="Cancellation tasks for hemispatial neglect."
      procedure="Give a sheet of scattered targets (lines, stars, letters); ask the patient to cross out every one."
      interpretation="Omissions clustered on one side (usually left) = hemineglect."
      significance="Most sensitive bedside test for unilateral spatial neglect."
    />
  ),
  'rp-bisect': (
    <Block
      intro="Line bisection — patient marks the midpoint of a horizontal line."
      procedure="Present several 20-cm lines centred on a page; ask the patient to mark the centre."
      interpretation="Mark consistently shifted to the right (>6 mm) = left hemineglect."
      significance="Quantitative neglect measure."
    />
  ),
  'rp-clock': (
    <Block
      intro="Clock drawing reveals neglect and constructional deficits simultaneously."
      procedure="Ask the patient to draw a clock face with all numbers and set the hands at 'ten past eleven'."
      interpretation="Numbers crowded on the right with left half empty = hemineglect. Disorganised layout = constructional apraxia."
      significance="Multi-domain bedside screen (visuospatial, executive, semantic)."
    />
  ),
  'rp-pent': (
    <Block
      intro="Interlocking pentagons (MMSE item)."
      procedure="Ask the patient to copy two intersecting pentagons."
      interpretation="Score for: 5 sides each, intersection forming a 4-sided figure. Distortion or loss of overlap = constructional apraxia."
      significance="Right parietal / posterior cortical dysfunction (e.g. PCA, DLB)."
    />
  ),
  'rp-necker': (
    <Block
      intro="Necker cube copy — a more demanding 3-D constructional test."
      procedure="Show a Necker cube; ask the patient to copy it."
      interpretation="Loss of perspective lines, flattening, fragmented figure = constructional apraxia."
      significance="Sensitive to right parietal dysfunction."
    />
  ),
  'rp-clockc': (
    <Block
      intro="Clock construction (without a model) tests planning and visuospatial organisation."
      procedure="Ask the patient to draw a clock from memory."
      interpretation="See clock drawing scoring above."
      significance="Combines executive, visuospatial and semantic processing."
    />
  ),
  'rp-dress': (
    <Block
      intro="Dressing apraxia — inability to orient clothing to the body."
      procedure="Hand the patient a shirt or gown (sometimes turned inside-out); ask them to put it on."
      interpretation="Confusion with sleeves, putting it on backward, getting stuck."
      significance="Right parietal lesion; common in Lewy-body dementia."
    />
  ),
  'rp-objloc': (
    <Block
      intro="Object-location memory in the room."
      procedure="Hide objects in named places; later ask the patient where each one is."
      interpretation="Loss of spatial layout memory = topographical disorientation."
      significance="Right hippocampal / parahippocampal dysfunction."
    />
  ),
  'rp-landmark': (
    <Block
      intro="Landmark recognition — recognising familiar buildings or scenes."
      procedure="Show photographs of well-known local landmarks; ask the patient to identify them."
      interpretation="Failure despite intact face/object recognition suggests landmark agnosia."
      significance="Right lingual / parahippocampal lesions."
    />
  ),
  'rp-maps': (
    <Block
      intro="Map reading and route description."
      procedure="Ask patient to describe the route from home to a familiar place, or to point out cities on a map."
      interpretation="Failure = topographical disorientation."
      significance="Right parietal / medial temporal dysfunction."
    />
  ),

  // ── Occipital: ventral stream ───────────────────────────────────────────
  'oc-apperc': (
    <Block
      intro="Apperceptive visual agnosia — failure to form a coherent percept of an object."
      procedure="Ask the patient to match shapes, copy simple line drawings, or identify objects shown from unusual viewpoints."
      interpretation="Cannot copy or match despite intact acuity = apperceptive agnosia."
      significance="Bilateral occipital damage (e.g. anoxia, posterior cortical atrophy)."
    />
  ),
  'oc-assoc': (
    <Block
      intro="Associative visual agnosia — perception is intact but meaning cannot be attached."
      procedure="Pyramids and Palm Trees Test: which of two pictures (palm tree, pine tree) goes with the target (pyramid)? Or function-matching tasks."
      interpretation="Patient can copy the object accurately but cannot say what it is or what it's for."
      significance="Left occipitotemporal lesions; semantic dementia."
    />
  ),
  'oc-proso': (
    <Block
      intro="Prosopagnosia — selective inability to recognise familiar faces."
      procedure="Show photos of famous faces; perform Benton Facial Recognition Test (matching unfamiliar faces)."
      interpretation="Failure despite recognising the person from voice/context = prosopagnosia."
      significance="Right (or bilateral) fusiform face area lesions."
    />
  ),
  'oc-color': (
    <Block
      intro="Colour vision and colour processing."
      procedure="Ishihara plates (perception); colour naming; colour pointing on command; matching colours; painting/colouring tasks."
      interpretation={
        <UL items={[
          'Failed Ishihara = peripheral colour deficit.',
          'Intact perception but cannot name colours = colour anomia.',
          'Cannot match/categorise colours = central achromatopsia.',
        ]} />
      }
      significance="Lingual/fusiform gyrus lesions cause achromatopsia; pure colour anomia is a disconnection syndrome."
    />
  ),

  // ── Occipital: dorsal stream ────────────────────────────────────────────
  'oc-simult': (
    <Block
      intro="Simultanagnosia — inability to perceive more than one object/element at a time (a component of Bálint syndrome)."
      procedure="Letter cancellation, global/local Navon letters (a big H made of small Ss), Boston cookie-theft picture description."
      interpretation="Patient describes only single details and misses the global scene."
      significance="Bilateral parieto-occipital lesions; classic in posterior cortical atrophy."
    />
  ),
  'oc-visdis': (
    <Block
      intro="Visual disorientation — impaired spatial localisation of seen objects."
      procedure="Ask the patient to estimate distance between two objects; place a dot in the centre of a circle."
      interpretation="Inaccurate localisation despite intact visual acuity."
      significance="Component of Bálint syndrome (bilateral parieto-occipital damage)."
    />
  ),
  'oc-optic': (
    <Block
      intro="Optic ataxia — misreaching for visual targets."
      procedure="Ask the patient to touch your finger or their own ear under visual guidance."
      interpretation="Inaccurate reaching despite intact strength and proprioception."
      significance="Third Bálint component (superior parietal lobule)."
    />
  ),

  // ── Temporal lobe ───────────────────────────────────────────────────────
  'te-episodic': (
    <Block
      intro="Recent episodic memory — memory for personally experienced events with time/place context."
      procedure="Ask about today's events, recent news, hospital course; corroborate with informant."
      interpretation="Loss with preserved working memory and remote memory = medial temporal/hippocampal amnesia."
      significance="Earliest cognitive sign of Alzheimer's disease."
    />
  ),
  'te-topo': (
    <Block
      intro="Topographic memory — memory for routes, layouts and landmarks (overlap with right parietal)."
      procedure="Ask route from home to a familiar place; recognition of local landmarks."
      interpretation="Failure = topographical amnesia."
      significance="Right hippocampal / parahippocampal lesions."
    />
  ),
  'te-faceid': (
    <Block
      intro="Face identification of familiar people."
      procedure="Show family photographs or famous faces; ask name and context."
      interpretation="Loss with preserved face perception suggests prosopagnosia or semantic loss for people."
      significance="Right anterior temporal lobe — common in semantic-dementia (right-temporal variant)."
    />
  ),
  'te-letterid': (
    <Block
      intro="Letter and symbol identification."
      procedure="Show isolated letters and common symbols; ask naming."
      interpretation="Letter-by-letter reading suggests pure alexia; symbol failure suggests broader visual agnosia."
      significance="Left fusiform (visual word form area) lesions."
    />
  ),
  'te-semantic': (
    <Block
      intro="Semantic memory — knowledge of words, objects and concepts (see also under Memory)."
      procedure="Confrontation naming, definitions ('what is a piano?'), category fluency, person knowledge."
      interpretation="Progressive loss of word meaning with fluent empty speech is the hallmark of semantic dementia."
      significance="Anterior temporal lobe atrophy."
    />
  ),
  'te-language': (
    <Block
      intro="Temporal language functions — comprehension, naming and semantic access."
      procedure="Use the Language section tests (comprehension, naming, repetition, reading)."
      interpretation="Wernicke's aphasia (posterior superior temporal) presents with fluent paraphasic speech and impaired comprehension."
      significance="Cross-references to the Language section above."
    />
  ),
};
