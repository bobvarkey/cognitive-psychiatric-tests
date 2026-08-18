import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FOSQ_ITEMS, FOSQ_SCORING_GUIDE, FOSQ_SUBSCALE_NAMES, FOSQ_INTERPRETATION } from '@/data/fosq';
import { ArrowLeft, RotateCcw, User } from 'lucide-react';
import { ExportButtons } from '@/components/ExportButtons';
import { type ReportData } from '@/utils/reportGenerator';

interface FosqAssessmentProps {
  onBack?: () => void;
}

interface PatientInfo {
  name: string;
  age: string;
  mrNumber: string;
}

export const FosqAssessment = ({ onBack }: FosqAssessmentProps) => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({ name: '', age: '', mrNumber: '' });
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [started, setStarted] = useState(false);

  const handleResponseChange = (itemId: string, score: number) => {
    setResponses(prev => ({ ...prev, [itemId]: score }));
  };

  const isComplete = FOSQ_ITEMS.length === Object.keys(responses).length;

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

  const getSubscaleItems = (subscaleId: number) => {
    return FOSQ_ITEMS.filter(item => item.subscale === subscaleId);
  };

  const getSubscaleMean = (subscaleId: number): number => {
    const items = getSubscaleItems(subscaleId);
    const sum = items.reduce((acc, item) => acc + (responses[item.id] || 0), 0);
    return items.length > 0 ? sum / items.length : 0;
  };

  const subscaleMeans: Record<number, number> = {};
  for (let s = 1; s <= 5; s++) {
    subscaleMeans[s] = getSubscaleMean(s);
  }

  const totalScore = Object.values(subscaleMeans).reduce((sum, m) => sum + m, 0) / 5 * 5;
  // totalScore = mean of subscale means × 5 (range 5-20)
  // More precisely: total = (sum of all subscale means / 5) × 5 = sum of all subscale means

  const getInterpretation = () => {
    if (totalScore > 18) return FOSQ_INTERPRETATION.normal;
    if (totalScore >= 15) return FOSQ_INTERPRETATION.mild;
    return FOSQ_INTERPRETATION.moderateSevere;
  };

  const getColorClass = () => {
    if (totalScore > 18) return 'green';
    if (totalScore >= 15) return 'yellow';
    return 'red';
  };

  const buildReportData = (): ReportData => {
    const interpretation = getInterpretation();
    return {
      assessmentName: 'Functional Outcomes of Sleep Questionnaire (FOSQ)',
      date: new Date().toLocaleDateString(),
      totalScore: `${totalScore.toFixed(1)}/20`,
      interpretation: interpretation.description,
      severity: interpretation.severity,
      patientInfo: {
        Name: patientInfo.name || 'Not provided',
        Age: patientInfo.age || 'Not provided',
        'MR Number': patientInfo.mrNumber || 'Not provided'
      },
      sections: [
        {
          title: 'Subscale Scores',
          type: 'info',
          items: [1, 2, 3, 4, 5].map(s => {
            const name = FOSQ_SUBSCALE_NAMES[s];
            const mean = subscaleMeans[s];
            const itemCount = getSubscaleItems(s).length;
            return `${name} (${itemCount} items): Mean = ${mean.toFixed(2)}/4`;
          })
        },
        {
          title: 'Recommendations',
          type: totalScore < 15 ? 'positive' : totalScore <= 18 ? 'info' : 'negative',
          items: interpretation.recommendations
        }
      ],
      disclaimer: 'The FOSQ is a validated measure of the functional impact of sleepiness. Clinical decisions should incorporate this assessment alongside objective sleep testing and clinical evaluation.'
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
            <h1 className="text-3xl font-bold">Functional Outcomes of Sleep Questionnaire</h1>
            <p className="text-gray-600 text-sm mt-1">FOSQ — Assess impact of sleepiness on daily functioning</p>
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
                <Label htmlFor="fosq-name">Patient Name</Label>
                <Input
                  id="fosq-name"
                  placeholder="Enter patient name"
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fosq-age">Age</Label>
                <Input
                  id="fosq-age"
                  placeholder="Enter age"
                  value={patientInfo.age}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fosq-mr">MR Number</Label>
                <Input
                  id="fosq-mr"
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
          <h1 className="text-3xl font-bold">Functional Outcomes of Sleep Questionnaire</h1>
          <p className="text-gray-600 text-sm mt-1">FOSQ — Assess impact of sleepiness on daily functioning</p>
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
            <strong>Instructions:</strong> The following questions ask about how sleepiness affects your ability to function
            in daily life. Rate each item using the 1-4 scale below. Consider your experiences over the past month.
          </p>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {Object.entries(FOSQ_SCORING_GUIDE).map(([score, label]) => (
              <div key={score} className="bg-white p-2 rounded border border-blue-200">
                <div className="font-semibold text-center">{score}</div>
                <div className="text-center text-gray-600">{label}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2 text-xs mt-3">
            {Object.entries(FOSQ_SUBSCALE_NAMES).map(([sId, name]) => (
              <div key={sId} className="bg-white p-2 rounded border border-blue-200">
                <div className="font-semibold text-center text-blue-800">S{sId}</div>
                <div className="text-center text-gray-600 text-[10px] leading-tight">{name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {!showResults ? (
        <div className="space-y-4">
          {FOSQ_ITEMS.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 text-xs font-semibold rounded-full w-6 h-6">
                        S{item.subscale}
                      </span>
                      <h3 className="font-semibold text-gray-800">{item.number}. {item.question}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                  <RadioGroup
                    value={responses[item.id]?.toString() || ''}
                    onValueChange={(val) => handleResponseChange(item.id, parseInt(val))}
                  >
                    <div className="grid grid-cols-4 gap-3">
                      {[1, 2, 3, 4].map((score) => (
                        <div key={score} className="flex items-center space-x-2">
                          <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} />
                          <Label htmlFor={`${item.id}-${score}`} className="cursor-pointer">
                            <div className="text-center">
                              <div className="font-semibold">{score}</div>
                              <div className="text-xs text-gray-600">{FOSQ_SCORING_GUIDE[score as keyof typeof FOSQ_SCORING_GUIDE]}</div>
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
        <Card className={`border-2 ${getColorClass() === 'green' ? 'border-green-200 bg-green-50' : getColorClass() === 'yellow' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${getColorClass() === 'green' ? 'text-green-900' : getColorClass() === 'yellow' ? 'text-yellow-900' : 'text-red-900'}`}>
              Assessment Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {(() => {
              const interpretation = getInterpretation();
              const color = getColorClass();
              const borderColor = color === 'green' ? 'border-green-200' : color === 'yellow' ? 'border-yellow-200' : 'border-red-200';
              const scoreColor = color === 'green' ? 'text-green-600' : color === 'yellow' ? 'text-yellow-600' : 'text-red-600';
              return (
                <div className="space-y-4">
                  <div className={`bg-white rounded-lg p-4 border ${borderColor}`}>
                    <div className="text-center">
                      <div className={`text-5xl font-bold ${scoreColor} mb-2`}>{totalScore.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Total FOSQ Score (Scale: 5-20)</div>
                    </div>
                  </div>

                  <div className={`bg-white rounded-lg p-4 border ${borderColor}`}>
                    <div className="text-center mb-2">
                      <div className={`text-xl font-semibold ${color === 'green' ? 'text-green-800' : color === 'yellow' ? 'text-yellow-800' : 'text-red-800'}`}>
                        {interpretation.level}
                      </div>
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

                  <div className={`bg-white rounded-lg p-4 border ${borderColor}`}>
                    <h3 className="font-semibold text-gray-800 mb-3">Subscale Scores (Mean / 4.0):</h3>
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map(s => {
                        const mean = subscaleMeans[s];
                        const name = FOSQ_SUBSCALE_NAMES[s];
                        const subColor = mean >= 3.0 ? 'green' : mean >= 2.0 ? 'yellow' : 'red';
                        return (
                          <div key={s} className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100">
                            <div className="flex items-center gap-2">
                              <span className={`w-3 h-3 rounded-full ${subColor === 'red' ? 'bg-red-400' : subColor === 'yellow' ? 'bg-yellow-400' : 'bg-green-400'}`} />
                              <span className="text-sm text-gray-700">{name}</span>
                            </div>
                            <span className={`text-sm font-semibold ${subColor === 'red' ? 'text-red-600' : subColor === 'yellow' ? 'text-yellow-600' : 'text-green-600'}`}>
                              {mean.toFixed(2)}/4
                            </span>
                          </div>
                        );
                      })}
                    </div>
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

                  {totalScore < 15 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">Clinical Note:</h3>
                      <p className="text-sm text-blue-800">
                        Significant functional impairment on the FOSQ indicates that sleepiness is substantially affecting
                        quality of life. Driving safety should be discussed with patients scoring low on the Vigilance subscale.
                        Targeted interventions for specific domains of impairment (e.g., CPAP for OSA, CBT-I for insomnia,
                        stimulant therapy for narcolepsy) should be prioritized based on the underlying sleep disorder diagnosis.
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
