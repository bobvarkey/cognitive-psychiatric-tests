import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DelusionsItemCard } from './DelusionsItemCard';
import { DelusionsResults } from './DelusionsResults';
import { DelusionChecklistSelector } from './DelusionChecklistSelector';
import { delusionsScale } from '@/data/delusionsScale';
import { DelusionResponse, DelusionResults } from '@/types/delusions';
import { useLanguage } from '@/contexts/LanguageContext';
import { PatientInfoForm } from '@/components/PatientInfoForm';

type AssessmentStep = 'selection' | 'detailed' | 'results';

export const DelusionsAssessment = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState<AssessmentStep>('selection');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, { present: boolean; severity?: number }>>({});
  const [results, setResults] = useState<DelusionResults | null>(null);

  const selectedItems = delusionsScale.filter(item => selectedIds.includes(item.id));
  const currentItem = selectedItems[currentIndex];
  const progress = selectedItems.length > 0 ? (currentIndex / selectedItems.length) * 100 : 0;

  const handleToggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleStartDetailedAssessment = () => {
    if (selectedIds.length === 0) return;
    // Initialize responses with all selected items as present
    const initialResponses: Record<string, { present: boolean; severity?: number }> = {};
    selectedIds.forEach(id => {
      initialResponses[id] = { present: true, severity: 1 };
    });
    setResponses(initialResponses);
    setStep('detailed');
  };

  const handleResponse = (value: { present: boolean; severity?: number }) => {
    setResponses(prev => ({
      ...prev,
      [currentItem.id]: value
    }));
  };

  const handleNext = () => {
    if (currentIndex < selectedItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const calculateResults = (): DelusionResults => {
    const responseArray: DelusionResponse[] = delusionsScale.map(item => ({
      itemId: item.id,
      present: responses[item.id]?.present || false,
      severity: responses[item.id]?.severity
    }));

    const presentDelusions = responseArray.filter(r => r.present);
    const totalPresent = presentDelusions.length;
    const severityScore = presentDelusions.reduce((sum, r) => sum + (r.severity || 0), 0);

    const categoriesAffected = [...new Set(
      delusionsScale
        .filter(item => responses[item.id]?.present)
        .map(item => item.category)
    )];

    const delusionTypes = delusionsScale
      .filter(item => responses[item.id]?.present)
      .map(item => item.type);

    return {
      responses: responseArray,
      totalPresent,
      categoriesAffected,
      severityScore,
      delusionTypes
    };
  };

  const handleSubmit = () => {
    const calculatedResults = calculateResults();
    setResults(calculatedResults);
    setStep('results');
  };

  const handleReset = () => {
    setStep('selection');
    setSelectedIds([]);
    setCurrentIndex(0);
    setResponses({});
    setResults(null);
  };

  if (step === 'results' && results) {
    return <DelusionsResults results={results} onReset={handleReset} />;
  }

  if (step === 'selection') {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Delusional Syndromes and Hallucinations Assessment</CardTitle>
            <CardDescription>
              Select all symptoms present in the patient before proceeding to detailed assessment
            </CardDescription>
          </CardHeader>
        </Card>
        <PatientInfoForm />

        <DelusionChecklistSelector
          selectedIds={selectedIds}
          onToggle={handleToggleSelection}
        />

        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleStartDetailedAssessment}
            disabled={selectedIds.length === 0}
            size="lg"
          >
            Continue to Detailed Assessment ({selectedIds.length} selected)
          </Button>
        </div>
      </div>
    );
  }

  // Detailed assessment step
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Detailed Assessment - {currentItem.section}</CardTitle>
          <CardDescription>
            Rate the severity for each selected symptom
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Symptom {currentIndex + 1} of {selectedItems.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardContent>
      </Card>

      <DelusionsItemCard
        item={currentItem}
        value={responses[currentItem.id] || { present: true, severity: 1 }}
        onChange={handleResponse}
      />

      <div className="flex justify-between mt-6">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="outline"
        >
          Previous
        </Button>

        {currentIndex === selectedItems.length - 1 ? (
          <Button onClick={handleSubmit}>
            View Results
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
