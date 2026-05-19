import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { HamaItemCard } from './HamaItemCard';
import { HamaResults } from './HamaResults';
import { HAMA_ITEMS } from '@/data/hamaScale';
import { HamaResponse, HamaResult } from '@/types/hama';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Activity } from 'lucide-react';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { AssessmentReference } from '@/components/AssessmentReference';

interface HamaAssessmentProps {
  onBack?: () => void;
}

export const HamaAssessment = ({ onBack }: HamaAssessmentProps) => {
  const { t } = useLanguage();
  const [responses, setResponses] = useState<HamaResponse[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleResponse = (itemId: number, score: number) => {
    const typed = score as HamaResponse['score'];
    setResponses(prev => {
      const existing = prev.find(r => r.itemId === itemId);
      if (existing) {
        return prev.map(r => r.itemId === itemId ? { itemId, score: typed } : r);
      }
      return [...prev, { itemId, score: typed }];
    });
  };

  const calculateResults = (): HamaResult => {
    const totalScore = responses.reduce((sum, r) => sum + r.score, 0);

    let severity: HamaResult['severity'];
    let interpretation: string;

    if (totalScore <= 7) {
      severity = 'none';
      interpretation = 'No or minimal anxiety symptoms.';
    } else if (totalScore <= 14) {
      severity = 'mild';
      interpretation = 'Mild anxiety. Monitor and consider supportive interventions.';
    } else if (totalScore <= 23) {
      severity = 'moderate';
      interpretation = 'Moderate anxiety. Clinical intervention is typically indicated.';
    } else {
      severity = 'severe';
      interpretation = 'Severe anxiety. Active treatment and close follow-up are recommended.';
    }

    return { responses, totalScore, interpretation, severity };
  };

  const handleSubmit = () => {
    if (responses.length === HAMA_ITEMS.length) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setResponses([]);
    setShowResults(false);
  };

  const progress = (responses.length / HAMA_ITEMS.length) * 100;

  if (showResults) {
    return <HamaResults result={calculateResults()} onReset={handleReset} onBack={onBack} />;
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

        <PatientInfoForm />

        <Card className="shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
                    <Activity className="h-6 w-6" />
                  </span>
                  Hamilton Anxiety Rating Scale (HAM-A)
                </h1>
                <p className="text-slate-600">
                  A 14-item clinician-administered scale for measuring the severity of anxiety symptoms. Each item is rated 0 (not present) to 4 (very severe). Total range 0–56.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{t('progress')}</span>
                  <span>{responses.length}/{HAMA_ITEMS.length}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-900">
                  <strong>{t('instructions')}:</strong> Rate each item based on the patient's condition over the past week. Select the option that best describes the patient's state.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 colorful-questions">
          {HAMA_ITEMS.map(item => (
            <HamaItemCard
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
              disabled={responses.length !== HAMA_ITEMS.length}
              className="w-full"
              size="lg"
            >
              {t('submitAssessment')}
            </Button>
          </CardContent>
        </Card>
      </div>
      <AssessmentReference assessmentKey="hama" />
    </div>
  );
};
