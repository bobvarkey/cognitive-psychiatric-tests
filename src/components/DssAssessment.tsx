import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { dssScale } from '@/data/dssScale';
import { DssDomain, DssResponse, DssResult, DssSubscaleScore } from '@/types/dss';
import { DssItemCard } from './DssItemCard';
import { DssResults } from './DssResults';
import { PatientInfoForm } from '@/components/PatientInfoForm';

interface Props {
  onBack: () => void;
}

const DOMAINS: DssDomain[] = [
  'depersonalization',
  'derealization',
  'gaps',
  'sensory',
  'cognitive',
  'identity',
];

export const DssAssessment = ({ onBack }: Props) => {
  const [responses, setResponses] = useState<DssResponse[]>([]);
  const [results, setResults] = useState<DssResult | null>(null);

  const handleSelect = (itemId: number, score: number) => {
    setResponses((prev) => {
      const existing = prev.find((r) => r.itemId === itemId);
      if (existing) return prev.map((r) => (r.itemId === itemId ? { ...r, score } : r));
      return [...prev, { itemId, score }];
    });
  };

  const calculate = (): DssResult => {
    const itemsScored = responses.length;
    const totalMean =
      itemsScored > 0 ? responses.reduce((s, r) => s + r.score, 0) / itemsScored : 0;

    const subscales: DssSubscaleScore[] = DOMAINS.map((domain) => {
      const subItems = dssScale.filter((i) => i.domain === domain);
      const subResponses = responses.filter((r) =>
        subItems.some((i) => i.id === r.itemId),
      );
      const mean =
        subResponses.length > 0
          ? subResponses.reduce((s, r) => s + r.score, 0) / subResponses.length
          : 0;
      return {
        domain,
        mean,
        itemsScored: subResponses.length,
        elevated: mean >= 1.0,
      };
    });

    let severity: DssResult['severity'];
    let interpretation: string;
    if (totalMean < 0.5) {
      severity = 'minimal';
      interpretation =
        'Minimal past-week dissociative symptoms across all six domains. Within the typical / non-clinical range.';
    } else if (totalMean < 1.0) {
      severity = 'mild';
      interpretation =
        'Mild past-week dissociative symptoms. Some symptoms present but below the developers\' suggested clinical threshold (mean ≥ 1.0).';
    } else if (totalMean < 2.0) {
      severity = 'moderate';
      interpretation =
        'Moderate past-week dissociative symptoms. Mean ≥ 1.0 meets the suggested threshold for clinically significant dissociation; further evaluation is warranted.';
    } else {
      severity = 'severe';
      interpretation =
        'Severe past-week dissociative symptoms across multiple domains. Structured clinical evaluation for a dissociative or trauma-related disorder is strongly recommended.';
    }

    return { totalMean, subscales, itemsScored, severity, interpretation };
  };

  const handleSubmit = () => {
    if (responses.length === dssScale.length) setResults(calculate());
  };

  const handleReset = () => {
    setResponses([]);
    setResults(null);
  };

  if (results) {
    return <DssResults results={results} onReset={handleReset} onBack={onBack} />;
  }

  const isComplete = responses.length === dssScale.length;
  const progress = (responses.length / dssScale.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold">Dissociative Symptoms Scale (DSS)</h2>
          <p className="text-muted-foreground mt-1">
            Carlson et al. (2018) — 20-item brief self-report measure of past-week dissociation
            across six domains.
          </p>
        </div>
      </div>

      <PatientInfoForm />

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
          <CardDescription>
            Below are 20 statements describing experiences people sometimes have. For each one,
            indicate how often the experience has happened to you <strong>in the past 7 days</strong>{' '}
            (0 = not at all, 4 = extremely). The total and each subscale are scored as a{' '}
            <em>mean</em> (range 0–4). A subscale or total mean of <strong>≥ 1.0</strong> is the
            developers' suggested threshold for clinically elevated dissociation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">
                {responses.length} / {dssScale.length}
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
        {dssScale.map((item) => (
          <DssItemCard
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
