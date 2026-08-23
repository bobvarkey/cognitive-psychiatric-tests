import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, TrendingUp, ClipboardCopy, Check, RotateCcw } from 'lucide-react';
import { DBS_CANDIDACY_CRITERIA } from '@/data/pdManagementTools';
import { PatientInfoForm } from './PatientInfoForm';
import { usePatientInfo } from '@/contexts/PatientInfoContext';
import { useToast } from '@/hooks/use-toast';

interface StimulusDbsAssessmentProps {
  onBack?: () => void;
}


export const StimulusDbsAssessment = ({ onBack }: StimulusDbsAssessmentProps) => {
  const [appropriateness, setAppropriateness] = useState<number>(5);
  const [selectedFavorable, setSelectedFavorable] = useState<Record<number, boolean>>({});
  const [selectedUnfavorable, setSelectedUnfavorable] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);
  const { patientInfo } = usePatientInfo();
  const { toast } = useToast();


  const getAppropriatenessLevel = () => {
    if (appropriateness <= 3) return { level: 'Not Appropriate', color: 'text-red-700 dark:text-red-400' };
    if (appropriateness <= 5) return { level: 'Uncertain', color: 'text-yellow-700 dark:text-yellow-400' };
    return { level: 'Appropriate', color: 'text-green-700 dark:text-green-400' };
  };

  const level = getAppropriatenessLevel();

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

      <PatientInfoForm />

      <Card className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-500/30">
        <CardHeader>
          <div className="flex items-start gap-3">
            <TrendingUp className="w-6 h-6 text-amber-700 dark:text-amber-400 mt-1" />
            <div>
              <CardTitle className="text-2xl text-foreground">Stimulus DBS Tool</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Decision Support for Deep Brain Stimulation Appropriateness
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Appropriateness Scale */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-amber-700 dark:text-amber-400">DBS Appropriateness Assessment</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Rate overall appropriateness for DBS referral (1-9 scale)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scale Display */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground w-16">Score</div>
              <input
                type="range"
                min="1"
                max="9"
                value={appropriateness}
                onChange={(e) => setAppropriateness(parseInt(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className={`text-3xl font-bold w-12 text-center ${level.color}`}>
                {appropriateness}
              </div>
            </div>

            {/* Scale Legend */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-left">
                <div className="text-red-700 dark:text-red-400 font-semibold">1-3</div>
                <div className="text-muted-foreground">Not Appropriate</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-700 dark:text-yellow-400 font-semibold">4-6</div>
                <div className="text-muted-foreground">Uncertain</div>
              </div>
              <div className="text-right">
                <div className="text-green-700 dark:text-green-400 font-semibold">7-9</div>
                <div className="text-muted-foreground">Appropriate</div>
              </div>
            </div>
          </div>

          {/* Current Assessment */}
          <div className={`p-4 rounded-lg border ${level.color.includes('red') ? 'bg-red-500/10 border-red-500/30' : level.color.includes('yellow') ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
            <div className="font-semibold text-foreground mb-2">Assessment Result</div>
            <p className={`text-sm ${level.color}`}>
              {level.level}: {
                appropriateness <= 3 ? 'DBS not recommended for this patient profile.'
                : appropriateness <= 6 ? 'DBS feasibility uncertain - further evaluation needed.'
                : 'DBS appears appropriate - proceed with formal evaluation.'
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Candidacy Criteria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Favorable */}
        <Card className="bg-card border-border border-green-500/20">
          <CardHeader>
            <CardTitle className="text-sm text-green-700 dark:text-green-400">Favorable Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {DBS_CANDIDACY_CRITERIA.favorable.map((factor, idx) => (
                <label key={idx} className="flex items-start gap-3 p-2 rounded hover:bg-muted/40 cursor-pointer transition-colors border border-transparent hover:border-border">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={!!selectedFavorable[idx]}
                    onChange={(e) => setSelectedFavorable(prev => ({ ...prev, [idx]: e.target.checked }))}
                  />
                  <span className="text-sm text-muted-foreground">{factor}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Unfavorable */}
        <Card className="bg-card border-border border-red-500/20">
          <CardHeader>
            <CardTitle className="text-sm text-red-700 dark:text-red-400">Unfavorable Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {DBS_CANDIDACY_CRITERIA.unfavorable.map((factor, idx) => (
                <label key={idx} className="flex items-start gap-3 p-2 rounded hover:bg-muted/40 cursor-pointer transition-colors border border-transparent hover:border-border">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    checked={!!selectedUnfavorable[idx]}
                    onChange={(e) => setSelectedUnfavorable(prev => ({ ...prev, [idx]: e.target.checked }))}
                  />
                  <span className="text-sm text-muted-foreground">{factor}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Generator */}
      <Card className="no-print">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => {
              const favs = DBS_CANDIDACY_CRITERIA.favorable.filter((_, i) => selectedFavorable[i]);
              const unfavs = DBS_CANDIDACY_CRITERIA.unfavorable.filter((_, i) => selectedUnfavorable[i]);
              
              const report = [
                `Stimulus DBS Appropriateness Report`,
                `Date: ${new Date().toLocaleDateString()}`,
                patientInfo.name ? `Patient: ${patientInfo.name}` : '',
                patientInfo.id ? `ID: ${patientInfo.id}` : '',
                `---`,
                `Appropriateness Score: ${appropriateness}/9 (${level.level})`,
                `---`,
                `Favorable Factors Present:`,
                favs.length ? favs.map(f => `  [+] ${f}`).join('\n') : '  None selected',
                ``,
                `Unfavorable Factors Present:`,
                unfavs.length ? unfavs.map(f => `  [-] ${f}`).join('\n') : '  None selected',
                `---`,
                `Clinical Note: The Stimulus tool is evidence-based decision support for DBS referral in PD. A score of 7-9 suggests DBS is appropriate.`
              ].filter(Boolean).join('\n');

              navigator.clipboard.writeText(report);
              setCopied(true);
              toast({ title: "Report copied to clipboard" });
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex-1 bg-medical-primary hover:bg-medical-primary/90 gap-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy TXT Report'}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setAppropriateness(5);
              setSelectedFavorable({});
              setSelectedUnfavorable({});
            }}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>


      {/* Clinical Information */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Clinical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Stimulus Tool Purpose:</span> Evidence-based decision support system
            developed using the RAND/UCLA Appropriateness method (modified Delphi) with international DBS expert panel.
          </p>
          <p>
            <span className="font-semibold text-foreground">Development:</span> Initial Stimulus tool (2009) assessed 1,728 patient
            profiles using 9 variables. Updated Stimulus 2 (2016) refined to 7 key variables and 972 profiles.
          </p>
          <p>
            <span className="font-semibold text-foreground">Appropriateness Definition:</span> "Benefits of referral far outweigh
            possible disadvantages" (9-point expert panel rating converted to binary).
          </p>
          <p>
            <span className="font-semibold text-foreground">Key Variables:</span> Disease duration, age, levodopa response, motor
            complications, cognition, psychiatric status, and motor phenotype.
          </p>
          <div className="p-3 rounded bg-muted/60 border border-border mt-3">
            <p className="text-xs">
              <span className="font-semibold">Access:</span> Stimulus 2 available at www.earlystimulus.eu
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
