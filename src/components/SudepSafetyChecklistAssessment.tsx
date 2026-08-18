import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import { SUDEP_SAFETY_MEASURES, SUDEP_PREVENTION_STRATEGIES } from '@/data/sudepScales';

interface SudepSafetyChecklistAssessmentProps {
  onBack?: () => void;
}

export const SudepSafetyChecklistAssessment = ({ onBack }: SudepSafetyChecklistAssessmentProps) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleToggle = (itemKey: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  const getTotalItems = () => {
    return SUDEP_SAFETY_MEASURES.reduce((total, category) => total + category.items.length, 0);
  };

  const getCheckedItems = () => {
    return Object.values(checkedItems).filter(Boolean).length;
  };

  const totalItems = getTotalItems();
  const checkedCount = getCheckedItems();
  const completionPercentage = Math.round((checkedCount / totalItems) * 100);

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

      <Card className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-orange-500/30">
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-orange-400 mt-1" />
            <div>
              <CardTitle className="text-2xl text-foreground">SUDEP Safety Checklist</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Comprehensive Risk Reduction and Safety Measures for Epilepsy Patients
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Safety Implementation Progress</span>
              <span className="text-sm font-bold text-orange-400">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {checkedCount} of {totalItems} measures implemented
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Measures by Category */}
      <div className="space-y-4">
        {SUDEP_SAFETY_MEASURES.map(category => {
          const categoryChecked = category.items.filter(item => checkedItems[`${category.id}-${item.id}`]).length;
          const categoryTotal = category.items.length;

          return (
            <Card key={category.id} className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg text-orange-400 flex items-center justify-between">
                  <span>{category.category}</span>
                  <span className="text-sm text-muted-foreground font-normal">
                    {categoryChecked}/{categoryTotal}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.items.map(item => {
                  const itemKey = `${category.id}-${item.id}`;
                  const isChecked = checkedItems[itemKey];

                  return (
                    <button
                      key={itemKey}
                      onClick={() => handleToggle(itemKey)}
                      className={`w-full p-3 rounded-lg border text-left transition ${
                        isChecked
                          ? 'border-orange-500/50 bg-orange-500/10'
                          : 'border-border bg-muted/40 hover:border-primary/60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center flex-shrink-0 transition ${
                            isChecked
                              ? 'bg-orange-500/30 border-orange-400'
                              : 'border-input'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-4 h-4 text-orange-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground text-sm">{item.name}</div>
                          <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Card */}
      <Card className={`bg-card border-border ${completionPercentage >= 80 ? 'border-green-500/30' : 'border-orange-500/30'}`}>
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${completionPercentage >= 80 ? 'bg-green-400' : 'bg-orange-400'}`} />
            Implementation Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/90">
            {completionPercentage >= 80
              ? '✓ Comprehensive SUDEP risk reduction measures are largely in place. Continue regular monitoring and adherence.'
              : completionPercentage >= 50
                ? 'Good progress on safety measures. Prioritize remaining items, especially medication adherence and emergency preparedness.'
                : 'Important to implement additional safety measures. Focus on medication optimization, sleep monitoring, and emergency planning.'}
          </p>
        </CardContent>
      </Card>

      {/* Prevention Strategies */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm text-orange-400">Evidence-Based SUDEP Prevention</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {SUDEP_PREVENTION_STRATEGIES.map((strategy, idx) => (
              <div key={idx} className="flex gap-3 text-sm">
                <span className="text-orange-400 font-bold flex-shrink-0">•</span>
                <span className="text-foreground/90">{strategy}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Clinical Notes */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm text-orange-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Clinical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">SUDEP Overview:</span> Sudden Unexpected Death in Epilepsy (SUDEP) is a
            rare but serious complication affecting primarily young people with uncontrolled seizures. Annual SUDEP risk ranges from
            <span className="font-semibold text-foreground"> 1 in 1,000 to 1 in 200</span> depending on seizure control.
          </p>
          <p>
            <span className="font-semibold text-foreground">Purpose of Checklist:</span> Comprehensive approach to SUDEP risk reduction
            through systematic implementation of evidence-based safety measures across multiple domains.
          </p>
          <p>
            <span className="font-semibold text-foreground">Key Modifiable Factors:</span> Medication adherence, seizure control,
            seizure monitoring, safe sleep practices, and emergency preparedness are the primary preventable risk factors.
          </p>
          <p>
            <span className="font-semibold text-foreground">Multidisciplinary Approach:</span> Optimal SUDEP risk reduction requires
            coordination between neurology, primary care, mental health services, and patient/family education.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
