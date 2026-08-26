import { DaphneItem } from '@/types/daphne';

/**
 * DAPHNE structured items from Clinician-facing Structured Assessment
 * source: https://pmc.ncbi.nlm.nih.gov/articles/PMC4777961/table/T1/
 */

export const getDaphneScaleItems = (lang: string = 'en'): DaphneItem[] => {
  if (lang === 'ml') return DAPHNE_SCALE_ITEMS_ML;
  return DAPHNE_SCALE_ITEMS_EN;
};

export const DAPHNE_SCALE_ITEMS_EN: DaphneItem[] = [
  {
    id: 'loss_social_convenience',
    domain: 'disinhibition',
    title: 'Loss of social convenience',
    descriptions: {
      normal: 'no trouble',
      veryMild: 'subject makes unpleasant, hurtful comments to family members; subject seeks out contact with strangers',
      mild: 'subject makes unpleasant, hurtful comments to strangers',
      moderate: 'subject is unable to participate in any social activity because of inappropriate social behavior (impatience, etc.)',
      severe: 'subject interrupts strangers’ activities, behaves inappropriately and disturbs public order (obscene words, urination, etc.)'
    }
  },
  {
    id: 'inappropriate_joviality',
    domain: 'disinhibition',
    title: 'Inappropriate joviality',
    descriptions: {
      normal: 'no trouble',
      veryMild: 'subject is jovial and laughs unreasonably but in appropriate situations and can stop when asked to',
      mild: 'subject is jovial and laughs unreasonably in appropriate situations but cannot stop when asked to',
      moderate: 'subject is jovial in embarrassing situations (talks to strangers, etc.)',
      severe: 'subject is jovial and says unacceptable words (jokes, sneers) in inappropriate situations (at funerals, with young children, etc.)'
    }
  },
  {
    id: 'unrestrained_spending',
    domain: 'disinhibition',
    title: 'Unrestrained spending habits',
    descriptions: {
      normal: 'no trouble',
      veryMild: 'subject buys a lot by mail order or repeatedly buys the same low-value things, but can listen to reason',
      mild: 'subject buys a lot by mail order or repeatedly buys the same low-value things, but cannot listen to reason',
      moderate: 'subject buys lots of useless things, buys expensive objects and does not understand that they are excessive and inappropriate',
      severe: 'subject is indebted because of lots of expensive purchases or gambling (card games, casino, etc.)'
    }
  },
  {
    id: 'sexual_disinhibition',
    domain: 'disinhibition',
    title: 'Sexual disinhibition',
    descriptions: {
      normal: 'no trouble',
      veryMild: 'subject makes inappropriate sexual comments or jokes, but can stop if asked to',
      mild: 'subject makes inappropriate and uncontrolled sexual comments or jokes, which he/she then acts on',
      moderate: 'subject makes inappropriate and uncontrolled sexual comments or jokes, which he/she then acts on; subject is indecent (undresses in inappropriate places, etc.)',
      severe: 'subject displays unwanted and inappropriate sexual behavior (public masturbation, sexual touching of a minor, sexual attraction to animals, etc.)'
    }
  },
  {
    id: 'loss_initiative_social_interest',
    domain: 'apathy',
    title: 'Loss of initiative, social interest',
    descriptions: {
      normal: 'no trouble',
      veryMild: 'subject can take part in usual activities, but must be encouraged to do anything outside of the ordinary',
      mild: 'subject can take part in usual activities, but does not complete them; subject can restart an activity, but only with stimulation',
      moderate: 'subject interrupts activities and does not restart them, even with stimulation; subject does not want to do usual activities',
      severe: 'subject has no interest; does not do anything despite stimulation, stays in his/her seat or in bed all day'
    }
  },
  {
    id: 'emotional_blunting_indifference',
    domain: 'empathy',
    title: 'Emotional blunting, indifference',
    descriptions: {
      normal: 'no trouble',
      veryMild: 'subject complains about loss of emotion towards relatives',
      mild: 'subject shows little interest in stories from relatives or in emotionally current matters; subject has difficulty expressing feelings',
      moderate: 'subject is indifferent to relatives, does not care about them, and is not concerned when people speak about him/her',
      severe: 'subject is unable to express or decipher any emotion, can have inappropriate emotional responses'
    }
  },
  {
    id: 'fixed_ideas_stereotyped_behavior',
    domain: 'perseverations',
    title: 'Fixed ideas, stereotypical behavior',
    descriptions: {
      normal: 'no trouble',
      veryMild: 'subject collects usual objects or has trouble getting rid of things or has routine activities',
      mild: 'subject collects unusual objects or does not throw anything away, has ritualized activities or has obsessions (hours, etc.), but this is consistent with social life',
      moderate: 'subject collects lots of objects or has difficulty sitting still, has obsessional rituals that interfere with social life',
      severe: 'subject has continuous rituals (grinding of teeth, rubbing of body, grasping of objects, repetition of words or sentences); subject does not stand still'
    }
  },
  {
    id: 'eating_disorders_sweet_preference',
    domain: 'hyperorality',
    title: 'Eating disorders, new preference for sweets',
    descriptions: {
      normal: 'no trouble',
      veryMild: 'subject has a new preference for sweets',
      mild: 'subject has new or bizarre food preferences but can listen to reason',
      moderate: 'subject eats or drinks excessively and cannot listen to reason (padlock on cupboard, etc.)',
      severe: 'subject eats and drinks everything within reach, including in other people\'s plates or glasses, or eats inedible substances'
    }
  },
  {
    id: 'bulimia_gluttony',
    domain: 'hyperorality',
    title: 'Bulimia, gluttony',
    descriptions: {
      normal: 'no trouble',
      veryMild: 'subject eats much more, has put on weight',
      mild: 'subject eats gluttonously, voraciously, without getting dirty',
      moderate: 'subject eats quickly and gets dirty, takes big pieces, risking choking',
      severe: 'subject eats with hands, uncleanly, does not cut his food, keeps food in mouth; subject has put on a lot of weight'
    }
  },
  {
    id: 'personal_neglect',
    domain: 'neglect',
    title: 'Personal neglect',
    descriptions: {
      normal: 'no trouble',
      veryMild: 'subject looks less neat',
      mild: 'subject must be stimulated to wash or change clothes',
      moderate: 'subject can wash or change clothes only when threatened or tricked',
      severe: 'subject has very poor hygiene (dirty fingernails, dirty hair, dirty clothes, etc.)'
    }
  }
];

export const DAPHNE_SCALE_ITEMS_ML: DaphneItem[] = DAPHNE_SCALE_ITEMS_EN.map(item => ({
  ...item,
  title: `${item.title} (മലയാളം താൽക്കാലികം)`
}));
