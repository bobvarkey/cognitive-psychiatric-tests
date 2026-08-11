import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { IRLS_ITEMS, IRLS_SCORING_GUIDE, IRLS_INTERPRETATION } from '@/data/internationalRestlessLegsScale';
import { ExportButtons } from '@/components/ExportButtons';
import { type ReportData } from '@/utils/reportGenerator';
import { ArrowLeft, RotateCcw, User } from 'lucide-react';

interface IrlsAssessmentProps {
  onBack?: () => void;
}

export const IrlsAssessment = ({ onBack }: IrlsAssessmentProps) => {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientMrNumber, setPatientMrNumber] = useState('');

  const handleResponseChange = (itemId: string, score: number) => {
    setResponses(prev => ({ ...prev, [itemId]: score }));
  };

  const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
  const isComplete = IRLS_ITEMS.length === Object.keys(responses).length;

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
    if (totalScore === 0) return IRLS_INTERPRETATION.none;
    if (totalScore <= 10) return IRLS_INTERPRETATION.mild;
    if (totalScore <= 20) return IRLS_INTERPRETATION.moderate;
    if (totalScore <= 30) return IRLS_INTERPRETATION.severe;
    return IRLS_INTERPRETATION.verySevere;
  };

  const reportData: ReportData = useMemo(() => {
    const interpretation = getInterpretation();
    return {
      assessmentName: 'International Restless Legs Scale (IRLS)',
      date: new Date().toLocaleDateString(),
      totalScore: `${totalScore}/40`,
      severity: interpretation.severity,
      interpretation: `${interpretation.level} - ${interpretation.description}`,
      patientInfo: {
        Name: patientName || 'Not provided',
        Age: patientAge || 'Not provided',
        'MR Number': patientMrNumber || 'Not provided'
      },
      sections: [
        {
          title: 'Item Responses',
          items: IRLS_ITEMS.map(item => {
            const score = responses[item.id];
            return `${item.number}. ${item.question}: ${score !== undefined ? `${score} (${IRLS_SCORING_GUIDE[score]})` : 'Not answered'}`;
          }),
          type: 'info'
        },
        {
          title: 'Recommendations',
          items: interpretation.recommendations,
          type: 'info'
        }
      ],
      disclaimer: 'This scale is a screening tool for RLS severity. Clinical diagnosis of RLS requires fulfillment of the five essential diagnostic criteria (URGE: Urge to move, Rest-induced, Gets better with movement, Evening worsening).'
    };
  }, [totalScore, responses, patientName, patientAge, patientMrNumber]);

  const severityColorMap: Record<string, string> = {
    'None': 'text-green-600 bg-green-50 border-green-200',
    'Mild': 'text-blue-600 bg-blue-50 border-blue-200',
    'Moderate': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'Severe': 'text-orange-600 bg-orange-50 border-orange-200',
    'Very Severe': 'text-red-600 bg-red-50 border-red-200'
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
          <h1 className="text-3xl font-bold">International Restless Legs Scale</h1>
          <p className="text-gray-600 text-sm mt-1">
            IRLS - Assess severity of Restless Legs Syndrome (RLS)
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
              <Label htmlFor="irls-patient-name" className="text-xs text-muted-foreground">Patient Name</Label>
              <Input
                id="irls-patient-name"
                placeholder="Enter name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value.slice(0, 100))}
                className="h-9 text-sm"
                maxLength={100}
              />
            </div>
            <div>
              <Label htmlFor="irls-patient-age" className="text-xs text-muted-foreground">Age</Label>
              <Input
                id="irls-patient-age"
                placeholder="Enter age"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value.slice(0, 3))}
                className="h-9 text-sm"
                maxLength={3}
              />
            </div>
            <div>
              <Label htmlFor="irls-patient-mr" className="text-xs text-muted-foreground">MR Number</Label>
              <Input
                id="irls-patient-mr"
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

      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="pt-6">
          <p className="text-sm text-purple-900 mb-3">
            <strong>Instructions:</strong> For each question, rate the severity of your RLS symptoms over the <strong>past week</strong> using the scale:
          </p>
          <div className="grid grid-cols-5 gap-2 text-xs">
            {Object.entries(IRLS_SCORING_GUIDE).map(([score, label]) => (
              <div key={score} className="bg-white p-2 rounded border border-purple-200">
                <div className="font-semibold text-center">{score}</div>
                <div className="text-center">{label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {!showResults ? (
        <div className="space-y-4">
          {IRLS_ITEMS.map((item) => (
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
                    <div className="grid grid-cols-5 gap-3">
                      {[0, 1, 2, 3, 4].map((score) => (
                        <div key={score} className="flex items-center space-x-2">
                          <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} />
                          <Label htmlFor={`${item.id}-${score}`} className="cursor-pointer">
                            <div className="text-center">
                              <div className="font-semibold">{score}</div>
                              <div className="text-xs text-gray-600">{IRLS_SCORING_GUIDE[score]}</div>
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
            <Button
              onClick={handleSubmit}
              disabled={!isComplete}
              className="bg-purple-600 hover:bg-purple-700"
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
        <div className="space-y-6">
          {(() => {
            const interpretation = getInterpretation();
            return (
              <Card className={`border-2 ${interpretation.severityColor.replace('text-', 'border-').split(' ')[0]} ${interpretation.severityColor.replace('text-', 'bg-').split(' ')[0]}`}>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Assessment Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {/* Total Score */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-center">
                        <div className={`text-5xl font-bold mb-2 ${interpretation.severityColor.split(' ')[0]}`}>
                          {totalScore}
                        </div>
                        <div className="text-sm text-gray-600">Total Score (Scale: 0-40)</div>
                      </div>
                    </div>

                    {/* Interpretation */}
                    <div className={`rounded-lg p-4 ${interpretation.severityColor}`}>
                      <div className="text-center mb-2">
                        <div className="text-xl font-semibold">
                          {interpretation.level}
                        </div>
                        <div className="text-sm mt-1 font-medium">
                          Severity: {interpretation.severity} ({interpretation.range})
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
                            <span className="font-medium text-purple-600 flex-shrink-0">{index + 1}.</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Item Breakdown */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Item Responses:</h3>
                      <div className="space-y-1">
                        {IRLS_ITEMS.map(item => (
                          <div key={item.id} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                            <span className="text-sm text-gray-700">
                              {item.number}. {item.question}
                            </span>
                            <span className="text-sm font-semibold text-purple-600">
                              {responses[item.id]} ({IRLS_SCORING_GUIDE[responses[item.id]]})
                            </span>
                          </div>
                        ))}
                      </div>
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
