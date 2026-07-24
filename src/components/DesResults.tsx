import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState } from 'react';
import { ArrowLeft, RotateCcw, AlertCircle, Copy, Check, FileDown, Info, Download } from 'lucide-react';
import { DesResult } from '@/types/des';
import { generatePdfReport, generateTextReport, downloadTextReport } from '@/utils/reportGenerator';
import type { ReportData } from '@/utils/reportGenerator';
import { usePatientInfo } from '@/contexts/PatientInfoContext';

interface Props {
  results: DesResult;
  onReset: () => void;
  onBack: () => void;
}

const SEVERITY_LABEL: Record<DesResult['severity'], string> = {
  minimal: 'Low (non-clinical range)',
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'High — possible dissociative disorder',
};

const severityClasses = (s: DesResult['severity']) => {
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

const fmt = (n: number) => n.toFixed(1);

export const DesResults = ({ results, onReset, onBack }: Props) => {
  const { getPatientInfoForReport } = usePatientInfo();
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold">DES-II Results</h2>
      </div>

      {results.severity === 'severe' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Above standard cutoff (≥ 30)</AlertTitle>
          <AlertDescription>
            A mean DES score ≥ 30 is the conventional screening threshold for possible dissociative
            disorder. Structured clinical interview (e.g. SCID-D) is recommended.
          </AlertDescription>
        </Alert>
      )}

      <Card className={`${severityClasses(results.severity)} border-2`}>
        <CardHeader>
          <CardTitle className="text-2xl">DES-II Mean Score</CardTitle>
          <CardDescription className="text-lg font-semibold">
            {SEVERITY_LABEL[results.severity]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium">Mean of 28 items</span>
            <span className="text-3xl font-bold">{fmt(results.totalMean)} / 100</span>
          </div>
          <p className="text-sm leading-relaxed mt-3">{results.interpretation}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total DES mean</CardTitle>
            <CardDescription className="text-xs">All 28 items averaged</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-violet-600">
              {fmt(results.totalMean)}
              <span className="text-base text-muted-foreground ml-1">/ 100</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">DES-T (taxon) mean</CardTitle>
            <CardDescription className="text-xs">
              Items 3, 5, 7, 8, 12, 13, 22, 27 — pathological dissociation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600">
              {fmt(results.taxonMean)}
              <span className="text-base text-muted-foreground ml-1">/ 100</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Interpretation guide</AlertTitle>
        <AlertDescription className="text-sm space-y-2">
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>&lt; 10</strong> — typical for the general population.
            </li>
            <li>
              <strong>10–19</strong> — mild dissociative experiences; common in clinical samples.
            </li>
            <li>
              <strong>20–29</strong> — moderate; suggests further evaluation for trauma-related or
              dissociative disorders.
            </li>
            <li>
              <strong>≥ 30</strong> — standard screening cutoff for possible dissociative
              disorder, including DID.
            </li>
          </ul>
          <p className="pt-1">
            DES-T mean ≥ 20 is sometimes used as an additional indicator of pathological
            dissociation. Screening tool only — not a diagnosis.
          </p>
        </AlertDescription>
      </Alert>

      <div className="flex gap-4 justify-end">
        <Button
          variant="outline"
          onClick={() => {
            generatePdfReport({
              assessmentName: 'Dissociative Experiences Scale (DES-II)',
              date: new Date().toLocaleDateString(),
              totalScore: `${fmt(results.totalMean)}/100 (mean)`,
              severity: SEVERITY_LABEL[results.severity],
              interpretation: results.interpretation,
              sections: [
                {
                  title: 'Subscales',
                  items: [
                    `Total DES mean: ${fmt(results.totalMean)}/100`,
                    `DES-T (taxon) mean: ${fmt(results.taxonMean)}/100`,
                    `Items completed: ${results.itemsScored}/28`,
                  ],
                  type: 'positive',
                },
              ],
              disclaimer:
                'Screening tool only. A mean score ≥30 suggests possible dissociative disorder; confirm with structured interview (e.g. SCID-D).',
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
                assessmentName: 'Dissociative Experiences Scale (DES-II)',
                date: new Date().toLocaleDateString(),
                totalScore: `${fmt(results.totalMean)}/100 (mean)`,
                severity: SEVERITY_LABEL[results.severity],
                interpretation: results.interpretation,
                sections: [
                  {
                    title: 'Subscales',
                    items: [
                      `Total DES mean: ${fmt(results.totalMean)}/100`,
                      `DES-T (taxon) mean: ${fmt(results.taxonMean)}/100`,
                      `Items completed: ${results.itemsScored}/28`,
                    ],
                    type: 'positive',
                  },
                ],
                disclaimer:
                  'Screening tool only. A mean score ≥30 suggests possible dissociative disorder; confirm with structured interview (e.g. SCID-D).',
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
          onClick={() => {
            downloadTextReport({
              assessmentName: 'Dissociative Experiences Scale (DES-II)',
              date: new Date().toLocaleDateString(),
              totalScore: `${fmt(results.totalMean)}/100 (mean)`,
              severity: SEVERITY_LABEL[results.severity],
              interpretation: results.interpretation,
              sections: [{
                title: 'Subscales',
                items: [
                  `Total DES mean: ${fmt(results.totalMean)}/100`,
                  `DES-T (taxon) mean: ${fmt(results.taxonMean)}/100`,
                  `Items completed: ${results.itemsScored}/28`,
                ],
                type: 'positive',
              }],
              disclaimer: 'Screening tool only. A mean score ≥30 suggests possible dissociative disorder; confirm with structured interview (e.g. SCID-D).',
              patientInfo: getPatientInfoForReport(),
            });
          }}
          className="flex items-center gap-1.5"
        >
          <Download className="h-4 w-4" />
          Download .txt
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Retake Assessment
        </Button>
      </div>
    </div>
  );
};
