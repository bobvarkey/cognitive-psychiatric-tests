import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { STOP_BANG_ITEMS, STOP_BANG_INTERPRETATION } from '@/data/stopBangScale';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { ExportButtons } from './ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

interface StopBangAssessmentProps {
  onBack?: () => void;
}

export const StopBangAssessment = ({ onBack }: StopBangAssessmentProps) => {
  const [responses, setResponses] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);

  const handleResponseChange = (itemId: string, value: boolean) => {
    setResponses(prev => ({ ...prev, [itemId]: value }));
  };

  const totalScore = Object.values(responses).filter(val => val === true).length;
  const isComplete = STOP_BANG_ITEMS.length === Object.keys(responses).length;

  const handleSubmit = () => {
    if (isComplete) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setResponses({});
    setShowResults(false);
  };

  const getRiskLevel = () => {
    if (totalScore <= 2) return STOP_BANG_INTERPRETATION.low;
    if (totalScore <= 4) return STOP_BANG_INTERPRETATION.intermediate;
    return STOP_BANG_INTERPRETATION.high;
  };

  const getRiskColor = () => {
    if (totalScore <= 2) return 'green';
    if (totalScore <= 4) return 'yellow';
    return 'red';
  };

  const reportData: ReportData = {
    assessmentName: 'STOP-BANG (Obstructive Sleep Apnea Risk)',
    date: new Date().toLocaleString(),
    totalScore: `${totalScore}/8`,
    interpretation: `${getRiskLevel().level} — ${getRiskLevel().description}`,
    severity: getRiskLevel().level,
    sections: [
      {
        title: 'Item Responses',
        items: STOP_BANG_ITEMS.map((item) => `${item.category}. ${item.question}: ${responses[item.id] ? 'Yes' : 'No'}`),
        type: 'info',
      },
      {
        title: 'Recommendation',
        items: [getRiskLevel().recommendation],
        type: 'info',
      },
    ],
    disclaimer: 'STOP-BANG is a screening tool for OSA risk; polysomnography is required for definitive diagnosis.',
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
          <h1 className="text-3xl font-bold">STOP-BANG Screening Tool</h1>
          <p className="text-gray-600 text-sm mt-1">
            Obstructive Sleep Apnea Risk Assessment
          </p>
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900 mb-3">
            <strong>Instructions:</strong> Answer "Yes" or "No" to each question.
            A higher number of "Yes" answers indicates higher OSA risk.
          </p>
          <p className="text-xs text-blue-800">
            STOP-BANG is a simple 8-item screening tool for sleep apnea risk.
          </p>
        </CardContent>
      </Card>

      {!showResults ? (
        <div className="space-y-4">
          {STOP_BANG_ITEMS.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      <span className="inline-block bg-blue-100 text-blue-800 rounded-full w-6 h-6 text-center text-sm mr-2">
                        {item.category}
                      </span>
                      {item.question}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                  </div>
                  <RadioGroup
                    value={responses[item.id] === true ? 'yes' : responses[item.id] === false ? 'no' : ''}
                    onValueChange={(val) => handleResponseChange(item.id, val === 'yes')}
                  >
                    <div className="flex items-center gap-8">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`${item.id}-yes`} />
                        <Label htmlFor={`${item.id}-yes`} className="cursor-pointer font-medium text-gray-700">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`${item.id}-no`} />
                        <Label htmlFor={`${item.id}-no`} className="cursor-pointer font-medium text-gray-700">
                          No
                        </Label>
                      </div>
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
              Calculate Risk
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      ) : (
        <Card className={`border-2 ${getRiskColor() === 'green' ? 'border-green-200 bg-green-50' : getRiskColor() === 'yellow' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${getRiskColor() === 'green' ? 'text-green-900' : getRiskColor() === 'yellow' ? 'text-yellow-900' : 'text-red-900'}`}>
              Assessment Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {(() => {
              const riskLevel = getRiskLevel();
              const color = getRiskColor();
              return (
                <div className="space-y-4">
                  <div className={`${color === 'green' ? 'bg-white border border-green-200' : color === 'yellow' ? 'bg-white border border-yellow-200' : 'bg-white border border-red-200'} rounded-lg p-4`}>
                    <div className="text-center">
                      <div className={`text-5xl font-bold mb-2 ${color === 'green' ? 'text-green-600' : color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
                        {totalScore}
                      </div>
                      <div className="text-sm text-gray-600">Total Score (Scale: 0-8)</div>
                    </div>
                  </div>

                  <div className={`${color === 'green' ? 'bg-white border border-green-200' : color === 'yellow' ? 'bg-white border border-yellow-200' : 'bg-white border border-red-200'} rounded-lg p-4`}>
                    <div className="text-center mb-2">
                      <div className={`text-xl font-semibold ${color === 'green' ? 'text-green-800' : color === 'yellow' ? 'text-yellow-800' : 'text-red-800'}`}>
                        {riskLevel.level}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{riskLevel.range} points</div>
                    </div>
                    <p className="text-sm text-gray-700 text-center">
                      {riskLevel.description}
                    </p>
                  </div>

                  <div className={`${color === 'green' ? 'bg-green-50 border border-green-200' : color === 'yellow' ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'} rounded-lg p-4`}>
                    <h3 className={`font-semibold mb-2 ${color === 'green' ? 'text-green-900' : color === 'yellow' ? 'text-yellow-900' : 'text-red-900'}`}>
                      Recommendation:
                    </h3>
                    <p className={`text-sm ${color === 'green' ? 'text-green-800' : color === 'yellow' ? 'text-yellow-800' : 'text-red-800'}`}>
                      {riskLevel.recommendation}
                    </p>
                  </div>

                  {totalScore >= 5 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">Additional Information:</h3>
                      <p className="text-sm text-blue-800">
                        For high-risk patients, consider polysomnography (PSG) or home sleep apnea testing (HSAT)
                        for definitive diagnosis of obstructive sleep apnea.
                      </p>
                    </div>
                  )}

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
