import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, BookOpen, TrendingUp } from 'lucide-react';
import { ESGS_COMPONENTS, ESGS_GRADING } from '@/data/epilepsyScales';

interface EsgsAssessmentProps {
  onBack?: () => void;
}

export const EsgsAssessment = ({ onBack }: EsgsAssessmentProps) => {
  const [scores, setScores] = useState<Record<string, number>>({
    mri: 0,
    eeg: 0,
    semiology: 0,
    iq: 0,
  });

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const getGrade = () => {
    if (totalScore >= 7.5) return ESGS_GRADING.grade1;
    if (totalScore > 4 && totalScore < 7.5) return ESGS_GRADING.grade2;
    return ESGS_GRADING.grade3;
  };

  const grade = getGrade();
  const gradeColor =
    totalScore >= 7.5 ? 'text-green-700 dark:text-green-400' :
    totalScore > 4 ? 'text-yellow-700 dark:text-yellow-400' :
    'text-red-700 dark:text-red-400';

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            size="sm"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Back
          </Button>
        )}
      </div>

      <Card className="bg-gradient-to-r from-fuchsia-600/20 to-purple-600/20 border-fuchsia-500/30">
        <CardHeader>
          <div className="flex items-start gap-3">
            <TrendingUp className="w-6 h-6 text-fuchsia-400 mt-1" />
            <div>
              <CardTitle className="text-2xl text-foreground">Epilepsy Surgery Grading Scale</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Prediction of seizure-free outcome after resective surgery for drug-resistant focal epilepsy
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="scoring" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted border border-border">
          <TabsTrigger value="scoring">ESGS Scoring</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>

        {/* Scoring Tab */}
        <TabsContent value="scoring">
          <div className="space-y-4">
            {/* Score Inputs */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg text-cyan-700 dark:text-cyan-400">Score Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(scores).map(([key, value]) => {
                  const component = ESGS_COMPONENTS[key];
                  return (
                    <div key={key} className="space-y-3">
                      <div>
                        <label className="font-semibold text-foreground">{component.name}</label>
                        <p className="text-sm text-muted-foreground mt-1">{component.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="3"
                          step="0.5"
                          value={value}
                          onChange={(e) =>
                            setScores(prev => ({
                              ...prev,
                              [key]: parseFloat(e.target.value),
                            }))
                          }
                          className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-400 w-12 text-right">{value}</div>
                      </div>
                      <p className="text-xs text-muted-foreground">{component.scoring}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Total Score & Grade */}
            <Card className={`bg-card border-border ${gradeColor.replace('text', 'border')}`}>
              <CardHeader>
                <CardTitle className="text-lg text-foreground">ESGS Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/60 border border-border">
                    <div className="text-sm text-muted-foreground mb-1">Total ESGS Score</div>
                    <div className={`text-4xl font-bold ${gradeColor}`}>{totalScore.toFixed(1)}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/60 border border-border">
                    <div className="text-sm text-muted-foreground mb-1">Grade Assignment</div>
                    <div className={`text-2xl font-bold ${gradeColor}`}>{grade.name}</div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${gradeColor.replace('text', 'bg').replace('400', '500/10')} border ${gradeColor.replace('text', 'border')} ${gradeColor.replace('text', 'border')}/30`}>
                  <div className="font-semibold text-foreground mb-2">Predicted Outcome</div>
                  <div className="text-sm text-foreground/90 space-y-1">
                    <p><span className="font-semibold">Probability:</span> {grade.probability}</p>
                    <p><span className="font-semibold">Prognosis:</span> {grade.description}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="text-sm text-foreground/90">
                    <span className="font-semibold">Clinical Interpretation:</span>
                    <p className="mt-2 text-muted-foreground">
                      {totalScore >= 7.5 &&
                        'Grade 1 (Most Favorable): Patient has excellent potential for seizure-free outcome. Surgical evaluation and counseling recommended.'}
                      {totalScore > 4 && totalScore < 7.5 &&
                        'Grade 2 (Intermediate): Patient has moderate potential for seizure freedom. Comprehensive presurgical evaluation recommended with careful risk-benefit discussion.'}
                      {totalScore <= 4 &&
                        'Grade 3 (Least Favorable): Patient has limited likelihood of seizure freedom but may still benefit from surgery. Detailed counseling about realistic expectations essential.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-cyan-700 dark:text-cyan-400">ESGS Components Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(ESGS_COMPONENTS).map(([key, component]) => (
                <div key={key} className="p-4 rounded-lg border border-border bg-muted/40">
                  <div className="font-semibold text-foreground mb-2">{component.name}</div>
                  <p className="text-sm text-muted-foreground mb-2">{component.description}</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    <span className="font-semibold">Scoring:</span> {component.scoring}
                  </p>
                  {component.example && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold">Example:</span> {component.example}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Clinical Notes */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm text-cyan-700 dark:text-cyan-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Clinical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Purpose:</span> The Epilepsy Surgery Grading Scale (ESGS) is an empirically derived
            tool designed to predict likelihood of seizure freedom after resective surgery in drug-resistant focal epilepsy.
          </p>
          <p>
            <span className="font-semibold text-foreground">Scoring Basis:</span> Combines MRI findings, interictal EEG, seizure semiology,
            and IQ to create an integrated prognostic score.
          </p>
          <p>
            <span className="font-semibold text-foreground">Clinical Use:</span> Helps stratify patients and guide surgical counseling,
            particularly for patients with drug-resistant focal epilepsy considering resective surgery.
          </p>
          <p className="italic text-muted-foreground">Source: National Institutes of Health (.gov)</p>
        </CardContent>
      </Card>
    </div>
  );
};
