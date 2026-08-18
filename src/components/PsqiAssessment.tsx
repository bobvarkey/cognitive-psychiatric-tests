import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PSQI_ITEMS, PSQI_INTERPRETATION } from '@/data/pittsburghSleepQualityIndex';
import { ArrowLeft, RotateCcw, User } from 'lucide-react';
import { ExportButtons } from '@/components/ExportButtons';
import { type ReportData } from '@/utils/reportGenerator';

interface PsqiAssessmentProps {
  onBack?: () => void;
}

interface PatientInfo {
  name: string;
  age: string;
  mrNumber: string;
}

const COMPONENT_NAMES: Record<number, string> = {
  1: 'Subjective Sleep Quality',
  2: 'Sleep Latency',
  3: 'Sleep Duration',
  4: 'Habitual Sleep Efficiency',
  5: 'Sleep Disturbances',
  6: 'Use of Sleeping Medication',
  7: 'Daytime Dysfunction'
};

export const PsqiAssessment = ({ onBack }: PsqiAssessmentProps) => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({ name: '', age: '', mrNumber: '' });
  const [responses, setResponses] = useState<Record<string, number | string>>({});
  const [showResults, setShowResults] = useState(false);
  const [started, setStarted] = useState(false);

  const handleResponseChange = (itemId: string, value: number | string) => {
    setResponses(prev => ({ ...prev, [itemId]: value }));
  };

  const getRadioItems = () => PSQI_ITEMS.filter(item => item.type !== 'time' && item.type !== 'duration');
  const getInputItems = () => PSQI_ITEMS.filter(item => item.type === 'time' || item.type === 'duration');

  const isComplete = (() => {
    const allItems = PSQI_ITEMS;
    const missing = allItems.filter(item => {
      const val = responses[item.id];
      return val === undefined || val === '';
    });
    return missing.length === 0;
  })();

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

  const parseTimeToMinutes = (timeStr: string): number | null => {
    if (!timeStr || typeof timeStr !== 'string') return null;
    const parts = timeStr.split(':');
    if (parts.length !== 2) return null;
    const h = parseInt(parts[0]);
    const m = parseInt(parts[1]);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  };

  // Component 1: Subjective Sleep Quality (direct score)
  const calculateComponent1 = (): number => {
    const val = responses['sleep_quality'];
    return typeof val === 'number' ? val : 0;
  };

  // Component 2: Sleep Latency
  const calculateComponent2 = (): number => {
    const latencyMinutes = parseFloat(responses['sleep_latency_min'] as string) || 0;
    let latencyScore: number;
    if (latencyMinutes <= 15) latencyScore = 0;
    else if (latencyMinutes <= 30) latencyScore = 1;
    else if (latencyMinutes <= 60) latencyScore = 2;
    else latencyScore = 3;

    const freqScore = typeof responses['disturb_cannot_sleep'] === 'number' ? responses['disturb_cannot_sleep'] as number : 0;
    const combined = latencyScore + freqScore;

    if (combined === 0) return 0;
    if (combined <= 2) return 1;
    if (combined <= 4) return 2;
    return 3;
  };

  // Component 3: Sleep Duration
  const calculateComponent3 = (): number => {
    const hours = parseFloat(responses['hours_slept'] as string) || 0;
    if (hours > 7) return 0;
    if (hours >= 6) return 1;
    if (hours >= 5) return 2;
    return 3;
  };

  // Component 4: Habitual Sleep Efficiency
  const calculateComponent4 = (): number => {
    const bedtime = parseTimeToMinutes(responses['bedtime'] as string);
    const wakeTime = parseTimeToMinutes(responses['wake_time'] as string);
    const hoursSlept = parseFloat(responses['hours_slept'] as string) || 0;

    if (bedtime === null || wakeTime === null) return 0;

    let timeInBedMinutes: number;
    if (wakeTime <= bedtime) {
      timeInBedMinutes = (24 * 60 - bedtime) + wakeTime;
    } else {
      timeInBedMinutes = wakeTime - bedtime;
    }

    const timeInBedHours = timeInBedMinutes / 60;
    if (timeInBedHours <= 0) return 0;

    const efficiency = (hoursSlept / timeInBedHours) * 100;
    if (efficiency >= 85) return 0;
    if (efficiency >= 75) return 1;
    if (efficiency >= 65) return 2;
    return 3;
  };

  // Component 5: Sleep Disturbances
  const calculateComponent5 = (): number => {
    const disturbanceIds = [
      'disturb_cannot_sleep', 'disturb_wake_middle', 'disturb_bathroom', 'disturb_breathe',
      'disturb_cough_snore', 'disturb_cold', 'disturb_hot',
      'disturb_bad_dreams', 'disturb_pain'
    ];
    const sum = disturbanceIds.reduce((acc, id) => {
      const val = responses[id];
      return acc + (typeof val === 'number' ? val : 0);
    }, 0);

    if (sum === 0) return 0;
    if (sum <= 9) return 1;
    if (sum <= 18) return 2;
    return 3;
  };

  // Component 6: Use of Sleeping Medication (direct score)
  const calculateComponent6 = (): number => {
    const val = responses['sleep_meds'];
    return typeof val === 'number' ? val : 0;
  };

  // Component 7: Daytime Dysfunction
  const calculateComponent7 = (): number => {
    const val1 = typeof responses['daytime_stay_awake'] === 'number' ? responses['daytime_stay_awake'] as number : 0;
    const val2 = typeof responses['daytime_enthusiasm'] === 'number' ? responses['daytime_enthusiasm'] as number : 0;
    const combined = val1 + val2;

    if (combined === 0) return 0;
    if (combined <= 2) return 1;
    if (combined <= 4) return 2;
    return 3;
  };

  const componentScores: Record<number, number> = {
    1: calculateComponent1(),
    2: calculateComponent2(),
    3: calculateComponent3(),
    4: calculateComponent4(),
    5: calculateComponent5(),
    6: calculateComponent6(),
    7: calculateComponent7(),
  };

  const totalScore = Object.values(componentScores).reduce((sum, s) => sum + s, 0);
  const isPoor = totalScore > 5;

  const getInterpretation = () => {
    return isPoor ? PSQI_INTERPRETATION.poor : PSQI_INTERPRETATION.good;
  };

  const buildReportData = (): ReportData => {
    const interpretation = getInterpretation();
    return {
      assessmentName: 'Pittsburgh Sleep Quality Index (PSQI)',
      date: new Date().toLocaleDateString(),
      totalScore: `${totalScore}/21`,
      interpretation: interpretation.description,
      severity: isPoor ? 'Clinically Significant' : 'Normal',
      patientInfo: {
        Name: patientInfo.name || 'Not provided',
        Age: patientInfo.age || 'Not provided',
        'MR Number': patientInfo.mrNumber || 'Not provided'
      },
      sections: [
        {
          title: 'Component Scores',
          type: 'info',
          items: [1, 2, 3, 4, 5, 6, 7].map(c => {
            const name = COMPONENT_NAMES[c];
            const score = componentScores[c];
            return `Component ${c} — ${name}: ${score}/3`;
          })
        },
        {
          title: 'Recommendations',
          type: isPoor ? 'positive' : 'negative',
          items: [interpretation.recommendation]
        }
      ],
      disclaimer: 'The PSQI is a validated screening tool for sleep quality. It has 89.6% sensitivity and 86.5% specificity for identifying sleep dysfunction. Clinical correlation is required.'
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
            <h1 className="text-3xl font-bold">Pittsburgh Sleep Quality Index</h1>
            <p className="text-gray-600 text-sm mt-1">PSQI — Comprehensive sleep quality assessment</p>
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
                <Label htmlFor="psqi-name">Patient Name</Label>
                <Input
                  id="psqi-name"
                  placeholder="Enter patient name"
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="psqi-age">Age</Label>
                <Input
                  id="psqi-age"
                  placeholder="Enter age"
                  value={patientInfo.age}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="psqi-mr">MR Number</Label>
                <Input
                  id="psqi-mr"
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
          <h1 className="text-3xl font-bold">Pittsburgh Sleep Quality Index</h1>
          <p className="text-gray-600 text-sm mt-1">PSQI — Comprehensive sleep quality assessment</p>
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
            <strong>Instructions:</strong> The following questions relate to your usual sleep habits during the
            <strong> past month only</strong>. Your answers should indicate the most accurate reply for the
            majority of days and nights in the past month. Please answer all questions.
          </p>
          <div className="grid grid-cols-7 gap-2 text-xs">
            {Object.entries(COMPONENT_NAMES).map(([compId, name]) => (
              <div key={compId} className="bg-white p-2 rounded border border-blue-200">
                <div className="font-semibold text-center text-blue-800">C{compId}</div>
                <div className="text-center text-gray-600 text-[10px] leading-tight">{name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {!showResults ? (
        <div className="space-y-4">
          {getInputItems().map((item, idx) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {idx + 1}. {item.question}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Component {item.component}: {COMPONENT_NAMES[item.component]}</p>
                  </div>
                  <Input
                    type={item.type === 'time' ? 'time' : 'text'}
                    placeholder={item.type === 'time' ? 'HH:MM' : item.type === 'duration' ? 'Enter number' : ''}
                    value={typeof responses[item.id] === 'string' ? responses[item.id] as string : ''}
                    onChange={(e) => handleResponseChange(item.id, e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {getRadioItems().map((item, idx) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {getInputItems().length + idx + 1}. {item.question}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Component {item.component}: {COMPONENT_NAMES[item.component]}</p>
                  </div>
                  <RadioGroup
                    value={responses[item.id]?.toString() || ''}
                    onValueChange={(val) => handleResponseChange(item.id, parseInt(val))}
                  >
                    <div className="space-y-2">
                      {item.options?.map((option, optIdx) => (
                        <div key={optIdx} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value.toString()} id={`${item.id}-${optIdx}`} />
                          <Label htmlFor={`${item.id}-${optIdx}`} className="cursor-pointer text-sm text-gray-700">
                            {option.label}
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
        <Card className={`border-2 ${isPoor ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${isPoor ? 'text-red-900' : 'text-green-900'}`}>
              Assessment Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {(() => {
              const interpretation = getInterpretation();
              const color = isPoor ? 'red' : 'green';
              const borderColor = isPoor ? 'border-red-200' : 'border-green-200';
              const scoreColor = isPoor ? 'text-red-600' : 'text-green-600';
              const severity = isPoor ? 'Clinically Significant' : 'Normal';
              return (
                <div className="space-y-4">
                  <div className={`bg-white rounded-lg p-4 border ${borderColor}`}>
                    <div className="text-center">
                      <div className={`text-5xl font-bold ${scoreColor} mb-2`}>{totalScore}</div>
                      <div className="text-sm text-gray-600">Global PSQI Score (Scale: 0-21)</div>
                    </div>
                  </div>

                  <div className={`bg-white rounded-lg p-4 border ${borderColor}`}>
                    <div className="text-center mb-2">
                      <div className={`text-xl font-semibold ${isPoor ? 'text-red-800' : 'text-green-800'}`}>
                        {interpretation.level}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{interpretation.range}</div>
                    </div>
                    <div className="inline-block mx-auto px-3 py-1 rounded-full text-sm font-semibold mt-2"
                      style={{
                        backgroundColor: isPoor ? '#fee2e2' : '#dcfce7',
                        color: isPoor ? '#991b1b' : '#166534'
                      }}
                    >
                      Severity: {severity}
                    </div>
                    <p className="text-sm text-gray-700 text-center mt-3">{interpretation.description}</p>
                  </div>

                  <div className={`bg-white rounded-lg p-4 border ${borderColor}`}>
                    <h3 className="font-semibold text-gray-800 mb-3">Component Scores:</h3>
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5, 6, 7].map(c => {
                        const score = componentScores[c];
                        const name = COMPONENT_NAMES[c];
                        const compColor = score >= 2 ? 'red' : score === 1 ? 'yellow' : 'green';
                        return (
                          <div key={c} className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100">
                            <div className="flex items-center gap-2">
                              <span className={`w-3 h-3 rounded-full ${compColor === 'red' ? 'bg-red-400' : compColor === 'yellow' ? 'bg-yellow-400' : 'bg-green-400'}`} />
                              <span className="text-sm text-gray-700">{name}</span>
                            </div>
                            <span className={`text-sm font-semibold ${compColor === 'red' ? 'text-red-600' : compColor === 'yellow' ? 'text-yellow-600' : 'text-green-600'}`}>
                              {score}/3
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className={`${color === 'green' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'} rounded-lg p-4`}>
                    <h3 className={`font-semibold mb-2 ${color === 'green' ? 'text-green-900' : 'text-red-900'}`}>
                      Recommendation:
                    </h3>
                    <p className={`text-sm ${color === 'green' ? 'text-green-800' : 'text-red-800'}`}>
                      {interpretation.recommendation}
                    </p>
                  </div>

                  {isPoor && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">Clinical Note:</h3>
                      <p className="text-sm text-blue-800">
                        The PSQI has high sensitivity (89.6%) and specificity (86.5%) for detecting sleep dysfunction.
                        Review individual component scores to identify the primary areas of sleep disturbance. Components scoring
                        2 or 3 warrant targeted intervention. Consider screening for comorbid conditions including depression,
                        anxiety, chronic pain, and substance use that may contribute to poor sleep quality.
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
