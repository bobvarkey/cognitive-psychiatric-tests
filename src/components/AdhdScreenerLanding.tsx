import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight, Brain, Focus, ClipboardCheck, ClipboardList } from 'lucide-react';
import { PsychosisScaleAssessment } from '@/components/PsychosisScaleAssessment';
import { ADHD_SCREENERS } from '@/data/adhdScreenerScales';
import type { PsychosisScale } from '@/data/psychosisScales';

interface Props {
  onBack?: () => void;
}

type AgeRange = 'child' | 'adolescent' | 'adult';
type ScreenerKey = 'asrs6' | 'asrs18' | 'vanderbilt';

const AGE_OPTIONS: {
  id: AgeRange;
  label: string;
  hint: string;
  recommended: ScreenerKey;
  alternates: ScreenerKey[];
}[] = [
  {
    id: 'child',
    label: 'Child (6–12 years)',
    hint: 'Parent-informant rating recommended; uses count-of-symptoms cutoffs.',
    recommended: 'vanderbilt',
    alternates: [],
  },
  {
    id: 'adolescent',
    label: 'Adolescent (13–17 years)',
    hint: 'ASRS not formally validated <18; use cautiously, ideally with collateral or Vanderbilt.',
    recommended: 'asrs6',
    alternates: ['asrs18', 'vanderbilt'],
  },
  {
    id: 'adult',
    label: 'Adult (≥18 years)',
    hint: 'WHO/Harvard ASRS validated cutoffs apply (≥4 of 6 in shaded zone = positive).',
    recommended: 'asrs6',
    alternates: ['asrs18'],
  },
];

const SCREENER_META: Record<ScreenerKey, { name: string; subtitle: string; icon: React.ElementType }> = {
  asrs6: { name: 'ASRS-v1.1 Part A (6 items)', subtitle: 'Brief adult screener', icon: Focus },
  asrs18: { name: 'ASRS-v1.1 Full (18 items)', subtitle: 'Inattention + hyperactivity domains', icon: ClipboardList },
  vanderbilt: { name: 'NICHQ Vanderbilt (parent)', subtitle: 'Childhood ADHD informant scale', icon: ClipboardCheck },
};

export const AdhdScreenerLanding = ({ onBack }: Props) => {
  const [age, setAge] = useState<AgeRange>('adult');
  const [chosen, setChosen] = useState<ScreenerKey | null>(null);

  if (chosen) {
    const scale = ADHD_SCREENERS[chosen] as PsychosisScale;
    return (
      <PsychosisScaleAssessment
        scale={scale}
        ageRange={age}
        onBack={() => setChosen(null)}
      />
    );
  }

  const ageOpt = AGE_OPTIONS.find((a) => a.id === age)!;
  const choices: ScreenerKey[] = [ageOpt.recommended, ...ageOpt.alternates];

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to menu
          </Button>
        )}

        <Card className="shadow-medical">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-medical-primary">
              <Brain className="h-6 w-6" />
              ADHD Screener
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Pick the patient's age range, then choose a screener. The default for each age is
              evidence-based; alternates are listed underneath.
            </p>
          </CardHeader>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">1. Patient age range</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={age}
              onValueChange={(v) => setAge(v as AgeRange)}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {AGE_OPTIONS.map((a) => (
                <Label
                  key={a.id}
                  htmlFor={`age-${a.id}`}
                  className={`flex items-start gap-2 rounded-md border p-3 text-sm cursor-pointer transition ${
                    age === a.id
                      ? 'border-medical-primary bg-medical-primary/10'
                      : 'border-border hover:bg-muted/40'
                  }`}
                >
                  <RadioGroupItem id={`age-${a.id}`} value={a.id} className="mt-0.5" />
                  <span>
                    <span className="font-medium block">{a.label}</span>
                    <span className="text-xs text-muted-foreground block mt-0.5">{a.hint}</span>
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">2. Choose a screener</CardTitle>
            <p className="text-xs text-muted-foreground">
              Recommended for {ageOpt.label.toLowerCase()}: <strong>{SCREENER_META[ageOpt.recommended].name}</strong>
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {choices.map((key, idx) => {
              const meta = SCREENER_META[key];
              const Icon = meta.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setChosen(key)}
                  className={`w-full text-left rounded-md border p-3 transition flex items-center justify-between gap-3 ${
                    idx === 0
                      ? 'border-medical-primary/50 bg-medical-primary/5 hover:bg-medical-primary/10'
                      : 'border-border hover:bg-muted/40'
                  }`}
                >
                  <span className="flex items-start gap-3">
                    <Icon className="h-5 w-5 mt-0.5 text-medical-primary shrink-0" />
                    <span>
                      <span className="font-medium block text-foreground">{meta.name}</span>
                      <span className="text-xs text-muted-foreground block">{meta.subtitle}</span>
                      {idx === 0 && (
                        <span className="text-[11px] font-medium text-medical-primary mt-1 inline-block">
                          Recommended
                        </span>
                      )}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          Screening tools support — they do not replace DSM-5-TR clinical evaluation.
        </p>
      </div>
    </div>
  );
};
