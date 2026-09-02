import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  ALCOHOL_SYMPTOM_CHECKLIST_ITEMS,
  ALCOHOL_SYMPTOM_CHECKLIST_INTERPRETATION,
} from '@/data/alcoholSymptomChecklist';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { ExportButtons } from '@/components/ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

interface AlcoholSymptomChecklistProps {
  onBack?: () => void;
}

export const AlcoholSymptomChecklist = ({ onBack }: AlcoholSymptomChecklistProps) => {
  const [responses, setResponses] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);

  const handleResponseChange = (itemId: string, value: boolean) => {
    setResponses(prev => ({ ...prev, [itemId]: value }));
  };

  const totalScore = Object.values(responses).filter(val => val === true).length;
  const isComplete = ALCOHOL_SYMPTOM_CHECKLIST_ITEMS.length === Object.keys(responses).length;

  const handleSubmit = () => {
    if (isComplete) setShowResults(true);
  };

  const handleReset = () => {
    setResponses({});
    setShowResults(false);
  };

  const getBand = () => {
    if (totalScore <= 1) return ALCOHOL_SYMPTOM_CHECKLIST_INTERPRETATION[0];
    if (totalScore <= 3) return ALCOHOL_SYMPTOM_CHECKLIST_INTERPRETATION[1];
    if (totalScore <= 5) return ALCOHOL_SYMPTOM_CHECKLIST_INTERPRETATION[2];
    return ALCOHOL_SYMPTOM_CHECKLIST_INTERPRETATION[3];
  };

  const getColor = () => {
    if (totalScore <= 1) return 'green';
    if (totalScore <= 3) return 'yellow';
    if (totalScore <= 5) return 'orange';
    return 'red';
  };

  const reportData: ReportData = {
    assessmentName: 'Alcohol Symptom Checklist (DSM-5 AUD Criteria)',
    date: new Date().toLocaleDateString(),
    totalScore: `${totalScore}/11`,
    interpretation: `${getBand().level} — ${getBand().description}`,
    severity: getBand().level,
    sections: [
      {
        title: 'DSM-5 Symptom Responses',
        items: ALCOHOL_SYMPTOM_CHECKLIST_ITEMS.map(item =>
          `${item.number}. [${item.criterion}] ${item.question}: ${responses[item.id] ? 'Yes' : 'No'}`
        ),
        type: 'info',
      },
      {
        title: 'Clinical Action',
        items: [getBand().clinicalAction],
        type: getBand().range === '0-1' ? 'negative' : 'positive',
      },
    ],
    disclaimer: 'Alcohol Symptom Checklist screens for DSM-5 Alcohol Use Disorder criteria over the past 12 months. A formal diagnostic evaluation is required to confirm AUD and its severity.',
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
          <h1 className="text-3xl font-bold">Alcohol Symptom Checklist</h1>
          <p className="text-gray-600 text-sm mt-1">
            DSM-5 Criteria for Alcohol Use Disorder
          </p>
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900 mb-3">
            <strong>Instructions:</strong> Answer "Yes" or "No" to each question based on your
            experience over the <strong>past 12 months</strong>. Each "Yes" counts as one criterion
            toward an Alcohol Use Disorder diagnosis.
          </p>
          <p className="text-xs text-blue-800">
            DSM-5 severity: <strong>2-3</strong> symptoms = Mild, <strong>4-5</strong> = Moderate, <strong>6+</strong> = Severe.
          </p>
        </CardContent>
      </Card>

      {!showResults ? (
        <div className="space-y-4">
          {ALCOHOL_SYMPTOM_CHECKLIST_ITEMS.map(item => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-0.5 text-xs mr-2 align-middle">
                        {item.criterion}
                      </span>
                      {item.number}. {item.question}
                    </h3>
                  </div>
                  <RadioGroup
                    value={responses[item.id] === true ? 'yes' : responses[item.id] === false ? 'no' : ''}
                    onValueChange={val => handleResponseChange(item.id, val === 'yes')}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id={`${item.id}-yes`} />
                      <Label htmlFor={`${item.id}-yes`} className="cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id={`${item.id}-no`} />
                      <Label htmlFor={`${item.id}-no`} className="cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-4">
            <Button onClick={handleSubmit} disabled={!isComplete} className="bg-blue-600 hover:bg-blue-700">
              Calculate Score
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      ) : (
        <Card className={`border-2 ${
          getColor() === 'green' ? 'border-green-200 bg-green-50' :
          getColor() === 'yellow' ? 'border-yellow-200 bg-yellow-50' :
          getColor() === 'orange' ? 'border-orange-200 bg-orange-50' :
          'border-red-200 bg-red-50'
        }`}>
          <CardHeader>
            <CardTitle className={`text-lg ${
              getColor() === 'green' ? 'text-green-900' :
              getColor() === 'yellow' ? 'text-yellow-900' :
              getColor() === 'orange' ? 'text-orange-900' :
              'text-red-900'
            }`}>Assessment Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`bg-white border rounded-lg p-4 ${
              getColor() === 'green' ? 'border-green-200' :
              getColor() === 'yellow' ? 'border-yellow-200' :
              getColor() === 'orange' ? 'border-orange-200' :
              'border-red-200'
            }`}>
              <div className="text-center">
                <div className={`text-5xl font-bold mb-2 ${
                  getColor() === 'green' ? 'text-green-600' :
                  getColor() === 'yellow' ? 'text-yellow-600' :
                  getColor() === 'orange' ? 'text-orange-600' :
                  'text-red-600'
                }`}>{totalScore}<span className="text-2xl text-gray-400">/11</span></div>
                <div className="text-sm text-gray-600">DSM-5 Symptoms Endorsed (past 12 months)</div>
              </div>
            </div>

            <div className={`bg-white border rounded-lg p-4 ${
              getColor() === 'green' ? 'border-green-200' :
              getColor() === 'yellow' ? 'border-yellow-200' :
              getColor() === 'orange' ? 'border-orange-200' :
              'border-red-200'
            }`}>
              <div className="text-center mb-2">
                <div className={`text-xl font-semibold ${
                  getColor() === 'green' ? 'text-green-800' :
                  getColor() === 'yellow' ? 'text-yellow-800' :
                  getColor() === 'orange' ? 'text-orange-800' :
                  'text-red-800'
                }`}>{getBand().level}</div>
                <div className="text-sm text-gray-600 mt-1">Symptom count: {getBand().range}</div>
              </div>
              <p className="text-sm text-gray-700 text-center">{getBand().description}</p>
            </div>

            <div className={`rounded-lg p-4 ${
              getColor() === 'green' ? 'bg-green-50 border border-green-200' :
              getColor() === 'yellow' ? 'bg-yellow-50 border border-yellow-200' :
              getColor() === 'orange' ? 'bg-orange-50 border border-orange-200' :
              'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`font-semibold mb-2 ${
                getColor() === 'green' ? 'text-green-900' :
                getColor() === 'yellow' ? 'text-yellow-900' :
                getColor() === 'orange' ? 'text-orange-900' :
                'text-red-900'
              }`}>Clinical Action:</h3>
              <p className={`text-sm ${
                getColor() === 'green' ? 'text-green-800' :
                getColor() === 'yellow' ? 'text-yellow-800' :
                getColor() === 'orange' ? 'text-orange-800' :
                'text-red-800'
              }`}>{getBand().clinicalAction}</p>
            </div>

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
