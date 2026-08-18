import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, TrendingUp } from 'lucide-react';
import { ENGEL_SCALE, ENGEL_OUTCOME_CATEGORIES } from '@/data/epilepsyScales';

interface EngelScaleAssessmentProps {
  onBack?: () => void;
}

export const EngelScaleAssessment = ({ onBack }: EngelScaleAssessmentProps): JSX.Element => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const getOutcomeCategory = (classId: string) => {
    for (const [category, data] of Object.entries(ENGEL_OUTCOME_CATEGORIES)) {
      if (data.classes.includes(classId)) {
        return { category, ...data };
      }
    }
    return null;
  };

  const selectedOutcome = selectedClass ? getOutcomeCategory(selectedClass) : null;

  const getOutcomeColor = (classId: string) => {
    const outcome = getOutcomeCategory(classId);
    if (!outcome) return 'text-muted-foreground';
    if (outcome.category === 'excellent') return 'text-green-400';
    if (outcome.category === 'good') return 'text-cyan-400';
    if (outcome.category === 'moderate') return 'text-yellow-400';
    return 'text-red-400';
  };

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

      <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/30">
        <CardHeader>
          <div className="flex items-start gap-3">
            <TrendingUp className="w-6 h-6 text-green-400 mt-1" />
            <div>
              <CardTitle className="text-2xl text-foreground">Engel Scale</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Post-Surgical Outcome Assessment in Epilepsy
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Scale Selection */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-green-400">Seizure Freedom Outcome</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">Select the patient's post-surgical seizure status</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {ENGEL_SCALE.map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedClass(item.id)}
              className={`w-full p-4 rounded-lg border-2 text-left transition ${
                selectedClass === item.id
                  ? `border-green-500 bg-green-500/10`
                  : `border-border bg-muted/40 hover:border-primary/60`
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                    selectedClass === item.id
                      ? 'bg-green-500 border-green-500'
                      : 'border-input'
                  }`}
                />
                <div className="flex-1">
                  <div className={`font-semibold ${getOutcomeColor(item.id)}`}>{item.name}</div>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Results */}
      {selectedClass && selectedOutcome && (
        <Card className={`bg-card border-border`}>
          <CardHeader>
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${getOutcomeColor(selectedClass).replace('text', 'bg')}`} />
              Post-Surgical Outcome
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Outcome Category */}
            <div className="p-4 rounded-lg bg-muted/60 border border-border">
              <div className="text-sm text-muted-foreground mb-2">Outcome Category</div>
              <div className={`text-2xl font-bold ${getOutcomeColor(selectedClass)}`}>
                {selectedOutcome.category.charAt(0).toUpperCase() + selectedOutcome.category.slice(1)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{selectedOutcome.description}</p>
            </div>

            {/* Detailed Interpretation */}
            <div className="border-t border-border pt-4">
              <div className="space-y-3">
                {selectedClass === 'ia' && (
                  <>
                    <div>
                      <span className="font-semibold text-foreground">Best Outcome:</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Patient is completely seizure-free since surgery. This is the ideal surgical outcome.
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">Management:</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Continue current AED regimen. Some patients may eventually taper or discontinue medications under supervision.
                      </p>
                    </div>
                  </>
                )}
                {selectedClass === 'ib' && (
                  <>
                    <div>
                      <span className="font-semibold text-foreground">Excellent Outcome:</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Only auras without motor or observable seizures. Functionally equivalent to seizure-free.
                      </p>
                    </div>
                  </>
                )}
                {selectedClass === 'ii' && (
                  <>
                    <div>
                      <span className="font-semibold text-foreground">Good Outcome:</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Patient experiencing rare seizures (≤3 per month). Significant improvement from pre-surgical baseline.
                      </p>
                    </div>
                  </>
                )}
                {selectedClass === 'iii' && (
                  <>
                    <div>
                      <span className="font-semibold text-foreground">Moderate Outcome:</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Greater than 90% reduction in seizures but not seizure-free. Still constitutes worthwhile improvement.
                      </p>
                    </div>
                  </>
                )}
                {selectedClass === 'iv' && (
                  <>
                    <div>
                      <span className="font-semibold text-foreground">Poor Outcome:</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        No worthwhile improvement or worsening of seizure control. May require reassessment of surgical indication.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scale Overview */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-green-400">Engel Scale Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Favorable Outcomes */}
            <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
              <div className="font-semibold text-green-400 text-sm mb-2">Favorable Outcomes (Class I-II)</div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Ia: Completely seizure-free</li>
                <li>• Ib: Only auras</li>
                <li>• Ic: Seizures only in sleep</li>
                <li>• Id: Nocturnal seizures only</li>
                <li>• II: ≤3 seizures/month</li>
              </ul>
            </div>

            {/* Unfavorable Outcomes */}
            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
              <div className="font-semibold text-red-400 text-sm mb-2">Unfavorable Outcomes (Class III-IV)</div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>{`• III: >90% reduction but not free`}</li>
                <li>• IV: No improvement or worse</li>
                <li>• Success rate varies by pathology</li>
                <li>• Favorable = 60-80% seizure-free</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Notes */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm text-green-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Clinical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Purpose:</span> The Engel Scale is the standard classification system for
            assessing seizure outcomes after epilepsy surgery. Allows comparison of surgical success rates across different centers.
          </p>
          <p>
            <span className="font-semibold text-foreground">Follow-up Assessment:</span> Typically assessed at 1 year post-surgery,
            though assessment can be done at any time point post-operatively.
          </p>
          <p>
            <span className="font-semibold text-foreground">Prognostic Factors:</span> Success depends on etiology, seizure type,
            presurgical evaluation accuracy, and surgical technique.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
