import { useState } from 'react';
import { FabItemCard } from './FabItemCard';
import { FabResults } from './FabResults';
import { Button } from '@/components/ui/button';
import { fabItems } from '@/data/fabScale';
import { FabResponse, FabScore } from '@/types/fab';
import { useLanguage } from '@/contexts/LanguageContext';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { AssessmentReference } from '@/components/AssessmentReference';

export const FabAssessment = () => {
  const [responses, setResponses] = useState<Map<number, FabScore>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const { t } = useLanguage();

  const handleScoreChange = (itemId: number, score: FabScore) => {
    setResponses(new Map(responses.set(itemId, score)));
  };

  const handleSubmit = () => {
    if (responses.size === fabItems.length) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setResponses(new Map());
    setShowResults(false);
  };

  const allItemsAnswered = responses.size === fabItems.length;

  if (showResults) {
    const formattedResponses: FabResponse[] = Array.from(responses.entries()).map(
      ([itemId, score]) => ({
        itemId,
        score,
      })
    );

    return <FabResults responses={formattedResponses} onReset={handleReset} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Frontal Assessment Battery (FAB)</h1>
        <p className="text-muted-foreground">
          {t('instructions')}
        </p>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm">
            <strong>Purpose:</strong> Brief bedside tool to differentiate frontal dysexecutive dementias from Alzheimer's Disease.
          </p>
          <p className="text-sm mt-2">
            <strong>Scoring:</strong> Total score ranges from 0-18. Higher scores indicate better performance.
          </p>
        </div>
      </div>

      <PatientInfoForm />

      <div className="space-y-4 mt-4 colorful-questions">
        {fabItems.map((item) => (
          <FabItemCard
            key={item.id}
            item={item}
            value={responses.get(item.id)}
            onChange={(score) => handleScoreChange(item.id, score)}
          />
        ))}
      </div>

      <div className="flex gap-4 mt-6">
        <Button
          onClick={handleSubmit}
          disabled={!allItemsAnswered}
          className="flex-1"
        >
          {t('calculate')}
        </Button>
        <Button onClick={handleReset} variant="outline">
          {t('reset')}
        </Button>
      </div>

      {!allItemsAnswered && (
        <p className="text-sm text-muted-foreground text-center mt-4">
          {t('answerAll')}
        </p>
      )}
      <AssessmentReference assessmentKey="fab" />

    </div>
  );
};
