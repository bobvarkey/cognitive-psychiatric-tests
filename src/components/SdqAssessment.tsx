import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SDQ_ITEMS, SDQ_DOMAINS, SDQ_SCORING_GUIDE, SDQ_INTERPRETATION } from '@/data/sleepDisordersQuestionnaire';
import { ExportButtons } from '@/components/ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';
import { ArrowLeft, RotateCcw, Moon, User } from 'lucide-react';

interface SdqAssessmentProps {
  onBack?: () => void;
}

export const SdqAssessment = ({ onBack }: SdqAssessmentProps) => {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientMrNumber, setPatientMrNumber] = useState('');

  const handleResponseChange = (itemId: string, score: number) => {
    setResponses(prev => ({ ...prev, [itemId]: score }));
  };

  const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
  const isComplete = SDQ_ITEMS.length === Object.keys(responses).length;

  const handleSubmit = () => {
    if (isComplete) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setResponses({});
    setShowResults(false);
  };

  const getDomainScores = () => {
    const result: Record<string, { score: number; max: number; label: string; description: string }> = {};
    for (const [key, domain] of Object.entries(SDQ_DOMAINS)) {
      const domainItems = SDQ_ITEMS.filter(item => item.domain === key);
      const score = domainItems.reduce((sum, item) => sum + (responses[item.id] || 0), 0);
      result[key] = {
        score,
        max: domainItems.length * 5,
        label: domain.label,
        description: domain.description
      };
    }
    return result;
  };

  const getInterpretation = () => {
    if (totalScore <= 60) return SDQ_INTERPRETATION.low;
    if (totalScore <= 90) return SDQ_INTERPRETATION.moderate;
    if (totalScore <= 120) return SDQ_INTERPRETATION.high;
    return SDQ_INTERPRETATION.veryHigh;
  };

  const reportData: ReportData = useMemo(() => {
    const interpretation = getInterpretation();
    const domainScores = getDomainScores();

    const domainItems = Object.entries(domainScores).map(([key, ds]) => {
      return `${ds.label}: ${ds.score}/${ds.max} (${((ds.score / ds.max) * 100).toFixed(0)}%)`;
    });

    return {
      assessmentName: 'Sleep Disorders Questionnaire (SDQ)',
      date: new Date().toLocaleDateString(),
      totalScore: `${totalScore}/150`,
      severity: interpretation.severity,
      interpretation: `${interpretation.level} - ${interpretation.description}`,
      patientInfo: {
        Name: patientName || 'Not provided',
        Age: patientAge || 'Not provided',
        'MR Number': patientMrNumber || 'Not provided'
      },
      sections: [
        {
          title: 'Domain Scores',
          items: domainItems,
          type: 'info'
        },
        {
          title: 'Interpretation',
          items: [
            `Level: ${interpretation.level}`,
            `Severity: ${interpretation.severity}`
          ],
          type: totalScore > 90 ? 'positive' : totalScore > 60 ? 'info' : 'negative'
        },
        {
          title: 'Recommendations',
          items: interpretation.recommendations,
          type: 'info'
        }
      ],
      disclaimer: 'The Sleep Disorders Questionnaire (SDQ) is a comprehensive screening tool for multiple sleep disorders. It is not a diagnostic instrument. Positive findings should be followed up with appropriate diagnostic testing and specialist evaluation.'
    };
  }, [totalScore, responses, patientName, patientAge, patientMrNumber]);

  const getCompletedCount = (domain: string) => {
    return SDQ_ITEMS.filter(item => item.domain === domain && responses[item.id] !== undefined).length;
  };

  const getDomainTotal = (domain: string) => {
    return SDQ_ITEMS.filter(item => item.domain === domain).length;
  };

  const domainColors: Record<string, { bg: string; border: string; text: string }> = {
    sleep_apnea: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
    insomnia: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' },
    narcolepsy: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800' },
    parasomnias: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' },
    restless_legs: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' }
  };

  const getDomainPercentBar = (score: number, max: number) => {
    const pct = Math.min((score / max) * 100, 100);
    let color = 'bg-green-500';
    if (pct > 75) color = 'bg-red-500';
    else if (pct > 50) color = 'bg-orange-500';
    else if (pct > 25) color = 'bg-yellow-500';
    return pct;
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
          <h1 className="text-3xl font-bold">Sleep Disorders Questionnaire</h1>
          <p className="text-gray-600 text-sm mt-1">
            SDQ - Comprehensive screening for multiple sleep disorders
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
              <Label htmlFor="sdq-patient-name" className="text-xs text-muted-foreground">Patient Name</Label>
              <Input
                id="sdq-patient-name"
                placeholder="Enter name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value.slice(0, 100))}
                className="h-9 text-sm"
                maxLength={100}
              />
            </div>
            <div>
              <Label htmlFor="sdq-patient-age" className="text-xs text-muted-foreground">Age</Label>
              <Input
                id="sdq-patient-age"
                placeholder="Enter age"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value.slice(0, 3))}
                className="h-9 text-sm"
                maxLength={3}
              />
            </div>
            <div>
              <Label htmlFor="sdq-patient-mr" className="text-xs text-muted-foreground">MR Number</Label>
              <Input
                id="sdq-patient-mr"
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

      <Card className="bg-teal-50 border-teal-200">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Moon className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-teal-900">
              <strong>Instructions:</strong> For each statement, rate how often it applies to you over the <strong>past month</strong> using the scale:
              <br />
              <strong>1 = Never, 2 = Rarely, 3 = Sometimes, 4 = Often, 5 = Always</strong>
              <br /><br />
              This questionnaire screens for 5 categories of sleep disorders: Sleep Apnea, Insomnia, Narcolepsy, Parasomnias, and Restless Legs/PLMD.
            </div>
          </div>
        </CardContent>
      </Card>

      {!showResults ? (
        <div className="space-y-4">
          <Tabs defaultValue="sleep_apnea" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-4">
              {Object.entries(SDQ_DOMAINS).map(([key, domain]) => {
                const color = domainColors[key];
                const completed = getCompletedCount(key);
                const total = getDomainTotal(key);
                return (
                  <TabsTrigger key={key} value={key} className="text-xs flex flex-col gap-1">
                    <span>{domain.label}</span>
                    <span className={`text-xs ${color.text}`}>
                      {completed}/{total}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Object.entries(SDQ_DOMAINS).map(([key, domain]) => {
              const color = domainColors[key];
              return (
                <TabsContent key={key} value={key} className="space-y-4">
                  <Card className={`${color.bg} ${color.border}`}>
                    <CardContent className="pt-4">
                      <h3 className={`font-semibold ${color.text}`}>{domain.label}</h3>
                      <p className="text-sm text-gray-600">{domain.description}</p>
                    </CardContent>
                  </Card>
                  {SDQ_ITEMS.filter(item => item.domain === key).map((item) => (
                    <Card key={item.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-gray-800">{item.number}. {item.question}</h3>
                          </div>
                          <RadioGroup
                            value={responses[item.id]?.toString() || ''}
                            onValueChange={(val) => handleResponseChange(item.id, parseInt(val))}
                          >
                            <div className="flex flex-wrap gap-4">
                              {[1, 2, 3, 4, 5].map((score) => (
                                <div key={score} className="flex items-center space-x-2">
                                  <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} />
                                  <Label htmlFor={`${item.id}-${score}`} className="cursor-pointer">
                                    <div className="text-center">
                                      <div className="font-semibold">{score}</div>
                                      <div className="text-xs text-gray-600">{SDQ_SCORING_GUIDE[score]}</div>
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
                </TabsContent>
              );
            })}
          </Tabs>

          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={!isComplete}
              className="bg-teal-600 hover:bg-teal-700"
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
            const domainScores = getDomainScores();
            return (
              <Card className={`border-2 ${totalScore > 120 ? 'border-red-200 bg-red-50' : totalScore > 90 ? 'border-orange-200 bg-orange-50' : totalScore > 60 ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'}`}>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Assessment Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {/* Total Score */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-center">
                        <div className={`text-5xl font-bold mb-2 ${
                          totalScore > 120 ? 'text-red-600' : totalScore > 90 ? 'text-orange-600' : totalScore > 60 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {totalScore}
                        </div>
                        <div className="text-sm text-gray-600">Total Sleep Disturbance Score (Scale: 30-150)</div>
                      </div>
                    </div>

                    {/* Domain Scores */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4">Domain Scores:</h3>
                      <div className="space-y-4">
                        {Object.entries(domainScores).map(([key, ds]) => {
                          const pct = getDomainPercentBar(ds.score, ds.max);
                          const color = domainColors[key];
                          let barColor = 'bg-green-500';
                          if (pct > 75) barColor = 'bg-red-500';
                          else if (pct > 50) barColor = 'bg-orange-500';
                          else if (pct > 25) barColor = 'bg-yellow-500';

                          return (
                            <div key={key}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-gray-700">{ds.label}</span>
                                <span className="text-sm font-semibold text-gray-900">
                                  {ds.score}/{ds.max} ({pct.toFixed(0)}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${barColor}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <span className={`text-xs ${color.text}`}>{ds.description}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Interpretation */}
                    <div className={`rounded-lg p-4 ${interpretation.severityColor}`}>
                      <div className="text-center mb-2">
                        <div className="text-xl font-semibold">
                          {interpretation.level}
                        </div>
                        <div className="text-sm mt-1 font-medium">
                          Severity: {interpretation.severity} (Range: {interpretation.range})
                        </div>
                      </div>
                      <p className="text-sm text-center mt-2">
                        {interpretation.description}
                      </p>
                    </div>

                    {/* Domain Item Breakdown */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Domain Item Responses:</h3>
                      <Tabs defaultValue="sleep_apnea" className="w-full">
                        <TabsList className="grid w-full grid-cols-5 mb-3">
                          {Object.entries(SDQ_DOMAINS).map(([key, domain]) => (
                            <TabsTrigger key={key} value={key} className="text-xs">
                              {domain.label}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {Object.entries(SDQ_DOMAINS).map(([key]) => (
                          <TabsContent key={key} value={key}>
                            <div className="space-y-1">
                              {SDQ_ITEMS.filter(item => item.domain === key).map(item => (
                                <div key={item.id} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                                  <span className="text-sm text-gray-700">{item.number}. {item.question}</span>
                                  <span className="text-sm font-semibold text-teal-600">
                                    {responses[item.id]} ({SDQ_SCORING_GUIDE[responses[item.id]]})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Clinical Recommendations:</h3>
                      <ul className="space-y-2">
                        {interpretation.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-700 flex gap-2">
                            <span className="font-medium text-teal-600 flex-shrink-0">{index + 1}.</span>
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
