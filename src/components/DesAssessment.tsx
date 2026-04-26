import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { desScale } from '@/data/desScale';
import { DesResponse, DesResult } from '@/types/des';
import { DesItemCard } from './DesItemCard';
import { DesResults } from './DesResults';
import { PatientInfoForm } from '@/components/PatientInfoForm';

interface Props {
  onBack: () => void;
}

export const DesAssessment = ({ onBack }: Props) => {
  const [responses, setResponses] = useState<DesResponse[]>([]);
  const [results, setResults] = useState<DesResult | null>(null);

  const handleSelect = (itemId: number, score: number) => {
    setResponses((prev) => {
      const existing = prev.find((r) => r.itemId === itemId);
      if (existing) return prev.map((r) => (r.itemId === itemId ? { ...r, score } : r));
      return [...prev, { itemId, score }];
    });
  };

  const calculate = (): DesResult => {
    const itemsScored = responses.length;
    const totalMean =
      itemsScored > 0 ? responses.reduce((s, r) => s + r.score, 0) / itemsScored : 0;
    const taxonResponses = responses.filter((r) => {
      const item = desScale.find((i) => i.id === r.itemId);
      return item?.taxon;
    });
    const taxonMean =
      taxonResponses.length > 0
        ? taxonResponses.reduce((s, r) => s + r.score, 0) / taxonResponses.length
        : 0;

    let severity: DesResult['severity'];
    let interpretation: string;
    if (totalMean < 10) {
      severity = 'minimal';
      interpretation =
        'Mean score < 10. Low level of dissociative experiences, within the typical range for non-clinical adults.';
    } else if (totalMean < 20) {
      severity = 'mild';
      interpretation =
        'Mean score 10–19. Some dissociative experiences; common in clinical samples but not specific to a dissociative disorder.';
    } else if (totalMean < 30) {
      severity = 'moderate';
      interpretation =
        'Mean score 20–29. Substantial dissociative experiences; further evaluation for dissociative, PTSD, or trauma-related disorders is suggested.';
    } else {
      severity = 'severe';
      interpretation =
        'Mean score ≥ 30. High level of dissociative experiences. The standard screening cutoff for possible dissociative disorder (including DID) is ≥ 30; structured clinical evaluation (e.g. SCID-D) is recommended.';
    }

    return { totalMean, taxonMean, itemsScored, severity, interpretation };
  };

  const handleSubmit = () => {
    if (responses.length === desScale.length) setResults(calculate());
  };

  const handleReset = () => {
    setResponses([]);
    setResults(null);
  };

  if (results) {
    return <DesResults results={results} onReset={handleReset} onBack={onBack} />;
  }

  const isComplete = responses.length === desScale.length;
  const progress = (responses.length / desScale.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold">Dissociative Experiences Scale (DES-II)</h2>
          <p className="text-muted-foreground mt-1">
            Carlson &amp; Putnam (1993) — 28-item self-report measure of dissociative experiences.
          </p>
        </div>
      </div>

      <PatientInfoForm />

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
          <CardDescription>
            For each statement, indicate the percentage of the time the experience happens to you
            (0% = never, 100% = always). Answer how often these experiences occur when you are{' '}
            <strong>not</strong> under the influence of alcohol or drugs. The total DES score is
            the <em>mean</em> of all 28 item scores (range 0–100). Items 3, 5, 7, 8, 12, 13, 22 and
            27 form the DES-Taxon (DES-T) used to estimate pathological dissociation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">
                {responses.length} / {desScale.length}
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
        {desScale.map((item) => (
          <DesItemCard
            key={item.id}
            item={item}
            selectedScore={responses.find((r) => r.itemId === item.id)?.score}
            onScoreSelect={handleSelect}
          />
        ))}
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
