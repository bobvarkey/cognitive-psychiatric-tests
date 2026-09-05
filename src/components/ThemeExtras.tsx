import { useState } from 'react';
import { Search, Book, X, Sun, Moon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/hooks/useThemeStore';

export const MiniAppSearch = ({ onSearch }: { onSearch: (q: string) => void }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="relative group w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <Input
        type="search"
        placeholder="Quick search tools..."
        value={query}
        onChange={handleChange}
        className="pl-10 pr-4 h-11 bg-card/50 border-border focus:ring-primary focus:border-primary rounded-xl transition-all dark:bg-card dark:border-primary/20"
      />
      {query && (
        <button
          onClick={() => { setQuery(''); onSearch(''); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export const ModeToggle = () => {
  const { mode, toggleMode } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleMode}
      className="h-10 w-10 rounded-xl hover:bg-accent transition-colors"
      title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {mode === 'light' ? (
        <Moon className="h-5 w-5 text-slate-700" />
      ) : (
        <Sun className="h-5 w-5 text-amber-700 dark:text-amber-400" />
      )}
    </Button>
  );
};

const GLOSSARY_TERMS: { term: string; definition: string }[] = [
  // ─── Attention & Psychomotor ───
  { term: 'Aprosexia', definition: 'Inability to concentrate, with easy forgetting of recent conversations, reading, or instructions.' },
  { term: 'Bradyphrenia', definition: 'Slowness of thought, seen especially in frontal-subcortical cognitive impairment.' },
  { term: 'Agrypnia', definition: 'Severe, total insomnia of long duration.' },
  { term: 'Akathisia', definition: 'Inner restlessness with continuous, often purposeless restless movements.' },
  { term: 'Ataraxis', definition: 'Freedom from worry; a state of serene calmness.' },
  { term: 'Alexithymia', definition: 'Reduced ability to identify and express one\'s own feelings.' },
  { term: 'Palilalia', definition: 'Repetition of one\'s own words, syllables, or phrases immediately after speaking them.' },
  { term: 'Echolalia', definition: 'Immediate repetition of words spoken by others.' },

  // ─── Perceptual Disorders ───
  { term: 'Akinetopsia', definition: 'Specific inability to see objects in motion despite preserved color, form, and depth perception.' },
  { term: 'Zeitraffer Phenomenon', definition: 'Subjective experience that external visual events are moving faster or slower than normal.' },
  { term: 'Chronotaraxis', definition: 'Isolated disorientation to time, often due to mediodorsal thalamic stroke.' },
  { term: 'Auditory-Visual Synesthesia', definition: 'Sudden sounds evoking light flashes in people with optic-nerve disease.' },
  { term: 'Anwesenheit (Presence Hallucination)', definition: 'Vivid sensation that someone is present nearby or behind the patient, also called a minor hallucination.' },
  { term: 'Autoprosopometamorphopsia', definition: 'Seeing one\'s own face as distorted, for example in a mirror.' },
  { term: 'Heteroprosopometamorphopsia', definition: 'Seeing other people\'s faces as distorted.' },
  { term: 'Hemiprosopometamorphopsia', definition: 'Seeing only the right or left half of faces as distorted.' },
  { term: 'Zoanthroprosopometamorphopsia', definition: 'Seeing human faces morph into animal faces.' },

  // ─── Body Schema & Awareness ───
  { term: 'Allochiria', definition: 'Transposition of stimuli from one side of the body to the opposite side.' },
  { term: 'Alloesthesia', definition: 'A sensory stimulus on one side of the body is felt on the corresponding opposite side after a short delay.' },
  { term: 'Anosodiaphoria', definition: 'Verbal acknowledgment of a deficit or illness without emotional concern or worry about it.' },
  { term: 'Anosognosia', definition: 'Unawareness or denial of one\'s own illness or neurological deficit.' },
  { term: 'Asomatognosia', definition: 'Lack of regard for a part of the body, classically the hemiplegic arm.' },

  // ─── Delusional Misidentification ───
  { term: 'Capgras Syndrome', definition: 'Delusional belief that a familiar person has been replaced by an identical-looking imposter.' },
  { term: 'Reverse Capgras Syndrome', definition: 'Delusional belief that an imposter has replaced oneself.' },
  { term: 'Fregoli Syndrome', definition: 'Delusional belief that the same familiar person appears in many different disguises.' },
  { term: 'Reverse Fregoli Syndrome', definition: 'Rare delusional belief that others cannot recognize the patient.' },
  { term: 'Intermetamorphosis', definition: 'Delusional belief that people are constantly transforming into or exchanging identities with each other.' },
  { term: 'Syndrome of Subjective Doubles', definition: 'Delusional belief that one has a duplicate of oneself, a Doppelgänger.' },
  { term: 'Clonal Pluralization of the Self', definition: 'Delusional belief that there are multiple identical physical and psychological copies of oneself.' },
  { term: 'Delusional Autoscopy', definition: 'Out-of-body experience as a delusional belief of seeing oneself from outside the body.' },
  { term: 'Mirrored-Self Misidentification', definition: 'Delusional belief that one\'s mirror reflection is another person.' },
  { term: 'Reduplicative Paramnesia', definition: 'Delusional misidentification of place (delusional misidentification syndrome of place): the core belief that “this is not my real home; my real home is elsewhere” — sometimes duplicated, sometimes in another location or country. It occurs as a fixed, specific delusion in an otherwise relatively clear consciousness. The person may insist the current place is a copy or that their true home has been moved. Also covers delusional belief that a familiar person or object has been duplicated.' },
  { term: 'Paramnesia vs Amnesia', definition: 'Amnesia is the loss or impairment of memory (forgetting). Paramnesia is the distortion or falsification of memory — remembering wrongly or mixing reality with fantasy. A person with paramnesia may recall events confidently but inaccurately, or experience strong but false feelings of familiarity or unfamiliarity with places and people.' },
  { term: 'Cotard Syndrome', definition: 'Delusional belief that one is dead, does not exist, or has lost organs or body parts.' },
  { term: 'Ekbom Syndrome', definition: 'Delusional parasitosis: fixed belief of being infested with parasites or bugs.' },
  { term: 'Othello Syndrome', definition: 'Delusional or morbid jealousy: irrational belief that a partner is unfaithful.' },
  { term: 'Erotomania (De Clérambault Syndrome)', definition: 'Delusional belief that someone, often of higher social status, is in love with the patient.' },
  { term: 'Delusional Companions', definition: 'Delusional belief that inanimate objects such as soft toys are sentient beings.' },
  { term: 'Clinical Lycanthropy', definition: 'Delusional belief that one is turning into or has turned into an animal.' },
  { term: 'Witzelsucht', definition: 'Compulsive telling of inappropriate jokes and pointless stories, often with childlike euphoria.' },
  { term: 'Moria', definition: 'Frivolity and inability to take things seriously, with childish or euphoric behavior.' },

  // ─── Motor / Frontal Signs ───
  { term: 'Utilization Behavior', definition: 'Automatic use of nearby objects inappropriately, reflecting loss of executive control.' },
  { term: 'Oppositional Paratonia (Gegenhalten)', definition: 'Involuntary resistance to passive movement by the examiner.' },
  { term: 'Facilitatory Paratonia (Mitgehen)', definition: 'Involuntary assistance with passive movement by the examiner.' },
  { term: 'Waxy Flexibility', definition: 'Limb maintains a position imposed by the examiner, as in catatonia.' },
  { term: 'Negativism', definition: 'Motiveless resistance to all instructions or attempts to be moved.' },
  { term: 'Automatic Obedience', definition: 'Exaggerated cooperation that overrides instructions, typical of catatonia.' },
  { term: 'Ambitendency', definition: 'Incipient, hesitant, or apparently contradictory motor responses in catatonia.' },
  { term: 'Verbigeration', definition: 'Meaningless repetition of specific words or phrases.' },
  { term: 'Stereotypy', definition: 'Repetitive, purposeless, non-goal-directed movements or speech.' },
  { term: 'Mannerism', definition: 'Exaggerated, purposeful-looking movements that have become odd or theatrical.' },
  { term: 'Perseveration', definition: 'Repetition of a response or action after the stimulus has changed.' },

  // ─── Cognitive Tests ───
  { term: 'Digit Backwards', definition: 'Reciting digits in reverse order to test working memory and attention.' },
  { term: 'Similarities', definition: 'Abstract conceptualization test asking how two items are alike.' },
  { term: 'Lexical Fluency', definition: 'Naming as many words beginning with a given letter as possible in 60 seconds.' },
  { term: 'Luria\'s Motor Series', definition: 'Fist-edge-palm sequence used to test motor programming.' },
  { term: 'Trail Making Test (Mental Flexibility)', definition: 'Alternating between numbers and letters to test set-shifting and mental flexibility.' },
  { term: 'Conflicting Instructions', definition: 'Neuropsychological test of sensitivity to interference with contradictory motor commands.' },
  { term: 'Go-No Go', definition: 'Inhibitory-control test requiring a motor response to one stimulus and withholding it to another.' },

  // ─── Epilepsy & Seizures ───
  { term: 'ILAE Seizure Classification', definition: 'International League Against Epilepsy framework classifying seizures by focal, generalized, or unknown onset.' },
  { term: 'Focal Seizures', definition: 'Seizures that begin in a specific brain region.' },
  { term: 'Focal with Preserved Consciousness', definition: 'Focal seizure in which awareness and responsiveness are retained.' },
  { term: 'Focal with Impaired Consciousness', definition: 'Focal seizure in which awareness or responsiveness is impaired.' },
  { term: 'Focal-to-Bilateral Tonic-Clonic', definition: 'Focal seizure that spreads to involve both hemispheres with convulsive activity.' },
  { term: 'Generalized Seizures', definition: 'Seizures that engage widespread networks in both hemispheres at onset.' },
  { term: 'Absence Seizures', definition: 'Brief generalized seizures with sudden impairment of awareness and staring.' },
  { term: 'Typical Absence', definition: 'Brief staring spell with abrupt onset and offset, generalized spike-wave on EEG.' },
  { term: 'Atypical Absence', definition: 'Absence with less abrupt onset/offset, often with other seizure types and intellectual disability.' },
  { term: 'Myoclonic Absence', definition: 'Absence seizure with superimposed rhythmic myoclonic jerks.' },
  { term: 'Eyelid Myoclonia', definition: 'Rapid eyelid jerks with upward deviation and brief absences, often photosensitive.' },
  { term: 'Generalized Tonic-Clonic Seizures', definition: 'Generalized convulsion with a tonic phase followed by clonic jerking.' },
  { term: 'Myoclonic Tonic-Clonic', definition: 'A myoclonic jerk immediately preceding a generalized tonic-clonic seizure.' },
  { term: 'Generalized Myoclonic', definition: 'Sudden brief shock-like muscle jerks of generalized onset.' },
  { term: 'Generalized Clonic', definition: 'Repetitive rhythmic jerking of generalized onset without a predominant tonic phase.' },
  { term: 'Generalized Tonic', definition: 'Sustained increase in muscle tone of generalized onset.' },
  { term: 'Generalized Atonic', definition: 'Sudden loss of muscle tone of generalized onset, causing drop attacks.' },
  { term: 'Drug-Resistant Epilepsy', definition: 'Failure to achieve seizure control after adequate trials of two or more antiepileptic drugs.' },
  { term: 'LAEP', definition: 'Likelihood of Adverse Effects Profile, a checklist of common antiepileptic-drug side effects.' },
  { term: 'ESGS', definition: 'Epilepsy Surgery Grading Scale, combining MRI, EEG, semiology, and IQ to estimate post-surgical seizure-freedom probability.' },
  { term: 'CASES Tool', definition: 'Clinical Appropriateness Scores screening tool for candidacy of epilepsy surgery.' },
  { term: 'Engel Scale', definition: 'Standardized post-surgical outcome classification for seizure freedom after epilepsy surgery.' },

  // ─── Substance Use & Alcohol ───
  { term: 'AUDIT', definition: 'WHO Alcohol Use Disorders Identification Test; a 10-item screen for hazardous drinking, harmful use, and dependence.' },
  { term: 'AUDIT-C', definition: 'A 3-item consumption screen for unhealthy alcohol use; positive at ≥4 (men) or ≥3 (women).' },
  { term: 'NIAAA Single Question', definition: 'One-question screen for heavy drinking: ≥5 drinks/day (men) or ≥4 (women) in the past year.' },
  { term: 'Alcohol Use Disorder (AUD)', definition: 'DSM-5 diagnosis based on 11 criteria; severity is mild (2-3), moderate (4-5), or severe (6+).' },
  { term: 'CAGE', definition: '4-item alcohol screen (Cut-down, Annoyed, Guilty, Eye-opener); score ≥2 is clinically significant.' },
  { term: 'CIWA-Ar', definition: 'Clinical Institute Withdrawal Assessment for Alcohol, revised; 10-item scale grading alcohol withdrawal severity (0-67).' },
  { term: 'COWS', definition: 'Clinical Opiate Withdrawal Scale; 11-item clinician rating (0-48) used to time buprenorphine induction.' },
  { term: 'SDS', definition: 'Severity of Dependence Scale; 5 items measuring psychological dependence and compulsive use.' },
  { term: 'Unhealthy Alcohol Use', definition: 'A pattern of heavy drinking that increases risk of harm, identified by a positive consumption screen.' },
  { term: 'Hazardous Drinking', definition: 'Alcohol consumption that increases the risk of harmful consequences for the drinker or others.' },

  // ─── Mood & Psychosis ───
  { term: 'PANSS', definition: 'Positive and Negative Syndrome Scale; 30-item rating for schizophrenia with positive, negative, and general subscales.' },
  { term: 'BPRS', definition: 'Brief Psychiatric Rating Scale; 18-item clinician-rated scale tracking acute psychiatric symptom severity.' },
  { term: 'SAPS / SANS', definition: 'Scales for the Assessment of Positive and Negative Symptoms in schizophrenia.' },
  { term: 'HAMA', definition: 'Hamilton Anxiety Rating Scale (14-item) measuring anxiety severity.' },
  { term: 'HAM-D', definition: 'Hamilton Depression Rating Scale; widely used clinician-administered depression severity scale.' },
  { term: 'PCL-5', definition: 'PTSD Checklist for DSM-5; self-report screen with provisional PTSD diagnosis at score ≥31-33.' },
  { term: 'PSS', definition: 'Perceived Stress Scale; measures how unpredictable and overloaded life feels.' },
  { term: 'SMARTS', definition: 'Systematic Monitoring of Adverse events Related to TreatmentS; patient-reported side-effect checklist.' },
  { term: 'NMS', definition: 'Neuroleptic Malignant Syndrome; life-threatening reaction to antipsychotics with rigidity, hyperthermia, and autonomic instability.' },
  { term: 'Hunter Criteria', definition: 'Diagnostic decision rule for serotonin syndrome (serotonin toxicity).' },
  { term: 'Simpson-Angus Scale', definition: '10-item clinician rating of antipsychotic-induced parkinsonism; mean ≥0.3 is clinically significant.' },

  // ─── Sleep ───
  { term: 'Epworth Sleepiness Scale', definition: '8-item self-report measuring likelihood of daytime sleepiness in common situations.' },
  { term: 'STOP-BANG', definition: 'Sleep-apnea risk screen across snoring, tiredness, observed apnea, blood pressure, BMI, age, neck, and gender.' },
  { term: 'PSQI', definition: 'Pittsburgh Sleep Quality Index; 19-item measure across 7 components; >5 indicates poor sleep quality.' },
  { term: 'ISI', definition: 'Insomnia Severity Index; 7-item measure of insomnia severity and daytime interference.' },
  { term: 'IRLS', definition: 'International Restless Legs Scale; 10-item clinician rating of RLS severity and impact.' },
  { term: 'Narcolepsy', definition: 'Sleep disorder of excessive daytime sleepiness with cataplexy, sleep paralysis, and hypnagogic hallucinations.' },
  { term: 'Cataplexy', definition: 'Sudden loss of muscle tone triggered by emotion, a hallmark of narcolepsy.' },

  // ─── Cognitive / Dementia ───
  { term: 'Mini-Cog', definition: '3-item recall plus clock-drawing; rapid bedside dementia screen (~3 minutes).' },
  { term: 'Mini-ACE', definition: 'Mini-Addenbrooke\'s Cognitive Examination; brief multidomain cognitive screen.' },
  { term: 'MOCA', definition: 'Montreal Cognitive Assessment; 30-point screen sensitive to mild cognitive impairment.' },
  { term: 'FAB', definition: 'Frontal Assessment Battery; 6 subtests for executive and frontal-lobe dysfunction.' },
  { term: 'DAPHNE-6', definition: '6-domain caregiver screening for behavioural variant frontotemporal dementia; ≥4/6 is positive.' },
  { term: 'CDR', definition: 'Clinical Dementia Rating; 6-domain staging scale for dementia severity.' },
  { term: 'FAST', definition: 'Functional Assessment Staging; 7-stage scale monitoring functional decline in dementia.' },
  { term: 'Agnosia', definition: 'Inability to recognize objects, people, sounds, or shapes despite intact senses.' },
  { term: 'Apraxia', definition: 'Inability to perform learned purposeful movements despite intact physical capacity.' },
  { term: 'Agraphia', definition: 'Loss of ability to write due to brain injury.' },
  { term: 'Aphasia', definition: 'Language impairment from brain damage, affecting speech, comprehension, reading, or writing.' },
  { term: 'Disorientation', definition: 'Impairment of orientation to time, place, or person.' },
  { term: 'Egocentric Disorientation', definition: 'Inability to locate objects relative to one\'s own body.' },
  { term: 'Allocentric Disorientation', definition: 'Inability to process spatial relationships between objects or landmarks in the environment.' },
  { term: 'Gegenhalten', definition: 'Paratonic rigidity; resistance to passive movement increasing with movement velocity.' },
  { term: 'Mitgehen', definition: 'Extreme cooperation where a patient moves a limb in response to light pressure.' },

  // ─── Cognitive Biases ───
  { term: 'Cognitive Bias', definition: 'A systematic pattern of deviation from rational judgment that affects how we perceive information, make decisions, and form beliefs. Arises from the brain\'s use of mental shortcuts (heuristics) that usually speed up thinking but can lead to predictable errors.' },
  { term: 'Availability Bias', definition: 'Overestimating the likelihood of events that are recent, vivid, or emotionally charged because they come to mind more easily.' },
  { term: 'Attentional Bias', definition: 'Focusing disproportionately on certain stimuli while ignoring other relevant information.' },
  { term: 'Confirmation Bias', definition: 'Seeking, interpreting, and remembering information that supports existing beliefs while discounting contradictory evidence.' },
  { term: 'Framing Effect', definition: 'Making different choices depending on how the same information is presented (e.g., “90% fat‑free” vs “10% fat”).' },
  { term: 'Anchoring Bias', definition: 'Relying too heavily on the first piece of information encountered (the “anchor”) when estimating or deciding.' },
  { term: 'Overconfidence Bias', definition: 'Overestimating one\'s knowledge, ability, or the accuracy of one\'s predictions. Includes the Dunning–Kruger effect, where the least competent overestimate their ability most.' },
  { term: 'Hindsight Bias', definition: 'Seeing past events as more predictable than they actually were (“I knew it all along”).' },
  { term: 'Sunk Cost Fallacy', definition: 'Continuing to invest in a failing course of action because of prior investment (time, money, effort).' },
  { term: 'Status Quo Bias', definition: 'Preferring the current state of affairs and resisting change, even when change is beneficial.' },
  { term: 'Optimism Bias', definition: 'Overestimating the likelihood of positive outcomes and underestimating risks.' },
  { term: 'Negativity Bias', definition: 'Giving more weight to negative information than positive information of equal intensity.' },
  { term: 'Fundamental Attribution Error', definition: 'Attributing others\' behavior to their character while attributing our own similar behavior to circumstances.' },
  { term: 'Self-Serving Bias', definition: 'Taking credit for successes but blaming external factors for failures.' },
  { term: 'Halo Effect', definition: 'Letting one positive trait (e.g., attractiveness, likability) color overall judgments of a person or thing.' },
  { term: 'In-Group Bias / Affinity Bias', definition: 'Favoring people who are similar to us or belong to our group.' },
  { term: 'Bandwagon Effect', definition: 'Adopting beliefs or behaviors because many others do.' },
  { term: 'Groupthink', definition: 'Suppressing dissent and critical evaluation to maintain group harmony, leading to poor decisions.' },
  { term: 'Clustering Illusion / Apophenia', definition: 'Perceiving meaningful patterns in random data.' },
  { term: 'Belief Perseverance / Backfire Effect', definition: 'Holding onto beliefs even when faced with strong contradictory evidence; sometimes strengthening the belief when challenged.' },
  { term: 'Just-World Hypothesis', definition: 'Assuming the world is fundamentally fair, so people “get what they deserve.”' },
];

export const GlossaryDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Book className="h-4 w-4" />
          Glossary
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-background/95 backdrop-blur-xl border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            Clinical Glossary
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-none">
          {GLOSSARY_TERMS.map((t) => (
            <div key={t.term} className="border-b border-border/50 pb-3 last:border-0">
              <h4 className="font-bold text-primary mb-1">{t.term}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.definition}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
