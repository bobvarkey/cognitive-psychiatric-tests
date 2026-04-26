// ADHD screeners modelled on the shared `PsychosisScale` shape so they can
// be rendered by `PsychosisScaleAssessment` without per-scale UI code.
//
// Sources:
//  • ASRS-v1.1 — Kessler RC et al. Psychol Med. 2005;35(2):245-256. WHO/Harvard, public-domain.
//  • NICHQ Vanderbilt Assessment Scale — Wolraich ML et al. NICHQ, 2002. Free for clinical use.

import type { PsychosisScale } from './psychosisScales';

const ASRS_FREQ = [
  { value: 0, label: '0 — Never' },
  { value: 1, label: '1 — Rarely' },
  { value: 2, label: '2 — Sometimes' },
  { value: 3, label: '3 — Often' },
  { value: 4, label: '4 — Very often' },
];

// ASRS Part A — 6-item screener.
// Validated cutoff: ≥4 items in the "darkly shaded" zone = positive screen.
// Items 1–3: shaded zone is "Sometimes/Often/Very often" (≥2).
// Items 4–6: shaded zone is "Often/Very often" (≥3).
export const ASRS6: PsychosisScale = {
  id: 'asrs6' as PsychosisScale['id'],
  name: 'ASRS-v1.1 (6)',
  fullName: 'Adult ADHD Self-Report Scale — Part A (6-item screener)',
  shortDescription:
    'WHO/Harvard 6-item adult ADHD screener. ≥4 items in the shaded zone suggests symptoms highly consistent with adult ADHD and warrants further evaluation.',
  instructions:
    'Rate how often each problem has occurred over the past 6 months. Items 1–3 score positive at "Sometimes" or higher; items 4–6 score positive at "Often" or higher.',
  anchors: ASRS_FREQ,
  items: [
    { id: 'a1', label: '1. Trouble wrapping up the final details of a project once the challenging parts are done.', hint: 'Shaded zone: Sometimes / Often / Very often' },
    { id: 'a2', label: '2. Difficulty getting things in order when you have to do a task that requires organisation.', hint: 'Shaded zone: Sometimes / Often / Very often' },
    { id: 'a3', label: '3. Problems remembering appointments or obligations.', hint: 'Shaded zone: Sometimes / Often / Very often' },
    { id: 'a4', label: '4. When you have a task that requires a lot of thought, you avoid or delay getting started.', hint: 'Shaded zone: Often / Very often' },
    { id: 'a5', label: '5. Fidget or squirm with your hands or feet when you have to sit down for a long time.', hint: 'Shaded zone: Often / Very often' },
    { id: 'a6', label: '6. Feel overly active and compelled to do things, like you were driven by a motor.', hint: 'Shaded zone: Often / Very often' },
  ],
  severityBands: {
    total: [
      { min: 0, max: 3, label: 'Negative screen', description: 'Fewer than 4 items in the shaded zone — symptoms not highly consistent with adult ADHD on this screener.', tone: 'success' },
      { min: 4, max: 6, label: 'Positive screen', description: '≥4 items in the shaded zone — symptoms highly consistent with adult ADHD; further clinical evaluation indicated.', tone: 'destructive' },
    ],
  },
  thresholdNote:
    'The "total" displayed here counts how many of the 6 items fall within the validated shaded (positive) zone, NOT a sum of 0–4 ratings. Cutoff: ≥4 of 6 = positive screen (Kessler et al., 2005).',
  citation:
    'Kessler RC, Adler L, Ames M, et al. The World Health Organization Adult ADHD Self-Report Scale (ASRS): a short screening scale for use in the general population. Psychol Med. 2005;35(2):245-256.',
  citationUrl: 'https://doi.org/10.1017/S0033291704002892',
};

// ASRS Part A + Part B — full 18-item symptom checklist mapping to DSM Inattention / Hyperactivity-Impulsivity.
const ASRS18_ITEMS = [
  // Inattention (items 1–4 from Part A + items 7–11 from Part B = 9 inattention items)
  { id: 'i1',  subscale: 'inattention', label: '1. Trouble wrapping up the final details of a project.' },
  { id: 'i2',  subscale: 'inattention', label: '2. Difficulty getting things in order for tasks that require organisation.' },
  { id: 'i3',  subscale: 'inattention', label: '3. Problems remembering appointments or obligations.' },
  { id: 'i4',  subscale: 'inattention', label: '4. Avoid or delay tasks requiring a lot of thought.' },
  { id: 'i7',  subscale: 'inattention', label: '7. Make careless mistakes on a boring or difficult project.' },
  { id: 'i8',  subscale: 'inattention', label: '8. Difficulty keeping attention on boring/repetitive work.' },
  { id: 'i9',  subscale: 'inattention', label: '9. Difficulty concentrating on what people say to you.' },
  { id: 'i10', subscale: 'inattention', label: '10. Misplace or have difficulty finding things at home or work.' },
  { id: 'i11', subscale: 'inattention', label: '11. Distracted by activity or noise around you.' },
  // Hyperactivity-Impulsivity (items 5–6 + 12–18 = 9 items)
  { id: 'h5',  subscale: 'hyperactivity', label: '5. Fidget or squirm with hands or feet when seated for long.' },
  { id: 'h6',  subscale: 'hyperactivity', label: '6. Feel overly active and compelled to do things, as if driven by a motor.' },
  { id: 'h12', subscale: 'hyperactivity', label: '12. Leave your seat in meetings or situations where you are expected to remain seated.' },
  { id: 'h13', subscale: 'hyperactivity', label: '13. Feel restless or fidgety.' },
  { id: 'h14', subscale: 'hyperactivity', label: '14. Difficulty unwinding and relaxing when you have time to yourself.' },
  { id: 'h15', subscale: 'hyperactivity', label: '15. Find yourself talking too much in social situations.' },
  { id: 'h16', subscale: 'hyperactivity', label: '16. When in conversation, you finish other people\u2019s sentences before they can finish them.' },
  { id: 'h17', subscale: 'hyperactivity', label: '17. Difficulty waiting your turn in situations when turn-taking is required.' },
  { id: 'h18', subscale: 'hyperactivity', label: '18. Interrupt others when they are busy.' },
];

export const ASRS18: PsychosisScale = {
  id: 'asrs18' as PsychosisScale['id'],
  name: 'ASRS-v1.1 (18)',
  fullName: 'Adult ADHD Self-Report Scale — Full 18-item symptom checklist',
  shortDescription:
    'Full ASRS-v1.1: 9 inattention + 9 hyperactivity-impulsivity items rated 0–4. Use after a positive Part A screen to characterise symptom domains.',
  instructions:
    'Rate how often each problem has occurred over the past 6 months (0 = Never, 4 = Very often). Items load onto Inattention or Hyperactivity-Impulsivity subscales.',
  anchors: ASRS_FREQ,
  subscales: [
    { id: 'inattention', label: 'Inattention (9 items)' },
    { id: 'hyperactivity', label: 'Hyperactivity / Impulsivity (9 items)' },
  ],
  items: ASRS18_ITEMS,
  severityBands: {
    inattention: [
      { min: 0, max: 8,  label: 'Low', description: 'Low inattention symptom load', tone: 'success' },
      { min: 9, max: 17, label: 'Moderate', description: 'Moderate inattention symptom load', tone: 'warning' },
      { min: 18, max: 26, label: 'High', description: 'High inattention symptom load', tone: 'orange' },
      { min: 27, max: 36, label: 'Very high', description: 'Very high inattention symptom load', tone: 'destructive' },
    ],
    hyperactivity: [
      { min: 0, max: 8,  label: 'Low', description: 'Low hyperactivity / impulsivity load', tone: 'success' },
      { min: 9, max: 17, label: 'Moderate', description: 'Moderate hyperactivity / impulsivity load', tone: 'warning' },
      { min: 18, max: 26, label: 'High', description: 'High hyperactivity / impulsivity load', tone: 'orange' },
      { min: 27, max: 36, label: 'Very high', description: 'Very high hyperactivity / impulsivity load', tone: 'destructive' },
    ],
  },
  thresholdNote:
    'The 18-item ASRS is a symptom checklist, NOT diagnostic on its own. Pair with the Part A screener cutoff and DSM-5-TR criteria. A common research cutoff is ≥4 frequency on ≥6 of 9 items in either domain.',
  citation:
    'Adler LA, Spencer T, Faraone SV, et al. Validity of pilot Adult ADHD Self-Report Scale (ASRS). Ann Clin Psychiatry. 2006;18(3):145-148. (See also Kessler RC et al., 2005.)',
  citationUrl: 'https://www.hcp.med.harvard.edu/ncs/asrs.php',
};

// NICHQ Vanderbilt — Parent informant version (child age 6–12).
// Symptom items rated 0=Never, 1=Occasionally, 2=Often, 3=Very Often.
// Symptom criterion: rating of 2 or 3 = "present"/positive item.
const VANDERBILT_FREQ = [
  { value: 0, label: '0 — Never' },
  { value: 1, label: '1 — Occasionally' },
  { value: 2, label: '2 — Often' },
  { value: 3, label: '3 — Very often' },
];

const VANDERBILT_PERF = [
  { value: 1, label: '1 — Excellent' },
  { value: 2, label: '2 — Above average' },
  { value: 3, label: '3 — Average' },
  { value: 4, label: '4 — Somewhat of a problem' },
  { value: 5, label: '5 — Problematic' },
];

export const VANDERBILT: PsychosisScale = {
  id: 'vanderbilt' as PsychosisScale['id'],
  name: 'Vanderbilt',
  fullName: 'NICHQ Vanderbilt Assessment Scale — Parent Informant (child 6–12)',
  shortDescription:
    'Parent rating scale for childhood ADHD covering inattention, hyperactivity-impulsivity, ODD, conduct, anxiety/depression and academic/behavioural performance.',
  instructions:
    'Symptom items 1–47: rate 0–3 over the past 6 months. A rating of 2 (Often) or 3 (Very often) counts as a positive symptom. Performance items: rate 1 (Excellent) to 5 (Problematic); a 4 or 5 indicates impairment.',
  anchors: VANDERBILT_FREQ,
  subscales: [
    { id: 'inattention', label: 'Inattention (Q1–9) — ≥6 positive needed' },
    { id: 'hyperactivity', label: 'Hyperactivity / Impulsivity (Q10–18) — ≥6 positive needed' },
    { id: 'odd', label: 'Oppositional-Defiant (Q19–26) — ≥4 positive needed' },
    { id: 'conduct', label: 'Conduct (Q27–40) — ≥3 positive needed' },
    { id: 'anxdep', label: 'Anxiety / Depression (Q41–47) — ≥3 positive needed' },
    { id: 'performance', label: 'Performance (Q48–55) — ≥1 score of 4–5 needed' },
  ],
  items: [
    // Inattention — 9 items
    { id: 'q1', subscale: 'inattention', label: '1. Does not pay attention to details or makes careless mistakes.' },
    { id: 'q2', subscale: 'inattention', label: '2. Has difficulty keeping attention to what needs to be done.' },
    { id: 'q3', subscale: 'inattention', label: '3. Does not seem to listen when spoken to directly.' },
    { id: 'q4', subscale: 'inattention', label: '4. Does not follow through on instructions and fails to finish schoolwork or chores.' },
    { id: 'q5', subscale: 'inattention', label: '5. Has difficulty organising tasks and activities.' },
    { id: 'q6', subscale: 'inattention', label: '6. Avoids, dislikes, or does not want to start tasks requiring sustained mental effort.' },
    { id: 'q7', subscale: 'inattention', label: '7. Loses things necessary for tasks/activities (toys, assignments, pencils).' },
    { id: 'q8', subscale: 'inattention', label: '8. Is easily distracted by extraneous stimuli or noises.' },
    { id: 'q9', subscale: 'inattention', label: '9. Is forgetful in daily activities.' },
    // Hyperactivity / Impulsivity — 9 items
    { id: 'q10', subscale: 'hyperactivity', label: '10. Fidgets with hands or feet or squirms in seat.' },
    { id: 'q11', subscale: 'hyperactivity', label: '11. Leaves seat when remaining seated is expected.' },
    { id: 'q12', subscale: 'hyperactivity', label: '12. Runs about or climbs in inappropriate situations.' },
    { id: 'q13', subscale: 'hyperactivity', label: '13. Has difficulty playing or beginning quiet play activities.' },
    { id: 'q14', subscale: 'hyperactivity', label: '14. Is "on the go" or acts as if "driven by a motor".' },
    { id: 'q15', subscale: 'hyperactivity', label: '15. Talks too much.' },
    { id: 'q16', subscale: 'hyperactivity', label: '16. Blurts out answers before questions have been completed.' },
    { id: 'q17', subscale: 'hyperactivity', label: '17. Has difficulty waiting his/her turn.' },
    { id: 'q18', subscale: 'hyperactivity', label: '18. Interrupts or intrudes on others (e.g. butts into conversations/games).' },
    // ODD — 8 items
    { id: 'q19', subscale: 'odd', label: '19. Argues with adults.' },
    { id: 'q20', subscale: 'odd', label: '20. Loses temper.' },
    { id: 'q21', subscale: 'odd', label: '21. Actively defies or refuses to comply with adults\u2019 requests or rules.' },
    { id: 'q22', subscale: 'odd', label: '22. Deliberately annoys people.' },
    { id: 'q23', subscale: 'odd', label: '23. Blames others for his/her mistakes or misbehaviours.' },
    { id: 'q24', subscale: 'odd', label: '24. Is touchy or easily annoyed by others.' },
    { id: 'q25', subscale: 'odd', label: '25. Is angry or resentful.' },
    { id: 'q26', subscale: 'odd', label: '26. Is spiteful and wants to get even.' },
    // Conduct — 14 items
    { id: 'q27', subscale: 'conduct', label: '27. Bullies, threatens or intimidates others.' },
    { id: 'q28', subscale: 'conduct', label: '28. Initiates physical fights.' },
    { id: 'q29', subscale: 'conduct', label: '29. Lies to obtain goods or favours, or to avoid obligations ("cons" others).' },
    { id: 'q30', subscale: 'conduct', label: '30. Is truant from school (skips school) without permission.' },
    { id: 'q31', subscale: 'conduct', label: '31. Is physically cruel to people.' },
    { id: 'q32', subscale: 'conduct', label: '32. Has stolen things that have value.' },
    { id: 'q33', subscale: 'conduct', label: '33. Deliberately destroys others\u2019 property.' },
    { id: 'q34', subscale: 'conduct', label: '34. Has used a weapon that can cause serious harm (bat, knife, etc.).' },
    { id: 'q35', subscale: 'conduct', label: '35. Is physically cruel to animals.' },
    { id: 'q36', subscale: 'conduct', label: '36. Has deliberately set fires to cause damage.' },
    { id: 'q37', subscale: 'conduct', label: '37. Has broken into someone else\u2019s home, business, or car.' },
    { id: 'q38', subscale: 'conduct', label: '38. Has stayed out at night without permission.' },
    { id: 'q39', subscale: 'conduct', label: '39. Has run away from home overnight.' },
    { id: 'q40', subscale: 'conduct', label: '40. Has forced someone into sexual activity.' },
    // Anxiety / Depression — 7 items
    { id: 'q41', subscale: 'anxdep', label: '41. Is fearful, anxious, or worried.' },
    { id: 'q42', subscale: 'anxdep', label: '42. Is afraid to try new things for fear of making mistakes.' },
    { id: 'q43', subscale: 'anxdep', label: '43. Feels worthless or inferior.' },
    { id: 'q44', subscale: 'anxdep', label: '44. Blames self for problems; feels guilty.' },
    { id: 'q45', subscale: 'anxdep', label: '45. Feels lonely, unwanted, or unloved; complains that "no one loves him/her".' },
    { id: 'q46', subscale: 'anxdep', label: '46. Is sad, unhappy, or depressed.' },
    { id: 'q47', subscale: 'anxdep', label: '47. Is self-conscious or easily embarrassed.' },
    // Performance — 8 items, rated 1–5
    { id: 'q48', subscale: 'performance', label: '48. Overall school performance.', anchors: VANDERBILT_PERF },
    { id: 'q49', subscale: 'performance', label: '49. Reading.', anchors: VANDERBILT_PERF },
    { id: 'q50', subscale: 'performance', label: '50. Writing.', anchors: VANDERBILT_PERF },
    { id: 'q51', subscale: 'performance', label: '51. Mathematics.', anchors: VANDERBILT_PERF },
    { id: 'q52', subscale: 'performance', label: '52. Relationship with parents.', anchors: VANDERBILT_PERF },
    { id: 'q53', subscale: 'performance', label: '53. Relationship with siblings.', anchors: VANDERBILT_PERF },
    { id: 'q54', subscale: 'performance', label: '54. Relationship with peers.', anchors: VANDERBILT_PERF },
    { id: 'q55', subscale: 'performance', label: '55. Participation in organised activities (e.g. sports).', anchors: VANDERBILT_PERF },
  ],
  severityBands: {
    inattention: [
      { min: 0, max: 17, label: 'Below threshold', description: 'Inattention symptom count likely <6 — does not meet ADHD-Inattentive criterion.', tone: 'success' },
      { min: 18, max: 27, label: 'Threshold range', description: 'Sum suggests ≥6 inattention items at ≥2; review item-level scores.', tone: 'orange' },
    ],
    hyperactivity: [
      { min: 0, max: 17, label: 'Below threshold', description: 'Hyperactivity-Impulsivity symptom count likely <6.', tone: 'success' },
      { min: 18, max: 27, label: 'Threshold range', description: 'Sum suggests ≥6 hyperactivity items at ≥2; review item-level scores.', tone: 'orange' },
    ],
  },
  thresholdNote:
    'Diagnostic thresholds use COUNT of items rated ≥2 (Often/Very often), not the raw sum: Inattention ≥6/9 = ADHD-Inattentive criterion; Hyperactivity ≥6/9 = ADHD-Hyperactive criterion; ODD ≥4/8; Conduct ≥3/14; Anxiety/Depression ≥3/7. Performance: ≥1 item rated 4–5 indicates functional impairment. Confirm criteria from item-level scores, not subscale sums.',
  citation:
    'Wolraich ML, Lambert W, Doffing MA, Bickman L, Simmons T, Worley K. Psychometric properties of the Vanderbilt ADHD diagnostic parent rating scale in a referred population. J Pediatr Psychol. 2003;28(8):559-567. NICHQ Vanderbilt Assessment Scales, 2002.',
  citationUrl: 'https://www.nichq.org/resource/nichq-vanderbilt-assessment-scales',
};

export const ADHD_SCREENERS = { asrs6: ASRS6, asrs18: ASRS18, vanderbilt: VANDERBILT };
