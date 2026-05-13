import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { HareResults as HareResultsType } from '@/types/hare';
import { AlertTriangle, FileText, RotateCcw, Printer } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExportButtons } from '@/components/ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

interface HareResultsProps {
  results: HareResultsType;
  onReset: () => void;
}

export const HareResults = ({ results, onReset }: HareResultsProps) => {
  const { t } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  const reportData: ReportData = useMemo(() => ({
    assessmentName: 'PCL-R Assessment (Hare Psychopathy Checklist)',
    date: new Date().toLocaleDateString(),
    totalScore: `${results.totalScore}/40`,
    interpretation: results.interpretation,
    severity: results.totalScore >= 30 ? 'High' : results.totalScore >= 20 ? 'Moderate' : 'Low',
    sections: [
      {
        title: 'Factor 1: Interpersonal/Affective',
        items: [`Score: ${results.factor1Score}/16 - Measures emotional and interpersonal traits`],
        type: 'info',
      },
      {
        title: 'Factor 2: Lifestyle/Antisocial',
        items: [`Score: ${results.factor2Score}/24 - Measures behavioral and lifestyle patterns`],
        type: 'info',
      },
      {
        title: 'Score Interpretation Guide',
        items: ['0-19: Low range - Traits are minimal or not clinically significant', '20-29: Moderate range - Some traits present, further evaluation may be warranted', '30-40: High range - Significant traits present, professional evaluation strongly recommended'],
        type: 'info',
      },
    ],
    disclaimer: 'This assessment is for educational purposes only. A clinical diagnosis requires professional evaluation by a qualified mental health professional with additional information including clinical interviews and collateral data.',
  }), [results]);

  const getSeverityColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage < 50) return 'text-green-600';
    if (percentage < 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityBgColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage < 50) return 'bg-green-100';
    if (percentage < 75) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center print:hidden">
          <h1 className="text-3xl font-bold text-slate-800">
            {t('assessmentResults') || 'Assessment Results'}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              {t('print') || 'Print'}
            </Button>
            <Button variant="outline" onClick={onReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('newAssessment') || 'New Assessment'}
            </Button>
            <ExportButtons data={reportData} />
          </div>
        </div>

        {/* Warning Banner */}
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">Professional Disclaimer</p>
                <p>
                  This assessment is for educational purposes only. A clinical diagnosis requires professional 
                  evaluation by a qualified mental health professional with additional information including 
                  clinical interviews and collateral data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Score */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-orange-500 to-red-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <FileText className="h-8 w-8" />
              PCL-R Assessment Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">
                  {results.totalScore}/40
                </div>
                <div className="text-xl text-orange-100">
                  {t('totalScore') || 'Total Score'}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-slate-800">
              <h3 className="font-semibold mb-2">{t('interpretation') || 'Interpretation'}:</h3>
              <p className="text-sm">{results.interpretation}</p>
            </div>
          </CardContent>
        </Card>

        {/* Factor Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Factor 1 */}
          <Card className={`shadow-lg ${getSeverityBgColor(results.factor1Score, 16)}`}>
            <CardHeader>
              <CardTitle className="text-lg">
                Factor 1: Interpersonal/Affective
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`text-5xl font-bold ${getSeverityColor(results.factor1Score, 16)}`}>
                  {results.factor1Score}/16
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  Measures emotional and interpersonal traits
                </p>
              </div>
              <Progress 
                value={(results.factor1Score / 16) * 100} 
                className="h-3"
              />
            </CardContent>
          </Card>

          {/* Factor 2 */}
          <Card className={`shadow-lg ${getSeverityBgColor(results.factor2Score, 24)}`}>
            <CardHeader>
              <CardTitle className="text-lg">
                Factor 2: Lifestyle/Antisocial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`text-5xl font-bold ${getSeverityColor(results.factor2Score, 24)}`}>
                  {results.factor2Score}/24
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  Measures behavioral and lifestyle patterns
                </p>
              </div>
              <Progress 
                value={(results.factor2Score / 24) * 100} 
                className="h-3"
              />
            </CardContent>
          </Card>
        </div>

        {/* Score Interpretation Guide */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t('scoreInterpretationGuide') || 'Score Interpretation Guide'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex gap-4">
                <div className="w-24 font-semibold text-green-700">0-19:</div>
                <div className="flex-1">Low range - Traits are minimal or not clinically significant</div>
              </div>
              <div className="flex gap-4">
                <div className="w-24 font-semibold text-yellow-700">20-29:</div>
                <div className="flex-1">Moderate range - Some traits present, further evaluation may be warranted</div>
              </div>
              <div className="flex gap-4">
                <div className="w-24 font-semibold text-red-700">30-40:</div>
                <div className="flex-1">High range - Significant traits present, professional evaluation strongly recommended</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clinical Notes */}
        <Card className="shadow-lg border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">
              {t('clinicalNotes') || 'Clinical Notes'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-blue-900">
            <p>
              • The PCL-R is a clinical tool that requires professional training for accurate administration and interpretation
            </p>
            <p>
              • A score of 30 or above is typically considered indicative of psychopathy in North American populations
            </p>
            <p>
              • Different cutoff scores may be used in different contexts (forensic vs. clinical) and populations
            </p>
            <p>
              • This self-report version lacks the clinical interview and collateral information that are essential for valid assessment
            </p>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-slate-500 print:hidden">
          {t('assessmentDate') || 'Assessment Date'}: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
