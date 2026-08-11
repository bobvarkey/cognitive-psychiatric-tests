import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StressScreeningResult } from '@/types/stressScreening';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { AlertCircle, CheckCircle, AlertTriangle, ArrowLeft, RotateCcw, Copy, Check, FileDown, Download } from 'lucide-react';
import { CATEGORY_LABELS } from '@/data/stressScreeningScale';
import { generatePdfReport, generateTextReport, downloadTextReport } from '@/utils/reportGenerator';
import { usePatientInfo } from '@/contexts/PatientInfoContext';

interface StressScreeningResultsProps {
  result: StressScreeningResult;
  onReset: () => void;
  onBack?: () => void;
}

export const StressScreeningResults = ({ result, onReset, onBack }: StressScreeningResultsProps) => {
  const { language, t } = useLanguage();
  const { getPatientInfoForReport } = usePatientInfo();
  const [copied, setCopied] = useState(false);

  const getLikelihoodIcon = () => {
    switch (result.likelihood) {
      case 'low':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'moderate':
        return <AlertTriangle className="h-8 w-8 text-amber-600" />;
      case 'high':
        return <AlertCircle className="h-8 w-8 text-red-600" />;
    }
  };

  const getLikelihoodColor = () => {
    switch (result.likelihood) {
      case 'low':
        return 'bg-green-50 border-green-200';
      case 'moderate':
        return 'bg-amber-50 border-amber-200';
      case 'high':
        return 'bg-red-50 border-red-200';
    }
  };

  const getLikelihoodLabel = () => {
    switch (result.likelihood) {
      case 'low':
        return language === 'ml' ? 'കുറഞ്ഞ സാധ്യത' : 'Low Likelihood';
      case 'moderate':
        return language === 'ml' ? 'മിതമായ സാധ്യത' : 'Moderate Likelihood';
      case 'high':
        return language === 'ml' ? 'ഉയർന്ന സാധ്യത' : 'High Likelihood';
    }
  };

  const hasRedFlags = Object.keys(result.redFlagsByCategory).some(
    cat => result.redFlagsByCategory[cat].length > 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-4 md:p-8">
      <LanguageToggle />
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToMenu')}
          </Button>
        )}

        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
            <CardTitle className="text-2xl">
              {language === 'ml' ? 'സ്ട്രെസ് vs മാനസികാരോഗ്യ സ്ക്രീനിംഗ് ഫലങ്ങൾ' : 'Stress vs Mental Disorder Screening Results'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            {/* Main Result */}
            <div className={`p-6 rounded-lg border-2 ${getLikelihoodColor()} flex items-start gap-4`}>
              {getLikelihoodIcon()}
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  {getLikelihoodLabel()} - {result.totalRedFlags} {language === 'ml' ? 'റെഡ് ഫ്ലാഗുകൾ' : 'Red Flags'}
                </h3>
                <p className="text-slate-700">
                  {language === 'ml' ? result.interpretationMl : result.interpretation}
                </p>
              </div>
            </div>

            {/* Red Flags by Category */}
            {hasRedFlags && (
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-slate-800">
                  {language === 'ml' ? 'കണ്ടെത്തിയ റെഡ് ഫ്ലാഗുകൾ' : 'Identified Red Flags'}
                </h4>
                {Object.entries(result.redFlagsByCategory).map(([category, flags]) => {
                  if (flags.length === 0) return null;
                  const label = CATEGORY_LABELS[category];
                  return (
                    <div key={category} className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h5 className="font-semibold text-red-800 mb-2">
                        {language === 'ml' ? label.ml : label.en}
                      </h5>
                      <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                        {flags.map((flag, idx) => (
                          <li key={idx}>{flag}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-violet-50 p-6 rounded-lg border border-violet-200">
              <h4 className="font-bold text-violet-800 mb-3">
                {language === 'ml' ? 'ശുപാർശകൾ' : 'Recommendations'}
              </h4>
              <ul className="space-y-2 text-sm text-violet-700">
                {(language === 'ml' ? result.recommendationsMl : result.recommendations).map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold">{idx + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Scoring Guide */}
            <div className="bg-slate-50 p-6 rounded-lg">
              <h4 className="font-bold text-slate-800 mb-3">
                {language === 'ml' ? 'വ്യാഖ്യാന മാർഗ്ഗദർശി' : 'Interpretation Guide'}
              </h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-green-700">0-2 {language === 'ml' ? 'റെഡ് ഫ്ലാഗുകൾ' : 'red flags'}:</span>
                  <span>{language === 'ml' ? 'സാധാരണ സ്ട്രെസ് പ്രതികരണത്തിന് അനുയോജ്യം' : 'Consistent with normal stress reaction'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-amber-700">3-5 {language === 'ml' ? 'റെഡ് ഫ്ലാഗുകൾ' : 'red flags'}:</span>
                  <span>{language === 'ml' ? 'കൂടുതൽ വിലയിരുത്തൽ ആവശ്യം' : 'Further evaluation warranted'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-red-700">≥6 {language === 'ml' ? 'റെഡ് ഫ്ലാഗുകൾ' : 'red flags'}:</span>
                  <span>{language === 'ml' ? 'മാനസിക വൈകല്യം സൂചിപ്പിക്കുന്നു' : 'Suggestive of mental disorder'}</span>
                </li>
              </ul>
            </div>

            {/* Clinical Note */}
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <p className="text-sm text-purple-900">
                <strong>{language === 'ml' ? 'കുറിപ്പ്' : 'Note'}:</strong>{' '}
                {language === 'ml' 
                  ? 'ഇത് ഒരു സ്ക്രീനിംഗ് ടൂളാണ്, ഡയഗ്നോസ്റ്റിക് ഉപകരണമല്ല. ക്ലിനിക്കൽ വിധിന്യായവും സമഗ്ര വിലയിരുത്തലും രോഗനിർണയത്തിന് അത്യാവശ്യമാണ്.'
                  : 'This is a screening tool, not a diagnostic instrument. Clinical judgment and comprehensive evaluation are essential for diagnosis.'}
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={onReset} variant="outline" className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                {t('retakeAssessment')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    const positiveFindings: string[] = [];
                    Object.entries(result.redFlagsByCategory).forEach(([cat, flags]) => {
                      const label = CATEGORY_LABELS[cat];
                      flags.forEach(f => positiveFindings.push(`[${language === 'ml' ? label.ml : label.en}] ${f}`));
                    });
                    const text = generateTextReport({
                      assessmentName: 'Stress vs Mental Disorder Screening',
                      date: new Date().toLocaleDateString(),
                      totalScore: `${result.totalRedFlags} Red Flags`,
                      severity: result.likelihood === 'low' ? 'Low Likelihood' : result.likelihood === 'moderate' ? 'Moderate Likelihood' : 'High Likelihood',
                      interpretation: language === 'ml' ? result.interpretationMl : result.interpretation,
                      sections: [
                        { title: 'Positive Findings (Red Flags Identified)', items: positiveFindings, type: 'positive' },
                        { title: 'Recommendations', items: language === 'ml' ? result.recommendationsMl : result.recommendations, type: 'info' },
                      ],
                      disclaimer: 'This is a screening tool, not a diagnostic instrument.',
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
                  const positiveFindings: string[] = [];
                  Object.entries(result.redFlagsByCategory).forEach(([cat, flags]) => {
                    const label = CATEGORY_LABELS[cat];
                    flags.forEach(f => positiveFindings.push(`[${language === 'ml' ? label.ml : label.en}] ${f}`));
                  });
                  downloadTextReport({
                    assessmentName: 'Stress vs Mental Disorder Screening',
                    date: new Date().toLocaleDateString(),
                    totalScore: `${result.totalRedFlags} Red Flags`,
                    severity: result.likelihood === 'low' ? 'Low Likelihood' : result.likelihood === 'moderate' ? 'Moderate Likelihood' : 'High Likelihood',
                    interpretation: language === 'ml' ? result.interpretationMl : result.interpretation,
                    sections: [
                      { title: 'Positive Findings (Red Flags Identified)', items: positiveFindings, type: 'positive' },
                      { title: 'Recommendations', items: language === 'ml' ? result.recommendationsMl : result.recommendations, type: 'info' },
                    ],
                    disclaimer: 'This is a screening tool, not a diagnostic instrument.',
                    patientInfo: getPatientInfoForReport(),
                  });
                }}
                className="flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" />
                Download .txt
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  const positiveFindings: string[] = [];
                  Object.entries(result.redFlagsByCategory).forEach(([cat, flags]) => {
                    const label = CATEGORY_LABELS[cat];
                    flags.forEach(f => positiveFindings.push(`[${language === 'ml' ? label.ml : label.en}] ${f}`));
                  });
                  generatePdfReport({
                    assessmentName: 'Stress vs Mental Disorder Screening',
                    date: new Date().toLocaleDateString(),
                    totalScore: `${result.totalRedFlags} Red Flags`,
                    severity: result.likelihood === 'low' ? 'Low Likelihood' : result.likelihood === 'moderate' ? 'Moderate Likelihood' : 'High Likelihood',
                    interpretation: language === 'ml' ? result.interpretationMl : result.interpretation,
                    sections: [
                      { title: 'Positive Findings (Red Flags Identified)', items: positiveFindings, type: 'positive' },
                      { title: 'Recommendations', items: language === 'ml' ? result.recommendationsMl : result.recommendations, type: 'info' },
                    ],
                    disclaimer: 'This is a screening tool, not a diagnostic instrument. Clinical judgment and comprehensive evaluation are essential for diagnosis.',
                    patientInfo: getPatientInfoForReport(),
                  });
                }}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export PDF
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
