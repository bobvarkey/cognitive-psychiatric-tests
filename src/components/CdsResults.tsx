import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState } from 'react';
import { ArrowLeft, RotateCcw, AlertCircle, Copy, Check, FileDown, Info, Download } from 'lucide-react';
import { CdsResult } from '@/types/cds';
import { generatePdfReport, generateTextReport, downloadTextReport } from '@/utils/reportGenerator';
import type { ReportData } from '@/utils/reportGenerator';
import { usePatientInfo } from '@/contexts/PatientInfoContext';

interface Props {
  results: CdsResult;
  onReset: () => void;
  onBack: () => void;
}

const SEVERITY_LABEL: Record<CdsResult['severity'], string> = {
  minimal: 'Below clinical cutoff',
  mild: 'Mild–moderate',
  moderate: 'Moderate–severe',
  severe: 'Severe',
};

const severityClasses = (s: CdsResult['severity']) => {
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

export const CdsResults = ({ results, onReset, onBack }: Props) => {
  const { getPatientInfoForReport } = usePatientInfo();
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold">CDS-29 Results</h2>
      </div>

      {results.severity !== 'minimal' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Above screening cutoff</AlertTitle>
          <AlertDescription>
            A total CDS score ≥ 70 has high sensitivity and specificity for depersonalisation
            disorder. Consider a structured clinical evaluation.
          </AlertDescription>
        </Alert>
      )}

      <Card className={`${severityClasses(results.severity)} border-2`}>
        <CardHeader>
          <CardTitle className="text-2xl">Total CDS Score</CardTitle>
          <CardDescription className="text-lg font-semibold">
            {SEVERITY_LABEL[results.severity]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium">Total</span>
            <span className="text-3xl font-bold">{results.totalScore} / 290</span>
          </div>
          <p className="text-sm leading-relaxed mt-3">{results.interpretation}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Frequency subtotal</CardTitle>
            <CardDescription className="text-xs">Sum of frequency ratings (0–4 each)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-600">
              {results.frequencyScore}
              <span className="text-base text-muted-foreground ml-1">/ 116</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Duration subtotal</CardTitle>
            <CardDescription className="text-xs">Sum of duration ratings (1–6 each)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {results.durationScore}
              <span className="text-base text-muted-foreground ml-1">/ 174</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Items endorsed</CardTitle>
            <CardDescription className="text-xs">Frequency ≥ 1 ("Rarely" or more)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">
              {results.itemsEndorsed}
              <span className="text-base text-muted-foreground ml-1">/ 29</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>About this scale</AlertTitle>
        <AlertDescription className="text-sm space-y-2">
          <p>
            The CDS-29 (Sierra &amp; Berrios, 2000) measures the frequency and duration of 29
            depersonalisation experiences over the past six months. Each item contributes a
            frequency score (0–4) and a duration score (1–6), summed to give a total of 0–290.
          </p>
          <p className="font-medium">
            A total score ≥ 70 has been validated as a sensitive and specific cutoff for
            depersonalisation disorder.
          </p>
          <p>This is a screening tool — not a substitute for diagnostic evaluation.</p>
        </AlertDescription>
      </Alert>

      <div className="flex gap-4 justify-end">
        <Button
          variant="outline"
          onClick={() => {
            generatePdfReport({
              assessmentName: 'Cambridge Depersonalisation Scale (CDS-29)',
              date: new Date().toLocaleDateString(),
              totalScore: `${results.totalScore}/290`,
              severity: SEVERITY_LABEL[results.severity],
              interpretation: results.interpretation,
              sections: [
                {
                  title: 'Subtotals',
                  items: [
                    `Frequency: ${results.frequencyScore}/116`,
                    `Duration: ${results.durationScore}/174`,
                    `Items endorsed: ${results.itemsEndorsed}/29`,
                  ],
                  type: 'positive',
                },
              ],
              disclaimer:
                'Screening tool only. A score ≥70 is the suggested clinical cutoff. Diagnosis requires structured clinical evaluation.',
              patientInfo: getPatientInfoForReport(),
            });
          }}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            try {
              const text = generateTextReport({
                assessmentName: 'Cambridge Depersonalisation Scale (CDS-29)',
                date: new Date().toLocaleDateString(),
                totalScore: `${results.totalScore}/290`,
                severity: SEVERITY_LABEL[results.severity],
                interpretation: results.interpretation,
                sections: [
                  {
                    title: 'Subtotals',
                    items: [
                      `Frequency: ${results.frequencyScore}/116`,
                      `Duration: ${results.durationScore}/174`,
                      `Items endorsed: ${results.itemsEndorsed}/29`,
                    ],
                    type: 'positive',
                  },
                ],
                disclaimer:
                  'Screening tool only. A score ≥70 is the suggested clinical cutoff. Diagnosis requires structured clinical evaluation.',
                patientInfo: getPatientInfoForReport(),
              });
              await navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {}
          }}
          className="flex items-center gap-1.5"
        >
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy Text'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadTextReport({
            assessmentName: 'Cambridge Depersonalisation Scale (CDS-29)',
            date: new Date().toLocaleDateString(),
            totalScore: `${results.totalScore}/290`,
            severity: SEVERITY_LABEL[results.severity],
            interpretation: results.interpretation,
            sections: [{
              title: 'Subtotals',
              items: [
                `Frequency: ${results.frequencyScore}/116`,
                `Duration: ${results.durationScore}/174`,
                `Items endorsed: ${results.itemsEndorsed}/29`,
              ],
              type: 'positive',
            }],
            disclaimer: 'Screening tool only. A score ≥70 is the suggested clinical cutoff. Diagnosis requires structured clinical evaluation.',
            patientInfo: getPatientInfoForReport(),
          })}
          className="flex items-center gap-1.5"
        >
          <Download className="h-4 w-4" />
          Download .txt
        </Button>
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Retake Assessment
        </Button>
      </div>
    </div>
  );
};
