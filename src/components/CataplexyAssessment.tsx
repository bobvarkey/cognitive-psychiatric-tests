import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  CATAPLEXY_ITEMS,
  CATAPLEXY_TRIGGER_SCORING,
  CATAPLEXY_FREQUENCY_OPTIONS,
  CATAPLEXY_DURATION_OPTIONS,
  CATAPLEXY_BODY_PARTS_OPTIONS,
  CATAPLEXY_INTERPRETATION
} from '@/data/cataplexyQuestionnaire';
import { ExportButtons } from '@/components/ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';
import { ArrowLeft, RotateCcw, Brain, User } from 'lucide-react';

interface CataplexyAssessmentProps {
  onBack?: () => void;
}

interface BodyPartsSelection {
  face_jaw: boolean;
  neck: boolean;
  arms: boolean;
  legs: boolean;
  generalized: boolean;
}

export const CataplexyAssessment = ({ onBack }: CataplexyAssessmentProps) => {
  const [triggerResponses, setTriggerResponses] = useState<Record<string, number>>({});
  const [characteristicResponses, setCharacteristicResponses] = useState<Record<string, number>>({});
  const [bodyParts, setBodyParts] = useState<BodyPartsSelection>({
    face_jaw: false, neck: false, arms: false, legs: false, generalized: false
  });
  const [showResults, setShowResults] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientMrNumber, setPatientMrNumber] = useState('');

  const triggerItems = CATAPLEXY_ITEMS.filter(item => item.type === 'trigger');
  const characteristicItems = CATAPLEXY_ITEMS.filter(item => item.type === 'characteristic');
  const associatedItems = CATAPLEXY_ITEMS.filter(item => item.type === 'associated');

  const handleTriggerChange = (itemId: string, score: number) => {
    setTriggerResponses(prev => ({ ...prev, [itemId]: score }));
  };

  const handleCharChange = (itemId: string, score: number) => {
    setCharacteristicResponses(prev => ({ ...prev, [itemId]: score }));
  };

  const handleBodyPartToggle = (partId: keyof BodyPartsSelection) => {
    setBodyParts(prev => ({ ...prev, [partId]: !prev[partId] }));
  };

  const isComplete =
    triggerItems.length === Object.keys(triggerResponses).length &&
    characteristicItems.length === Object.keys(characteristicResponses).length;

  const positiveTriggerCount = Object.values(triggerResponses).filter(score => score === 2).length;

  const getInterpretation = () => {
    const consciousnessPreserved = characteristicResponses['consciousness'] === 0;
    const durationBrief = characteristicResponses['duration'] && characteristicResponses['duration'] >= 1 && characteristicResponses['duration'] <= 3;

    if (positiveTriggerCount >= 3 && consciousnessPreserved && durationBrief) {
      return CATAPLEXY_INTERPRETATION.high;
    }
    if (positiveTriggerCount >= 1) {
      return CATAPLEXY_INTERPRETATION.moderate;
    }
    return CATAPLEXY_INTERPRETATION.low;
  };

  const handleSubmit = () => {
    if (isComplete) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setTriggerResponses({});
    setCharacteristicResponses({});
    setBodyParts({ face_jaw: false, neck: false, arms: false, legs: false, generalized: false });
    setShowResults(false);
  };

  const reportData: ReportData = useMemo(() => {
    const interpretation = getInterpretation();
    const selectedBodyParts = Object.entries(bodyParts)
      .filter(([, v]) => v)
      .map(([k]) => CATAPLEXY_BODY_PARTS_OPTIONS.find(o => o.id === k)?.label || k);

    return {
      assessmentName: 'Cataplexy Questionnaire',
      date: new Date().toLocaleDateString(),
      totalScore: `${positiveTriggerCount} positive triggers`,
      severity: interpretation.severity,
      interpretation: `${interpretation.level} - ${interpretation.description}`,
      patientInfo: {
        Name: patientName || 'Not provided',
        Age: patientAge || 'Not provided',
        'MR Number': patientMrNumber || 'Not provided'
      },
      sections: [
        {
          title: `Emotional Trigger Screening (${positiveTriggerCount}/6 positive)`,
          items: triggerItems.map(item => {
            const score = triggerResponses[item.id];
            const label = score !== undefined ? CATAPLEXY_TRIGGER_SCORING[score] : 'Not answered';
            return `${item.number}. ${item.question} - ${label}`;
          }),
          type: positiveTriggerCount >= 3 ? 'positive' : positiveTriggerCount >= 1 ? 'info' : 'negative'
        },
        {
          title: 'Episode Characteristics',
          items: [
            `Body parts affected: ${selectedBodyParts.length > 0 ? selectedBodyParts.join(', ') : 'None selected'}`,
            `Frequency: ${CATAPLEXY_FREQUENCY_OPTIONS[characteristicResponses['frequency']] || 'Not answered'}`,
            `Duration: ${CATAPLEXY_DURATION_OPTIONS[characteristicResponses['duration']] || 'Not answered'}`,
            `Consciousness: ${characteristicResponses['consciousness'] === 0 ? 'Preserved during episodes' : characteristicResponses['consciousness'] === 1 ? 'Impaired during episodes' : 'Not answered'}`
          ],
          type: 'info'
        },
        {
          title: 'Recommendations',
          items: interpretation.recommendations,
          type: 'info'
        }
      ],
      disclaimer: 'This questionnaire is a screening tool for cataplexy in the context of suspected narcolepsy. A definitive diagnosis of narcolepsy type 1 requires polysomnography (PSG), Multiple Sleep Latency Test (MSLT), and/or CSF hypocretin-1 measurement.'
    };
  }, [positiveTriggerCount, triggerResponses, characteristicResponses, bodyParts, patientName, patientAge, patientMrNumber]);

  const resultColor = positiveTriggerCount >= 3 ? 'border-red-200 bg-red-50' : positiveTriggerCount >= 1 ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50';
  const scoreColor = positiveTriggerCount >= 3 ? 'text-red-600' : positiveTriggerCount >= 1 ? 'text-yellow-600' : 'text-green-600';

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
          <h1 className="text-3xl font-bold">Cataplexy Questionnaire</h1>
          <p className="text-gray-600 text-sm mt-1">
            Screening for cataplexy symptoms in suspected narcolepsy
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
              <Label htmlFor="cataplexy-patient-name" className="text-xs text-muted-foreground">Patient Name</Label>
              <Input
                id="cataplexy-patient-name"
                placeholder="Enter name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value.slice(0, 100))}
                className="h-9 text-sm"
                maxLength={100}
              />
            </div>
            <div>
              <Label htmlFor="cataplexy-patient-age" className="text-xs text-muted-foreground">Age</Label>
              <Input
                id="cataplexy-patient-age"
                placeholder="Enter age"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value.slice(0, 3))}
                className="h-9 text-sm"
                maxLength={3}
              />
            </div>
            <div>
              <Label htmlFor="cataplexy-patient-mr" className="text-xs text-muted-foreground">MR Number</Label>
              <Input
                id="cataplexy-patient-mr"
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

      <Card className="bg-indigo-50 border-indigo-200">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Brain className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-indigo-900">
              <strong>Instructions:</strong> Cataplexy is the sudden, brief loss of muscle tone (weakness) triggered by strong emotions - especially laughter. This questionnaire helps identify cataplexy symptoms that may indicate type 1 narcolepsy.
              <br /><br />
              For each situation, indicate whether you experience sudden muscle weakness.
            </div>
          </div>
        </CardContent>
      </Card>

      {!showResults ? (
        <div className="space-y-6">
          {/* Trigger Screening Questions */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Part 1: Emotional Trigger Screening
              <span className="text-sm font-normal text-gray-500 ml-2">(Scoring: 0=No, 1=Unsure, 2=Yes)</span>
            </h2>
            {triggerItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.number}. {item.question}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                    <RadioGroup
                      value={triggerResponses[item.id]?.toString() || ''}
                      onValueChange={(val) => handleTriggerChange(item.id, parseInt(val))}
                    >
                      <div className="flex gap-6">
                        {[0, 1, 2].map((score) => (
                          <div key={score} className="flex items-center space-x-2">
                            <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} />
                            <Label htmlFor={`${item.id}-${score}`} className="cursor-pointer">
                              <div className="font-medium text-gray-700">
                                {CATAPLEXY_TRIGGER_SCORING[score]}
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

          {/* Characteristics Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Part 2: Episode Characteristics</h2>

            {/* Body Parts Affected */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">7. Which body parts are affected during these episodes?</h3>
                    <p className="text-sm text-gray-600 mt-1">Select all that apply.</p>
                  </div>
                  <div className="space-y-2">
                    {CATAPLEXY_BODY_PARTS_OPTIONS.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`body-part-${option.id}`}
                          checked={bodyParts[option.id as keyof BodyPartsSelection]}
                          onCheckedChange={() => handleBodyPartToggle(option.id as keyof BodyPartsSelection)}
                        />
                        <Label htmlFor={`body-part-${option.id}`} className="cursor-pointer text-sm text-gray-700">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Frequency */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">8. How often do these episodes of muscle weakness occur?</h3>
                    <p className="text-sm text-gray-600 mt-1">Rate the frequency over the past month.</p>
                  </div>
                  <RadioGroup
                    value={characteristicResponses['frequency']?.toString() || ''}
                    onValueChange={(val) => handleCharChange('frequency', parseInt(val))}
                  >
                    <div className="space-y-2">
                      {Object.entries(CATAPLEXY_FREQUENCY_OPTIONS).map(([score, label]) => (
                        <div key={score} className="flex items-start space-x-2">
                          <RadioGroupItem value={score} id={`frequency-${score}`} />
                          <Label htmlFor={`frequency-${score}`} className="cursor-pointer text-sm text-gray-700">
                            {label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Duration */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">9. How long do these episodes of muscle weakness typically last?</h3>
                    <p className="text-sm text-gray-600 mt-1">Cataplexy episodes are typically brief (seconds to less than 2 minutes).</p>
                  </div>
                  <RadioGroup
                    value={characteristicResponses['duration']?.toString() || ''}
                    onValueChange={(val) => handleCharChange('duration', parseInt(val))}
                  >
                    <div className="space-y-2">
                      {Object.entries(CATAPLEXY_DURATION_OPTIONS).map(([score, label]) => (
                        <div key={score} className="flex items-start space-x-2">
                          <RadioGroupItem value={score} id={`duration-${score}`} />
                          <Label htmlFor={`duration-${score}`} className="cursor-pointer text-sm text-gray-700">
                            {label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Consciousness */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">10. Are you fully conscious and aware during these episodes?</h3>
                    <p className="text-sm text-gray-600 mt-1">In true cataplexy, consciousness is preserved. You should be fully aware of what is happening.</p>
                  </div>
                  <RadioGroup
                    value={characteristicResponses['consciousness']?.toString() || ''}
                    onValueChange={(val) => handleCharChange('consciousness', parseInt(val))}
                  >
                    <div className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="consciousness-0" />
                        <Label htmlFor="consciousness-0" className="cursor-pointer">
                          <div className="font-medium text-green-700">Yes, fully conscious</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="consciousness-1" />
                        <Label htmlFor="consciousness-1" className="cursor-pointer">
                          <div className="font-medium text-red-700">No, consciousness is impaired</div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Associated Features */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Part 3: Associated Features</h2>
            {associatedItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.number}. {item.question}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                    <RadioGroup
                      value={characteristicResponses[item.id]?.toString() || ''}
                      onValueChange={(val) => handleCharChange(item.id, parseInt(val))}
                    >
                      <div className="flex gap-6">
                        {[0, 1].map((score) => (
                          <div key={score} className="flex items-center space-x-2">
                            <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} />
                            <Label htmlFor={`${item.id}-${score}`} className="cursor-pointer">
                              <div className="font-medium text-gray-700">{score === 0 ? 'No' : 'Yes'}</div>
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
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Calculate Results
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {(() => {
            const interpretation = getInterpretation();
            const consciousnessPreserved = characteristicResponses['consciousness'] === 0;
            const durationValue = characteristicResponses['duration'];
            const durationBrief = durationValue !== undefined && durationValue >= 1 && durationValue <= 3;
            const selectedBodyParts = Object.entries(bodyParts)
              .filter(([, v]) => v)
              .map(([k]) => CATAPLEXY_BODY_PARTS_OPTIONS.find(o => o.id === k)?.label || k);

            return (
              <Card className={`border-2 ${resultColor}`}>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Assessment Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {/* Trigger Count */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-center">
                        <div className={`text-5xl font-bold mb-2 ${scoreColor}`}>
                          {positiveTriggerCount}/6
                        </div>
                        <div className="text-sm text-gray-600">Positive Emotional Triggers</div>
                      </div>
                    </div>

                    {/* Trigger Details */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Emotional Trigger Responses:</h3>
                      <div className="space-y-1">
                        {triggerItems.map(item => {
                          const score = triggerResponses[item.id] || 0;
                          return (
                            <div key={item.id} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                              <span className="text-sm text-gray-700">{item.number}. {item.question}</span>
                              <span className={`text-sm font-semibold ${score === 2 ? 'text-red-600' : score === 1 ? 'text-yellow-600' : 'text-green-600'}`}>
                                {CATAPLEXY_TRIGGER_SCORING[score]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Characteristic Assessment */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Characteristic Assessment:</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Body Parts Affected</span>
                          <span className="text-sm text-gray-900">
                            {selectedBodyParts.length > 0 ? selectedBodyParts.join(', ') : 'None'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Frequency</span>
                          <span className="text-sm text-gray-900">
                            {CATAPLEXY_FREQUENCY_OPTIONS[characteristicResponses['frequency']] || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Duration</span>
                          <span className={`text-sm font-semibold ${durationBrief ? 'text-green-600' : durationValue !== undefined ? 'text-orange-600' : 'text-gray-400'}`}>
                            {CATAPLEXY_DURATION_OPTIONS[durationValue] || 'N/A'}
                            {durationBrief && ' (consistent with cataplexy)'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Consciousness</span>
                          <span className={`text-sm font-semibold ${consciousnessPreserved ? 'text-green-600' : 'text-red-600'}`}>
                            {consciousnessPreserved ? 'Preserved (consistent with cataplexy)' : 'Impaired (atypical for cataplexy)'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">History of Falls</span>
                          <span className={`text-sm font-semibold ${characteristicResponses['falls'] === 1 ? 'text-red-600' : 'text-green-600'}`}>
                            {characteristicResponses['falls'] === 1 ? 'Yes' : characteristicResponses['falls'] === 0 ? 'No' : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Identifiable Triggers</span>
                          <span className={`text-sm font-semibold ${characteristicResponses['trigger_situations'] === 1 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {characteristicResponses['trigger_situations'] === 1 ? 'Yes' : characteristicResponses['trigger_situations'] === 0 ? 'No' : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Interpretation */}
                    <div className={`rounded-lg p-4 ${interpretation.severityColor}`}>
                      <div className="text-center mb-2">
                        <div className="text-xl font-semibold">
                          {interpretation.level}
                        </div>
                        <div className="text-sm mt-1 font-medium">
                          Suspicion Level: {interpretation.severity}
                        </div>
                      </div>
                      <p className="text-sm text-center mt-2">
                        {interpretation.description}
                      </p>
                    </div>

                    {/* Diagnostic Criteria Summary */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Cataplexy Diagnostic Indicators:</h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 py-1">
                          <span className={positiveTriggerCount >= 3 ? 'text-green-600' : 'text-red-600'}>
                            {positiveTriggerCount >= 3 ? '✓' : '✗'}
                          </span>
                          <span className="text-sm text-gray-700">
                            {positiveTriggerCount >= 3
                              ? '3 or more emotional triggers identified'
                              : `Only ${positiveTriggerCount}/3 required triggers identified`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 py-1">
                          <span className={consciousnessPreserved ? 'text-green-600' : 'text-red-600'}>
                            {consciousnessPreserved ? '✓' : '✗'}
                          </span>
                          <span className="text-sm text-gray-700">
                            {consciousnessPreserved
                              ? 'Consciousness preserved during episodes'
                              : 'Consciousness NOT preserved (atypical)'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 py-1">
                          <span className={durationBrief ? 'text-green-600' : 'text-red-600'}>
                            {durationBrief ? '✓' : '✗'}
                          </span>
                          <span className="text-sm text-gray-700">
                            {durationBrief
                              ? 'Brief episode duration (seconds to < 2 minutes)'
                              : 'Episode duration not characteristic of cataplexy'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Clinical Recommendations:</h3>
                      <ul className="space-y-2">
                        {interpretation.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-700 flex gap-2">
                            <span className="font-medium text-indigo-600 flex-shrink-0">{index + 1}.</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <ExportButtons data={reportData} className="mt-4" />

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
                </CardContent>
              </Card>
            );
          })()}
        </div>
      )}
    </div>
  );
};
