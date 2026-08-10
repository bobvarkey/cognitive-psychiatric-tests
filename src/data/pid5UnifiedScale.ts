export type Pid5Domain =
  | 'Negative Affectivity'
  | 'Detachment'
  | 'Antagonism'
  | 'Disinhibition'
  | 'Psychoticism';

export type PatternKey =
  | 'paranoid' | 'schizoid' | 'schizotypal'
  | 'antisocial' | 'borderline' | 'histrionic' | 'narcissistic'
  | 'avoidant' | 'dependent' | 'obsessiveCompulsive';

export type ClusterKey = 'A' | 'B' | 'C';

export interface Pid5Item {
  id: string;
  key: string;
  label: string;
  domain: Pid5Domain;
  pattern?: PatternKey;
  cluster?: ClusterKey;
  weight: number;
  safetyFlag?: boolean;
}

export const PID5_RESPONSE_OPTIONS = [
  { value: 0, label: 'Not characteristic' },
  { value: 1, label: 'Occasionally characteristic' },
  { value: 2, label: 'Often characteristic' },
  { value: 3, label: 'Very characteristic or pervasive' },
  { value: 9, label: 'Unknown / not assessed' },
] as const;

export const PID5_DOMAINS: Pid5Domain[] = [
  'Negative Affectivity',
  'Detachment',
  'Antagonism',
  'Disinhibition',
  'Psychoticism',
];

export const PID5_ITEMS: Pid5Item[] = [
  { id: 'U01', key: 'na_emotionalLability', label: 'My emotional reactions can change quickly or feel difficult to control.', domain: 'Negative Affectivity', pattern: 'borderline', cluster: 'B', weight: 2 },
  { id: 'U02', key: 'na_anxiousness', label: 'I frequently anticipate that something will go wrong.', domain: 'Negative Affectivity', pattern: 'avoidant', cluster: 'C', weight: 2 },
  { id: 'U03', key: 'na_separationInsecurity', label: 'I become highly distressed when important relationships feel uncertain or distant.', domain: 'Negative Affectivity', pattern: 'dependent', cluster: 'C', weight: 2 },
  { id: 'U04', key: 'na_submissiveness', label: 'I often give up my preferences to avoid disagreement, rejection, or loss of support.', domain: 'Negative Affectivity', pattern: 'dependent', cluster: 'C', weight: 2 },
  { id: 'U05', key: 'na_hostility', label: 'I remain angry or resentful after perceived slights.', domain: 'Negative Affectivity', pattern: 'paranoid', cluster: 'A', weight: 2 },
  { id: 'U06', key: 'det_withdrawal', label: 'I prefer to keep emotional distance from most people.', domain: 'Detachment', pattern: 'schizoid', cluster: 'A', weight: 3 },
  { id: 'U07', key: 'det_intimacyAvoidance', label: 'Close emotional intimacy often feels uncomfortable or unnecessary.', domain: 'Detachment', pattern: 'avoidant', cluster: 'C', weight: 2 },
  { id: 'U08', key: 'det_anhedonia', label: 'Few activities or experiences give me a strong sense of pleasure.', domain: 'Detachment', weight: 1 },
  { id: 'U09', key: 'det_restrictedAffectivity', label: 'Other people may find it difficult to tell what I am feeling.', domain: 'Detachment', pattern: 'schizoid', cluster: 'A', weight: 2 },
  { id: 'U10', key: 'det_socialInadequacy', label: 'I avoid new social situations because I expect criticism, rejection, or embarrassment.', domain: 'Detachment', pattern: 'avoidant', cluster: 'C', weight: 3 },
  { id: 'U11', key: 'ant_manipulativeness', label: 'I sometimes influence people through pressure, guilt, or calculated persuasion.', domain: 'Antagonism', pattern: 'antisocial', cluster: 'B', weight: 2 },
  { id: 'U12', key: 'ant_grandiosity', label: 'I see myself as deserving more recognition or special treatment than most people.', domain: 'Antagonism', pattern: 'narcissistic', cluster: 'B', weight: 3 },
  { id: 'U13', key: 'ant_attentionSeeking', label: "I may behave dramatically or noticeably to keep other people's attention.", domain: 'Antagonism', pattern: 'histrionic', cluster: 'B', weight: 3 },
  { id: 'U14', key: 'ant_callousness', label: "I can overlook other people's feelings when pursuing my own goals.", domain: 'Antagonism', pattern: 'antisocial', cluster: 'B', weight: 3 },
  { id: 'U15', key: 'ant_unusualBeliefs', label: 'I sometimes hold unusual beliefs or interpretations that others find difficult to understand.', domain: 'Psychoticism', pattern: 'schizotypal', cluster: 'A', weight: 3 },
  { id: 'U16', key: 'dis_impulsivity', label: 'I often act on urges without considering what may happen next.', domain: 'Disinhibition', pattern: 'borderline', cluster: 'B', weight: 3 },
  { id: 'U17', key: 'dis_irresponsibility', label: 'I sometimes fail to meet important responsibilities despite knowing the consequences.', domain: 'Disinhibition', pattern: 'antisocial', cluster: 'B', weight: 3 },
  { id: 'U18', key: 'dis_distractibility', label: 'I have difficulty staying focused when tasks are repetitive or demanding.', domain: 'Disinhibition', weight: 1 },
  { id: 'U19', key: 'dis_rigidPerfectionism', label: 'I become so focused on doing things correctly that completing them becomes difficult.', domain: 'Disinhibition', pattern: 'obsessiveCompulsive', cluster: 'C', weight: 3 },
  { id: 'U20', key: 'dis_perseveration', label: 'I continue with a behaviour or plan long after it is clear that it is not working.', domain: 'Disinhibition', pattern: 'obsessiveCompulsive', cluster: 'C', weight: 2 },
  { id: 'U21', key: 'psy_eccentricity', label: 'My behaviour, appearance, or ideas may seem noticeably eccentric to others.', domain: 'Psychoticism', pattern: 'schizotypal', cluster: 'A', weight: 2 },
  { id: 'U22', key: 'psy_cognitiveDysregulation', label: 'My thinking can become disorganized or difficult for others to follow.', domain: 'Psychoticism', pattern: 'schizotypal', cluster: 'A', weight: 2 },
  { id: 'U23', key: 'borderlineIdentity', label: 'My sense of self, values, or life direction can change markedly.', domain: 'Negative Affectivity', pattern: 'borderline', cluster: 'B', weight: 3 },
  { id: 'U24', key: 'borderlineSelfHarm', label: 'I have recurrent self-harm, suicidal behaviour, or intense self-destructive urges.', domain: 'Negative Affectivity', pattern: 'borderline', cluster: 'B', weight: 3, safetyFlag: true },
  { id: 'U25', key: 'narcissisticEmpathy', label: "I have persistent difficulty recognizing or responding to other people's feelings and needs.", domain: 'Antagonism', pattern: 'narcissistic', cluster: 'B', weight: 3 },
  { id: 'U26', key: 'paranoidMistrust', label: 'I persistently expect others to deceive, exploit, betray, or harm me.', domain: 'Negative Affectivity', pattern: 'paranoid', cluster: 'A', weight: 3 },
  { id: 'U27', key: 'histrionicExpression', label: 'I use intense or theatrical emotional expression to influence how others respond to me.', domain: 'Antagonism', pattern: 'histrionic', cluster: 'B', weight: 2 },
  { id: 'U28', key: 'dependentCare', label: 'I need other people to assume responsibility for important areas of my life.', domain: 'Negative Affectivity', pattern: 'dependent', cluster: 'C', weight: 3 },
  { id: 'U29', key: 'ocpdControl', label: 'I have difficulty delegating or changing plans because other approaches may not meet my standards.', domain: 'Disinhibition', pattern: 'obsessiveCompulsive', cluster: 'C', weight: 3 },
  { id: 'U30', key: 'schizotypalSocialSuspicion', label: 'I experience persistent social anxiety related to suspiciousness or unusual interpretations.', domain: 'Psychoticism', pattern: 'schizotypal', cluster: 'A', weight: 2 },
];

export const PID5_PATTERNS: Record<PatternKey, { label: string; cluster: ClusterKey }> = {
  paranoid: { label: 'Paranoid pattern', cluster: 'A' },
  schizoid: { label: 'Schizoid pattern', cluster: 'A' },
  schizotypal: { label: 'Schizotypal pattern', cluster: 'A' },
  antisocial: { label: 'Antisocial pattern', cluster: 'B' },
  borderline: { label: 'Borderline pattern', cluster: 'B' },
  histrionic: { label: 'Histrionic pattern', cluster: 'B' },
  narcissistic: { label: 'Narcissistic pattern', cluster: 'B' },
  avoidant: { label: 'Avoidant pattern', cluster: 'C' },
  dependent: { label: 'Dependent pattern', cluster: 'C' },
  obsessiveCompulsive: { label: 'Obsessive-compulsive personality pattern', cluster: 'C' },
};

export const PID5_CLUSTERS: Record<ClusterKey, { label: string; description: string; patterns: PatternKey[] }> = {
  A: { label: 'Cluster A', description: 'Odd, eccentric, or suspicious patterns.', patterns: ['paranoid', 'schizoid', 'schizotypal'] },
  B: { label: 'Cluster B', description: 'Dramatic, emotional, erratic, or impulsive patterns.', patterns: ['antisocial', 'borderline', 'histrionic', 'narcissistic'] },
  C: { label: 'Cluster C', description: 'Anxious, fearful, or highly controlled patterns.', patterns: ['avoidant', 'dependent', 'obsessiveCompulsive'] },
};

export const PID5_SAFETY_ITEMS = [
  { key: 'currentSuicidalIntent', label: 'Current suicidal intent or plan' },
  { key: 'recentSeriousSelfHarm', label: 'Recent serious self-harm' },
  { key: 'imminentViolenceRisk', label: 'Imminent risk of serious violence' },
  { key: 'severeRealityTestingImpairment', label: 'Severe impairment of reality testing' },
] as const;

export const PID5_BANDS = [
  { min: 0, max: 24, label: 'Low relative elevation' },
  { min: 25, max: 49, label: 'Mild relative elevation' },
  { min: 50, max: 74, label: 'Moderate relative elevation' },
  { min: 75, max: 100, label: 'Marked relative elevation' },
];

export const bandFor = (score: number) =>
  PID5_BANDS.find((b) => score >= b.min && score <= b.max)?.label ?? '—';

export const PID5_MIN_ITEMS = 24;
export const PID5_DOMAIN_MIN_ITEMS = 2;
export const PID5_PATTERN_MIN_ITEMS = 1;

export const PID5_COPYRIGHT_NOTE =
  'This is not the official PID-5-BF and does not reproduce its copyrighted item wording. It is an original screening instrument inspired by the same five-domain structure.';
