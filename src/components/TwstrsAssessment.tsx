import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TWSTRS_ITEMS, TWSTRS_INTERPRETATION } from '@/data/twstrsScale';
import { ArrowLeft, RotateCcw, AlertCircle } from 'lucide-react';
import { ExportButtons } from './ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

interface TwstrsAssessmentProps {
  onBack?: () => void;
}

export const TwstrsAssessment = ({ onBack }: TwstrsAssessmentProps) => {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleResponseChange = (itemId: string, score: number) => {
    setResponses(prev => ({ ...prev, [itemId]: score }));
  };

  const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
  const isComplete = TWSTRS_ITEMS.length === Object.keys(responses).length;

  const handleSubmit = () => {
    if (isComplete) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setResponses({});
    setShowResults(false);
  };

  const getSeverityScore = () => {
    return TWSTRS_ITEMS.slice(0, 6).reduce((sum, item) => sum + (responses[item.id] || 0), 0);
  };

  const getDisabilityScore = () => {
    return TWSTRS_ITEMS.slice(6).reduce((sum, item) => sum + (responses[item.id] || 0), 0);
  };

  const getInterpretation = () => {
    if (totalScore <= 20) return TWSTRS_INTERPRETATION.mild;
    if (totalScore <= 40) return TWSTRS_INTERPRETATION.moderate;
    if (totalScore <= 60) return TWSTRS_INTERPRETATION.severe;
    return TWSTRS_INTERPRETATION.verysevere;
  };

  const reportData: ReportData = {
    assessmentName: 'TWSTRS (Toronto Western Spasmodic Torticollis Rating Scale)',
    date: new Date().toLocaleString(),
    totalScore: `${totalScore}/85`,
    interpretation: `${getInterpretation().level} (${getInterpretation().range}) — ${getInterpretation().description}`,
    severity: getInterpretation().level,
    sections: [
      {
        title: 'Subscales',
        items: [`Severity: ${getSeverityScore()} / 25`, `Disability: ${getDisabilityScore()} / 30`],
        type: 'info',
      },
    ],
    disclaimer: 'TWSTRS assesses cervical dystonia severity and disability; clinical interpretation required.',
  };

  const groupedItems = {
    severity: TWSTRS_ITEMS.filter(item => item.subscale === 'Severity'),
    disability: TWSTRS_ITEMS.filter(item => item.subscale === 'Disability')
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
          <h1 className="text-3xl font-bold">Toronto Western Spasmodic Torticollis Rating Scale</h1>
          <p className="text-gray-600 text-sm mt-1">
            TWSTRS - Cervical Dystonia Assessment
          </p>
        </div>
      </div>

      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6 space-y-3">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <strong>Instructions:</strong> This scale assesses cervical dystonia severity and disability.
              It has two subscales: Severity (0-25) and Disability (0-30). Complete all items.
            </div>
          </div>
        </CardContent>
      </Card>

      {!showResults ? (
        <div className="space-y-6">
          {/* Severity Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Severity Subscale (Items 1-6)</h2>
            <div className="space-y-4">
              {groupedItems.severity.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.number}. {item.item_name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <RadioGroup
                        value={responses[item.id]?.toString() || ''}
                        onValueChange={(val) => handleResponseChange(item.id, parseInt(val))}
                      >
                        <div className="space-y-2">
                          {item.max_score && Object.keys(item.scoring).map((scoreKey) => {
                            const score = parseInt(scoreKey);
                            return (
                              <div key={score} className="flex items-start space-x-2">
                                <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} />
                                <Label htmlFor={`${item.id}-${score}`} className="cursor-pointer flex-1">
                                  <div className="font-medium text-gray-700">{score}</div>
                                  <div className="text-sm text-gray-600">{item.scoring[score]}</div>
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Disability Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Disability Subscale (Items 7-12)</h2>
            <div className="space-y-4">
              {groupedItems.disability.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.number}. {item.item_name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <RadioGroup
                        value={responses[item.id]?.toString() || ''}
                        onValueChange={(val) => handleResponseChange(item.id, parseInt(val))}
                      >
                        <div className="space-y-2">
                          {item.max_score && Object.keys(item.scoring).map((scoreKey) => {
                            const score = parseInt(scoreKey);
                            return (
                              <div key={score} className="flex items-start space-x-2">
                                <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} />
                                <Label htmlFor={`${item.id}-${score}`} className="cursor-pointer flex-1">
                                  <div className="font-medium text-gray-700">{score}</div>
                                  <div className="text-sm text-gray-600">{item.scoring[score]}</div>
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

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
              const severityScore = getSeverityScore();
              const disabilityScore = getDisabilityScore();
              return (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-green-600 mb-2">
                        {totalScore}
                      </div>
                      <div className="text-sm text-gray-600">Total Score (Scale: 0-85)</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="text-sm text-blue-900 font-semibold">Severity</div>
                      <div className="text-2xl font-bold text-blue-600 mt-2">{severityScore}</div>
                      <div className="text-xs text-blue-700 mt-1">Max: 25</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="text-sm text-purple-900 font-semibold">Disability</div>
                      <div className="text-2xl font-bold text-purple-600 mt-2">{disabilityScore}</div>
                      <div className="text-xs text-purple-700 mt-1">Max: 30</div>
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
                    <h3 className="font-semibold text-yellow-900 mb-2">Clinical Recommendations:</h3>
                    <p className="text-sm text-yellow-800">
                      {totalScore <= 20
                        ? 'Mild cervical dystonia. Continue conservative management and monitoring.'
                        : totalScore <= 40
                        ? 'Moderate cervical dystonia. Consider botulinum toxin therapy or medication adjustments.'
                        : totalScore <= 60
                        ? 'Severe cervical dystonia. Botulinum toxin therapy is recommended. Consider specialist consultation.'
                        : 'Very severe cervical dystonia. Multiple therapeutic options should be considered including botulinum toxin, medications, and possible surgical intervention.'}
                    </p>
                  </div>
                </div>
              );
            })()}

            <div className="flex flex-wrap gap-4 pt-4">
              <ExportButtons data={reportData} />
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
