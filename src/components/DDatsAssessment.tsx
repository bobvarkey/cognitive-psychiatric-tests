import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, BookOpen, CheckCircle2, AlertTriangle } from 'lucide-react';
import { D_DATS_CRITERIA, DAT_TYPES } from '@/data/pdManagementTools';
import { ExportButtons } from './ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

interface DDatsAssessmentProps {
  onBack?: () => void;
}

export const DDatsAssessment = ({ onBack }: DDatsAssessmentProps) => {
  const [responses, setResponses] = useState<Record<string, boolean | null>>({});
  const [selectedDats, setSelectedDats] = useState<Record<string, boolean>>({});

  const handleResponse = (id: string, value: boolean) => {
    setResponses(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDatSelection = (id: string) => {
    setSelectedDats(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const requiredMet = D_DATS_CRITERIA
    .filter(c => c.required)
    .every(c => responses[c.id] === true);

  const totalMet = Object.values(responses).filter(v => v === true).length;
  const eligibleForDat = requiredMet && totalMet >= 5;

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

      <Card className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 border-emerald-500/30">
        <CardHeader>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-700 dark:text-emerald-400 mt-1" />
            <div>
              <CardTitle className="text-2xl text-foreground">D-DATS</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Dutch DAT Screening Tool for Advanced Parkinson's Disease
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="screening" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted border border-border">
          <TabsTrigger value="screening">DAT Eligibility</TabsTrigger>
          <TabsTrigger value="dats">Available DATs</TabsTrigger>
        </TabsList>

        {/* Screening Tab */}
        <TabsContent value="screening">
          <div className="space-y-4">
            {/* Criteria */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">Eligibility Criteria</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  All REQUIRED criteria must be met. Optional criteria enhance candidacy.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {D_DATS_CRITERIA.map(criterion => {
                  const isRequired = criterion.required;
                  const isMet = responses[criterion.id] === true;

                  return (
                    <div key={criterion.id} className={`p-4 rounded-lg border ${isMet ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-border bg-muted/40'}`}>
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleResponse(criterion.id, !isMet)}
                          className={`w-6 h-6 rounded border-2 flex-shrink-0 flex items-center justify-center mt-1 transition ${
                            isMet
                              ? 'bg-emerald-500/30 border-emerald-400'
                              : 'border-input hover:border-primary/60'
                          }`}
                        >
                          {isMet && <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-foreground">{criterion.name}</div>
                            {isRequired && (
                              <span className="text-xs font-bold text-red-700 dark:text-red-400 bg-red-500/20 px-2 py-0.5 rounded">
                                REQUIRED
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{criterion.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Results */}
            {Object.keys(responses).length > 0 && (
              <Card className={`bg-card border-border ${eligibleForDat ? 'border-emerald-500/30' : 'border-yellow-500/30'}`}>
                <CardHeader>
                  <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${eligibleForDat ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                    DAT Eligibility Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-muted/60 border border-border">
                      <div className="text-sm text-muted-foreground mb-1">Total Met</div>
                      <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{totalMet}/6</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/60 border border-border">
                      <div className="text-sm text-muted-foreground mb-1">Required Met</div>
                      <div className={`text-2xl font-bold ${requiredMet ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                        {D_DATS_CRITERIA.filter(c => c.required && responses[c.id] === true).length}/4
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/60 border border-border">
                      <div className="text-sm text-muted-foreground mb-1">Eligible</div>
                      <div className={`text-xl font-bold ${eligibleForDat ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                        {eligibleForDat ? 'YES' : 'NO'}
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border ${eligibleForDat ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                    <div className="flex items-start gap-3">
                      {eligibleForDat ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-700 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <div className={`font-semibold ${eligibleForDat ? 'text-emerald-700 dark:text-emerald-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                          {eligibleForDat ? 'Eligible for DAT Referral' : 'Not Yet Eligible'}
                        </div>
                        <p className="text-sm text-foreground/90 mt-2">
                          {eligibleForDat
                            ? 'Patient meets all required criteria. Proceed with DAT evaluation and selection.'
                            : 'All required criteria must be met. Continue optimizing standard medical therapy.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <ExportButtons
              className="justify-start"
              data={{
                assessmentName: 'D-DATS (Dutch DAT Screening Tool)',
                date: new Date().toLocaleString(),
                totalScore: `${totalMet}/6 criteria met`,
                interpretation: eligibleForDat ? 'Eligible for DAT Referral' : 'Not Yet Eligible',
                sections: [
                  {
                    title: 'Eligibility Criteria',
                    items: D_DATS_CRITERIA.map(c => {
                      const met = responses[c.id] === true;
                      return `${c.name}${c.required ? ' (required)' : ''}: ${met ? 'Yes' : 'No'}`;
                    }),
                    type: eligibleForDat ? 'negative' : 'positive',
                  },
                  {
                    title: 'Selected Device-Aided Therapies',
                    items: Object.entries(selectedDats)
                      .filter(([, v]) => v)
                      .map(([id]) => {
                        const dat = DAT_TYPES.find(d => d.id === id);
                        return dat ? `${dat.name} (${dat.abbreviation})` : id;
                      }),
                    type: 'info',
                  },
                ],
                disclaimer: 'D-DATS screens candidacy for device-aided therapy in advanced Parkinson disease; final selection requires multidisciplinary review.',
              } as ReportData}
            />
          </div>
        </TabsContent>

        {/* DATs Tab */}
        <TabsContent value="dats">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">Available Device-Aided Therapies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {DAT_TYPES.map(dat => (
                <button
                  key={dat.id}
                  onClick={() => handleDatSelection(dat.id)}
                  className={`w-full p-4 rounded-lg border text-left transition ${
                    selectedDats[dat.id]
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : 'border-border bg-muted/40 hover:border-primary/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded border-2 mt-0.5 flex-shrink-0 ${
                        selectedDats[dat.id] ? 'bg-emerald-500/30 border-emerald-400' : 'border-input'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{dat.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">{dat.description}</div>
                      <div className="text-xs text-muted-foreground mt-2">Abbreviation: {dat.abbreviation}</div>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Clinical Information */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Clinical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Purpose:</span> The Dutch DAT Screening Tool (D-DATS) supports general
            neurologists in determining whether a PD patient is eligible for referral to specialized centers offering Device-Aided Therapy.
          </p>
          <p>
            <span className="font-semibold text-foreground">DAT Options:</span> DBS (surgical), LCIG (intestinal infusion), CSAI
            (subcutaneous apomorphine), and LECIG (intestinal levodopa-etacapone).
          </p>
          <p>
            <span className="font-semibold text-foreground">Clinical Value:</span> Standardizes decision-making for advanced therapy
            referrals, ensuring appropriate patient selection and optimal resource utilization.
          </p>
          <p className="italic text-muted-foreground">Source: Moes et al. 2023 (Groningen)</p>
        </CardContent>
      </Card>
    </div>
  );
};
