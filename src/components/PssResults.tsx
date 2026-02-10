import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PssResult } from '@/types/pss';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { AlertCircle, CheckCircle, AlertTriangle, ArrowLeft, RotateCcw } from 'lucide-react';

interface PssResultsProps {
  result: PssResult;
  onReset: () => void;
  onBack?: () => void;
}

export const PssResults = ({ result, onReset, onBack }: PssResultsProps) => {
  const { t } = useLanguage();

  const getSeverityIcon = () => {
    switch (result.severity) {
      case 'low':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'moderate':
        return <AlertTriangle className="h-8 w-8 text-amber-600" />;
      case 'high':
        return <AlertCircle className="h-8 w-8 text-red-600" />;
    }
  };

  const getSeverityColor = () => {
    switch (result.severity) {
      case 'low':
        return 'bg-green-50 border-green-200';
      case 'moderate':
        return 'bg-amber-50 border-amber-200';
      case 'high':
        return 'bg-red-50 border-red-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-8">
      <LanguageToggle />
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToMenu')}
          </Button>
        )}

        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
            <CardTitle className="text-2xl">{t('pssResults')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className={`p-6 rounded-lg border-2 ${getSeverityColor()} flex items-start gap-4`}>
              {getSeverityIcon()}
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  {t('totalScore')}: {result.totalScore}/40
                </h3>
                <p className="text-slate-700">{result.interpretation}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg">
              <h4 className="font-bold text-slate-800 mb-3">{t('scoringGuide')}:</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-green-700">0-13:</span>
                  <span>{t('pssLow')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-amber-700">14-26:</span>
                  <span>{t('pssModerate')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-red-700">27-40:</span>
                  <span>{t('pssHigh')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded">
              <p className="text-sm text-emerald-900">
                <strong>{t('note')}:</strong> {t('pssNote')}
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={onReset} variant="outline" className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                {t('retakeAssessment')}
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
