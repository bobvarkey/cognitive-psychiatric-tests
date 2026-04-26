import { DssItem } from '@/types/dss';

// Dissociative Symptoms Scale (DSS) — 20-item brief measure of past-week
// dissociative symptoms across six domains.
// Carlson EB, Waelde LC, Palmieri PA, Macia KS, Smith SR, McDade-Montez E.
// Development and validation of the Dissociative Symptoms Scale.
// Assessment. 2018;25(1):84–98.
//
// Items are clinical paraphrases of the published instrument. Respondents
// rate past-week frequency on a 0–4 scale. Subscale and total scores are
// MEANS (range 0–4). A subscale mean ≥ 1.0 is the developers' suggested
// threshold for clinically elevated symptoms.
export const dssScale: DssItem[] = [
  // Depersonalization
  { id: 1, question: 'I felt as though I were watching myself from outside my body.', domain: 'depersonalization' },
  { id: 2, question: 'My body or parts of my body felt numb or unreal.', domain: 'depersonalization' },
  { id: 3, question: 'I felt as though I were not really me, or as if I were "going through the motions".', domain: 'depersonalization' },

  // Derealization
  { id: 4, question: 'Things around me felt unreal, dreamlike, or as if I were in a fog.', domain: 'derealization' },
  { id: 5, question: 'Familiar places or people seemed strange or unfamiliar.', domain: 'derealization' },
  { id: 6, question: 'It seemed as though I were looking at the world through a veil or pane of glass.', domain: 'derealization' },

  // Gaps in awareness / memory
  { id: 7, question: 'I "lost time" — I could not account for minutes or hours that had passed.', domain: 'gaps' },
  { id: 8, question: 'I found myself in a place and could not remember how I got there.', domain: 'gaps' },
  { id: 9, question: 'I had no memory of doing something that I knew I had done.', domain: 'gaps' },

  // Sensory misperceptions
  { id: 10, question: 'I heard sounds, voices, or noises that other people did not seem to hear.', domain: 'sensory' },
  { id: 11, question: 'I saw things that other people did not seem to see.', domain: 'sensory' },
  { id: 12, question: 'I felt physical sensations on my body that I could not explain (e.g. being touched when no one was there).', domain: 'sensory' },
  { id: 13, question: 'I noticed strange smells or tastes that I could not explain.', domain: 'sensory' },

  // Cognitive-behavioural reexperiencing
  { id: 14, question: 'I had vivid memories of past events that felt as if they were happening again, right now.', domain: 'cognitive' },
  { id: 15, question: 'I reacted to something in the present as if a past event were actually occurring.', domain: 'cognitive' },
  { id: 16, question: 'My thoughts, feelings, or actions seemed to be coming from a younger version of myself.', domain: 'cognitive' },

  // Identity dissociation
  { id: 17, question: 'I felt as if there were different parts of me that took over and acted on their own.', domain: 'identity' },
  { id: 18, question: 'I noticed that my behaviour or feelings changed so much that it felt like I was a different person.', domain: 'identity' },
  { id: 19, question: 'I found objects, writing, or possessions and could not remember acquiring or making them.', domain: 'identity' },
  { id: 20, question: 'Other people told me I had said or done things that I could not remember.', domain: 'identity' },
];

export const dssScoreOptions = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'A little bit' },
  { value: 2, label: 'Moderately' },
  { value: 3, label: 'Quite a bit' },
  { value: 4, label: 'Extremely' },
];

export const DSS_DOMAIN_LABEL: Record<string, string> = {
  depersonalization: 'Depersonalization',
  derealization: 'Derealization',
  gaps: 'Gaps in awareness / memory',
  sensory: 'Sensory misperceptions',
  cognitive: 'Cognitive-behavioural reexperiencing',
  identity: 'Identity dissociation',
};
