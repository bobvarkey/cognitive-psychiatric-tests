import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { HOEHN_YAHR_STAGES } from '@/data/hoehnYahrScale';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface HoehnYahrAssessmentProps {
  onBack?: () => void;
}

export const HoehnYahrAssessment = ({ onBack }: HoehnYahrAssessmentProps) => {
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = () => {
    if (selectedStage) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setSelectedStage('');
    setShowResults(false);
  };

  const selectedStageData = HOEHN_YAHR_STAGES.find(
    s => s.stage === selectedStage
  );

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
          <h1 className="text-3xl font-bold">Hoehn and Yahr Scale</h1>
          <p className="text-gray-600 text-sm mt-1">
            Parkinson's Disease Staging (0-5)
          </p>
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            This scale is used to categorize the stage of Parkinson's disease based on clinical findings.
          </p>
        </CardContent>
      </Card>

      {!showResults ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Patient's Disease Stage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={selectedStage} onValueChange={setSelectedStage}>
              {HOEHN_YAHR_STAGES.map((stage) => (
                <div key={stage.stage} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value={stage.stage} id={stage.stage} />
                    <Label htmlFor={stage.stage} className="flex-1 cursor-pointer">
                      <div className="font-semibold text-base">{stage.stage}</div>
                      <div className="text-gray-700 font-medium">{stage.description}</div>
                      <div className="text-gray-600 text-sm mt-2">
                        <ul className="list-disc list-inside space-y-1">
                          {stage.characteristics.map((char, idx) => (
                            <li key={idx}>{char}</li>
                          ))}
                        </ul>
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={!selectedStage}
                className="bg-blue-600 hover:bg-blue-700"
              >
                View Results
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg text-green-900">Assessment Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedStageData && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-green-600 mb-2">
                      {selectedStageData.stage}
                    </div>
                    <div className="text-xl font-semibold text-gray-800">
                      {selectedStageData.description}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-gray-800 mb-3">Characteristics:</h3>
                  <ul className="space-y-2">
                    {selectedStageData.characteristics.map((char, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <span className="text-green-600 font-bold">•</span>
                        <span className="text-gray-700">{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">Clinical Guidance:</h3>
                  <p className="text-sm text-yellow-800">
                    {selectedStageData.stage === 'Stage 5'
                      ? 'Patient requires comprehensive care coordination, placement considerations, and advanced symptomatic management.'
                      : selectedStageData.stage === 'Stage 4'
                      ? 'Patient requires significant assistance with most activities of daily living and mobility.'
                      : selectedStageData.stage === 'Stage 3'
                      ? 'Patient demonstrates postural instability and significant functional limitations.'
                      : selectedStageData.stage === 'Stage 2.5'
                      ? 'Patient shows early postural instability symptoms.'
                      : selectedStageData.stage === 'Stage 2'
                      ? 'Patient has bilateral symptoms but maintains postural stability.'
                      : selectedStageData.stage === 'Stage 1.5'
                      ? 'Patient shows unilateral symptoms with midline involvement.'
                      : 'Patient shows early unilateral symptoms with good functional status.'}
                  </p>
                </div>
              </div>
            )}

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
