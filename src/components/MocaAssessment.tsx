import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, FileText, BookOpen } from 'lucide-react';

interface MocaAssessmentProps {
  onBack?: () => void;
}

const domains = [
  { name: 'Visuospatial / Executive', points: 5, items: 'Trail-making B (alternation), cube copy, clock drawing (contour, numbers, hands).' },
  { name: 'Naming', points: 3, items: 'Low-familiarity animals: lion, rhinoceros, camel.' },
  { name: 'Memory (registration)', points: 0, items: '5 words read twice (face, velvet, church, daisy, red); not scored at registration — scored on delayed recall.' },
  { name: 'Attention', points: 6, items: 'Forward digit span (5), backward digit span (3), target-letter tap, serial 7 subtraction.' },
  { name: 'Language', points: 3, items: 'Repetition of 2 syntactically complex sentences; phonemic fluency (words starting with F, ≥11 in 1 min).' },
  { name: 'Abstraction', points: 2, items: 'Similarities: train–bicycle; watch–ruler.' },
  { name: 'Delayed recall', points: 5, items: 'Free recall of the 5 words after ~5 min (cues are given but only free recall scores).' },
  { name: 'Orientation', points: 6, items: 'Date, month, year, day, place, city.' },
];

const cutoffs = [
  { range: '26 – 30', label: 'Normal', tone: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' },
  { range: '18 – 25', label: 'Mild cognitive impairment', tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30' },
  { range: '10 – 17', label: 'Moderate cognitive impairment', tone: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30' },
  { range: '< 10',   label: 'Severe cognitive impairment',   tone: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30' },
];

const links = [
  {
    label: 'Official MoCA Test (mocacognition.com)',
    url: 'https://mocacognition.com/',
    note: 'Official site — training, certification and licensed PDFs (registration required).',
  },
  {
    label: 'StrokEngine — MoCA review',
    url: 'https://strokengine.ca/en/assessments/montreal-cognitive-assessment-moca/',
    note: 'Evidence summary, psychometrics and clinical use in stroke populations.',
  },
  {
    label: 'MoCA test paper (PDF, English)',
    url: 'https://mocacognition.com/wp-content/uploads/2015/tests-instructions/MoCA-Test-English_7_1.pdf',
    note: 'Direct PDF of the version 7.1 form (for reference; see official site for licensing).',
  },
];

export const MocaAssessment = ({ onBack }: MocaAssessmentProps) => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Montreal Cognitive Assessment</h1>
              <p className="text-sm text-muted-foreground">MoCA — 30-point multidomain cognitive screen (~10 min)</p>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1">
            <BookOpen className="h-3.5 w-3.5" /> Reference tool
          </Badge>
        </div>

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About the MoCA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              The Montreal Cognitive Assessment (Nasreddine et al., 2005) is a 30-point bedside cognitive
              screen designed to detect <span className="font-medium text-foreground">mild cognitive
              impairment (MCI)</span> — a population in whom the MMSE is often insensitive. It samples
              eight cognitive domains and takes about 10 minutes to administer.
            </p>
            <p>
              <span className="font-medium text-foreground">Education adjustment:</span> add 1 point to
              the total if the patient has ≤12 years of formal education (max 30).
            </p>
            <p>
              Scoring, training and the test forms are licensed through the official MoCA site. Use the
              link below to access the validated versions, alternative-language translations and the
              MoCA-Basic / MoCA-Blind variants.
            </p>
          </CardContent>
        </Card>

        {/* Domains */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Domains &amp; scoring (max 30)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {domains.map((d) => (
                <div key={d.name} className="py-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{d.items}</p>
                  </div>
                  <Badge variant="outline" className="self-start sm:self-center shrink-0">
                    {d.points === 0 ? 'not scored' : `${d.points} pt${d.points > 1 ? 's' : ''}`}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cut-offs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interpretation cut-offs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cutoffs.map((c) => (
                <div
                  key={c.range}
                  className={`flex items-center justify-between gap-3 rounded-md border px-3 py-2 ${c.tone}`}
                >
                  <span className="font-mono text-sm">{c.range}</span>
                  <span className="text-sm font-medium">{c.label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              The standard MCI cut-off is &lt; 26/30 (sensitivity ~90% for MCI, ~100% for mild
              Alzheimer's in the original validation). Population-specific norms may apply.
            </p>
          </CardContent>
        </Card>

        {/* External links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ExternalLink className="h-4 w-4" /> Take the test &amp; references
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-3 rounded-md border border-border p-3 hover:bg-muted/40 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:underline">{l.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{l.note}</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
              </a>
            ))}
            <p className="text-xs text-muted-foreground pt-1">
              The MoCA is © Z. Nasreddine. Clinical use requires registration and (for many users)
              certification via the official MoCA site.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
