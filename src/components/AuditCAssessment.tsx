import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AUDIT_C_ITEMS, AUDIT_C_INTERPRETATION } from '@/data/auditC';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { ExportButtons } from '@/components/ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

interface AuditCAssessmentProps {
  onBack?: () => void;
}

export const AuditCAssessment = ({ onBack }: AuditCAssessmentProps) => {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [patientSex, setPatientSex] = useState<'male' | 'female' | ''>('');

  const handleResponseChange = (itemId: string, score: number) => {
    setResponses(prev => ({ ...prev, [itemId]: score }));
  };

  const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
  const isComplete = AUDIT_C_ITEMS.length === Object.keys(responses).length;

  const handleSubmit = () => {
    if (isComplete) setShowResults(true);
  };

  const handleReset = () => {
    setResponses({});
    setPatientSex('');
    setShowResults(false);
  };

  const threshold = patientSex === 'female'
    ? AUDIT_C_INTERPRETATION.women.threshold
    : AUDIT_C_INTERPRETATION.men.threshold;

  const isPositiveScreen = totalScore >= threshold;

  const getColor = () => (isPositiveScreen ? 'red' : 'green');

  const reportData: ReportData = {
    assessmentName: 'AUDIT-C — Alcohol Use Disorders Identification Test (Consumption)',
    date: new Date().toLocaleDateString(),
    totalScore: `${totalScore}/12`,
    interpretation: isPositiveScreen
      ? `Positive screen (score >= ${threshold} for ${patientSex === 'female' ? 'women' : 'men'}). ${AUDIT_C_INTERPRETATION.action.positive}`
      : `Negative screen. ${AUDIT_C_INTERPRETATION.action.negative}`,
    severity: isPositiveScreen ? 'Positive screen' : 'Negative screen',
    sections: [
      {
        title: 'Item Responses',
        items: AUDIT_C_ITEMS.map(item => {
          const score = responses[item.id] ?? 0;
          const opt = item.options.find(o => o.value === score);
          return `${item.number}. ${item.question}: ${opt?.label ?? 'Not answered'} (${score})`;
        }),
        type: 'info',
      },
    ],
    disclaimer: 'AUDIT-C is a 3-item screen for unhealthy alcohol use. Sex-specific cut-offs: >=4 for men, >=3 for women. Not a diagnostic instrument — positive screens warrant full AUDIT and clinical assessment.',
    patientInfo: {
      ...(patientSex ? { 'Sex': patientSex === 'female' ? 'Female' : 'Male' } : {}),
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold">AUDIT-C</h1>
          <p className="text-gray-600 text-sm mt-1">
            Alcohol Use Disorders Identification Test — Consumption
          </p>
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900 mb-3">
            <strong>Instructions:</strong> AUDIT-C is a 3-item screen for unhealthy alcohol
            consumption and heavy drinking. Answer each question about your drinking over the past year.
          </p>
          <p className="text-xs text-blue-800">
            Sex-specific cut-offs: <strong>Score ≥ 4</strong> for men, <strong>Score ≥ 3</strong> for women indicates a positive screen.
          </p>
        </CardContent>
      </Card>

      {!showResults ? (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Label>Patient Sex</Label>
              <p className="text-xs text-gray-500 mb-2">Used to apply the correct sex-specific cut-off.</p>
              <RadioGroup
                value={patientSex}
                onValueChange={val => setPatientSex(val as 'male' | 'female')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="sex-male" />
                  <Label htmlFor="sex-male" className="cursor-pointer">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="sex-female" />
                  <Label htmlFor="sex-female" className="cursor-pointer">Female</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {AUDIT_C_ITEMS.map(item => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">
                    {item.number}. {item.question}
                  </h3>
                  <RadioGroup
                    value={responses[item.id]?.toString() ?? ''}
                    onValueChange={val => handleResponseChange(item.id, parseInt(val))}
                  >
                    <div className="space-y-2">
                      {item.options.map(opt => (
                        <div key={opt.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={opt.value.toString()} id={`${item.id}-${opt.value}`} />
                          <Label htmlFor={`${item.id}-${opt.value}`} className="cursor-pointer text-sm">
                            {opt.label} ({opt.value})
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
            <Button onClick={handleSubmit} disabled={!isComplete || !patientSex} className="bg-blue-600 hover:bg-blue-700">
              Calculate Score
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      ) : (
        <Card className={`border-2 ${getColor() === 'green' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${getColor() === 'green' ? 'text-green-900' : 'text-red-900'}`}>
              Assessment Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`bg-white border rounded-lg p-4 ${getColor() === 'green' ? 'border-green-200' : 'border-red-200'}`}>
              <div className="text-center">
                <div className={`text-5xl font-bold mb-2 ${getColor() === 'green' ? 'text-green-600' : 'text-red-600'}`}>{totalScore}</div>
                <div className="text-sm text-gray-600">Total Score (range 0-12)</div>
              </div>
            </div>

            <div className={`bg-white border rounded-lg p-4 ${getColor() === 'green' ? 'border-green-200' : 'border-red-200'}`}>
              <div className="text-center mb-2">
                <div className={`text-xl font-semibold ${getColor() === 'green' ? 'text-green-800' : 'text-red-800'}`}>
                  {isPositiveScreen ? 'Positive Screen' : 'Negative Screen'}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Cut-off: Score ≥ {threshold} ({patientSex === 'female' ? 'women' : 'men'})
                </div>
              </div>
              <p className="text-sm text-gray-700 text-center">
                {isPositiveScreen ? AUDIT_C_INTERPRETATION.action.positive : AUDIT_C_INTERPRETATION.action.negative}
              </p>
            </div>

            {isPositiveScreen && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-amber-900 mb-2">Clinical Note:</h3>
                <p className="text-sm text-amber-800">
                  A positive AUDIT-C screen indicates the need for further assessment of
                  unhealthy alcohol use. Consider administering the full 10-item AUDIT and
                  screening for Alcohol Use Disorder using DSM-5 criteria.
                </p>
              </div>
            )}

            <ExportButtons data={reportData} className="mt-4" />

            <div className="flex gap-4 pt-4">
              <Button onClick={handleReset} variant="outline">New Assessment</Button>
              {onBack && <Button onClick={onBack} variant="outline">Back</Button>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
