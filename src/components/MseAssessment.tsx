import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { usePatientInfo } from '@/contexts/PatientInfoContext';
import { generatePdfReport } from '@/utils/reportGenerator';
import { ClipboardList, FileText, RotateCcw, Search, X } from 'lucide-react';
import { mseExplanations } from '@/data/mseExplanations';
import { mseImages } from '@/data/mseImages';
import { StroopGrid } from '@/components/StroopGrid';

interface MseAssessmentProps {
  onBack?: () => void;
}

interface MseItem {
  id: string;
  label: string;
  detail?: string;
  explanation?: React.ReactNode;
}

interface MseSubsection {
  id: string;
  title: string;
  items: MseItem[];
}

interface MseSection {
  id: string;
  title: string;
  intro?: string;
  subsections: MseSubsection[];
}

const sections: MseSection[] = [
  {
    id: 'general',
    title: 'General Functions',
    subsections: [
      {
        id: 'loc',
        title: 'Level of Consciousness',
        items: [
          { id: 'loc-alert', label: 'Alert' },
          { id: 'loc-drowsy', label: 'Drowsy / lethargic' },
          { id: 'loc-stupor', label: 'Stupor' },
          { id: 'loc-coma', label: 'Coma' },
        ],
      },
      {
        id: 'orientation',
        title: 'Orientation',
        items: [
          { id: 'or-time', label: 'Time', detail: 'Year, season, month, day, date' },
          { id: 'or-place', label: 'Place', detail: 'Country, state, city, hospital, floor' },
          { id: 'or-person', label: 'Person' },
        ],
      },
      {
        id: 'attention',
        title: 'Attention & Concentration',
        items: [
          {
            id: 'att-tapA',
            label: "Tap 'A' test",
            detail: 'Tap when examiner says "A" during random letters',
            explanation: (
              <div className="space-y-3 text-xs text-muted-foreground">
                <p>
                  The Tap 'A' test is a bedside vigilance task. The examiner reads a random
                  string of letters at ~1/second; the patient taps (or raises a finger) only
                  when they hear the target letter "A". Errors of omission (missed A's) and
                  commission (tapping on non-targets) are recorded.
                </p>
                <div>
                  <p className="font-semibold text-foreground">Purpose &amp; clinical significance</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>
                      <span className="font-medium">Assesses attention:</span> Tests the ability to
                      focus on a repetitive auditory task while ignoring irrelevant stimuli.
                    </li>
                    <li>
                      <span className="font-medium">Measures vigilance:</span> Detects inability to
                      sustain arousal/alertness (hypoactivity, easy distractibility).
                    </li>
                    <li>
                      <span className="font-medium">Indicates cognitive dysfunction:</span> Frequent
                      errors suggest a deficit in attention or reduced alertness (e.g. delirium).
                    </li>
                    <li>
                      <span className="font-medium">Identifies frontal impairment:</span> Useful for
                      quickly screening decreased attentiveness in brain injury or other
                      neurological disorders.
                    </li>
                  </ul>
                </div>
              </div>
            ),
          },
          { id: 'att-cancel', label: 'Random letter cancellation', detail: 'Cross out targets in 1 minute' },
          { id: 'att-serial7', label: 'Serial 7s / months backward' },
        ],
      },
    ],
  },
  {
    id: 'memory',
    title: 'Memory',
    subsections: [
      {
        id: 'mem-immediate',
        title: 'Immediate / Working Memory',
        items: [
          { id: 'mem-digit-fwd', label: 'Digits forward', detail: 'Immediate memory' },
          { id: 'mem-digit-bwd', label: 'Digits backward', detail: 'Working memory' },
        ],
      },
      {
        id: 'mem-recent',
        title: 'Recent Memory',
        items: [
          { id: 'mem-3obj', label: 'Recall 3 objects after 3–5 min' },
          { id: 'mem-breakfast', label: 'Breakfast details, admission date' },
          { id: 'mem-story', label: 'Story retrieval' },
          { id: 'mem-visual', label: 'Visual: find 5 hidden objects' },
          { id: 'mem-paired', label: 'Paired association', detail: 'e.g., book–page, school–tape' },
        ],
      },
      {
        id: 'mem-remote',
        title: 'Remote Memory',
        items: [
          { id: 'mem-school', label: 'Schooling details, exam years, retirement date' },
        ],
      },
      {
        id: 'mem-semantic',
        title: 'Semantic Memory',
        items: [
          { id: 'mem-sem-facts', label: 'Facts / concepts', detail: 'e.g., first PM of India, elephant colour, days in week' },
        ],
      },
    ],
  },
  {
    id: 'language',
    title: 'Language',
    subsections: [
      {
        id: 'lang-spont',
        title: 'Spontaneous Speech',
        items: [
          { id: 'lang-fluency', label: 'Fluency' },
          { id: 'lang-prosody', label: 'Prosody' },
          { id: 'lang-grammar', label: 'Grammar' },
          { id: 'lang-paraphasia', label: 'Paraphasia' },
          { id: 'lang-circum', label: 'Circumlocutions' },
        ],
      },
      {
        id: 'lang-comp',
        title: 'Comprehension',
        items: [
          { id: 'lang-1step', label: '1-step command' },
          { id: 'lang-2step', label: '2-step command' },
          { id: 'lang-3step', label: '3-step command' },
          {
            id: 'lang-marie',
            label: "Marie's three-paper test",
            detail: 'Comprehension of complex sequential commands',
            explanation: (
              <div className="space-y-3 text-xs text-muted-foreground">
                <p>
                  Marie's three-paper test (Marie's paper test) assesses comprehension in
                  higher mental function exams, particularly for dominant parietal lobe lesions
                  such as Wernicke's aphasia or conduction aphasia.
                </p>
                <div>
                  <p className="font-semibold text-foreground">Test procedure</p>
                  <p>Present three papers of different sizes (big, medium, small) and instruct:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>"Take the big piece, crumple it up and throw it on the ground."</li>
                    <li>"Give me the middle sized one."</li>
                    <li>"Put the smallest in your pocket."</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Interpretation</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li><span className="font-medium">Normal:</span> Performs all 3 actions correctly in sequence.</li>
                    <li>
                      <span className="font-medium">Abnormal (comprehension deficit):</span> Fails
                      multi-step commands, grabs the wrong paper, ignores size adjectives, or
                      performs actions out of order/incompletely.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Clinical significance</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Tests auditory comprehension of complex sequential commands with size adjectives.</li>
                    <li>Differentiates receptive language deficit from simple motor apraxia.</li>
                    <li>Positive in left parietal/temporal lesions affecting Wernicke's area or arcuate fasciculus.</li>
                  </ul>
                </div>
              </div>
            ),
          },
        ],
      },
      {
        id: 'lang-other',
        title: 'Other Language Functions',
        items: [
          { id: 'lang-rep', label: 'Repetition' },
          { id: 'lang-naming', label: 'Naming' },
          { id: 'lang-read-aloud', label: 'Reading aloud' },
          { id: 'lang-read-comp', label: 'Reading comprehension' },
          { id: 'lang-symbols', label: 'Reading symbols' },
          { id: 'lang-writing', label: 'Writing' },
          { id: 'lang-automatic', label: 'Automatic speech' },
        ],
      },
    ],
  },
  {
    id: 'frontal',
    title: 'Frontal Lobe Tests',
    subsections: [
      {
        id: 'fr-plan',
        title: 'Planning',
        items: [{ id: 'fr-tol', label: 'Tower of London' }],
      },
      {
        id: 'fr-inhib',
        title: 'Inhibition',
        items: [
          { id: 'fr-gng', label: 'Go / no-go' },
          { id: 'fr-stroop', label: 'Stroop' },
        ],
      },
      {
        id: 'fr-flex',
        title: 'Flexibility',
        items: [
          { id: 'fr-trailb', label: 'Trail Making B' },
          { id: 'fr-wcst', label: 'Wisconsin Card Sorting' },
        ],
      },
      {
        id: 'fr-fluency',
        title: 'Fluency',
        items: [
          { id: 'fr-fas', label: 'FAS (phonemic)' },
          { id: 'fr-sem', label: 'Semantic (animals)' },
          { id: 'fr-design', label: 'Design fluency' },
        ],
      },
      {
        id: 'fr-seq',
        title: 'Sequencing',
        items: [
          { id: 'fr-graphic', label: 'Graphic sequence', detail: 'V V V V V ?' },
          { id: 'fr-fep', label: 'Fist–edge–palm (Luria)' },
          { id: 'fr-fr', label: 'Fist–ring' },
        ],
      },
      {
        id: 'fr-series',
        title: 'Series Completion',
        items: [
          { id: 'fr-num', label: 'Number series', detail: '1, 3, 5, …' },
          { id: 'fr-letter', label: 'Letter series', detail: 'cat – tac …' },
        ],
      },
      {
        id: 'fr-abs',
        title: 'Abstract Thinking',
        items: [
          { id: 'fr-prov', label: 'Proverbs' },
          { id: 'fr-sim', label: 'Similarities', detail: 'cow / goat' },
        ],
      },
      {
        id: 'fr-motor',
        title: 'Motor Frontal Signs',
        items: [
          { id: 'fr-imp', label: 'Impersistence' },
          { id: 'fr-pers', label: 'Perseveration' },
          { id: 'fr-echo', label: 'Echopraxia' },
        ],
      },
    ],
  },
  {
    id: 'leftparietal',
    title: 'Left Parietal Lobe',
    subsections: [
      {
        id: 'lp-apraxia',
        title: 'Apraxia',
        items: [
          { id: 'lp-concept', label: 'Conceptual', detail: 'Tool / alternative tool selection, gesture recognition' },
          { id: 'lp-ideational', label: 'Ideational', detail: 'Letter-mailing sequence' },
          { id: 'lp-ideomotor', label: 'Ideomotor', detail: 'Transitive / intransitive, imitation' },
          { id: 'lp-limbk', label: 'Limb-kinetic', detail: 'Finger opposition' },
        ],
      },
      {
        id: 'lp-calc',
        title: 'Calculation',
        items: [
          { id: 'lp-counting', label: 'Counting' },
          { id: 'lp-trans', label: 'Transcoding' },
          { id: 'lp-signs', label: 'Arithmetic signs' },
          { id: 'lp-mental', label: 'Mental calculation' },
          { id: 'lp-written', label: 'Written calculation' },
          { id: 'lp-column', label: 'Column alignment' },
        ],
      },
      {
        id: 'lp-finger',
        title: 'Finger Gnosis & Right–Left Orientation',
        items: [
          { id: 'lp-fid-vis', label: 'Finger ID — visible' },
          { id: 'lp-fid-hid', label: 'Finger ID — hidden' },
          { id: 'lp-bodyparts', label: 'Body part identification' },
          { id: 'lp-crossed', label: 'Crossed movements', detail: 'Right hand to left ear' },
        ],
      },
    ],
  },
  {
    id: 'rightparietal',
    title: 'Right Parietal Lobe',
    subsections: [
      {
        id: 'rp-neglect',
        title: 'Hemineglect',
        items: [
          { id: 'rp-cancel', label: 'Cancellation task' },
          { id: 'rp-bisect', label: 'Line bisection' },
          { id: 'rp-clock', label: 'Clock drawing' },
        ],
      },
      {
        id: 'rp-construct',
        title: 'Constructional Apraxia',
        items: [
          { id: 'rp-pent', label: 'Interlocking pentagons' },
          { id: 'rp-necker', label: 'Necker cube' },
          { id: 'rp-clockc', label: 'Clock construction' },
        ],
      },
      {
        id: 'rp-dressing',
        title: 'Dressing Apraxia',
        items: [{ id: 'rp-dress', label: 'Dressing apraxia observed' }],
      },
      {
        id: 'rp-topo',
        title: 'Topographical Disorientation',
        items: [
          { id: 'rp-objloc', label: 'Object locations' },
          { id: 'rp-landmark', label: 'Landmark recognition' },
          { id: 'rp-maps', label: 'Map reading' },
        ],
      },
    ],
  },
  {
    id: 'occipital',
    title: 'Occipital Lobe',
    subsections: [
      {
        id: 'oc-ventral',
        title: 'Ventral Stream — Object Recognition',
        items: [
          { id: 'oc-apperc', label: 'Apperceptive agnosia', detail: 'Matching, copying' },
          { id: 'oc-assoc', label: 'Associative agnosia', detail: 'Function matching, pyramids & palm trees' },
          { id: 'oc-proso', label: 'Prosopagnosia', detail: 'Benton facial recognition' },
          { id: 'oc-color', label: 'Colour vision', detail: 'Ishihara, naming / pointing / matching / painting' },
        ],
      },
      {
        id: 'oc-dorsal',
        title: 'Dorsal Stream — Space',
        items: [
          { id: 'oc-simult', label: 'Simultanagnosia', detail: 'Letter cancellation, global/local letters, cookie-theft picture' },
          { id: 'oc-visdis', label: 'Visual disorientation', detail: 'Distance estimation, circle-centre dot' },
          { id: 'oc-optic', label: 'Optic ataxia', detail: 'Ear-touching task' },
        ],
      },
    ],
  },
  {
    id: 'temporal',
    title: 'Temporal Lobe',
    subsections: [
      {
        id: 'te-items',
        title: 'Temporal Functions',
        items: [
          { id: 'te-episodic', label: 'Recent episodic memory' },
          { id: 'te-topo', label: 'Topographic memory' },
          { id: 'te-faceid', label: 'Face identification' },
          { id: 'te-letterid', label: 'Letter / symbol identification' },
          { id: 'te-semantic', label: 'Semantic memory' },
          { id: 'te-language', label: 'Language (see General Language section)' },
        ],
      },
    ],
  },
];

type Status = 'normal' | 'abnormal' | 'na';

export const MseAssessment = ({ onBack }: MseAssessmentProps) => {
  const { t } = useLanguage();
  const { patientInfo } = usePatientInfo();
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const setItem = (id: string, s: Status) => {
    setStatus(prev => {
      const next = { ...prev };
      if (next[id] === s) {
        delete next[id];
      } else {
        next[id] = s;
      }
      return next;
    });
  };

  const handleReset = () => {
    setStatus({});
    setNotes('');
  };

  const allItems = sections.flatMap(sec =>
    sec.subsections.flatMap(sub => sub.items.map(it => ({ ...it, section: sec.title, subsection: sub.title })))
  );

  const counts = {
    normal: Object.values(status).filter(s => s === 'normal').length,
    abnormal: Object.values(status).filter(s => s === 'abnormal').length,
    na: Object.values(status).filter(s => s === 'na').length,
  };

  const handleExportPdf = () => {
    const fmt = (s: Status) =>
      allItems
        .filter(it => status[it.id] === s)
        .map(it => `${it.section} › ${it.subsection} › ${it.label}${it.detail ? ` — ${it.detail}` : ''}`);

    const reportSections: { title: string; items: string[]; type?: 'positive' | 'negative' | 'info' }[] = [
      { title: 'Abnormal Findings', items: fmt('abnormal'), type: 'positive' },
      { title: 'Normal Findings', items: fmt('normal'), type: 'negative' },
      { title: 'Not Assessed', items: fmt('na'), type: 'info' },
    ];

    if (notes.trim()) {
      reportSections.push({ title: 'Clinical Notes', items: [notes], type: 'info' });
    }

    const pi = patientInfo
      ? (Object.fromEntries(Object.entries(patientInfo).map(([k, v]) => [k, String(v)])) as Record<string, string>)
      : undefined;

    generatePdfReport({
      assessmentName: 'Mental Status Examination (MSE)',
      date: new Date().toLocaleDateString(),
      totalScore: `${counts.abnormal} abnormal · ${counts.normal} normal · ${counts.na} N/A`,
      patientInfo: pi,
      sections: reportSections,
    });
  };

  const matchesSearch = (label: string, detail?: string) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return label.toLowerCase().includes(q) || (detail?.toLowerCase().includes(q) ?? false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pt-16">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
          <ClipboardList className="h-7 w-7 text-primary" />
          Mental Status Examination
        </h1>
        <p className="text-sm text-muted-foreground">
          Comprehensive bedside MSE covering general functions, memory, language, frontal-lobe, parietal, occipital and temporal-lobe testing.
          Mark each item as <span className="font-semibold text-foreground">Normal</span>, <span className="font-semibold text-foreground">Abnormal</span> or <span className="font-semibold text-foreground">N/A</span>.
        </p>
      </div>

      <PatientInfoForm />

      {/* Summary */}
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-muted">
              <div className="text-xl font-bold text-destructive">{counts.abnormal}</div>
              <div className="text-xs text-muted-foreground">Abnormal</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted">
              <div className="text-xl font-bold text-primary">{counts.normal}</div>
              <div className="text-xs text-muted-foreground">Normal</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted">
              <div className="text-xl font-bold text-muted-foreground">{counts.na}</div>
              <div className="text-xs text-muted-foreground">N/A</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search MSE items…"
          className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Sections */}
      <Accordion type="multiple" defaultValue={sections.map(s => s.id)} className="space-y-2">
        {sections.map(section => {
          const visibleSubs = section.subsections
            .map(sub => ({ ...sub, items: sub.items.filter(it => matchesSearch(it.label, it.detail)) }))
            .filter(sub => sub.items.length > 0);
          if (visibleSubs.length === 0) return null;
          const sectionCount = visibleSubs.reduce((n, s) => n + s.items.length, 0);
          return (
            <AccordionItem key={section.id} value={section.id} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-left">{section.title}</span>
                  <Badge variant="secondary" className="text-xs">{sectionCount}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {visibleSubs.map(sub => (
                    <div key={sub.id}>
                      <h4 className="text-sm font-semibold text-foreground mb-2">{sub.title}</h4>
                      <div className="space-y-2">
                        {sub.items.map(item => {
                          const cur = status[item.id];
                          return (
                            <div key={item.id} className="p-3 rounded-lg border border-border">
                              <div className="flex items-start justify-between gap-3 flex-wrap">
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-foreground text-sm">{item.label}</div>
                                  {item.detail && (
                                    <div className="text-xs text-muted-foreground mt-0.5">{item.detail}</div>
                                  )}
                                </div>
                                <div className="flex gap-1 shrink-0">
                                  <Button
                                    size="sm"
                                    variant={cur === 'normal' ? 'default' : 'outline'}
                                    onClick={() => setItem(item.id, 'normal')}
                                    className="h-7 px-2 text-xs"
                                  >
                                    Normal
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={cur === 'abnormal' ? 'destructive' : 'outline'}
                                    onClick={() => setItem(item.id, 'abnormal')}
                                    className="h-7 px-2 text-xs"
                                  >
                                    Abnormal
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={cur === 'na' ? 'secondary' : 'outline'}
                                    onClick={() => setItem(item.id, 'na')}
                                    className="h-7 px-2 text-xs"
                                  >
                                    N/A
                                  </Button>
                                </div>
                              </div>
                              {(item.explanation ?? mseExplanations[item.id] ?? mseImages[item.id]) && (
                                <Collapsible className="mt-2">
                                  <CollapsibleTrigger className="flex items-center gap-1 text-xs text-primary hover:underline [&[data-state=open]>svg.chev]:rotate-180">
                                    <Info className="h-3 w-3" />
                                    Learn more about this test
                                    <ChevronDown className="chev h-3 w-3 transition-transform" />
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className="mt-2 p-3 rounded-md bg-muted/40 border border-border space-y-3">
                                    {item.id === 'fr-stroop' ? (
                                      <figure className="rounded-md overflow-hidden border border-border bg-background">
                                        <StroopGrid />
                                        <figcaption className="px-2 py-1.5 text-[11px] text-muted-foreground border-t border-border">
                                          {mseImages['fr-stroop']?.caption ?? 'Name the ink colour, suppressing the printed colour word.'}
                                        </figcaption>
                                      </figure>
                                    ) : mseImages[item.id] && (
                                      <figure className="rounded-md overflow-hidden border border-border bg-background">
                                        <img
                                          src={mseImages[item.id].src}
                                          alt={mseImages[item.id].alt}
                                          loading="lazy"
                                          width={1024}
                                          height={1024}
                                          className="w-full h-auto max-h-72 object-contain bg-white"
                                        />
                                        <figcaption className="px-2 py-1.5 text-[11px] text-muted-foreground border-t border-border">
                                          {mseImages[item.id].caption}
                                        </figcaption>
                                      </figure>
                                    )}
                                    {(item.explanation ?? mseExplanations[item.id])}
                                  </CollapsibleContent>
                                </Collapsible>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Notes */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">Clinical Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add clinical observations…"
            className="w-full min-h-[100px] p-3 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
          />
        </CardContent>
      </Card>

      <div className="flex gap-3 mt-6 mb-8">
        <Button onClick={handleExportPdf} className="flex-1" disabled={Object.keys(status).length === 0 && !notes.trim()}>
          <FileText className="h-4 w-4 mr-2" /> Export PDF
        </Button>
        <Button onClick={handleReset} variant="outline">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
