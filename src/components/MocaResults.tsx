import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { MocaResults as MocaResultsType } from '@/types/moca';
import { MOCA_DOMAIN_MAX_SCORES } from '@/types/moca';
import { RotateCcw, Download, Calculator } from 'lucide-react';
import { DomainRadarChart } from './DomainRadarChart';

interface MocaResultsProps {
  results: MocaResultsType;
  patientInfo: {
    name: string;
    sex: string;
    education: string;
  };
  onRestart: () => void;
}

export const MocaResults = ({ results, patientInfo, onRestart }: MocaResultsProps) => {
  const { t } = useLanguage();

  const getDomainInterpretation = (domain: string, score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return t('withinNormalLimits');
    if (percentage >= 60) return t('mildImpairment');
    if (percentage >= 40) return t('moderateImpairment');
    return t('severeImpairment');
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (percentage >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const printResults = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8 print:mb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-8 w-8 text-green-600 print:hidden" />
            <h1 className="text-3xl font-bold text-slate-800 print:text-2xl">
              {t('mocaResults')}
            </h1>
          </div>
        </div>

        {/* Patient Information */}
        <Card className="shadow-lg border-0 print:shadow-none print:border">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg print:bg-white print:text-black print:border-b">
            <CardTitle>{t('patientInformation')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 print:p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold">{t('patientName')}:</span>
                <p className="text-slate-600">{patientInfo.name}</p>
              </div>
              <div>
                <span className="font-semibold">{t('sex')}:</span>
                <p className="text-slate-600">{patientInfo.sex}</p>
              </div>
              <div>
                <span className="font-semibold">{t('education')}:</span>
                <p className="text-slate-600">{patientInfo.education} {t('years')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Score */}
        <Card className="shadow-lg border-0 print:shadow-none print:border">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg print:bg-white print:text-black print:border-b">
            <CardTitle>{t('overallScore')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 print:p-4">
            <div className="text-center space-y-4">
              <div className="flex justify-center items-center gap-4 flex-wrap">
                <div className={`px-6 py-3 rounded-lg border-2 ${getScoreColor(results.finalScore, 30)}`}>
                  <div className="text-3xl font-bold">{results.finalScore}/30</div>
                  <div className="text-sm font-medium">{t('totalScore')}</div>
                </div>
                {results.educationAdjusted && (
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    +1 {t('educationAdjustment')}
                  </Badge>
                )}
              </div>
              <div className="text-lg font-semibold text-slate-700">
                {results.interpretation}
              </div>
              <div className="text-sm text-slate-600">
                {t('normalCutoff')}: ≥26/30
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Domain Radar Chart */}
        <DomainRadarChart
          title={t('domainScores') + ' — Overview'}
          data={Object.entries(results.domainScores).map(([domain, score]) => ({
            domain: t(domain),
            score,
            maxScore: MOCA_DOMAIN_MAX_SCORES[domain as keyof typeof MOCA_DOMAIN_MAX_SCORES],
            fullMark: 100,
          }))}
        />

        {/* Domain Scores */}
        <Card className="shadow-lg border-0 print:shadow-none print:border">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg print:bg-white print:text-black print:border-b">
            <CardTitle>{t('domainScores')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 print:p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(results.domainScores).map(([domain, score]) => {
                const maxScore = MOCA_DOMAIN_MAX_SCORES[domain as keyof typeof MOCA_DOMAIN_MAX_SCORES];
                const interpretation = getDomainInterpretation(domain, score, maxScore);
                
                return (
                  <div key={domain} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg print:bg-white print:border">
                    <div>
                      <div className="font-semibold text-slate-800">
                        {t(domain)}
                      </div>
                      <div className="text-sm text-slate-600">
                        {interpretation}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(score, maxScore)}`}>
                      {score}/{maxScore}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Clinical Notes */}
        <Card className="shadow-lg border-0 print:shadow-none print:border">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg print:bg-white print:text-black print:border-b">
            <CardTitle>{t('clinicalNotes')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 print:p-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-slate-700">
                {t('mocaClinicalNote1')}
              </p>
              <p className="text-slate-700 mt-3">
                {t('mocaClinicalNote2')}
              </p>
              <p className="text-slate-700 mt-3">
                <strong>{t('recommendation')}:</strong> {t('mocaRecommendation')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-6 print:hidden">
          <Button onClick={onRestart} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            {t('newAssessment')}
          </Button>
          <Button onClick={printResults} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {t('printResults')}
          </Button>
        </div>
      </div>
    </div>
  );
};