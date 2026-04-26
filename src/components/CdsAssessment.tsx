import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { cdsScale } from '@/data/cdsScale';
import { CdsResponse, CdsResult } from '@/types/cds';
import { CdsItemCard } from './CdsItemCard';
import { CdsResults } from './CdsResults';
import { PatientInfoForm } from '@/components/PatientInfoForm';

interface Props {
  onBack: () => void;
}

export const CdsAssessment = ({ onBack }: Props) => {
  const [responses, setResponses] = useState<CdsResponse[]>([]);
  const [results, setResults] = useState<CdsResult | null>(null);

  const handleChange = (itemId: number, frequency: number, duration: number) => {
    setResponses((prev) => {
      const existing = prev.find((r) => r.itemId === itemId);
      if (existing) {
        return prev.map((r) => (r.itemId === itemId ? { ...r, frequency, duration } : r));
      }
      return [...prev, { itemId, frequency, duration }];
    });
  };

  const calculate = (): CdsResult => {
    const frequencyScore = responses.reduce((s, r) => s + r.frequency, 0);
    const durationScore = responses.reduce((s, r) => s + r.duration, 0);
    const totalScore = frequencyScore + durationScore;
    const itemsEndorsed = responses.filter((r) => r.frequency >= 1).length;

    // Sierra & Berrios suggest a cutoff of ≥70 for clinically significant
    // depersonalisation. We add bands for clinical interpretation.
    let severity: CdsResult['severity'];
    let interpretation: string;
    if (totalScore < 70) {
      severity = 'minimal';
      interpretation =
        'Below the suggested clinical cutoff (70) for depersonalisation disorder. Symptoms, if any, are within the normal/sub-clinical range.';
    } else if (totalScore < 130) {
      severity = 'mild';
      interpretation =
        'Above the screening cutoff (≥70). Mild-to-moderate depersonalisation symptoms; consider further structured evaluation.';
    } else if (totalScore < 200) {
      severity = 'moderate';
      interpretation =
        'Substantial depersonalisation symptom burden. Clinical evaluation for depersonalisation/derealisation disorder is recommended.';
    } else {
      severity = 'severe';
      interpretation =
        'Severe and pervasive depersonalisation symptoms. Specialist mental-health evaluation is strongly recommended.';
    }

    return {
      totalScore,
      frequencyScore,
      durationScore,
      itemsEndorsed,
      severity,
      interpretation,
    };
  };

  const handleSubmit = () => {
    if (responses.length === cdsScale.length) {
      setResults(calculate());
    }
  };

  const handleReset = () => {
    setResponses([]);
    setResults(null);
  };

  if (results) {
    return <CdsResults results={results} onReset={handleReset} onBack={onBack} />;
  }

  const isComplete = responses.length === cdsScale.length;
  const progress = (responses.length / cdsScale.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold">Cambridge Depersonalisation Scale (CDS-29)</h2>
          <p className="text-muted-foreground mt-1">
            Sierra & Berrios (2000) — 29-item self-report measure of depersonalisation symptoms
            over the past 6 months.
          </p>
        </div>
      </div>

      <PatientInfoForm />

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
          <CardDescription>
            Please read each statement carefully and indicate <strong>how often</strong> you have
            experienced it during the past 6 months and <strong>how long</strong> it lasts when it
            occurs. Each item contributes a frequency score (0–4) and a duration score (1–6); the
            total score (max 290) reflects symptom intensity. A total ≥70 is the suggested
            screening cutoff for depersonalisation disorder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">
                {responses.length} / {cdsScale.length}
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {cdsScale.map((item) => {
          const r = responses.find((x) => x.itemId === item.id);
          return (
            <CdsItemCard
              key={item.id}
              item={item}
              frequency={r?.frequency}
              duration={r?.duration}
              onChange={handleChange}
            />
          );
        })}
      </div>

      <div className="flex gap-4 justify-end sticky bottom-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg border">
        <Button variant="outline" onClick={handleReset} disabled={responses.length === 0}>
          Reset
        </Button>
        <Button onClick={handleSubmit} disabled={!isComplete}>
          Calculate Results
        </Button>
      </div>
    </div>
  );
};
