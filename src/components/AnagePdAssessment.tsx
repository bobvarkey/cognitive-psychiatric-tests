import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, CheckCircle } from 'lucide-react';
import { ANAGE_PD_DOMAINS } from '@/data/pdManagementTools';

interface AnagePdAssessmentProps {
  onBack?: () => void;
}

export const AnagePdAssessment = ({ onBack }: AnagePdAssessmentProps) => {
  const [concerns, setConcerns] = useState<Record<string, boolean>>({});

  const handleToggle = (key: string) => {
    setConcerns(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const totalConcerns = Object.values(concerns).filter(Boolean).length;
  const requiresIntervention = totalConcerns >= 2;

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

      <Card className="bg-gradient-to-r from-cyan-600/20 to-teal-600/20 border-cyan-500/30">
        <CardHeader>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-cyan-400 mt-1" />
            <div>
              <CardTitle className="text-2xl text-foreground">ANAGE-PD</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Making Informed Decisions to Aid Timely Management of Advanced PD
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Assessment Domains */}
      <div className="space-y-4">
        {ANAGE_PD_DOMAINS.map(domain => (
          <Card key={domain.id} className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-cyan-400">{domain.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {domain.items.map((item, idx) => {
                const itemKey = `${domain.id}-${idx}`;
                return (
                  <button
                    key={itemKey}
                    onClick={() => handleToggle(itemKey)}
                    className={`w-full p-3 rounded-lg border text-left transition ${
                      concerns[itemKey]
                        ? 'border-cyan-500/50 bg-cyan-500/10'
                        : 'border-border bg-muted/40 hover:border-primary/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded border-2 flex-shrink-0 ${
                          concerns[itemKey]
                            ? 'bg-cyan-500/30 border-cyan-400'
                            : 'border-input'
                        }`}
                      />
                      <span className="text-foreground/90">{item}</span>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Results */}
      <Card className={`bg-card border-border ${requiresIntervention ? 'border-cyan-500/30' : 'border-border'}`}>
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${requiresIntervention ? 'bg-cyan-400' : 'bg-gray-500'}`} />
            Clinical Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/60 border border-border">
              <div className="text-sm text-muted-foreground mb-1">Concerns Identified</div>
              <div className="text-3xl font-bold text-cyan-400">{totalConcerns}</div>
            </div>
            <div className="p-4 rounded-lg bg-muted/60 border border-border">
              <div className="text-sm text-muted-foreground mb-1">Management Status</div>
              <div className={`text-lg font-bold ${requiresIntervention ? 'text-amber-400' : 'text-green-400'}`}>
                {requiresIntervention ? 'Needs Review' : 'Optimized'}
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${requiresIntervention ? 'bg-amber-500/10 border-amber-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
            <div className="font-semibold text-foreground mb-2">Recommendation</div>
            <p className="text-sm text-foreground/90">
              {requiresIntervention
                ? 'Multiple concerns identified. Patient warrants evaluation for advanced therapeutics or treatment optimization. Consider consultation at specialized movement disorders center.'
                : 'Current symptom management appears adequate. Continue standard therapy with regular follow-up monitoring.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Information */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm text-cyan-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Clinical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Purpose:</span> ANAGE-PD is a clinician-based decision support tool
            designed to facilitate timely identification and treatment of advanced PD patients with suboptimal symptom control.
          </p>
          <p>
            <span className="font-semibold text-foreground">Key Domains:</span> Evaluates motor complications, non-motor symptoms,
            and current therapy status to comprehensively assess treatment burden and identify intervention opportunities.
          </p>
          <p>
            <span className="font-semibold text-foreground">Clinical Use:</span> Helps structure clinical decision-making for
            considering advanced therapies including DBS, LCIG, CSAI, or other Device-Aided Therapies.
          </p>
          <div className="p-3 rounded bg-muted/60 border border-border mt-3">
            <p className="text-xs">
              <span className="font-semibold">Access:</span> Available at www.managepd.com and www.managepd.eu
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
