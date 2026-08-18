import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BERLIN_ITEMS, BERLIN_CATEGORY_DEFINITIONS, BERLIN_INTERPRETATION } from '@/data/berlinQuestionnaire';
import { ArrowLeft, RotateCcw, User } from 'lucide-react';
import { ExportButtons } from '@/components/ExportButtons';
import { type ReportData } from '@/utils/reportGenerator';

interface BerlinAssessmentProps {
  onBack?: () => void;
}

interface PatientInfo {
  name: string;
  age: string;
  mrNumber: string;
}

export const BerlinAssessment = ({ onBack }: BerlinAssessmentProps) => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({ name: '', age: '', mrNumber: '' });
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [started, setStarted] = useState(false);

  const handleResponseChange = (itemId: string, score: number) => {
    setResponses(prev => ({ ...prev, [itemId]: score }));
  };

  const isComplete = BERLIN_ITEMS.length === Object.keys(responses).length;

  const getCategoryScore = (categoryId: 1 | 2 | 3): number => {
    const def = BERLIN_CATEGORY_DEFINITIONS[categoryId];
    return def.items.reduce((sum, itemId) => sum + (responses[itemId] || 0), 0);
  };

  const getCategoryPositive = (categoryId: 1 | 2 | 3): boolean => {
    const score = getCategoryScore(categoryId);
    return score >= BERLIN_CATEGORY_DEFINITIONS[categoryId].positiveThreshold;
  };

  const getPositiveCategoryCount = (): number => {
    return [1, 2, 3].filter(cat => getCategoryPositive(cat as 1 | 2 | 3)).length;
  };

  const getHighRisk = (): boolean => {
    return getPositiveCategoryCount() >= 2;
  };

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

  const buildReportData = (): ReportData => {
    const highRisk = getHighRisk();
    const interpretation = highRisk ? BERLIN_INTERPRETATION.highRisk : BERLIN_INTERPRETATION.lowRisk;

    return {
      assessmentName: 'Berlin Questionnaire',
      date: new Date().toLocaleDateString(),
      totalScore: `${getPositiveCategoryCount()} of 3 categories positive`,
      interpretation: interpretation.description,
      severity: interpretation.severity,
      patientInfo: {
        Name: patientInfo.name || 'Not provided',
        Age: patientInfo.age || 'Not provided',
        'MR Number': patientInfo.mrNumber || 'Not provided'
      },
      sections: [
        {
          title: 'Category Results',
          type: 'info',
          items: [1, 2, 3].map(catId => {
            const cat = catId as 1 | 2 | 3;
            const score = getCategoryScore(cat);
            const positive = getCategoryPositive(cat);
            return `Category ${catId}: ${BERLIN_CATEGORY_DEFINITIONS[cat].name} — Score: ${score} (Threshold: ${BERLIN_CATEGORY_DEFINITIONS[cat].positiveThreshold}) — ${positive ? 'POSITIVE' : 'NEGATIVE'}`;
          })
        },
        {
          title: 'Recommendations',
          type: highRisk ? 'positive' : 'negative',
          items: interpretation.recommendations
        }
      ],
      disclaimer: 'The Berlin Questionnaire is a screening tool for OSA risk. A definitive diagnosis requires objective sleep testing (PSG or HSAT).'
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
            <h1 className="text-3xl font-bold">Berlin Questionnaire</h1>
            <p className="text-gray-600 text-sm mt-1">OSA Risk Screening Tool</p>
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
                <Label htmlFor="berlin-name">Patient Name</Label>
                <Input
                  id="berlin-name"
                  placeholder="Enter patient name"
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="berlin-age">Age</Label>
                <Input
                  id="berlin-age"
                  placeholder="Enter age"
                  value={patientInfo.age}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="berlin-mr">MR Number</Label>
                <Input
                  id="berlin-mr"
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
          <h1 className="text-3xl font-bold">Berlin Questionnaire</h1>
          <p className="text-gray-600 text-sm mt-1">OSA Risk Screening Tool</p>
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
            <strong>Instructions:</strong> The Berlin Questionnaire assesses risk of Obstructive Sleep Apnea (OSA)
            across three categories: (1) Snoring & Apnea, (2) Daytime Sleepiness, (3) Hypertension/BMI.
            Answer all questions. High risk = 2 or more positive categories.
          </p>
          <div className="grid grid-cols-3 gap-3 text-xs">
            {Object.entries(BERLIN_CATEGORY_DEFINITIONS).map(([catId, def]) => (
              <div key={catId} className="bg-white p-2 rounded border border-blue-200">
                <div className="font-semibold text-center text-blue-800">Category {catId}</div>
                <div className="text-center text-gray-600">{def.name}</div>
                <div className="text-center text-muted-foreground mt-1">Threshold: &ge; {def.positiveThreshold}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {!showResults ? (
        <div className="space-y-4">
          {BERLIN_ITEMS.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 text-xs font-semibold rounded-full w-6 h-6">
                        C{item.category}
                      </span>
                      <h3 className="font-semibold text-gray-800">{item.number}. {item.question}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                  <RadioGroup
                    value={responses[item.id]?.toString() ?? ''}
                    onValueChange={(val) => handleResponseChange(item.id, parseInt(val))}
                  >
                    <div className={`grid gap-3 ${item.options.length > 3 ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'}`}>
                      {item.options.map((option, optIdx) => (
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
              Calculate Risk
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      ) : (
        <Card className={`border-2 ${getHighRisk() ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${getHighRisk() ? 'text-red-900' : 'text-green-900'}`}>
              Assessment Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {(() => {
              const highRisk = getHighRisk();
              const interpretation = highRisk ? BERLIN_INTERPRETATION.highRisk : BERLIN_INTERPRETATION.lowRisk;
              const positiveCount = getPositiveCategoryCount();
              const color = highRisk ? 'red' : 'green';
              const borderColor = highRisk ? 'border-red-200' : 'border-green-200';
              return (
                <div className="space-y-4">
                  <div className={`bg-white rounded-lg p-4 border ${borderColor}`}>
                    <div className="text-center">
                      <div className={`text-5xl font-bold mb-2 ${highRisk ? 'text-red-600' : 'text-green-600'}`}>
                        {positiveCount}/3
                      </div>
                      <div className="text-sm text-gray-600">Positive Categories (Scale: 0-3)</div>
                    </div>
                  </div>

                  <div className={`bg-white rounded-lg p-4 border ${borderColor}`}>
                    <div className="text-center mb-2">
                      <div className={`text-xl font-semibold ${highRisk ? 'text-red-800' : 'text-green-800'}`}>
                        {interpretation.level}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {highRisk ? '2 or more categories positive' : '0-1 categories positive'}
                      </div>
                    </div>
                    <div className="inline-block mx-auto px-3 py-1 rounded-full text-sm font-semibold mt-2"
                      style={{
                        backgroundColor: highRisk ? '#fee2e2' : '#dcfce7',
                        color: highRisk ? '#991b1b' : '#166534'
                      }}
                    >
                      Severity: {interpretation.severity} Risk
                    </div>
                    <p className="text-sm text-gray-700 text-center mt-3">{interpretation.description}</p>
                  </div>

                  <div className={`bg-white rounded-lg p-4 border ${borderColor}`}>
                    <h3 className="font-semibold text-gray-800 mb-3">Category Breakdown:</h3>
                    <div className="space-y-2">
                      {([1, 2, 3] as const).map(catId => {
                        const score = getCategoryScore(catId);
                        const positive = getCategoryPositive(catId);
                        const def = BERLIN_CATEGORY_DEFINITIONS[catId];
                        return (
                          <div key={catId} className={`flex items-center justify-between p-2 rounded ${positive ? 'bg-red-50 border border-red-100' : 'bg-gray-50 border border-gray-100'}`}>
                            <div>
                              <span className="text-sm font-semibold text-gray-700">Category {catId}: {def.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Score: {score}/{def.items.length * 2}</span>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${positive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {positive ? 'POSITIVE' : 'NEGATIVE'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className={`${color === 'green' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'} rounded-lg p-4`}>
                    <h3 className={`font-semibold mb-2 ${color === 'green' ? 'text-green-900' : 'text-red-900'}`}>
                      Recommendations:
                    </h3>
                    <ul className={`text-sm space-y-1 ${color === 'green' ? 'text-green-800' : 'text-red-800'}`}>
                      {interpretation.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-0.5">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {highRisk && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">Clinical Note:</h3>
                      <p className="text-sm text-blue-800">
                        High-risk patients should be prioritized for sleep evaluation. Untreated OSA is associated with
                        increased risk of cardiovascular disease, stroke, hypertension, metabolic syndrome, cognitive impairment,
                        and motor vehicle accidents due to excessive daytime sleepiness.
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
