import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HamdResult } from '@/types/hamd';
import { HAMD_ITEMS } from '@/data/hamdScale';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, ArrowLeft, RotateCcw, Copy, Check, FileDown } from 'lucide-react';
import { generatePdfReport, generateTextReport } from '@/utils/reportGenerator';
import type { ReportData } from '@/utils/reportGenerator';
import { usePatientInfo } from '@/contexts/PatientInfoContext';

interface HamdResultsProps {
  result: HamdResult;
  onReset: () => void;
  onBack?: () => void;
}

export const HamdResults = ({ result, onReset, onBack }: HamdResultsProps) => {
  const { t } = useLanguage();
  const { getPatientInfoForReport } = usePatientInfo();
  const [copied, setCopied] = useState(false);

  const getSeverityIcon = () => {
    switch (result.severity) {
      case 'normal':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'mild':
        return <AlertCircle className="h-8 w-8 text-blue-600" />;
      case 'moderate':
        return <AlertTriangle className="h-8 w-8 text-amber-600" />;
      case 'severe':
        return <AlertCircle className="h-8 w-8 text-orange-600" />;
      case 'very-severe':
        return <AlertCircle className="h-8 w-8 text-red-600" />;
    }
  };

  const getSeverityColor = () => {
    switch (result.severity) {
      case 'normal':
        return 'bg-green-50 border-green-200';
      case 'mild':
        return 'bg-blue-50 border-blue-200';
      case 'moderate':
        return 'bg-amber-50 border-amber-200';
      case 'severe':
        return 'bg-orange-50 border-orange-200';
      case 'very-severe':
        return 'bg-red-50 border-red-200';
    }
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
            <CardTitle className="text-2xl">{t('hamdResults')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className={`p-6 rounded-lg border-2 ${getSeverityColor()} flex items-start gap-4`}>
              {getSeverityIcon()}
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  {t('totalScore')}: {result.totalScore}/52
                </h3>
                <p className="text-slate-700">{result.interpretation}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg">
              <h4 className="font-bold text-slate-800 mb-3">{t('scoringGuide')}:</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-green-700">0-7:</span>
                  <span>{t('hamdNormal')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-blue-700">8-13:</span>
                  <span>{t('hamdMild')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-amber-700">14-18:</span>
                  <span>{t('hamdModerate')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-orange-700">19-22:</span>
                  <span>{t('hamdSevere')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-red-700">≥23:</span>
                  <span>{t('hamdVerySevere')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-900">
                <strong>{t('note')}:</strong> {t('hamdNote')}
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={onReset} variant="outline" className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                {t('retakeAssessment')}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  const positiveFindings: string[] = [];
                  const negativeFindings: string[] = [];
                  result.responses.forEach(r => {
                    const item = HAMD_ITEMS.find(i => i.id === r.itemId);
                    if (!item) return;
                    if (r.score > 0) {
                      positiveFindings.push(`${item.question} — ${item.options[r.score]} (Score: ${r.score}/${item.maxScore})`);
                    } else {
                      negativeFindings.push(`${item.question} (Score: 0)`);
                    }
                  });
                  const answeredIds = result.responses.map(r => r.itemId);
                  const notAssessed = HAMD_ITEMS.filter(i => !answeredIds.includes(i.id)).map(i => i.question);
                  generatePdfReport({
                    assessmentName: 'Hamilton Depression Rating Scale (HAM-D)',
                    date: new Date().toLocaleDateString(),
                    totalScore: `${result.totalScore}/52`,
                    severity: result.severity === 'normal' ? 'Normal' : result.severity === 'mild' ? 'Mild Depression' : result.severity === 'moderate' ? 'Moderate Depression' : result.severity === 'severe' ? 'Severe Depression' : 'Very Severe Depression',
                    interpretation: result.interpretation,
                    sections: [
                      { title: 'Positive Findings (Symptoms Present)', items: positiveFindings, type: 'positive' },
                      { title: 'Negative Findings (Symptoms Absent)', items: negativeFindings, type: 'negative' },
                      { title: 'Items Not Assessed', items: notAssessed, type: 'not-assessed' },
                    ],
                    disclaimer: 'The HAM-D is a clinician-rated scale. Scores should be interpreted in the context of a comprehensive clinical assessment.',
                    patientInfo: getPatientInfoForReport(),
                  });
                }}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    const positiveFindings: string[] = [];
                    const negativeFindings: string[] = [];
                    result.responses.forEach(r => {
                      const item = HAMD_ITEMS.find(i => i.id === r.itemId);
                      if (!item) return;
                      if (r.score > 0) {
                        positiveFindings.push(`${item.question} — ${item.options[r.score]} (Score: ${r.score}/${item.maxScore})`);
                      } else {
                        negativeFindings.push(`${item.question} (Score: 0)`);
                      }
                    });
                    const answeredIds = result.responses.map(r => r.itemId);
                    const notAssessed = HAMD_ITEMS.filter(i => !answeredIds.includes(i.id)).map(i => i.question);
                    const text = generateTextReport({
                      assessmentName: 'Hamilton Depression Rating Scale (HAM-D)',
                      date: new Date().toLocaleDateString(),
                      totalScore: `${result.totalScore}/52`,
                      severity: result.severity === 'normal' ? 'Normal' : result.severity === 'mild' ? 'Mild Depression' : result.severity === 'moderate' ? 'Moderate Depression' : result.severity === 'severe' ? 'Severe Depression' : 'Very Severe Depression',
                      interpretation: result.interpretation,
                      sections: [
                        { title: 'Positive Findings (Symptoms Present)', items: positiveFindings, type: 'positive' },
                        { title: 'Negative Findings (Symptoms Absent)', items: negativeFindings, type: 'negative' },
                        { title: 'Items Not Assessed', items: notAssessed, type: 'not-assessed' },
                      ],
                      disclaimer: 'The HAM-D is a clinician-rated scale. Scores should be interpreted in the context of a comprehensive clinical assessment.',
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
