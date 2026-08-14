import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { MDS_UPDRS_ITEMS, MDS_UPDRS_INTERPRETATION } from '@/data/mdsUpdrsScale';
import { ArrowLeft, RotateCcw, AlertCircle } from 'lucide-react';

interface MdsUpdrsAssessmentProps {
  onBack?: () => void;
}

export const MdsUpdrsAssessment = ({ onBack }: MdsUpdrsAssessmentProps) => {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleResponseChange = (itemId: string, score: number) => {
    setResponses(prev => ({ ...prev, [itemId]: score }));
  };

  const calculateTotalItems = () => {
    return MDS_UPDRS_ITEMS.reduce((acc, item) => acc + (item.isLateralized ? 2 : 1), 0);
  };

  const calculateFilledItems = () => {
    return Object.keys(responses).length;
  };

  const totalPossibleItems = calculateTotalItems();
  const filledItems = calculateFilledItems();
  const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
  const isComplete = totalPossibleItems === filledItems;
  const progress = Math.round((filledItems / totalPossibleItems) * 100);

  const handleSubmit = () => {
    if (isComplete) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setResponses({});
    setShowResults(false);
  };

  const getPartScores = () => {
    const part1 = MDS_UPDRS_ITEMS.filter(item => item.part === 'Part I').reduce((sum, item) => sum + (responses[item.id] || 0), 0);
    const part2 = MDS_UPDRS_ITEMS.filter(item => item.part === 'Part II').reduce((sum, item) => sum + (responses[item.id] || 0), 0);
    const part3 = MDS_UPDRS_ITEMS.filter(item => item.part === 'Part III').reduce((sum, item) => sum + (responses[item.id] || 0), 0);
    return { part1, part2, part3 };
  };

  const getInterpretation = () => {
    if (totalScore <= 30) return MDS_UPDRS_INTERPRETATION.mild;
    if (totalScore <= 59) return MDS_UPDRS_INTERPRETATION.moderate;
    return MDS_UPDRS_INTERPRETATION.severe;
  };

  const groupByPart = (part: string) => {
    return MDS_UPDRS_ITEMS.filter(item => item.part === part);
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
          <h1 className="text-3xl font-bold">MDS-UPDRS</h1>
          <p className="text-gray-600 text-sm mt-1">
            Movement Disorder Society Unified Parkinson's Disease Rating Scale
          </p>
        </div>
      </div>

      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6 space-y-3">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <strong>Instructions:</strong> This comprehensive scale assesses motor and non-motor symptoms
              of Parkinson's disease. Complete all three parts: Non-Motor, Motor Aspects of Daily Living, and Motor Examination.
            </div>
          </div>
        </CardContent>
      </Card>

      {!showResults ? (
        <div className="space-y-6">
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Assessment Progress</span>
              <span className="text-sm font-bold text-gray-700">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Tabs defaultValue="part1" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="part1">Part I: Non-Motor</TabsTrigger>
              <TabsTrigger value="part2">Part II: Motor Daily</TabsTrigger>
              <TabsTrigger value="part3">Part III: Motor Exam</TabsTrigger>
            </TabsList>

            <TabsContent value="part1" className="space-y-4 mt-4">
              <h2 className="text-lg font-semibold text-gray-800">Part I: Non-Motor Aspects of Experiences of Daily Living</h2>
              {groupByPart('Part I').map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.number}. {item.domain}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.question}</p>
                        <p className="text-sm text-gray-600 mt-1 italic">{item.description}</p>
                      </div>
                      <RadioGroup
                        value={responses[item.id]?.toString() || ''}
                        onValueChange={(val) => handleResponseChange(item.id, parseInt(val))}
                      >
                        <div className="space-y-2">
                          {Object.keys(item.scoring).map((scoreKey) => {
                            const score = parseInt(scoreKey);
                            return (
                              <div key={score} className="flex items-start space-x-2">
                                <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} />
                                <Label htmlFor={`${item.id}-${score}`} className="cursor-pointer flex-1">
                                  <div className="font-medium text-gray-700">{score}</div>
                                  <div className="text-sm text-gray-600">{item.scoring[score]}</div>
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="part2" className="space-y-4 mt-4">
              <h2 className="text-lg font-semibold text-gray-800">Part II: Motor Aspects of Experiences of Daily Living</h2>
              {groupByPart('Part II').map((item) => (
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
                          {Object.keys(item.scoring).map((scoreKey) => {
                            const score = parseInt(scoreKey);
                            return (
                              <div key={score} className="flex items-start space-x-2">
                                <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} />
                                <Label htmlFor={`${item.id}-${score}`} className="cursor-pointer flex-1">
                                  <div className="font-medium text-gray-700">{score}</div>
                                  <div className="text-sm text-gray-600">{item.scoring[score]}</div>
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="part3" className="space-y-4 mt-4">
              <h2 className="text-lg font-semibold text-gray-800">Part III: Motor Examination</h2>
              <p className="text-sm text-gray-600 italic">
                Physical examination findings. Evaluate through direct observation and clinical testing.
              </p>
              {groupByPart('Part III').map((item) => (
                <Card key={item.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.number}. {item.question}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>

                      {item.isLateralized ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                              Left Side
                            </h4>
                            <RadioGroup
                              value={responses[`${item.id}_L`]?.toString() || ''}
                              onValueChange={(val) => handleResponseChange(`${item.id}_L`, parseInt(val))}
                            >
                              <div className="space-y-2">
                                {Object.keys(item.scoring).map((scoreKey) => {
                                  const score = parseInt(scoreKey);
                                  return (
                                    <div key={score} className="flex items-start space-x-2 p-1 hover:bg-gray-50 rounded transition-colors">
                                      <RadioGroupItem value={score.toString()} id={`${item.id}-L-${score}`} />
                                      <Label htmlFor={`${item.id}-L-${score}`} className="cursor-pointer flex-1">
                                        <div className="font-medium text-gray-700">{score} - {item.scoring[score]}</div>
                                      </Label>
                                    </div>
                                  );
                                })}
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-red-600 uppercase tracking-wider flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-600"></span>
                              Right Side
                            </h4>
                            <RadioGroup
                              value={responses[`${item.id}_R`]?.toString() || ''}
                              onValueChange={(val) => handleResponseChange(`${item.id}_R`, parseInt(val))}
                            >
                              <div className="space-y-2">
                                {Object.keys(item.scoring).map((scoreKey) => {
                                  const score = parseInt(scoreKey);
                                  return (
                                    <div key={score} className="flex items-start space-x-2 p-1 hover:bg-gray-50 rounded transition-colors">
                                      <RadioGroupItem value={score.toString()} id={`${item.id}-R-${score}`} />
                                      <Label htmlFor={`${item.id}-R-${score}`} className="cursor-pointer flex-1">
                                        <div className="font-medium text-gray-700">{score} - {item.scoring[score]}</div>
                                      </Label>
                                    </div>
                                  );
                                })}
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      ) : (
                        <RadioGroup
                          value={responses[item.id]?.toString() || ''}
                          onValueChange={(val) => handleResponseChange(item.id, parseInt(val))}
                        >
                          <div className="space-y-2">
                            {Object.keys(item.scoring).map((scoreKey) => {
                              const score = parseInt(scoreKey);
                              return (
                                <div key={score} className="flex items-start space-x-2">
                                  <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} />
                                  <Label htmlFor={`${item.id}-${score}`} className="cursor-pointer flex-1">
                                    <div className="font-medium text-gray-700">{score}</div>
                                    <div className="text-sm text-gray-600">{item.scoring[score]}</div>
                                  </Label>
                                </div>
                              );
                            })}
                          </div>
                        </RadioGroup>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={!isComplete}
              className="bg-blue-600 hover:bg-blue-700"
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
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg text-green-900">Assessment Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {(() => {
              const interpretation = getInterpretation();
              const partScores = getPartScores();
              return (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-green-600 mb-2">
                        {totalScore}
                      </div>
                      <div className="text-sm text-gray-600">Total Score</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="text-sm text-blue-900 font-semibold">Part I</div>
                      <div className="text-3xl font-bold text-blue-600 mt-2">{partScores.part1}</div>
                      <div className="text-xs text-blue-700 mt-1">Non-Motor</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="text-sm text-purple-900 font-semibold">Part II</div>
                      <div className="text-3xl font-bold text-purple-600 mt-2">{partScores.part2}</div>
                      <div className="text-xs text-purple-700 mt-1">Motor Daily</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <div className="text-sm text-orange-900 font-semibold">Part III</div>
                      <div className="text-3xl font-bold text-orange-600 mt-2">{partScores.part3}</div>
                      <div className="text-xs text-orange-700 mt-1">Motor Exam</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="text-center mb-2">
                      <div className="text-xl font-semibold text-gray-800">
                        {interpretation.level}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{interpretation.range}</div>
                    </div>
                    <p className="text-sm text-gray-700 text-center">
                      {interpretation.description}
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2">Clinical Recommendations:</h3>
                    <p className="text-sm text-yellow-800">
                      {totalScore <= 30
                        ? 'Mild Parkinson\'s disease symptoms. Continue current therapy and monitor progression.'
                        : totalScore <= 59
                        ? 'Moderate Parkinson\'s disease. Review medication efficacy and consider optimization. Monitor for complications.'
                        : 'Severe Parkinson\'s disease. Comprehensive medication review, consider specialist consultation, evaluate for advanced therapies (deep brain stimulation, pump therapies).'}
                    </p>
                  </div>
                </div>
              );
            })()}

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
      )}
    </div>
  );
};
