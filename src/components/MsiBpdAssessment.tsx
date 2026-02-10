import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MsiBpdItemCard } from './MsiBpdItemCard';
import { MsiBpdResults } from './MsiBpdResults';
import { MSI_BPD_ITEMS } from '@/data/msiBpdScale';
import { MsiBpdResponse, MsiBpdResult } from '@/types/msibpd';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';

interface MsiBpdAssessmentProps {
  onBack?: () => void;
}

export const MsiBpdAssessment = ({ onBack }: MsiBpdAssessmentProps) => {
  const { t } = useLanguage();
  const [responses, setResponses] = useState<MsiBpdResponse[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleResponse = (itemId: number, score: 0 | 1) => {
    setResponses(prev => {
      const existing = prev.find(r => r.itemId === itemId);
      if (existing) {
        return prev.map(r => r.itemId === itemId ? { itemId, score } : r);
      }
      return [...prev, { itemId, score }];
    });
  };

  const calculateResults = (): MsiBpdResult => {
    const totalScore = responses.reduce((sum, r) => sum + r.score, 0);
    
    let severity: MsiBpdResult['severity'];
    let interpretation: string;

    if (totalScore >= 7) {
      severity = 'above-cutoff';
      interpretation = t('msiBpdAboveCutoff');
    } else if (totalScore >= 5) {
      severity = 'further-evaluation';
      interpretation = t('msiBpdFurtherEval');
    } else {
      severity = 'not-consistent';
      interpretation = t('msiBpdNotConsistent');
    }

    return { responses, totalScore, interpretation, severity };
  };

  const handleSubmit = () => {
    if (responses.length === MSI_BPD_ITEMS.length) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setResponses([]);
    setShowResults(false);
  };

  const progress = (responses.length / MSI_BPD_ITEMS.length) * 100;

  if (showResults) {
    return <MsiBpdResults result={calculateResults()} onReset={handleReset} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4 md:p-8">
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
                  {t('msiBpdTitle')}
                </h1>
                <p className="text-slate-600">
                  {t('msiBpdDescription')}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{t('progress')}</span>
                  <span>{responses.length}/{MSI_BPD_ITEMS.length}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-900">
                  <strong>{t('instructions')}:</strong> {t('msiBpdInstructions')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {MSI_BPD_ITEMS.map(item => (
            <MsiBpdItemCard
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
              disabled={responses.length !== MSI_BPD_ITEMS.length}
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
