import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Eye, Brain, Layers, Activity } from 'lucide-react';
import { DpdrAssessment } from './DpdrAssessment';
import { CdsAssessment } from './CdsAssessment';
import { DesAssessment } from './DesAssessment';
import { DssAssessment } from './DssAssessment';

interface Props {
  onBack: () => void;
}

type ScaleKey = 'dpdr' | 'cds' | 'des' | 'dss';

const SCALES: {
  id: ScaleKey;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  items: number;
  duration: string;
  recommended?: boolean;
}[] = [
  {
    id: 'dpdr',
    name: 'DPDR Symptom Scale',
    subtitle: 'Brief depersonalisation–derealisation screen',
    description:
      '20-item bedside screen across three domains — depersonalisation, derealisation, and impact/distress. Bilingual (English / Malayalam). Best for quick clinical screening.',
    icon: Eye,
    items: 20,
    duration: '~5 min',
    recommended: true,
  },
  {
    id: 'cds',
    name: 'Cambridge Depersonalisation Scale (CDS-29)',
    subtitle: 'Sierra & Berrios, 2000',
    description:
      '29-item self-report measuring frequency (0–4) and duration (1–6) of depersonalisation experiences over the past 6 months. Total ≥70 is the validated cutoff for depersonalisation disorder.',
    icon: Brain,
    items: 29,
    duration: '~10 min',
  },
  {
    id: 'des',
    name: 'Dissociative Experiences Scale (DES-II)',
    subtitle: 'Carlson & Putnam, 1993',
    description:
      '28-item self-report rating dissociative experiences from 0% to 100%. Mean ≥30 is the standard screening cutoff for dissociative disorders. Includes the 8-item DES-Taxon (DES-T).',
    icon: Layers,
    items: 28,
    duration: '~10 min',
  },
  {
    id: 'dss',
    name: 'Dissociative Symptoms Scale (DSS)',
    subtitle: 'Carlson et al., 2018 — brief, past-week',
    description:
      '20-item brief self-report rating past-week dissociation across six domains: depersonalization, derealization, gaps in awareness/memory, sensory misperceptions, cognitive-behavioural reexperiencing, and identity dissociation. Mean ≥ 1.0 on any subscale is clinically elevated. Sensitive to short-term change — useful for treatment monitoring.',
    icon: Activity,
    items: 20,
    duration: '~5 min',
  },
];

export const DpdrLanding = ({ onBack }: Props) => {
  const [chosen, setChosen] = useState<ScaleKey | null>(null);

  if (chosen === 'dpdr') return <DpdrAssessment onBack={() => setChosen(null)} />;
  if (chosen === 'cds') return <CdsAssessment onBack={() => setChosen(null)} />;
  if (chosen === 'des') return <DesAssessment onBack={() => setChosen(null)} />;
  if (chosen === 'dss') return <DssAssessment onBack={() => setChosen(null)} />;

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to menu
        </Button>

        <Card className="shadow-medical">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-medical-primary">
              <Eye className="h-6 w-6" />
              Depersonalisation / Derealisation &amp; Dissociation
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Three complementary scales for assessing depersonalisation, derealisation and broader
              dissociative experiences. Choose by clinical question and time available.
            </p>
          </CardHeader>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Choose a scale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {SCALES.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setChosen(s.id)}
                  className={`w-full text-left rounded-md border p-4 transition flex items-start justify-between gap-3 ${
                    s.recommended
                      ? 'border-medical-primary/50 bg-medical-primary/5 hover:bg-medical-primary/10'
                      : 'border-border hover:bg-muted/40'
                  }`}
                >
                  <span className="flex items-start gap-3 flex-1 min-w-0">
                    <Icon className="h-5 w-5 mt-0.5 text-medical-primary shrink-0" />
                    <span className="flex-1 min-w-0">
                      <span className="font-semibold block text-foreground">{s.name}</span>
                      <span className="text-xs text-muted-foreground block">{s.subtitle}</span>
                      <span className="text-xs text-muted-foreground block mt-2">
                        {s.description}
                      </span>
                      <span className="flex flex-wrap gap-2 mt-2">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                          {s.items} items
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                          {s.duration}
                        </span>
                        {s.recommended && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-medical-primary/15 text-medical-primary font-medium">
                            Quick screen
                          </span>
                        )}
                      </span>
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </button>
              );
            })}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          Screening tools only — they do not replace DSM-5-TR clinical evaluation.
        </p>
      </div>
    </div>
  );
};
