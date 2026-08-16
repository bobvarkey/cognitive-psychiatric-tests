import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { MDS_UPDRS_ITEMS, MDS_UPDRS_INTERPRETATION } from '@/data/mdsUpdrsScale';
import { ArrowLeft, RotateCcw, AlertCircle, Brain, Activity, Stethoscope, CheckCircle2 } from 'lucide-react';

interface MdsUpdrsAssessmentProps {
  onBack?: () => void;
}

export const MdsUpdrsAssessment = ({ onBack }: MdsUpdrsAssessmentProps) => {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const handleResponseChange = (itemId: string, score: number) => {
    setResponses(prev => ({ ...prev, [itemId]: score }));
    setShowValidationErrors(false);
  };

  const calculateTotalItems = () => {
    return MDS_UPDRS_ITEMS.reduce((acc, item) => {
      if (!item.isLateralized) return acc + 1;
      if (item.id === 'resting_tremor_amplitude') return acc + 5; // Lip/Jaw, RUE, LUE, RLE, LLE
      if (item.id === 'rigidity') return acc + 5; // Neck, RUE, LUE, RLE, LLE
      return acc + 2; // Default lateralized (R/L)
    }, 0);
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
    if (!isComplete) {
      setShowValidationErrors(true);
      return;
    }
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setResponses({});
    setShowResults(false);
  };

  const getPartScores = () => {
    const part1 = MDS_UPDRS_ITEMS.filter(item => item.part === 'Part I').reduce((sum, item) => sum + (responses[item.id] || 0), 0);
    
    // Part II with lateralization
    const part2Items = MDS_UPDRS_ITEMS.filter(item => item.part === 'Part II');
    let part2L = 0;
    let part2R = 0;
    let part2NonLat = 0;
    
    part2Items.forEach(item => {
      if (item.isLateralized) {
        part2L += (responses[`${item.id}_L`] || 0);
        part2R += (responses[`${item.id}_R`] || 0);
      } else {
        part2NonLat += (responses[item.id] || 0);
      }
    });
    
    const part2 = part2NonLat + part2L + part2R;

    const part3 = MDS_UPDRS_ITEMS.filter(item => item.part === 'Part III').reduce((sum, item) => {
      if (!item.isLateralized) {
        return sum + (responses[item.id] || 0);
      }
      if (item.id === 'resting_tremor_amplitude' || item.id === 'rigidity') {
        const suffixes = item.id === 'rigidity' ? ['Neck', 'RUE', 'LUE', 'RLE', 'LLE'] : ['LipJaw', 'RUE', 'LUE', 'RLE', 'LLE'];
        return sum + suffixes.reduce((s, suffix) => s + (responses[`${item.id}_${suffix}`] || 0), 0);
      }
      return sum + (responses[`${item.id}_L`] || 0) + (responses[`${item.id}_R`] || 0);
    }, 0);
    
    return { part1, part2, part2L, part2R, part2NonLat, part3 };
  };

  const getInterpretation = () => {
    if (totalScore <= 32) return MDS_UPDRS_INTERPRETATION.mild;
    if (totalScore <= 58) return MDS_UPDRS_INTERPRETATION.moderate;
    return MDS_UPDRS_INTERPRETATION.severe;
  };

  const groupByPart = (part: string) => {
    return MDS_UPDRS_ITEMS.filter(item => item.part === part);
  };

  const getPartProgress = (part: string) => {
    const items = groupByPart(part);
    const total = items.reduce((acc, item) => {
      if (!item.isLateralized) return acc + 1;
      if (item.id === 'resting_tremor_amplitude') return acc + 5;
      if (item.id === 'rigidity' && item.part === 'Part III') return acc + 5;
      return acc + 2;
    }, 0);
    const filled = items.reduce((acc, item) => {
      if (!item.isLateralized) {
        return acc + (responses[item.id] !== undefined ? 1 : 0);
      }
      if (item.id === 'resting_tremor_amplitude' || (item.id === 'rigidity' && item.part === 'Part III')) {
        const suffixes = item.id === 'rigidity' ? ['Neck', 'RUE', 'LUE', 'RLE', 'LLE'] : ['LipJaw', 'RUE', 'LUE', 'RLE', 'LLE'];
        return acc + suffixes.reduce((s, suffix) => s + (responses[`${item.id}_${suffix}`] !== undefined ? 1 : 0), 0);
      }
      return acc + (responses[`${item.id}_L`] !== undefined ? 1 : 0) + (responses[`${item.id}_R`] !== undefined ? 1 : 0);
    }, 0);
    return { filled, total, complete: filled === total };
  };

  const part1Progress = getPartProgress('Part I');
  const part2Progress = getPartProgress('Part II');
  const part3Progress = getPartProgress('Part III');

  const renderLateralizedRadios = (item: any, id: string, label: string, color: string) => (
    <div className={`space-y-4 p-3 rounded-lg border bg-white shadow-sm ${showValidationErrors && responses[id] === undefined ? 'ring-2 ring-red-500 border-red-500' : 'border-gray-100'} hover:border-blue-200 transition-colors`}>
      <h4 className={`text-sm font-bold ${color} uppercase tracking-wider flex items-center gap-2`}>
        <span className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')}`}></span>
        {label}
      </h4>
      <RadioGroup
        value={responses[id]?.toString() || ''}
        onValueChange={(val) => handleResponseChange(id, parseInt(val))}
      >
        <div className="space-y-2">
          {Object.keys(item.scoring).map((scoreKey) => {
            const score = parseInt(scoreKey);
            return (
              <div key={score} className="flex items-start space-x-2 p-1.5 hover:bg-gray-50 rounded transition-colors group border border-transparent hover:border-gray-200">
                <RadioGroupItem value={score.toString()} id={`${id}-${score}`} className="mt-1" />
                <Label htmlFor={`${id}-${score}`} className="cursor-pointer flex-1">
                  <div className="font-medium text-gray-800 text-sm">{score} - {item.scoring[score]}</div>
                </Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>
    </div>
  );

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
              <strong>Instructions:</strong> Complete all sections. Part III (Motor Exam) requires physical examination. 
              Asymmetrical symptoms must be scored separately for each limb or side.
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
            <TabsList className="grid w-full grid-cols-3 bg-gray-100/50 p-1 rounded-xl h-auto min-h-[3.5rem] shadow-inner gap-1">
              <TabsTrigger 
                value="part1" 
                className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-md font-semibold transition-all hover:bg-blue-50 border border-transparent data-[state=active]:border-blue-400"
              >
                <span className="flex items-center gap-1.5">
                  <Brain className="w-4 h-4" />
                  I: Non-Motor
                </span>
                <span className={`text-[10px] font-medium transition-colors ${part1Progress.complete ? 'text-green-500' : 'text-gray-400'}`}>
                  {part1Progress.complete ? (
                    <span className="flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" />Complete</span>
                  ) : (
                    `${part1Progress.filled}/${part1Progress.total}`
                  )}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="part2" 
                className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white data-[state=active]:shadow-md font-semibold transition-all hover:bg-purple-50 border border-transparent data-[state=active]:border-purple-400"
              >
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  II: Daily
                </span>
                <span className={`text-[10px] font-medium transition-colors ${part2Progress.complete ? 'text-green-500' : 'text-gray-400'}`}>
                  {part2Progress.complete ? (
                    <span className="flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" />Complete</span>
                  ) : (
                    `${part2Progress.filled}/${part2Progress.total}`
                  )}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="part3" 
                className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md font-semibold transition-all hover:bg-orange-50 border border-transparent data-[state=active]:border-orange-400"
              >
                <span className="flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4" />
                  III: Exam
                </span>
                <span className={`text-[10px] font-medium transition-colors ${part3Progress.complete ? 'text-green-500' : 'text-gray-400'}`}>
                  {part3Progress.complete ? (
                    <span className="flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" />Complete</span>
                  ) : (
                    `${part3Progress.filled}/${part3Progress.total}`
                  )}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="part1" className="space-y-4 mt-4">
              <h2 className="text-lg font-semibold text-gray-800">Part I: Non-Motor Aspects of Experiences of Daily Living</h2>
              {groupByPart('Part I').map((item) => (
                <Card key={item.id} className={`${showValidationErrors && responses[item.id] === undefined ? 'border-2 border-red-500' : 'border-l-4 border-l-blue-400'}`}>
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
                              <div key={score} className="flex items-start space-x-2 p-1.5 hover:bg-gray-50 rounded transition-colors group border border-transparent hover:border-gray-200">
                                <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} className="mt-1" />
                                <Label htmlFor={`${item.id}-${score}`} className="cursor-pointer flex-1">
                                  <div className="font-medium text-gray-800 text-sm">{score} - {item.scoring[score]}</div>
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
                <Card key={item.id} className={`${item.isLateralized ? 'border-l-4 border-l-purple-400 bg-purple-50/10' : 'border-l-4 border-l-purple-400'} ${showValidationErrors && (item.isLateralized ? (responses[`${item.id}_L`] === undefined || responses[`${item.id}_R`] === undefined) : responses[item.id] === undefined) ? 'border-2 border-red-500' : ''}`}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.number}. {item.question}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                      {item.isLateralized ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderLateralizedRadios(item, `${item.id}_R`, 'Right Side', 'text-red-600')}
                          {renderLateralizedRadios(item, `${item.id}_L`, 'Left Side', 'text-blue-600')}
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
                                <div key={score} className="flex items-start space-x-2 p-1.5 hover:bg-gray-50 rounded transition-colors group border border-transparent hover:border-gray-200">
                                  <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} className="mt-1" />
                                  <Label htmlFor={`${item.id}-${score}`} className="cursor-pointer flex-1">
                                    <div className="font-medium text-gray-800 text-sm">{score} - {item.scoring[score]}</div>
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

            <TabsContent value="part3" className="space-y-4 mt-4">
              <h2 className="text-lg font-semibold text-gray-800">Part III: Motor Examination</h2>
              <p className="text-sm text-gray-600 italic">
                Physical examination findings. Evaluate through direct observation and clinical testing.
              </p>
              {groupByPart('Part III').map((item) => (
                <Card key={item.id} className={`${item.isLateralized ? 'border-l-4 border-l-blue-500 bg-blue-50/10' : ''} ${showValidationErrors && (item.isLateralized ? (item.id === 'rigidity' || item.id === 'resting_tremor_amplitude' ? false : (responses[`${item.id}_L`] === undefined || responses[`${item.id}_R`] === undefined)) : responses[item.id] === undefined) ? 'border-2 border-red-500' : ''}`}>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.number}. {item.question}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>

                      {item.isLateralized ? (
                        <>
                          {(item.id === 'rigidity' || item.id === 'resting_tremor_amplitude') ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {item.id === 'rigidity' ? (
                                <>
                                  {renderLateralizedRadios(item, `${item.id}_Neck`, 'Neck', 'text-slate-600')}
                                  {renderLateralizedRadios(item, `${item.id}_RUE`, 'Right Upper Extremity', 'text-red-600')}
                                  {renderLateralizedRadios(item, `${item.id}_LUE`, 'Left Upper Extremity', 'text-blue-600')}
                                  {renderLateralizedRadios(item, `${item.id}_RLE`, 'Right Lower Extremity', 'text-red-600')}
                                  {renderLateralizedRadios(item, `${item.id}_LLE`, 'Left Lower Extremity', 'text-blue-600')}
                                </>
                              ) : (
                                <>
                                  {renderLateralizedRadios(item, `${item.id}_LipJaw`, 'Lip/Jaw', 'text-slate-600')}
                                  {renderLateralizedRadios(item, `${item.id}_RUE`, 'Right Upper Extremity', 'text-red-600')}
                                  {renderLateralizedRadios(item, `${item.id}_LUE`, 'Left Upper Extremity', 'text-blue-600')}
                                  {renderLateralizedRadios(item, `${item.id}_RLE`, 'Right Lower Extremity', 'text-red-600')}
                                  {renderLateralizedRadios(item, `${item.id}_LLE`, 'Left Lower Extremity', 'text-blue-600')}
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {renderLateralizedRadios(item, `${item.id}_L`, 'Left Side', 'text-blue-600')}
                              {renderLateralizedRadios(item, `${item.id}_R`, 'Right Side', 'text-red-600')}
                            </div>
                          )}
                        </>
                      ) : (
                        <RadioGroup
                          value={responses[item.id]?.toString() || ''}
                          onValueChange={(val) => handleResponseChange(item.id, parseInt(val))}
                        >
                          <div className="space-y-2">
                            {Object.keys(item.scoring).map((scoreKey) => {
                              const score = parseInt(scoreKey);
                              return (
                                <div key={score} className="flex items-start space-x-2 p-1.5 hover:bg-gray-50 rounded transition-colors group border border-transparent hover:border-gray-200">
                                  <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} className="mt-1" />
                                  <Label htmlFor={`${item.id}-${score}`} className="cursor-pointer flex-1">
                                    <div className="font-medium text-gray-800 text-sm">{score} - {item.scoring[score]}</div>
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

          <div className="flex flex-col gap-4">
            {showValidationErrors && !isComplete && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                Please complete all items before calculating the score. Missing responses are highlighted below.
              </div>
            )}
            <div className="flex gap-4">
              <Button
                onClick={handleSubmit}
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
                  <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 rounded-2xl border border-green-200 dark:border-green-800/50 shadow-lg">
                    <div className="text-center">
                      <div className="text-sm font-bold text-green-800 dark:text-green-300 uppercase tracking-widest mb-1">MDS-UPDRS Total</div>
                      <div className="text-7xl font-black text-green-600 dark:text-green-400 tabular-nums drop-shadow-sm leading-none">
                        {totalScore}
                      </div>
                      <div className="mt-4 px-4 py-1.5 bg-green-200/50 dark:bg-green-800/40 rounded-full text-green-900 dark:text-green-200 text-sm font-bold">
                        {interpretation.level}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
                      <div className="text-sm text-blue-900 dark:text-blue-300 font-semibold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Part I
                      </div>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{partScores.part1}</div>
                      <div className="text-xs text-blue-700 dark:text-blue-300/70 mt-1">Non-Motor</div>
                    </div>
                    <div className="bg-purple-50/50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/30 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
                      <div className="text-sm text-purple-900 dark:text-purple-300 font-semibold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        Part II
                      </div>
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">{partScores.part2}</div>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <span className="text-[10px] text-purple-700 dark:text-purple-300/70 uppercase font-bold tracking-tight">Daily Living Activities</span>
                        <div className="flex gap-2 text-[9px] font-black">
                          <span className="text-blue-600 dark:text-blue-400">L: {partScores.part2L}</span>
                          <span className="text-red-600 dark:text-red-400">R: {partScores.part2R}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-50/50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200/50 dark:border-orange-800/30 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
                      <div className="text-sm text-orange-900 dark:text-orange-300 font-semibold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        Part III (Motor Examination)
                      </div>
                      <div className="text-4xl font-black text-orange-600 dark:text-orange-400 mt-2 tabular-nums">{partScores.part3}</div>
                      <div className="text-xs text-orange-700 dark:text-orange-300/70 mt-1 uppercase font-bold tracking-tighter">Motor Score Only</div>
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
                      {totalScore <= 32
                        ? 'Mild Parkinson\'s disease symptoms. Continue current therapy and monitor progression.'
                        : totalScore <= 58
                        ? 'Moderate Parkinson\'s disease. Review medication efficacy and consider optimization. Monitor for complications.'
                        : 'Severe Parkinson\'s disease. Comprehensive medication review, consider specialist consultation, evaluate for advanced therapies (deep brain stimulation, pump therapies).'}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-orange-500" />
                      Part III: Motor Examination Breakdown
                    </h3>
                    <div className="space-y-4">
                      {groupByPart('Part III').map((item) => {
                        if (!item.isLateralized) {
                          const score = responses[item.id];
                          if (score === undefined) return null;
                          return (
                            <div key={item.id} className="flex justify-between items-center text-sm py-1 border-b border-gray-100 last:border-0">
                              <span className="text-gray-700 font-medium">{item.number}. {item.question}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 italic">{item.scoring[score]}</span>
                                <span className="font-bold text-orange-600">+{score}</span>
                              </div>
                            </div>
                          );
                        }

                        // Lateralized items
                        let subItems: { label: string; id: string }[] = [];
                        if (item.id === 'rigidity') {
                          subItems = [
                            { label: 'Neck', id: `${item.id}_Neck` },
                            { label: 'RUE', id: `${item.id}_RUE` },
                            { label: 'LUE', id: `${item.id}_LUE` },
                            { label: 'RLE', id: `${item.id}_RLE` },
                            { label: 'LLE', id: `${item.id}_LLE` },
                          ];
                        } else if (item.id === 'resting_tremor_amplitude') {
                          subItems = [
                            { label: 'Lip/Jaw', id: `${item.id}_LipJaw` },
                            { label: 'RUE', id: `${item.id}_RUE` },
                            { label: 'LUE', id: `${item.id}_LUE` },
                            { label: 'RLE', id: `${item.id}_RLE` },
                            { label: 'LLE', id: `${item.id}_LLE` },
                          ];
                        } else {
                          subItems = [
                            { label: 'Left', id: `${item.id}_L` },
                            { label: 'Right', id: `${item.id}_R` },
                          ];
                        }

                        return (
                          <div key={item.id} className="py-2 border-b border-gray-100 last:border-0">
                            <div className="text-sm font-semibold text-gray-800 mb-1">{item.number}. {item.question}</div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-4">
                              {subItems.map((sub) => {
                                const score = responses[sub.id];
                                if (score === undefined) return null;
                                return (
                                  <div key={sub.id} className="flex flex-col bg-gray-50 p-2 rounded border border-gray-100">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold">{sub.label}</span>
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] text-gray-600 truncate mr-1" title={item.scoring[score]}>{item.scoring[score]}</span>
                                      <span className="font-bold text-orange-600">+{score}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-blue-500" />
                      Part I: Non-Motor Examination Breakdown
                    </h3>
                    <div className="space-y-4">
                      {groupByPart('Part I').map((item) => {
                        const score = responses[item.id];
                        if (score === undefined) return null;
                        return (
                          <div key={item.id} className="flex justify-between items-center text-sm py-1 border-b border-gray-100 last:border-0">
                            <span className="text-gray-700 font-medium">{item.number}. {item.domain}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500 italic">{item.scoring[score]}</span>
                              <span className="font-bold text-blue-600">+{score}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-500" />
                      Part II: Motor Aspects of Daily Living Breakdown
                    </h3>
                    <div className="space-y-4">
                      {groupByPart('Part II').map((item) => {
                        if (!item.isLateralized) {
                          const score = responses[item.id];
                          if (score === undefined) return null;
                          return (
                            <div key={item.id} className="flex justify-between items-center text-sm py-1 border-b border-gray-100 last:border-0">
                              <span className="text-gray-700 font-medium">{item.number}. {item.question}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 italic">{item.scoring[score]}</span>
                                <span className="font-bold text-purple-600">+{score}</span>
                              </div>
                            </div>
                          );
                        }

                        // Lateralized Part II items
                        const subItems = [
                          { label: 'Left', id: `${item.id}_L` },
                          { label: 'Right', id: `${item.id}_R` },
                        ];

                        return (
                          <div key={item.id} className="py-2 border-b border-gray-100 last:border-0">
                            <div className="text-sm font-semibold text-gray-800 mb-1">{item.number}. {item.question}</div>
                            <div className="grid grid-cols-2 gap-2 pl-4">
                              {subItems.map((sub) => {
                                const score = responses[sub.id];
                                if (score === undefined) return null;
                                return (
                                  <div key={sub.id} className="flex flex-col bg-gray-50 p-2 rounded border border-gray-100">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold">{sub.label}</span>
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] text-gray-600 truncate mr-1" title={item.scoring[score]}>{item.scoring[score]}</span>
                                      <span className="font-bold text-purple-600">+{score}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
