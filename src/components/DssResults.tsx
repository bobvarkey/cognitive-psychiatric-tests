import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, RotateCcw, AlertCircle, FileDown, Info } from 'lucide-react';
import { DssResult } from '@/types/dss';
import { DSS_DOMAIN_LABEL } from '@/data/dssScale';
import { generatePdfReport } from '@/utils/reportGenerator';
import { usePatientInfo } from '@/contexts/PatientInfoContext';

interface Props {
  results: DssResult;
  onReset: () => void;
  onBack: () => void;
}

const SEVERITY_LABEL: Record<DssResult['severity'], string> = {
  minimal: 'Minimal (non-clinical range)',
  mild: 'Mild',
  moderate: 'Moderate — clinically elevated',
  severe: 'Severe',
};

const severityClasses = (s: DssResult['severity']) => {
  switch (s) {
    case 'minimal':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'mild':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'moderate':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'severe':
      return 'text-red-600 bg-red-50 border-red-200';
  }
};

const fmt = (n: number) => n.toFixed(2);

export const DssResults = ({ results, onReset, onBack }: Props) => {
  const { getPatientInfoForReport } = usePatientInfo();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold">DSS Results</h2>
      </div>

      {(results.severity === 'moderate' || results.severity === 'severe') && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Above clinical threshold (mean ≥ 1.0)</AlertTitle>
          <AlertDescription>
            Past-week dissociative symptoms exceed the developers' suggested threshold for
            clinically elevated dissociation. Consider further trauma- and dissociation-focused
            evaluation.
          </AlertDescription>
        </Alert>
      )}

      <Card className={`${severityClasses(results.severity)} border-2`}>
        <CardHeader>
          <CardTitle className="text-2xl">DSS Total Mean</CardTitle>
          <CardDescription className="text-lg font-semibold">
            {SEVERITY_LABEL[results.severity]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium">Mean of 20 items</span>
            <span className="text-3xl font-bold">{fmt(results.totalMean)} / 4</span>
          </div>
          <p className="text-sm leading-relaxed mt-3">{results.interpretation}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscale means</CardTitle>
          <CardDescription>
            Each subscale ranges 0–4. Means ≥ 1.0 are flagged as clinically elevated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {results.subscales.map((s) => (
              <div
                key={s.domain}
                className={`rounded-lg border p-3 ${
                  s.elevated
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {DSS_DOMAIN_LABEL[s.domain]}
                  </span>
                  <span
                    className={`text-lg font-bold tabular-nums ${
                      s.elevated ? 'text-orange-700' : 'text-foreground'
                    }`}
                  >
                    {fmt(s.mean)}
                  </span>
                </div>
                {s.elevated && (
                  <p className="text-[11px] mt-1 text-orange-700 font-medium">
                    Clinically elevated (≥ 1.0)
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>About this scale</AlertTitle>
        <AlertDescription className="text-sm space-y-2">
          <p>
            The DSS (Carlson et al., 2018) is a 20-item brief measure of past-week dissociative
            symptoms across six domains: depersonalization, derealization, gaps in awareness /
            memory, sensory misperceptions, cognitive-behavioural reexperiencing, and identity
            dissociation.
          </p>
          <p>
            Items are rated 0–4; subscale and total scores are reported as the <em>mean</em>{' '}
            (range 0–4). A mean of <strong>≥ 1.0</strong> on any subscale or the total is the
            developers' suggested threshold for clinically significant dissociation.
          </p>
          <p>
            Sensitive to past-week change — useful for monitoring response to trauma-focused
            treatment. Screening tool only; not diagnostic.
          </p>
        </AlertDescription>
      </Alert>

      <div className="flex gap-4 justify-end">
        <Button
          variant="outline"
          onClick={() => {
            const elevated = results.subscales
              .filter((s) => s.elevated)
              .map((s) => `${DSS_DOMAIN_LABEL[s.domain]}: ${fmt(s.mean)}`);
            const normal = results.subscales
              .filter((s) => !s.elevated)
              .map((s) => `${DSS_DOMAIN_LABEL[s.domain]}: ${fmt(s.mean)}`);
            generatePdfReport({
              assessmentName: 'Dissociative Symptoms Scale (DSS)',
              date: new Date().toLocaleDateString(),
              totalScore: `${fmt(results.totalMean)}/4 (mean)`,
              severity: SEVERITY_LABEL[results.severity],
              interpretation: results.interpretation,
              sections: [
                {
                  title: 'Elevated subscales (mean ≥ 1.0)',
                  items: elevated,
                  type: 'positive',
                },
                {
                  title: 'Subscales within normal range',
                  items: normal,
                  type: 'negative',
                },
              ],
              disclaimer:
                'Screening tool only. A subscale or total mean ≥ 1.0 is the developers\' suggested clinical threshold; diagnosis requires structured clinical evaluation.',
              patientInfo: getPatientInfoForReport(),
            });
          }}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Retake Assessment
        </Button>
      </div>
    </div>
  );
};
