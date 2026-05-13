import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AUDIT_ITEMS, AUDIT_INTERPRETATION } from '@/data/audit';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { ExportButtons } from '@/components/ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

interface AuditAssessmentProps {
  onBack?: () => void;
}

export const AuditAssessment = ({ onBack }: AuditAssessmentProps) => {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [assessorName, setAssessorName] = useState('');

  const handleResponseChange = (itemId: string, score: number) => {
    setResponses(prev => ({ ...prev, [itemId]: score }));
  };

  const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
  const isComplete = AUDIT_ITEMS.length === Object.keys(responses).length;

  const handleSubmit = () => {
    if (isComplete) setShowResults(true);
  };

  const handleReset = () => {
    setResponses({});
    setShowResults(false);
  };

  const getZone = () => {
    if (totalScore <= 7) return AUDIT_INTERPRETATION.zone1;
    if (totalScore <= 15) return AUDIT_INTERPRETATION.zone2;
    if (totalScore <= 19) return AUDIT_INTERPRETATION.zone3;
    return AUDIT_INTERPRETATION.zone4;
  };

  const getZoneColor = () => {
    if (totalScore <= 7) return 'green';
    if (totalScore <= 15) return 'yellow';
    if (totalScore <= 19) return 'orange';
    return 'red';
  };

  const reportData: ReportData = {
    assessmentName: 'AUDIT — Alcohol Use Disorders Identification Test',
    date: new Date().toLocaleDateString(),
    totalScore: `${totalScore}/40`,
    interpretation: getZone().description,
    severity: getZone().level,
    sections: [
      {
        title: 'Consumption (Items 1-3)',
        items: AUDIT_ITEMS.slice(0, 3).map(item => {
          const score = responses[item.id] ?? 0;
          const opt = item.options.find(o => o.value === score);
          return `${item.question}: ${opt?.label ?? 'Not answered'} (${score})`;
        }),
        type: 'info',
      },
      {
        title: 'Dependence (Items 4-6)',
        items: AUDIT_ITEMS.slice(3, 6).map(item => {
          const score = responses[item.id] ?? 0;
          const opt = item.options.find(o => o.value === score);
          return `${item.question}: ${opt?.label ?? 'Not answered'} (${score})`;
        }),
        type: (() => {
          const depScore = AUDIT_ITEMS.slice(3, 6).reduce((s, item) => s + (responses[item.id] ?? 0), 0);
          return depScore >= 4 ? 'positive' : 'negative';
        })(),
      },
      {
        title: 'Alcohol-Related Problems (Items 7-10)',
        items: AUDIT_ITEMS.slice(6).map(item => {
          const score = responses[item.id] ?? 0;
          const opt = item.options.find(o => o.value === score);
          return `${item.question}: ${opt?.label ?? 'Not answered'} (${score})`;
        }),
        type: (() => {
          const probScore = AUDIT_ITEMS.slice(6).reduce((s, item) => s + (responses[item.id] ?? 0), 0);
          return probScore >= 4 ? 'positive' : 'negative';
        })(),
      },
    ],
    disclaimer: 'AUDIT is a screening tool developed by WHO. A score of 8+ indicates hazardous/harmful alcohol use. Not a diagnostic instrument — clinical interview is required for diagnosis of Alcohol Use Disorder.',
    patientInfo: {
      ...(patientName ? { 'Patient': patientName } : {}),
      ...(patientAge ? { 'Age': patientAge } : {}),
      ...(assessorName ? { 'Assessor': assessorName } : {}),
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
          <h1 className="text-3xl font-bold">AUDIT</h1>
          <p className="text-gray-600 text-sm mt-1">
            Alcohol Use Disorders Identification Test — WHO
          </p>
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900 mb-3">
            <strong>Instructions:</strong> The AUDIT is a 10-item screening tool developed by the World Health Organization to assess alcohol consumption, drinking behaviors, and alcohol-related problems. Answer each question based on your experience over the past year.
          </p>
        </CardContent>
      </Card>

      {!showResults ? (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="pat-name">Patient Name</Label>
                  <input id="pat-name" className="w-full mt-1 rounded-md border border-input px-3 py-2 text-sm" value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="Optional" />
                </div>
                <div>
                  <Label htmlFor="pat-age">Age</Label>
                  <input id="pat-age" className="w-full mt-1 rounded-md border border-input px-3 py-2 text-sm" value={patientAge} onChange={e => setPatientAge(e.target.value)} placeholder="Optional" />
                </div>
                <div>
                  <Label htmlFor="assessor">Assessor Name</Label>
                  <input id="assessor" className="w-full mt-1 rounded-md border border-input px-3 py-2 text-sm" value={assessorName} onChange={e => setAssessorName(e.target.value)} placeholder="Optional" />
                </div>
              </div>
            </CardContent>
          </Card>

          {AUDIT_ITEMS.map(item => (
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
          getZoneColor() === 'green' ? 'border-green-200 bg-green-50' :
          getZoneColor() === 'yellow' ? 'border-yellow-200 bg-yellow-50' :
          getZoneColor() === 'orange' ? 'border-orange-200 bg-orange-50' :
          'border-red-200 bg-red-50'
        }`}>
          <CardHeader>
            <CardTitle className={`text-lg ${
              getZoneColor() === 'green' ? 'text-green-900' :
              getZoneColor() === 'yellow' ? 'text-yellow-900' :
              getZoneColor() === 'orange' ? 'text-orange-900' :
              'text-red-900'
            }`}>Assessment Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {(() => {
              const zone = getZone();
              const color = getZoneColor();
              const depScore = AUDIT_ITEMS.slice(3, 6).reduce((s, item) => s + (responses[item.id] ?? 0), 0);
              const probScore = AUDIT_ITEMS.slice(6).reduce((s, item) => s + (responses[item.id] ?? 0), 0);

              return (
                <div className="space-y-4">
                  <div className={`bg-white border rounded-lg p-4 ${
                    color === 'green' ? 'border-green-200' : color === 'yellow' ? 'border-yellow-200' : color === 'orange' ? 'border-orange-200' : 'border-red-200'
                  }`}>
                    <div className="text-center">
                      <div className={`text-5xl font-bold mb-2 ${
                        color === 'green' ? 'text-green-600' : color === 'yellow' ? 'text-yellow-600' : color === 'orange' ? 'text-orange-600' : 'text-red-600'
                      }`}>{totalScore}</div>
                      <div className="text-sm text-gray-600">Total Score (range 0-40)</div>
                    </div>
                  </div>

                  <div className={`bg-white border rounded-lg p-4 ${
                    color === 'green' ? 'border-green-200' : color === 'yellow' ? 'border-yellow-200' : color === 'orange' ? 'border-orange-200' : 'border-red-200'
                  }`}>
                    <div className="text-center mb-2">
                      <div className={`text-xl font-semibold ${
                        color === 'green' ? 'text-green-800' : color === 'yellow' ? 'text-yellow-800' : color === 'orange' ? 'text-orange-800' : 'text-red-800'
                      }`}>{zone.level}</div>
                      <div className="text-sm text-gray-600 mt-1">Score: {zone.range}</div>
                    </div>
                    <p className="text-sm text-gray-700 text-center">{zone.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white border rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 uppercase mb-1">Consumption</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {AUDIT_ITEMS.slice(0, 3).reduce((s, item) => s + (responses[item.id] ?? 0), 0)}/12
                      </div>
                    </div>
                    <div className="bg-white border rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 uppercase mb-1">Dependence</div>
                      <div className={`text-2xl font-bold ${depScore >= 4 ? 'text-red-600' : 'text-green-600'}`}>
                        {depScore}/12
                      </div>
                    </div>
                    <div className="bg-white border rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-500 uppercase mb-1">Problems</div>
                      <div className={`text-2xl font-bold ${probScore >= 4 ? 'text-red-600' : 'text-green-600'}`}>
                        {probScore}/16
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-lg p-4 ${
                    color === 'green' ? 'bg-green-50 border border-green-200' :
                    color === 'yellow' ? 'bg-yellow-50 border border-yellow-200' :
                    color === 'orange' ? 'bg-orange-50 border border-orange-200' :
                    'bg-red-50 border border-red-200'
                  }`}>
                    <h3 className={`font-semibold mb-2 ${
                      color === 'green' ? 'text-green-900' : color === 'yellow' ? 'text-yellow-900' : color === 'orange' ? 'text-orange-900' : 'text-red-900'
                    }`}>Recommendation:</h3>
                    <p className={`text-sm ${
                      color === 'green' ? 'text-green-800' : color === 'yellow' ? 'text-yellow-800' : color === 'orange' ? 'text-orange-800' : 'text-red-800'
                    }`}>{zone.recommendation}</p>
                  </div>

                  {totalScore >= 8 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h3 className="font-semibold text-amber-900 mb-2">Clinical Note:</h3>
                      <p className="text-sm text-amber-800">
                        AUDIT score ≥ 8 indicates hazardous or harmful alcohol use. A score ≥ 20 suggests alcohol dependence.
                        For patients scoring in Zones II-III, provide feedback on their AUDIT results, discuss safe drinking limits,
                        and offer a brief intervention. Patients in Zone IV should receive a diagnostic evaluation for Alcohol Use Disorder
                        and referral to specialized treatment.
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

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
