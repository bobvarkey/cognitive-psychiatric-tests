import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  ASRS_ITEMS,
  ASRS_SCALE_ITEM_SCORING,
  ASRS_YESNO_SCORING_GUIDE,
  ASRS_INTERPRETATION
} from '@/data/augmentationSeverityRatingScale';
import { ExportButtons } from '@/components/ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';
import { ArrowLeft, RotateCcw, AlertTriangle, User } from 'lucide-react';

interface AsrsAssessmentProps {
  onBack?: () => void;
}

export const AsrsAssessment = ({ onBack }: AsrsAssessmentProps) => {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientMrNumber, setPatientMrNumber] = useState('');

  const handleResponseChange = (itemId: string, score: number) => {
    setResponses(prev => ({ ...prev, [itemId]: score }));
  };

  const isComplete = ASRS_ITEMS.length === Object.keys(responses).length;

  const totalScore = useMemo(() => {
    return Object.values(responses).reduce((sum, score) => sum + score, 0);
  }, [responses]);

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
    if (totalScore <= 3) return ASRS_INTERPRETATION.noAugmentation;
    return ASRS_INTERPRETATION.probableAugmentation;
  };

  const reportData: ReportData = useMemo(() => {
    const interpretation = getInterpretation();
    const itemResponses = ASRS_ITEMS.map(item => {
      const score = responses[item.id];
      if (score === undefined) return `${item.number}. ${item.question}: Not answered`;
      if (item.type === 'scale') {
        const itemScoring = ASRS_SCALE_ITEM_SCORING[item.id];
        return `${item.number}. ${item.question}: ${score} - ${itemScoring ? itemScoring[score] : ''}`;
      }
      return `${item.number}. ${item.question}: ${ASRS_YESNO_SCORING_GUIDE[score] || score}`;
    });

    return {
      assessmentName: 'Augmentation Severity Rating Scale (ASRS)',
      date: new Date().toLocaleDateString(),
      totalScore: `${totalScore}/13`,
      severity: interpretation.severity,
      interpretation: `${interpretation.level} - ${interpretation.description}`,
      patientInfo: {
        Name: patientName || 'Not provided',
        Age: patientAge || 'Not provided',
        'MR Number': patientMrNumber || 'Not provided'
      },
      sections: [
        {
          title: 'Severity Scale Items (Items 1-3, scored 0-3 each)',
          items: itemResponses.slice(0, 3),
          type: totalScore <= 3 ? 'negative' : 'positive'
        },
        {
          title: 'Clinical Screening Questions (Items 4-7, Yes/No)',
          items: itemResponses.slice(3),
          type: 'info'
        },
        {
          title: 'Recommendations',
          items: interpretation.recommendations,
          type: 'info'
        }
      ],
      disclaimer: 'The ASRS is a screening tool for augmentation in patients receiving dopaminergic therapy for RLS. Clinical diagnosis requires comprehensive evaluation by a sleep medicine specialist. Augmentation is a serious adverse effect that requires medication adjustment.'
    };
  }, [totalScore, responses, patientName, patientAge, patientMrNumber]);

  const scaleItems = ASRS_ITEMS.filter(item => item.type === 'scale');
  const yesnoItems = ASRS_ITEMS.filter(item => item.type === 'yesno');

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
          <h1 className="text-3xl font-bold">Augmentation Severity Rating Scale</h1>
          <p className="text-gray-600 text-sm mt-1">
            ASRS - Assess augmentation of RLS with dopaminergic treatment
          </p>
        </div>
      </div>

      {/* Patient Information */}
      <Card className="shadow-md border-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Patient Information (Optional)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="asrs-patient-name" className="text-xs text-muted-foreground">Patient Name</Label>
              <Input
                id="asrs-patient-name"
                placeholder="Enter name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value.slice(0, 100))}
                className="h-9 text-sm"
                maxLength={100}
              />
            </div>
            <div>
              <Label htmlFor="asrs-patient-age" className="text-xs text-muted-foreground">Age</Label>
              <Input
                id="asrs-patient-age"
                placeholder="Enter age"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value.slice(0, 3))}
                className="h-9 text-sm"
                maxLength={3}
              />
            </div>
            <div>
              <Label htmlFor="asrs-patient-mr" className="text-xs text-muted-foreground">MR Number</Label>
              <Input
                id="asrs-patient-mr"
                placeholder="Enter MR number"
                value={patientMrNumber}
                onChange={(e) => setPatientMrNumber(e.target.value.slice(0, 50))}
                className="h-9 text-sm"
                maxLength={50}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6 space-y-3">
          <div className="flex gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-900">
              <p className="mb-2"><strong>Clinical Context:</strong> The ASRS assesses for augmentation syndrome in patients receiving dopaminergic therapy for Restless Legs Syndrome (RLS). Augmentation is characterized by:</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>Earlier onset of symptoms during the day</li>
                <li>Increased intensity/severity of symptoms</li>
                <li>Shorter duration of benefit from medication</li>
                <li>Spread of symptoms to previously unaffected body parts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {!showResults ? (
        <div className="space-y-6">
          {/* Severity Scale Items (1-3) */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Severity Scale Items</h2>
            {scaleItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.number}. {item.question}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                    <RadioGroup
                      value={responses[item.id]?.toString() || ''}
                      onValueChange={(val) => handleResponseChange(item.id, parseInt(val))}
                    >
                      <div className="space-y-2">
                        {[0, 1, 2, 3].map((score) => (
                          <div key={score} className="flex items-start space-x-2">
                            <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} />
                            <Label htmlFor={`${item.id}-${score}`} className="cursor-pointer flex-1">
                              <div className="font-medium text-gray-700">{score}</div>
                              <div className="text-sm text-gray-600">
                                {ASRS_SCALE_ITEM_SCORING[item.id]?.[score] || ''}
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
          </div>

          {/* Yes/No Clinical Screening Questions (4-7) */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Clinical Screening Questions</h2>
            {yesnoItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.number}. {item.question}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                    <RadioGroup
                      value={responses[item.id]?.toString() || ''}
                      onValueChange={(val) => handleResponseChange(item.id, parseInt(val))}
                    >
                      <div className="flex gap-6">
                        {[0, 1].map((score) => (
                          <div key={score} className="flex items-center space-x-2">
                            <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} />
                            <Label htmlFor={`${item.id}-${score}`} className="cursor-pointer">
                              <div className="font-medium">{ASRS_YESNO_SCORING_GUIDE[score]}</div>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={!isComplete}
              className="bg-red-600 hover:bg-red-700"
            >
              Calculate Score
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-gray-900">
            <span className="text-sm font-medium">Current score: </span>
            <span className="text-lg font-bold">{totalScore}/13</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {(() => {
            const interpretation = getInterpretation();
            const hasAugmentation = totalScore > 3;
            return (
              <Card className={`border-2 ${hasAugmentation ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Assessment Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {/* Total Score */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-center">
                        <div className={`text-5xl font-bold mb-2 ${hasAugmentation ? 'text-red-600' : 'text-green-600'}`}>
                          {totalScore}
                        </div>
                        <div className="text-sm text-gray-600">Total Score (Scale: 0-13)</div>
                      </div>
                    </div>

                    {/* Scale Score Breakdown */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Scale Item Scores (Items 1-3, max score: 9):</h3>
                      <div className="space-y-1">
                        {scaleItems.map(item => (
                          <div key={item.id} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                            <span className="text-sm text-gray-700">{item.number}. {item.question}</span>
                            <span className="text-sm font-semibold text-red-600">
                              {responses[item.id] || 0}/3
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center py-2 mt-1 bg-gray-50 rounded px-2">
                          <span className="text-sm font-semibold text-gray-800">Scale Subtotal</span>
                          <span className="text-sm font-bold text-red-600">
                            {scaleItems.reduce((sum, item) => sum + (responses[item.id] || 0), 0)}/9
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Screening Questions Breakdown */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Screening Questions (Items 4-7):</h3>
                      <div className="space-y-1">
                        {yesnoItems.map(item => (
                          <div key={item.id} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                            <span className="text-sm text-gray-700">{item.number}. {item.question}</span>
                            <span className={`text-sm font-semibold ${responses[item.id] === 1 ? 'text-red-600' : 'text-green-600'}`}>
                              {ASRS_YESNO_SCORING_GUIDE[responses[item.id]] || 'Not answered'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interpretation */}
                    <div className={`rounded-lg p-4 ${interpretation.severityColor}`}>
                      <div className="text-center mb-2">
                        <div className="text-xl font-semibold">
                          {interpretation.level}
                        </div>
                        <div className="text-sm mt-1 font-medium">
                          Severity: {interpretation.severity} (Score: {totalScore})
                        </div>
                      </div>
                      <p className="text-sm text-center mt-2">
                        {interpretation.description}
                      </p>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Clinical Recommendations:</h3>
                      <ul className="space-y-2">
                        {interpretation.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-700 flex gap-2">
                            <span className="font-medium text-red-600 flex-shrink-0">{index + 1}.</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <ExportButtons data={reportData} className="mt-4" />

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
            );
          })()}
        </div>
      )}
    </div>
  );
};
