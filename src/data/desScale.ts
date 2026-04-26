import { DesItem } from '@/types/des';

// Dissociative Experiences Scale–II (DES-II)
// Carlson EB, Putnam FW. An update on the Dissociative Experiences Scale.
// Dissociation. 1993;6(1):16–27.
//
// Score each item 0–100% in 10% increments (frequency the experience happens
// when not under the influence of alcohol or drugs). The total score is the
// MEAN of the 28 item scores (range 0–100).
//
// Taxon (DES-T): items 3, 5, 7, 8, 12, 13, 22, 27 — used to estimate
// pathological dissociation (Waller, Putnam & Carlson, 1996).
const TAXON_IDS = new Set([3, 5, 7, 8, 12, 13, 22, 27]);

const RAW: { id: number; question: string }[] = [
  { id: 1, question: 'Some people have the experience of driving or riding in a car or bus or subway and suddenly realising that they don\'t remember what has happened during all or part of the trip.' },
  { id: 2, question: 'Some people find that sometimes they are listening to someone talk and they suddenly realise that they did not hear part or all of what was said.' },
  { id: 3, question: 'Some people have the experience of finding themselves in a place and having no idea how they got there.' },
  { id: 4, question: 'Some people have the experience of finding themselves dressed in clothes that they don\'t remember putting on.' },
  { id: 5, question: 'Some people have the experience of finding new things among their belongings that they do not remember buying.' },
  { id: 6, question: 'Some people sometimes find that they are approached by people that they do not know who call them by another name or insist that they have met them before.' },
  { id: 7, question: 'Some people sometimes have the experience of feeling as though they are standing next to themselves or watching themselves do something and they actually see themselves as if they were looking at another person.' },
  { id: 8, question: 'Some people are told that they sometimes do not recognise friends or family members.' },
  { id: 9, question: 'Some people find that they have no memory for some important events in their lives (e.g. a wedding or graduation).' },
  { id: 10, question: 'Some people have the experience of being accused of lying when they do not think that they have lied.' },
  { id: 11, question: 'Some people have the experience of looking in a mirror and not recognising themselves.' },
  { id: 12, question: 'Some people have the experience of feeling that other people, objects, and the world around them are not real.' },
  { id: 13, question: 'Some people have the experience of feeling that their body does not belong to them.' },
  { id: 14, question: 'Some people have the experience of sometimes remembering a past event so vividly that they feel as if they were reliving that event.' },
  { id: 15, question: 'Some people have the experience of not being sure whether things that they remember happening really did happen or whether they just dreamed them.' },
  { id: 16, question: 'Some people have the experience of being in a familiar place but finding it strange and unfamiliar.' },
  { id: 17, question: 'Some people find that when they are watching television or a movie they become so absorbed in the story that they are unaware of other events happening around them.' },
  { id: 18, question: 'Some people find that they become so involved in a fantasy or daydream that it feels as though it were really happening to them.' },
  { id: 19, question: 'Some people find that they sometimes are able to ignore pain.' },
  { id: 20, question: 'Some people find that they sometimes sit staring off into space, thinking of nothing, and are not aware of the passage of time.' },
  { id: 21, question: 'Some people sometimes find that when they are alone they talk out loud to themselves.' },
  { id: 22, question: 'Some people find that in one situation they may act so differently compared with another situation that they feel almost as if they were two different people.' },
  { id: 23, question: 'Some people sometimes find that in certain situations they are able to do things with amazing ease and spontaneity that would usually be difficult for them (e.g. sports, work, social situations).' },
  { id: 24, question: 'Some people sometimes find that they cannot remember whether they have done something or have just thought about doing it (e.g. not knowing whether they have just mailed a letter or have just thought about mailing it).' },
  { id: 25, question: 'Some people find evidence that they have done things that they do not remember doing.' },
  { id: 26, question: 'Some people sometimes find writings, drawings, or notes among their belongings that they must have done but cannot remember doing.' },
  { id: 27, question: 'Some people sometimes find that they hear voices inside their head that tell them to do things or comment on things that they are doing.' },
  { id: 28, question: 'Some people sometimes feel as if they are looking at the world through a fog so that people and objects appear far away or unclear.' },
];

export const desScale: DesItem[] = RAW.map((it) => ({
  ...it,
  taxon: TAXON_IDS.has(it.id),
}));

export const desScoreOptions = Array.from({ length: 11 }, (_, i) => ({
  value: i * 10,
  label: `${i * 10}%`,
}));
