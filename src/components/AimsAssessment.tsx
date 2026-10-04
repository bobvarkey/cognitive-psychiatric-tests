import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AIMS_ITEMS, AIMS_INTERPRETATION } from '@/data/aimsScale';
import {
  SCHOOLER_KANE_NAME,
  SK_CRITERIA_LABELS,
  SK_EXPOSURE_LABEL,
  SK_IMAGE_ALT,
  SK_IMAGE_CAPTION,
} from '@/data/schoolerKaneCriteria';
import schoolerKaneImg from '@/assets/schooler-kane-criteria.png';
import { ArrowLeft, RotateCcw, AlertCircle, BookOpen, Maximize2 } from 'lucide-react';
import { ExportButtons } from './ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

interface AimsAssessmentProps {
  onBack?: () => void;
}

export const AimsAssessment = ({ onBack }: AimsAssessmentProps) => {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleResponseChange = (itemId: string, score: number) => {
    setResponses(prev => ({ ...prev, [itemId]: score }));
  };

  const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
  const isComplete = AIMS_ITEMS.length === Object.keys(responses).length;

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
    if (totalScore <= 8) return AIMS_INTERPRETATION.normal;
    if (totalScore <= 15) return AIMS_INTERPRETATION.borderline;
    if (totalScore <= 25) return AIMS_INTERPRETATION.mild;
    if (totalScore <= 40) return AIMS_INTERPRETATION.moderate;
    return AIMS_INTERPRETATION.severe;
  };

  const getAreaScores = () => {
    const orofacial = AIMS_ITEMS.slice(0, 4).reduce((sum, item) => sum + (responses[item.id] || 0), 0);
    const extremities = AIMS_ITEMS.slice(4, 8).reduce((sum, item) => sum + (responses[item.id] || 0), 0);
    const trunk = (responses['trunk'] || 0);
    const global = (responses['global_severity'] || 0) + (responses['incapacity'] || 0);
    return { orofacial, extremities, trunk, global };
  };

  const reportData: ReportData = {
    assessmentName: 'AIMS (Abnormal Involuntary Movement Scale)',
    date: new Date().toLocaleString(),
    totalScore: `${totalScore}/44`,
    interpretation: `${getInterpretation().level} — ${getInterpretation().description}`,
    severity: getInterpretation().level,
    sections: [
      {
        title: 'Area Scores',
        items: [
          `Orofacial (Items 1-4): ${getAreaScores().orofacial}`,
          `Extremities (Items 5-8): ${getAreaScores().extremities}`,
          `Trunk (Item 9): ${getAreaScores().trunk}`,
          `Global Assessment (Items 10-11): ${getAreaScores().global}`,
        ],
        type: 'info',
      },
      {
        title: 'Item Scores',
        items: AIMS_ITEMS.map((item) => `${item.number}. ${item.body_region}: ${responses[item.id] ?? 0}`),
        type: 'info',
      },
    ],
    disclaimer: 'AIMS is a clinician-rated scale for dyskinesia; clinical interpretation required.',
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
          <h1 className="text-3xl font-bold">Abnormal Involuntary Movement Scale</h1>
          <p className="text-gray-600 text-sm mt-1">
            AIMS - Assess dyskinesia and involuntary movements
          </p>
        </div>
      </div>

      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6 space-y-3">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <strong>Instructions:</strong> Observe the patient for involuntary movements and rate their presence and severity.
              Rate each area based on observation during the assessment.
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-primary/30 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 shrink-0 text-primary" />
            {SCHOOLER_KANE_NAME}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Clinical interpretation guidance for identifying probable tardive dyskinesia from AIMS findings.
          </p>
        </CardHeader>
        <CardContent className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-start">
          <figure className="min-w-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="group relative h-auto min-h-11 w-full overflow-hidden p-0"
                  aria-label="Enlarge Schooler-Kane criteria infographic"
                >
                  <img
                    src={schoolerKaneImg}
                    alt={SK_IMAGE_ALT}
                    className="h-auto w-full"
                    loading="lazy"
                  />
                  <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-xs font-medium text-foreground shadow-sm">
                    <Maximize2 className="h-3.5 w-3.5" /> Enlarge
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[95vh] max-w-[95vw] overflow-auto p-2 sm:p-4">
                <DialogTitle className="sr-only">Schooler-Kane criteria infographic</DialogTitle>
                <img
                  src={schoolerKaneImg}
                  alt={SK_IMAGE_ALT}
                  className="mx-auto h-auto max-h-[88vh] w-auto max-w-full object-contain"
                />
              </DialogContent>
            </Dialog>
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              {SK_IMAGE_CAPTION}
            </figcaption>
          </figure>

          <ol className="min-w-0 space-y-3">
            <li className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="text-sm font-semibold text-foreground">1. {SK_CRITERIA_LABELS.exposure}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{SK_EXPOSURE_LABEL}.</p>
            </li>
            <li className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="text-sm font-semibold text-foreground">2. {SK_CRITERIA_LABELS.aims}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Moderate movements in at least one body area (AIMS ≥3), or mild movements in at least two body areas (AIMS ≥2).
              </p>
            </li>
            <li className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="text-sm font-semibold text-foreground">3. {SK_CRITERIA_LABELS.exclusion}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Confirm that no other neurological, medical, or drug-related cause adequately explains the movements.
              </p>
            </li>
            <li className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs leading-relaxed text-foreground">
              Qualifying AIMS findings sustained for at least 3 months support probable TD; at least 6 months supports persistent TD.
            </li>
          </ol>
        </CardContent>
      </Card>

      {!showResults ? (
        <div className="space-y-4">
          {AIMS_ITEMS.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {item.number}. {item.body_region}
                    </h3>
                    <p className="text-sm text-gray-600 italic mt-1">{item.area}</p>
                    <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                  </div>
                  <RadioGroup
                    value={responses[item.id]?.toString() || ''}
                    onValueChange={(val) => handleResponseChange(item.id, parseInt(val))}
                  >
                    <div className="space-y-2">
                      {[0, 1, 2, 3, 4].map((score) => (
                        <div key={score} className="flex items-start space-x-2">
                          <RadioGroupItem value={score.toString()} id={`${item.id}-${score}`} />
                          <Label htmlFor={`${item.id}-${score}`} className="cursor-pointer flex-1">
                            <div className="font-medium text-gray-700">{score}</div>
                            <div className="text-sm text-gray-600">{item.scoring[score]}</div>
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
              const areaScores = getAreaScores();
              return (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-green-600 mb-2">
                        {totalScore}
                      </div>
                      <div className="text-sm text-gray-600">Total Score (Scale: 0-44)</div>
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

                  <Tabs defaultValue="breakdown" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="breakdown">Area Breakdown</TabsTrigger>
                      <TabsTrigger value="guidance">Clinical Guidance</TabsTrigger>
                    </TabsList>
                    <TabsContent value="breakdown" className="bg-white rounded-lg p-4 border border-gray-200 mt-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="font-medium text-gray-700">Orofacial (Items 1-4)</span>
                          <span className="text-lg font-semibold text-blue-600">{areaScores.orofacial}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="font-medium text-gray-700">Extremities (Items 5-8)</span>
                          <span className="text-lg font-semibold text-blue-600">{areaScores.extremities}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="font-medium text-gray-700">Trunk (Item 9)</span>
                          <span className="text-lg font-semibold text-blue-600">{areaScores.trunk}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">Global Assessment (Items 10-11)</span>
                          <span className="text-lg font-semibold text-blue-600">{areaScores.global}</span>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="guidance" className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                      <h3 className="font-semibold text-yellow-900 mb-3">Clinical Recommendations:</h3>
                      <p className="text-sm text-yellow-800">
                        {totalScore <= 8
                          ? 'No dyskinesia detected. Continue current medication monitoring.'
                          : totalScore <= 15
                          ? 'Minimal dyskinesia. Monitor for progression with periodic AIMS assessments.'
                          : totalScore <= 25
                          ? 'Mild dyskinesia present. Consider medication adjustment or dopamine agonist modifications.'
                          : totalScore <= 40
                          ? 'Moderate dyskinesia with functional impact. Consider dose reduction or medication changes. May benefit from deep brain stimulation evaluation.'
                          : 'Severe dyskinesia with significant functional impairment. Urgent medication review and specialist consultation recommended.'}
                      </p>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-center pt-1">
                    <ExportButtons data={reportData} />
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
