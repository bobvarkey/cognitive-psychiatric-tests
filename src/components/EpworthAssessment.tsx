import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { EPWORTH_ITEMS, EPWORTH_SCORING_GUIDE, EPWORTH_INTERPRETATION } from '@/data/epworthSleepinessScale';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { ExportButtons } from './ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

interface EpworthAssessmentProps {
  onBack?: () => void;
}

export const EpworthAssessment = ({ onBack }: EpworthAssessmentProps) => {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleResponseChange = (itemId: string, score: number) => {
    setResponses(prev => ({ ...prev, [itemId]: score }));
  };

  const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
  const isComplete = EPWORTH_ITEMS.length === Object.keys(responses).length;

  const handleSubmit = () => {
    if (isComplete) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setResponses({});
    setShowResults(false);
  };

  const getInterpretation = () => {
    if (totalScore <= 5) return EPWORTH_INTERPRETATION[0];
    if (totalScore <= 10) return EPWORTH_INTERPRETATION[1];
    if (totalScore <= 12) return EPWORTH_INTERPRETATION[2];
    if (totalScore <= 15) return EPWORTH_INTERPRETATION[3];
    return EPWORTH_INTERPRETATION[4];
  };

  const reportData: ReportData = {
    assessmentName: 'Epworth Sleepiness Scale (ESS)',
    date: new Date().toLocaleString(),
    totalScore: `${totalScore}/24`,
    interpretation: getInterpretation().description,
    severity: getInterpretation().level,
    sections: [
      {
        title: 'Item Scores',
        items: EPWORTH_ITEMS.map((item) => `${item.number}. ${item.situation}: ${responses[item.id] ?? 0}`),
        type: 'info',
      },
    ],
    disclaimer: 'ESS is a self-report screening tool for daytime sleepiness; clinical evaluation is required for diagnosis.',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold">Epworth Sleepiness Scale</h1>
          <p className="text-gray-600 text-sm mt-1">
            ESS - Assess daytime sleepiness
          </p>
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900 mb-3">
            <strong>Instructions:</strong> For each situation, rate your likelihood of dozing off using the scale:
          </p>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {Object.entries(EPWORTH_SCORING_GUIDE).map(([score, label]) => (
              <div key={score} className="bg-white p-2 rounded border border-blue-200">
                <div className="font-semibold text-center">{score}</div>
                <div className="text-center">{label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {!showResults ? (
        <div className="space-y-4">
          {EPWORTH_ITEMS.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.number}. {item.situation}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                  <RadioGroup
                    value={responses[item.id]?.toString() || ''}
                    onValueChange={(val) => handleResponseChange(item.id, parseInt(val))}
                  >
                    <div className="grid grid-cols-4 gap-4">
                      {[0, 1, 2, 3].map((score) => (
                        <div key={score} className="flex items-center space-x-2">
                          <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} />
                          <Label htmlFor={`${item.id}-${score}`} className="cursor-pointer">
                            <div className="text-center">
                              <div className="font-semibold">{score}</div>
                              <div className="text-xs text-gray-600">{EPWORTH_SCORING_GUIDE[score as keyof typeof EPWORTH_SCORING_GUIDE]}</div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={!isComplete}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Calculate Score
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      ) : (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg text-green-900">Assessment Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {(() => {
              const interpretation = getInterpretation();
              return (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-green-600 mb-2">
                        {totalScore}
                      </div>
                      <div className="text-sm text-gray-600">Total Score (Scale: 0-24)</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="text-center mb-2">
                      <div className="text-xl font-semibold text-gray-800">
                        {interpretation.level}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{interpretation.range}</div>
                    </div>
                    <p className="text-sm text-gray-700 text-center">
                      {interpretation.description}
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2">Recommendations:</h3>
                    <p className="text-sm text-yellow-800">
                      {totalScore <= 5
                        ? 'Patient has normal daytime sleepiness. Continue current sleep habits.'
                        : totalScore <= 10
                        ? 'Patient has higher normal daytime sleepiness. Discuss sleep hygiene.'
                        : totalScore <= 12
                        ? 'Patient shows mild excessive daytime sleepiness. Further evaluation may be warranted.'
                        : totalScore <= 15
                        ? 'Patient shows moderate excessive daytime sleepiness. Consider sleep study.'
                        : 'Patient shows severe excessive daytime sleepiness. Sleep study strongly recommended.'}
                    </p>
                  </div>

                  <div className="flex justify-center pt-1">
                    <ExportButtons data={reportData} />
                  </div>
                </div>
              );
            })()}

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleReset}
                variant="outline"
              >
                New Assessment
              </Button>
              {onBack && (
                <Button
                  onClick={onBack}
                  variant="outline"
                >
                  Back
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
