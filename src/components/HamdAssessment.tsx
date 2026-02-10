import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { HamdItemCard } from './HamdItemCard';
import { HamdResults } from './HamdResults';
import { HAMD_ITEMS } from '@/data/hamdScale';
import { HamdResponse, HamdResult } from '@/types/hamd';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';

interface HamdAssessmentProps {
  onBack?: () => void;
}

export const HamdAssessment = ({ onBack }: HamdAssessmentProps) => {
  const { t } = useLanguage();
  const [responses, setResponses] = useState<HamdResponse[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleResponse = (itemId: number, score: number) => {
    setResponses(prev => {
      const existing = prev.find(r => r.itemId === itemId);
      if (existing) {
        return prev.map(r => r.itemId === itemId ? { itemId, score: score as any } : r);
      }
      return [...prev, { itemId, score: score as any }];
    });
  };

  const calculateResults = (): HamdResult => {
    const totalScore = responses.reduce((sum, r) => sum + r.score, 0);
    
    let severity: HamdResult['severity'];
    let interpretation: string;

    if (totalScore <= 7) {
      severity = 'normal';
      interpretation = t('hamdNormal');
    } else if (totalScore <= 13) {
      severity = 'mild';
      interpretation = t('hamdMild');
    } else if (totalScore <= 18) {
      severity = 'moderate';
      interpretation = t('hamdModerate');
    } else if (totalScore <= 22) {
      severity = 'severe';
      interpretation = t('hamdSevere');
    } else {
      severity = 'very-severe';
      interpretation = t('hamdVerySevere');
    }

    return { responses, totalScore, interpretation, severity };
  };

  const handleSubmit = () => {
    if (responses.length === HAMD_ITEMS.length) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setResponses([]);
    setShowResults(false);
  };

  const progress = (responses.length / HAMD_ITEMS.length) * 100;

  if (showResults) {
    return <HamdResults result={calculateResults()} onReset={handleReset} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToMenu')}
          </Button>
        )}

        <Card className="shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  {t('hamdTitle')}
                </h1>
                <p className="text-slate-600">
                  {t('hamdDescription')}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{t('progress')}</span>
                  <span>{responses.length}/{HAMD_ITEMS.length}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-900">
                  <strong>{t('instructions')}:</strong> {t('hamdInstructions')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {HAMD_ITEMS.map(item => (
            <HamdItemCard
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
              disabled={responses.length !== HAMD_ITEMS.length}
              className="w-full"
              size="lg"
            >
              {t('submitAssessment')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
