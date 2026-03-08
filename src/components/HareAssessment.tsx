import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { HareItemCard } from '@/components/HareItemCard';
import { HareResults } from '@/components/HareResults';
import { HARE_SCALE_ITEMS } from '@/data/hareScale';
import { HareResponse, HareResults as HareResultsType } from '@/types/hare';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { PatientInfoForm } from '@/components/PatientInfoForm';

export const HareAssessment = () => {
  const { t } = useLanguage();
  const [responses, setResponses] = useState<Map<string, number>>(new Map());
  const [showResults, setShowResults] = useState(false);

  const handleScoreChange = (itemId: string, score: number) => {
    setResponses(new Map(responses.set(itemId, score)));
  };

  const calculateResults = (): HareResultsType => {
    const responseArray: HareResponse[] = Array.from(responses.entries()).map(
      ([itemId, score]) => ({ itemId, score })
    );

    const totalScore = responseArray.reduce((sum, r) => sum + r.score, 0);
    
    // Factor 1: Items h1-h8 (max 16)
    const factor1Score = responseArray
      .filter(r => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8'].includes(r.itemId))
      .reduce((sum, r) => sum + r.score, 0);
    
    // Factor 2: Items h9-h20 (max 24, but website says 20)
    const factor2Score = responseArray
      .filter(r => ['h9', 'h10', 'h11', 'h12', 'h13', 'h14', 'h15', 'h16', 'h17', 'h18', 'h19', 'h20'].includes(r.itemId))
      .reduce((sum, r) => sum + r.score, 0);

    let interpretation = '';
    if (totalScore < 20) {
      interpretation = 'Low range - Traits are minimal or not clinically significant';
    } else if (totalScore < 30) {
      interpretation = 'Moderate range - Some traits present, further evaluation may be warranted';
    } else {
      interpretation = 'High range - Significant traits present, professional evaluation strongly recommended';
    }

    return {
      responses: responseArray,
      totalScore,
      factor1Score,
      factor2Score,
      interpretation
    };
  };

  const handleSubmit = () => {
    if (responses.size === HARE_SCALE_ITEMS.length) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setResponses(new Map());
    setShowResults(false);
  };

  const progress = (responses.size / HARE_SCALE_ITEMS.length) * 100;
  const isComplete = responses.size === HARE_SCALE_ITEMS.length;

  if (showResults) {
    return <HareResults results={calculateResults()} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4 print:hidden">
          <LanguageToggle />
        </div>

        <PatientInfoForm />

        <Card className="mb-8 shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl">Hare Psychopathy Checklist-Revised (PCL-R)</CardTitle>
            <p className="text-orange-100 text-sm mt-2">
              {t('hareSubtitle') || 'Professional psychopathy assessment tool'}
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Important Disclaimer</p>
                  <p>
                    This assessment is for educational purposes only and should not be used for self-diagnosis. 
                    Professional assessment requires clinical training and additional information beyond this questionnaire.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-slate-700">
                  {t('progress') || 'Progress'}: {responses.size} / {HARE_SCALE_ITEMS.length}
                </div>
                {isComplete && (
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <CheckCircle2 className="h-5 w-5" />
                    {t('allItemsCompleted') || 'All items completed'}
                  </div>
                )}
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {HARE_SCALE_ITEMS.map((item) => (
            <HareItemCard
              key={item.id}
              item={item}
              currentScore={responses.get(item.id)}
              onScoreChange={(score) => handleScoreChange(item.id, score)}
            />
          ))}
        </div>

        <div className="sticky bottom-4 mt-8 print:hidden">
          <Card className="shadow-2xl border-2 border-orange-200">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="text-sm text-slate-600">
                  {isComplete ? (
                    <span className="text-green-600 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      {t('readyToCalculate') || 'Ready to calculate results'}
                    </span>
                  ) : (
                    <span>
                      {t('pleaseComplete') || 'Please complete'} {HARE_SCALE_ITEMS.length - responses.size}{' '}
                      {t('moreItems') || 'more items'}
                    </span>
                  )}
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="flex-1 sm:flex-none"
                  >
                    {t('reset') || 'Reset'}
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!isComplete}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                  >
                    {t('calculateResults') || 'Calculate Results'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
