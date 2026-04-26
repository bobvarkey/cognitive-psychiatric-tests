import { CdsItem } from '@/types/cds';

// Cambridge Depersonalisation Scale (CDS-29)
// Sierra & Berrios (2000), Psychiatry Research 93(2):153–164.
// Items are clinical paraphrases of the published 29-item instrument; refer
// to the original publication for verbatim wording before research/clinical use.
export const cdsScale: CdsItem[] = [
  { id: 1, question: 'Out of the blue, I feel strange, as if I were not real or as if I were cut off from the world.' },
  { id: 2, question: 'What I see looks "flat" or "lifeless", as if I were looking at a picture.' },
  { id: 3, question: 'Parts of my body feel as if they did not belong to me.' },
  { id: 4, question: 'I have found myself not being frightened at all in situations which normally I would find frightening or distressing.' },
  { id: 5, question: 'My favourite activities are no longer enjoyable.' },
  { id: 6, question: 'Whilst doing something I have the feeling of being a "detached observer" of myself.' },
  { id: 7, question: 'The flavour of meals no longer gives me a feeling of pleasure or distaste.' },
  { id: 8, question: 'My body feels very light, as if it were floating on air.' },
  { id: 9, question: 'When I weep or laugh, I do not seem to feel any emotions at all.' },
  { id: 10, question: 'I have the feeling of not having any thoughts at all, so that when I speak it feels as if my words were being uttered by an "automaton".' },
  { id: 11, question: 'Familiar voices (including my own) sound remote and unreal.' },
  { id: 12, question: 'I have the feeling that my hands or my feet have become larger or smaller.' },
  { id: 13, question: 'My surroundings feel detached or unreal, as if there were a veil between me and the outside world.' },
  { id: 14, question: 'It seems as if things that I have recently done had taken place a long time ago.' },
  { id: 15, question: 'Whilst fully awake I have visual images of past events that are so vivid as to feel I am actually re-living the experience.' },
  { id: 16, question: 'Things I am seeing look as if they were viewed through a tunnel or telescope.' },
  { id: 17, question: 'When a part of my body hurts, I feel so detached from the pain that it feels like "somebody else\'s pain".' },
  { id: 18, question: 'When I am in a new situation, it feels as if I have been through it before.' },
  { id: 19, question: 'Out of the blue, I find myself not feeling any affection towards my family and close friends.' },
  { id: 20, question: 'Objects around me seem to look smaller or further away.' },
  { id: 21, question: 'I cannot feel properly the objects that I touch with my hands, for it feels as if it were not me who were touching it.' },
  { id: 22, question: 'I do not seem to be able to picture things in my mind, e.g. the face of a close friend or a familiar place.' },
  { id: 23, question: 'When a part of my body hurts, I feel curiously detached from the pain.' },
  { id: 24, question: 'I have the feeling of being outside my body.' },
  { id: 25, question: 'When I move it does not feel as if I were in charge of the movements, so that I feel "automatic" and mechanical, as if I were a "robot".' },
  { id: 26, question: 'The smell of things no longer gives me a feeling of pleasure or dislike.' },
  { id: 27, question: 'I feel so detached from my thoughts that they seem to have a "life" of their own.' },
  { id: 28, question: 'I have to touch myself to make sure that I have a body or a real existence.' },
  { id: 29, question: 'I seem to have lost some bodily sensations (e.g. of hunger and thirst) so that when I eat or drink, it feels like an automatic routine.' },
];

export const cdsFrequencyOptions = [
  { value: 0, label: 'Never' },
  { value: 1, label: 'Rarely' },
  { value: 2, label: 'Often' },
  { value: 3, label: 'Very often' },
  { value: 4, label: 'All the time' },
];

export const cdsDurationOptions = [
  { value: 1, label: 'Few seconds' },
  { value: 2, label: 'Few minutes' },
  { value: 3, label: 'Few hours' },
  { value: 4, label: 'About a day' },
  { value: 5, label: 'More than a day' },
  { value: 6, label: 'More than a week' },
];
