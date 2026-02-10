import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MsiBpdResult } from '@/types/msibpd';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertCircle, CheckCircle, ArrowLeft, RotateCcw } from 'lucide-react';

interface MsiBpdResultsProps {
  result: MsiBpdResult;
  onReset: () => void;
  onBack?: () => void;
}

export const MsiBpdResults = ({ result, onReset, onBack }: MsiBpdResultsProps) => {
  const { t } = useLanguage();

  const getSeverityIcon = () => {
    switch (result.severity) {
      case 'above-cutoff':
        return <AlertCircle className="h-8 w-8 text-red-600" />;
      case 'further-evaluation':
        return <AlertCircle className="h-8 w-8 text-amber-600" />;
      case 'not-consistent':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
    }
  };

  const getSeverityColor = () => {
    switch (result.severity) {
      case 'above-cutoff':
        return 'bg-red-50 border-red-200';
      case 'further-evaluation':
        return 'bg-amber-50 border-amber-200';
      case 'not-consistent':
        return 'bg-green-50 border-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToMenu')}
          </Button>
        )}

        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
            <CardTitle className="text-2xl">{t('msiBpdResults')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className={`p-6 rounded-lg border-2 ${getSeverityColor()} flex items-start gap-4`}>
              {getSeverityIcon()}
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  {t('totalScore')}: {result.totalScore}/10
                </h3>
                <p className="text-slate-700">{result.interpretation}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg">
              <h4 className="font-bold text-slate-800 mb-3">{t('scoringGuide')}:</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-green-700">0-4:</span>
                  <span>{t('msiBpdNotConsistent')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-amber-700">5-6:</span>
                  <span>{t('msiBpdFurtherEval')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-red-700">7-10:</span>
                  <span>{t('msiBpdAboveCutoff')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-900">
                <strong>{t('note')}:</strong> {t('msiBpdNote')}
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
