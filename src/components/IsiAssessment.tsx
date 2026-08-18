import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ISI_ITEMS, ISI_SCORING_GUIDE, ISI_INTERPRETATION } from '@/data/insomniaSeverityIndex';
import { ArrowLeft, RotateCcw, User } from 'lucide-react';
import { ExportButtons } from '@/components/ExportButtons';
import { type ReportData } from '@/utils/reportGenerator';

interface IsiAssessmentProps {
  onBack?: () => void;
}

interface PatientInfo {
  name: string;
  age: string;
  mrNumber: string;
}

export const IsiAssessment = ({ onBack }: IsiAssessmentProps) => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({ name: '', age: '', mrNumber: '' });
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [started, setStarted] = useState(false);

  const handleResponseChange = (itemId: string, score: number) => {
    setResponses(prev => ({ ...prev, [itemId]: score }));
  };

  const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
  const isComplete = ISI_ITEMS.length === Object.keys(responses).length;

  const handleSubmit = () => {
    if (isComplete) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setResponses({});
    setShowResults(false);
    setStarted(false);
    setPatientInfo({ name: '', age: '', mrNumber: '' });
  };

  const getInterpretation = () => {
    if (totalScore <= 7) return ISI_INTERPRETATION[0];
    if (totalScore <= 14) return ISI_INTERPRETATION[1];
    if (totalScore <= 21) return ISI_INTERPRETATION[2];
    return ISI_INTERPRETATION[3];
  };

  const getColorClass = (score: number) => {
    if (score <= 7) return 'green';
    if (score <= 14) return 'yellow';
    return 'red';
  };

  const buildReportData = (): ReportData => {
    const interpretation = getInterpretation();
    return {
      assessmentName: 'Insomnia Severity Index (ISI)',
      date: new Date().toLocaleDateString(),
      totalScore: `${totalScore}/28`,
      interpretation: interpretation.description,
      severity: interpretation.severity,
      patientInfo: {
        Name: patientInfo.name || 'Not provided',
        Age: patientInfo.age || 'Not provided',
        'MR Number': patientInfo.mrNumber || 'Not provided'
      },
      sections: [
        {
          title: 'Item Responses',
          type: 'info',
          items: ISI_ITEMS.map(item => {
            const score = responses[item.id] ?? '-';
            const label = typeof score === 'number' ? ISI_SCORING_GUIDE[score] : 'Not answered';
            return `${item.number}. ${item.question}: ${score} (${label})`;
          })
        },
        {
          title: 'Recommendations',
          type: interpretation.severity === 'Normal' ? 'negative' : 'positive',
          items: interpretation.recommendations
        }
      ],
      disclaimer: 'The ISI is a validated screening tool. Clinical diagnosis of insomnia requires comprehensive evaluation by a qualified healthcare professional.'
    };
  };

  if (!started) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold">Insomnia Severity Index</h1>
            <p className="text-gray-600 text-sm mt-1">ISI — Assess insomnia severity</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="isi-name">Patient Name</Label>
                <Input
                  id="isi-name"
                  placeholder="Enter patient name"
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isi-age">Age</Label>
                <Input
                  id="isi-age"
                  placeholder="Enter age"
                  value={patientInfo.age}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isi-mr">MR Number</Label>
                <Input
                  id="isi-mr"
                  placeholder="Enter MR number"
                  value={patientInfo.mrNumber}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, mrNumber: e.target.value }))}
                />
              </div>
            </div>
            <Button onClick={() => setStarted(true)} className="bg-blue-600 hover:bg-blue-700">
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold">Insomnia Severity Index</h1>
          <p className="text-gray-600 text-sm mt-1">ISI — Assess insomnia severity</p>
          {(patientInfo.name || patientInfo.mrNumber) && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {[patientInfo.name, patientInfo.age ? `Age: ${patientInfo.age}` : '', patientInfo.mrNumber ? `MR: ${patientInfo.mrNumber}` : ''].filter(Boolean).join(' | ')}
            </p>
          )}
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900 mb-3">
            <strong>Instructions:</strong> For each question, rate the severity of your sleep problem over the <strong>past two weeks</strong>.
          </p>
          <div className="grid grid-cols-5 gap-2 text-xs">
            {Object.entries(ISI_SCORING_GUIDE).map(([score, label]) => (
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
          {ISI_ITEMS.map((item) => (
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
                    <div className="grid grid-cols-5 gap-2">
                      {[0, 1, 2, 3, 4].map((score) => (
                        <div key={score} className="flex items-center space-x-2">
                          <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} />
                          <Label htmlFor={`${item.id}-${score}`} className="cursor-pointer">
                            <div className="text-center">
                              <div className="font-semibold">{score}</div>
                              <div className="text-xs text-gray-600">{ISI_SCORING_GUIDE[score as keyof typeof ISI_SCORING_GUIDE]}</div>
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
        <Card className={`border-2 ${getColorClass(totalScore) === 'green' ? 'border-green-200 bg-green-50' : getColorClass(totalScore) === 'yellow' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${getColorClass(totalScore) === 'green' ? 'text-green-900' : getColorClass(totalScore) === 'yellow' ? 'text-yellow-900' : 'text-red-900'}`}>
              Assessment Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {(() => {
              const interpretation = getInterpretation();
              const color = getColorClass(totalScore);
              const borderColor = color === 'green' ? 'border-green-200' : color === 'yellow' ? 'border-yellow-200' : 'border-red-200';
              const scoreColor = color === 'green' ? 'text-green-600' : color === 'yellow' ? 'text-yellow-600' : 'text-red-600';
              return (
                <div className="space-y-4">
                  <div className={`bg-white rounded-lg p-4 border ${borderColor}`}>
                    <div className="text-center">
                      <div className={`text-5xl font-bold ${scoreColor} mb-2`}>{totalScore}</div>
                      <div className="text-sm text-gray-600">Total Score (Scale: 0-28)</div>
                    </div>
                  </div>

                  <div className={`bg-white rounded-lg p-4 border ${borderColor}`}>
                    <div className="text-center mb-2">
                      <div className="text-xl font-semibold text-gray-800">{interpretation.level}</div>
                      <div className="text-sm text-gray-600 mt-1">{interpretation.range}</div>
                    </div>
                    <div className="inline-block mx-auto px-3 py-1 rounded-full text-sm font-semibold mt-2"
                      style={{
                        backgroundColor: color === 'green' ? '#dcfce7' : color === 'yellow' ? '#fef9c3' : '#fee2e2',
                        color: color === 'green' ? '#166534' : color === 'yellow' ? '#854d0e' : '#991b1b'
                      }}
                    >
                      Severity: {interpretation.severity}
                    </div>
                    <p className="text-sm text-gray-700 text-center mt-3">{interpretation.description}</p>
                  </div>

                  <div className={`${color === 'green' ? 'bg-green-50 border border-green-200' : color === 'yellow' ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'} rounded-lg p-4`}>
                    <h3 className={`font-semibold mb-2 ${color === 'green' ? 'text-green-900' : color === 'yellow' ? 'text-yellow-900' : 'text-red-900'}`}>
                      Recommendations:
                    </h3>
                    <ul className={`text-sm space-y-1 ${color === 'green' ? 'text-green-800' : color === 'yellow' ? 'text-yellow-800' : 'text-red-800'}`}>
                      {interpretation.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-0.5">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {totalScore >= 15 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">Clinical Note:</h3>
                      <p className="text-sm text-blue-800">
                        Clinical insomnia warrants a comprehensive sleep evaluation. Consider screening for comorbid
                        psychiatric conditions (depression, anxiety) as these frequently co-occur with and exacerbate
                        insomnia. CBT-I is the first-line treatment for chronic insomnia.
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="flex gap-4 pt-4">
              <Button onClick={handleReset} variant="outline">
                New Assessment
              </Button>
              {onBack && (
                <Button onClick={onBack} variant="outline">
                  Back
                </Button>
              )}
            </div>

            <ExportButtons data={buildReportData()} className="mt-4" />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
