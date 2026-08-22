import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, AlertCircle, BookOpen, CheckCircle } from 'lucide-react';
import { LAEP_ITEMS } from '@/data/epilepsyScales';
import { ExportButtons } from './ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

interface LaepAssessmentProps {
  onBack?: () => void;
}

export const LaepAssessment = ({ onBack }: LaepAssessmentProps) => {
  const [responses, setResponses] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);

  const handleToggle = (itemId: string, value: boolean) => {
    setResponses(prev => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const sideEffectsCount = Object.values(responses).filter(Boolean).length;
  const totalItems = LAEP_ITEMS.length;
  const percentage = totalItems > 0 ? Math.round((sideEffectsCount / totalItems) * 100) : 0;

  const getSeverityLevel = () => {
    if (sideEffectsCount === 0) return { level: 'None', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-500/10' };
    if (sideEffectsCount <= 2) return { level: 'Mild', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-500/10' };
    if (sideEffectsCount <= 4) return { level: 'Moderate', color: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-500/10' };
    return { level: 'Severe', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-500/10' };
  };

  const severity = getSeverityLevel();

  const reportData: ReportData = {
    assessmentName: 'LAEP (Likelihood of Adverse Effects Profile for Antiseizure Medications)',
    date: new Date().toLocaleString(),
    totalScore: `${sideEffectsCount} / ${totalItems}`,
    interpretation: `Severity level: ${severity.level}. ${sideEffectsCount} of ${totalItems} (${percentage}%) adverse effects reported.`,
    severity: severity.level,
    sections: [
      {
        title: 'Reported Side Effects',
        items: LAEP_ITEMS.filter((item) => responses[item.id]).map((item) => item.name),
        type: 'info',
      },
    ],
    disclaimer: 'LAEP is a self-report tool for tracking antiseizure medication side effects; higher burden suggests medication review.',
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-4">
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

      <Card className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-cyan-500/30">
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-cyan-700 dark:text-cyan-400 mt-1" />
            <div>
              <CardTitle className="text-2xl text-foreground">LAEP Assessment</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Likelihood of Adverse Effects Profile for Antiseizure Medications
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Assessment Items */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-700 dark:text-cyan-400">Reported Side Effects</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">Select all side effects currently experienced</p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {LAEP_ITEMS.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border border-border hover:border-cyan-500/30 transition cursor-pointer bg-muted/40"
                  onClick={() => handleToggle(item.id, !responses[item.id])}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded border-2 mt-0.5 flex items-center justify-center transition ${
                        responses[item.id]
                          ? 'bg-cyan-500/20 border-cyan-400'
                          : 'border-input'
                      }`}
                    >
                      {responses[item.id] && (
                        <CheckCircle className="w-5 h-5 text-cyan-700 dark:text-cyan-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{item.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className={`bg-card border-border ${severity.bg}`}>
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${severity.color.replace('text', 'bg')}`} />
            Adverse Effect Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-700 dark:text-cyan-400">{sideEffectsCount}</div>
              <div className="text-sm text-muted-foreground mt-1">Effects Reported</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-700 dark:text-cyan-400">{percentage}%</div>
              <div className="text-sm text-muted-foreground mt-1">Of Total Items</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${severity.color}`}>{severity.level}</div>
              <div className="text-sm text-muted-foreground mt-1">Severity Level</div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-sm text-foreground/90">
              <span className="font-semibold text-foreground">Clinical Interpretation:</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {sideEffectsCount === 0 &&
                'Patient reports no current adverse effects from antiseizure medication. Continue current regimen with monitoring.'}
              {sideEffectsCount > 0 && sideEffectsCount <= 2 &&
                'Patient experiencing mild side effects. Consider dose optimization or time-dependent tolerance monitoring.'}
              {sideEffectsCount > 2 && sideEffectsCount <= 4 &&
                'Patient experiencing moderate side effects. May warrant medication adjustment or addition of supportive therapy.'}
              {sideEffectsCount > 4 &&
                'Patient experiencing significant side effects. Medication change or dose reduction should be considered in consultation with neurologist.'}
            </p>
            <div className="pt-2 flex justify-center print:hidden">
              <ExportButtons data={reportData} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Box */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm text-cyan-700 dark:text-cyan-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Clinical Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">LAEP Purpose:</span> The Likelihood of Adverse Effects Profile (LAEP) is
            a self-report tool for systematically measuring and tracking side effects of antiseizure medications (ASMs).
          </p>
          <p>
            <span className="font-semibold text-foreground">Clinical Use:</span> Useful for identifying medication-related side effects
            that may impact quality of life and medication adherence in patients with epilepsy.
          </p>
          <p>
            <span className="font-semibold text-foreground">Interpretation:</span> Higher number of reported effects suggests need for
            medication review. Consider balancing seizure control with side effect burden.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
