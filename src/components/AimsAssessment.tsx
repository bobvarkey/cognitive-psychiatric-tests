import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIMS_ITEMS, AIMS_INTERPRETATION } from '@/data/aimsScale';
import { ArrowLeft, RotateCcw, AlertCircle } from 'lucide-react';

interface AimsAssessmentProps {
  onBack?: () => void;
}

export const AimsAssessment = ({ onBack }: AimsAssessmentProps) => {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleResponseChange = (itemId: string, score: number) => {
    setResponses(prev => ({ ...prev, [itemId]: score }));
  };

  const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
  const isComplete = AIMS_ITEMS.length === Object.keys(responses).length;

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
    if (totalScore <= 8) return AIMS_INTERPRETATION.normal;
    if (totalScore <= 15) return AIMS_INTERPRETATION.borderline;
    if (totalScore <= 25) return AIMS_INTERPRETATION.mild;
    if (totalScore <= 40) return AIMS_INTERPRETATION.moderate;
    return AIMS_INTERPRETATION.severe;
  };

  const getAreaScores = () => {
    const orofacial = AIMS_ITEMS.slice(0, 4).reduce((sum, item) => sum + (responses[item.id] || 0), 0);
    const extremities = AIMS_ITEMS.slice(4, 8).reduce((sum, item) => sum + (responses[item.id] || 0), 0);
    const trunk = (responses['trunk'] || 0);
    const global = (responses['global_severity'] || 0) + (responses['incapacity'] || 0);
    return { orofacial, extremities, trunk, global };
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
          <h1 className="text-3xl font-bold">Abnormal Involuntary Movement Scale</h1>
          <p className="text-gray-600 text-sm mt-1">
            AIMS - Assess dyskinesia and involuntary movements
          </p>
        </div>
      </div>

      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6 space-y-3">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <strong>Instructions:</strong> Observe the patient for involuntary movements and rate their presence and severity.
              Rate each area based on observation during the assessment.
            </div>
          </div>
        </CardContent>
      </Card>

      {!showResults ? (
        <div className="space-y-4">
          {AIMS_ITEMS.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {item.number}. {item.body_region}
                    </h3>
                    <p className="text-sm text-gray-600 italic mt-1">{item.area}</p>
                    <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                  </div>
                  <RadioGroup
                    value={responses[item.id]?.toString() || ''}
                    onValueChange={(val) => handleResponseChange(item.id, parseInt(val))}
                  >
                    <div className="space-y-2">
                      {[0, 1, 2, 3, 4].map((score) => (
                        <div key={score} className="flex items-start space-x-2">
                          <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} />
                          <Label htmlFor={`${item.id}-${score}`} className="cursor-pointer flex-1">
                            <div className="font-medium text-gray-700">{score}</div>
                            <div className="text-sm text-gray-600">{item.scoring[score]}</div>
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
              const areaScores = getAreaScores();
              return (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-green-600 mb-2">
                        {totalScore}
                      </div>
                      <div className="text-sm text-gray-600">Total Score (Scale: 0-44)</div>
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

                  <Tabs defaultValue="breakdown" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="breakdown">Area Breakdown</TabsTrigger>
                      <TabsTrigger value="guidance">Clinical Guidance</TabsTrigger>
                    </TabsList>
                    <TabsContent value="breakdown" className="bg-white rounded-lg p-4 border border-gray-200 mt-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="font-medium text-gray-700">Orofacial (Items 1-4)</span>
                          <span className="text-lg font-semibold text-blue-600">{areaScores.orofacial}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="font-medium text-gray-700">Extremities (Items 5-8)</span>
                          <span className="text-lg font-semibold text-blue-600">{areaScores.extremities}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="font-medium text-gray-700">Trunk (Item 9)</span>
                          <span className="text-lg font-semibold text-blue-600">{areaScores.trunk}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">Global Assessment (Items 10-11)</span>
                          <span className="text-lg font-semibold text-blue-600">{areaScores.global}</span>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="guidance" className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                      <h3 className="font-semibold text-yellow-900 mb-3">Clinical Recommendations:</h3>
                      <p className="text-sm text-yellow-800">
                        {totalScore <= 8
                          ? 'No dyskinesia detected. Continue current medication monitoring.'
                          : totalScore <= 15
                          ? 'Minimal dyskinesia. Monitor for progression with periodic AIMS assessments.'
                          : totalScore <= 25
                          ? 'Mild dyskinesia present. Consider medication adjustment or dopamine agonist modifications.'
                          : totalScore <= 40
                          ? 'Moderate dyskinesia with functional impact. Consider dose reduction or medication changes. May benefit from deep brain stimulation evaluation.'
                          : 'Severe dyskinesia with significant functional impairment. Urgent medication review and specialist consultation recommended.'}
                      </p>
                    </TabsContent>
                  </Tabs>
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
