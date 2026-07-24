import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HamaResult } from '@/types/hama';
import { HAMA_ITEMS, HAMA_OPTIONS } from '@/data/hamaScale';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, ArrowLeft, RotateCcw, Copy, Check, FileDown, Download } from 'lucide-react';
import { generatePdfReport, generateTextReport, downloadTextReport } from '@/utils/reportGenerator';
import { usePatientInfo } from '@/contexts/PatientInfoContext';

interface HamaResultsProps {
  result: HamaResult;
  onReset: () => void;
  onBack?: () => void;
}

const severityLabel = (s: HamaResult['severity']) => {
  switch (s) {
    case 'none': return 'No / minimal anxiety';
    case 'mild': return 'Mild anxiety';
    case 'moderate': return 'Moderate anxiety';
    case 'severe': return 'Severe anxiety';
  }
};

export const HamaResults = ({ result, onReset, onBack }: HamaResultsProps) => {
  const { t } = useLanguage();
  const { getPatientInfoForReport } = usePatientInfo();
  const [copied, setCopied] = useState(false);

  const getSeverityIcon = () => {
    switch (result.severity) {
      case 'none': return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'mild': return <AlertCircle className="h-8 w-8 text-blue-600" />;
      case 'moderate': return <AlertTriangle className="h-8 w-8 text-amber-600" />;
      case 'severe': return <AlertCircle className="h-8 w-8 text-red-600" />;
    }
  };

  const getSeverityColor = () => {
    switch (result.severity) {
      case 'none': return 'bg-green-50 border-green-200';
      case 'mild': return 'bg-blue-50 border-blue-200';
      case 'moderate': return 'bg-amber-50 border-amber-200';
      case 'severe': return 'bg-red-50 border-red-200';
    }
  };

  const buildReport = () => {
    const positiveFindings: string[] = [];
    const negativeFindings: string[] = [];
    result.responses.forEach(r => {
      const item = HAMA_ITEMS.find(i => i.id === r.itemId);
      if (!item) return;
      if (r.score > 0) {
        positiveFindings.push(`${item.title} — ${HAMA_OPTIONS[r.score]} (Score: ${r.score}/4)`);
      } else {
        negativeFindings.push(`${item.title} (Score: 0)`);
      }
    });
    const answeredIds = result.responses.map(r => r.itemId);
    const notAssessed = HAMA_ITEMS.filter(i => !answeredIds.includes(i.id)).map(i => i.title);
    return {
      assessmentName: 'Hamilton Anxiety Rating Scale (HAM-A)',
      date: new Date().toLocaleDateString(),
      totalScore: `${result.totalScore}/56`,
      severity: severityLabel(result.severity)!,
      interpretation: result.interpretation,
      sections: [
        { title: 'Positive Findings (Symptoms Present)', items: positiveFindings, type: 'positive' as const },
        { title: 'Negative Findings (Symptoms Absent)', items: negativeFindings, type: 'negative' as const },
        { title: 'Items Not Assessed', items: notAssessed, type: 'not-assessed' as const },
      ],
      disclaimer: 'The HAM-A is a clinician-rated scale. Scores should be interpreted in the context of a comprehensive clinical assessment.',
      patientInfo: getPatientInfoForReport(),
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToMenu')}
          </Button>
        )}

        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <CardTitle className="text-2xl">HAM-A Assessment Results</CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className={`p-6 rounded-lg border-2 ${getSeverityColor()} flex items-start gap-4`}>
              {getSeverityIcon()}
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  {t('totalScore')}: {result.totalScore}/56
                </h3>
                <p className="text-slate-700">{result.interpretation}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg">
              <h4 className="font-bold text-slate-800 mb-3">{t('scoringGuide')}:</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2"><span className="font-semibold text-green-700">0–7:</span><span>No / minimal anxiety</span></li>
                <li className="flex items-start gap-2"><span className="font-semibold text-blue-700">8–14:</span><span>Mild anxiety</span></li>
                <li className="flex items-start gap-2"><span className="font-semibold text-amber-700">15–23:</span><span>Moderate anxiety</span></li>
                <li className="flex items-start gap-2"><span className="font-semibold text-red-700">≥24:</span><span>Severe anxiety</span></li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-900">
                <strong>{t('note')}:</strong> The HAM-A is a clinician-rated scale. Scores should be interpreted in the context of a comprehensive clinical assessment.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={onReset} variant="outline" className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                {t('retakeAssessment')}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => generatePdfReport(buildReport())}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    const text = generateTextReport(buildReport());
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
                onClick={() => downloadTextReport(buildReport())}
                className="flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" />
                Download .txt
              {onBack && (
                <Button onClick={onBack} variant="default" className="flex-1">
                  {t('backToMenu')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
