export interface SdqItem {
  id: string;
  number: number;
  question: string;
  domain: 'sleep_apnea' | 'insomnia' | 'narcolepsy' | 'parasomnias' | 'restless_legs';
  domainLabel: string;
}

export const SDQ_DOMAINS = {
  sleep_apnea: {
    label: 'Sleep Apnea',
    description: 'Assesses risk for obstructive sleep apnea (OSA)',
    items: [1, 2, 3, 4, 5, 6, 7, 8]
  },
  insomnia: {
    label: 'Insomnia',
    description: 'Assesses difficulty initiating and maintaining sleep',
    items: [9, 10, 11, 12, 13, 14]
  },
  narcolepsy: {
    label: 'Narcolepsy',
    description: 'Assesses symptoms suggestive of narcolepsy spectrum disorders',
    items: [15, 16, 17, 18, 19]
  },
  parasomnias: {
    label: 'Parasomnias',
    description: 'Assesses abnormal behaviors and experiences during sleep',
    items: [20, 21, 22, 23, 24]
  },
  restless_legs: {
    label: 'Restless Legs / PLMD',
    description: 'Assesses restless legs syndrome and periodic limb movement disorder',
    items: [25, 26, 27, 28, 29, 30]
  }
};

export const SDQ_ITEMS: SdqItem[] = [
  // Sleep Apnea (items 1-8)
  {
    id: 'loud_snoring',
    number: 1,
    question: 'I have been told that I snore loudly.',
    domain: 'sleep_apnea',
    domainLabel: 'Sleep Apnea'
  },
  {
    id: 'breathing_pauses',
    number: 2,
    question: 'I have been told that I stop breathing or gasp/choke during sleep.',
    domain: 'sleep_apnea',
    domainLabel: 'Sleep Apnea'
  },
  {
    id: 'morning_headache',
    number: 3,
    question: 'I wake up with a headache or dry mouth.',
    domain: 'sleep_apnea',
    domainLabel: 'Sleep Apnea'
  },
  {
    id: 'unrefreshing_sleep',
    number: 4,
    question: 'I wake up feeling unrefreshed despite getting enough hours of sleep.',
    domain: 'sleep_apnea',
    domainLabel: 'Sleep Apnea'
  },
  {
    id: 'daytime_sleepiness',
    number: 5,
    question: 'I feel excessively sleepy during the day and could easily fall asleep in passive situations.',
    domain: 'sleep_apnea',
    domainLabel: 'Sleep Apnea'
  },
  {
    id: 'nocturia',
    number: 6,
    question: 'I wake up frequently during the night to urinate.',
    domain: 'sleep_apnea',
    domainLabel: 'Sleep Apnea'
  },
  {
    id: 'witnessed_apneas',
    number: 7,
    question: 'My bed partner has observed me stop breathing while asleep.',
    domain: 'sleep_apnea',
    domainLabel: 'Sleep Apnea'
  },
  {
    id: 'nocturnal_choking',
    number: 8,
    question: 'I wake up suddenly feeling like I am choking or gasping for air.',
    domain: 'sleep_apnea',
    domainLabel: 'Sleep Apnea'
  },
  // Insomnia (items 9-14)
  {
    id: 'difficulty_falling_asleep',
    number: 9,
    question: 'I have difficulty falling asleep at night (takes more than 30 minutes).',
    domain: 'insomnia',
    domainLabel: 'Insomnia'
  },
  {
    id: 'difficulty_staying_asleep',
    number: 10,
    question: 'I wake up multiple times during the night and have trouble getting back to sleep.',
    domain: 'insomnia',
    domainLabel: 'Insomnia'
  },
  {
    id: 'early_morning_wakening',
    number: 11,
    question: 'I wake up too early in the morning and cannot fall back asleep.',
    domain: 'insomnia',
    domainLabel: 'Insomnia'
  },
  {
    id: 'worry_about_sleep',
    number: 12,
    question: 'I worry about my sleep and feel anxious or frustrated about not sleeping well.',
    domain: 'insomnia',
    domainLabel: 'Insomnia'
  },
  {
    id: 'sleep_interferes_daily',
    number: 13,
    question: 'My poor sleep interferes with my daily activities, mood, or concentration.',
    domain: 'insomnia',
    domainLabel: 'Insomnia'
  },
  {
    id: 'sleep_medication',
    number: 14,
    question: 'I need medication (prescription or over-the-counter) to help me sleep.',
    domain: 'insomnia',
    domainLabel: 'Insomnia'
  },
  // Narcolepsy (items 15-19)
  {
    id: 'sleep_attacks',
    number: 15,
    question: 'I experience sudden, irresistible urges to sleep during the day (sleep attacks).',
    domain: 'narcolepsy',
    domainLabel: 'Narcolepsy'
  },
  {
    id: 'muscle_weakness_emotion',
    number: 16,
    question: 'I experience sudden muscle weakness (head dropping, knees buckling, jaw sagging) when I laugh or feel strong emotions.',
    domain: 'narcolepsy',
    domainLabel: 'Narcolepsy'
  },
  {
    id: 'sleep_paralysis',
    number: 17,
    question: 'I have experienced episodes where I cannot move or speak when waking up or falling asleep (sleep paralysis).',
    domain: 'narcolepsy',
    domainLabel: 'Narcolepsy'
  },
  {
    id: 'hypnagogic_hallucinations',
    number: 18,
    question: 'I see, hear, or feel things that are not there when falling asleep or waking up (hypnagogic/hypnopompic hallucinations).',
    domain: 'narcolepsy',
    domainLabel: 'Narcolepsy'
  },
  {
    id: 'fragmented_night_sleep',
    number: 19,
    question: 'My nighttime sleep is disturbed and fragmented with frequent awakenings.',
    domain: 'narcolepsy',
    domainLabel: 'Narcolepsy'
  },
  // Parasomnias (items 20-24)
  {
    id: 'sleep_talking',
    number: 20,
    question: 'I have been told that I talk, shout, or cry out during sleep.',
    domain: 'parasomnias',
    domainLabel: 'Parasomnias'
  },
  {
    id: 'sleep_walking',
    number: 21,
    question: 'I have been told that I walk or perform complex behaviors while asleep (sleepwalking).',
    domain: 'parasomnias',
    domainLabel: 'Parasomnias'
  },
  {
    id: 'nightmares',
    number: 22,
    question: 'I have frequent disturbing dreams or nightmares that wake me up.',
    domain: 'parasomnias',
    domainLabel: 'Parasomnias'
  },
  {
    id: 'acting_out_dreams',
    number: 23,
    question: 'I have been told that I act out my dreams by thrashing, punching, kicking, or jumping out of bed (possible REM sleep behavior disorder).',
    domain: 'parasomnias',
    domainLabel: 'Parasomnias'
  },
  {
    id: 'night_terrors',
    number: 24,
    question: 'I wake up suddenly in a state of intense fear, confusion, or panic with no memory of a dream.',
    domain: 'parasomnias',
    domainLabel: 'Parasomnias'
  },
  // Restless Legs / PLMD (items 25-30)
  {
    id: 'creeping_crawling',
    number: 25,
    question: 'I feel uncomfortable creeping, crawling, tingling, or aching sensations in my legs when sitting or lying down.',
    domain: 'restless_legs',
    domainLabel: 'Restless Legs / PLMD'
  },
  {
    id: 'urge_to_move_legs',
    number: 26,
    question: 'I feel an irresistible urge to move my legs to relieve uncomfortable sensations, especially at night.',
    domain: 'restless_legs',
    domainLabel: 'Restless Legs / PLMD'
  },
  {
    id: 'evening_worsening',
    number: 27,
    question: 'My leg discomfort or urge to move is worse in the evening or at night.',
    domain: 'restless_legs',
    domainLabel: 'Restless Legs / PLMD'
  },
  {
    id: 'relief_with_movement',
    number: 28,
    question: 'Movement (walking, stretching, rubbing) provides temporary relief of my leg discomfort.',
    domain: 'restless_legs',
    domainLabel: 'Restless Legs / PLMD'
  },
  {
    id: 'leg_jerking',
    number: 29,
    question: 'I have been told that my legs jerk or twitch repeatedly during sleep (periodic limb movements).',
    domain: 'restless_legs',
    domainLabel: 'Restless Legs / PLMD'
  },
  {
    id: 'restless_sleep',
    number: 30,
    question: 'I wake up feeling that my sleep was restless, with unexplained leg movements or kicking.',
    domain: 'restless_legs',
    domainLabel: 'Restless Legs / PLMD'
  }
];

export const SDQ_SCORING_GUIDE: Record<number, string> = {
  1: 'Never',
  2: 'Rarely',
  3: 'Sometimes',
  4: 'Often',
  5: 'Always'
};

export const SDQ_INTERPRETATION = {
  low: {
    range: '30-60',
    level: 'Low Sleep Disturbance',
    severity: 'Low',
    severityColor: 'text-green-600 bg-green-50 border-green-200',
    description: 'Patient reports minimal sleep disturbance across all domains. Sleep patterns are generally within normal limits, with occasional mild symptoms that do not significantly impair functioning.',
    recommendations: [
      'Reinforce healthy sleep hygiene practices.',
      'Educate patient on maintaining consistent sleep-wake schedules.',
      'Discuss the importance of a sleep-conducive environment (dark, quiet, cool).',
      'Reassess periodically for any changes in sleep patterns.',
      'No formal intervention is indicated at this time.'
    ]
  },
  moderate: {
    range: '61-90',
    level: 'Moderate Sleep Disturbance',
    severity: 'Moderate',
    severityColor: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    description: 'Patient reports moderate sleep disturbance affecting one or more domains. Symptoms are noticeable and may impact daytime functioning, mood, and quality of life. Further evaluation is warranted.',
    recommendations: [
      'Identify domains with the highest scores and focus evaluation on those areas.',
      'Consider polysomnography if sleep apnea or PLMD is suggested by domain scores.',
      'Provide structured sleep hygiene counseling and behavioral interventions.',
      'If insomnia domain is elevated, consider CBT-I referral.',
      'Screen for comorbid psychiatric conditions (anxiety, depression) that commonly co-occur with sleep disorders.',
      'Regular follow-up to assess response to interventions.'
    ]
  },
  high: {
    range: '91-120',
    level: 'High Sleep Disturbance',
    severity: 'High',
    severityColor: 'text-orange-600 bg-orange-50 border-orange-200',
    description: 'Patient reports significant sleep disturbance across multiple domains. Symptoms are markedly affecting sleep quality, daytime functioning, and overall health. Comprehensive evaluation and targeted interventions are needed.',
    recommendations: [
      'Comprehensive sleep medicine evaluation is strongly recommended.',
      'Polysomnography to evaluate for sleep apnea, PLMD, and parasomnias.',
      'Multiple Sleep Latency Test (MSLT) if narcolepsy is suggested by domain scores.',
      'Refer for CBT-I if insomnia is a predominant feature.',
      'Assess for and manage comorbid medical conditions (obesity, hypertension, diabetes, chronic pain).',
      'Evaluate medication effects on sleep (stimulants, SSRIs, beta-blockers).',
      'Close follow-up with a multidisciplinary approach.'
    ]
  },
  veryHigh: {
    range: '121-150',
    level: 'Very High Sleep Disturbance',
    severity: 'Very High',
    severityColor: 'text-red-600 bg-red-50 border-red-200',
    description: 'Patient reports severe and pervasive sleep disturbance affecting virtually all domains. Symptoms are profoundly impacting quality of life, safety, and health. Urgent comprehensive intervention is required.',
    recommendations: [
      'Urgent referral to sleep medicine specialist for comprehensive evaluation.',
      'Polysomnography and MSLT as clinically indicated for objective sleep assessment.',
      'Address safety concerns: evaluate driving risk if significant daytime sleepiness is present.',
      'Comprehensive psychiatric evaluation for co-occurring mental health conditions.',
      'Multidisciplinary team approach including sleep medicine, psychiatry, primary care, and behavioral sleep medicine.',
      'Consider inpatient sleep evaluation if symptoms are severe and refractory to outpatient management.',
      'Develop a structured, multi-modal treatment plan addressing all identified sleep disorders.',
      'Regular, frequent follow-up with monitoring of treatment response and safety.'
    ]
  }
};
