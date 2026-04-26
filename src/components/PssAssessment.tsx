import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PssItemCard } from './PssItemCard';
import { PssResults } from './PssResults';
import { PSS_ITEMS } from '@/data/pssScale';
import { PssResponse, PssResult, PssScore } from '@/types/pss';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { ArrowLeft, Gauge } from 'lucide-react';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { AssessmentReference } from '@/components/AssessmentReference';

interface PssAssessmentProps {
  onBack?: () => void;
}

export const PssAssessment = ({ onBack }: PssAssessmentProps) => {
  const { t } = useLanguage();
  const [responses, setResponses] = useState<PssResponse[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleResponse = (itemId: number, score: number) => {
    setResponses(prev => {
      const existing = prev.find(r => r.itemId === itemId);
      if (existing) {
        return prev.map(r => r.itemId === itemId ? { itemId, score: score as PssScore } : r);
      }
      return [...prev, { itemId, score: score as PssScore }];
    });
  };

  const calculateResults = (): PssResult => {
    let totalScore = 0;
    
    responses.forEach(r => {
      const item = PSS_ITEMS.find(i => i.id === r.itemId);
      if (item) {
        // Reverse score for items 4, 5, 7, 8 (isReversed = true)
        const score = item.isReversed ? (4 - r.score) : r.score;
        totalScore += score;
      }
    });

    let severity: PssResult['severity'];
    let interpretation: string;

    if (totalScore <= 13) {
      severity = 'low';
      interpretation = t('pssLow');
    } else if (totalScore <= 26) {
      severity = 'moderate';
      interpretation = t('pssModerate');
    } else {
      severity = 'high';
      interpretation = t('pssHigh');
    }

    return { responses, totalScore, interpretation, severity };
  };

  const handleSubmit = () => {
    if (responses.length === PSS_ITEMS.length) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setResponses([]);
    setShowResults(false);
  };

  const progress = (responses.length / PSS_ITEMS.length) * 100;

  if (showResults) {
    return <PssResults result={calculateResults()} onReset={handleReset} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-8">
      <LanguageToggle />
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToMenu')}
          </Button>
        )}

        <PatientInfoForm />

        <Card className="shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                    <Gauge className="h-6 w-6" />
                  </span>
                  {t('pssTitle')}
                </h1>
                <p className="text-slate-600">
                  {t('pssDescription')}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{t('progress')}</span>
                  <span>{responses.length}/{PSS_ITEMS.length}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded">
                <p className="text-sm text-emerald-900">
                  <strong>{t('instructions')}:</strong> {t('pssInstructions')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 colorful-questions">
          {PSS_ITEMS.map(item => (
            <PssItemCard
              key={item.id}
              item={item}
              response={responses.find(r => r.itemId === item.id)}
              onResponse={handleResponse}
            />
          ))}
        </div>

        <Card className="shadow-lg sticky bottom-4">
          <CardContent className="p-4">
            <Button 
              onClick={handleSubmit}
              disabled={responses.length !== PSS_ITEMS.length}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              size="lg"
            >
              {t('submitAssessment')}
            </Button>
          </CardContent>
        </Card>
      </div>
      <AssessmentReference assessmentKey="pss" />

    </div>
  );
};
