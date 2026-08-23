import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, CheckCircle2, AlertTriangle, Lightbulb, ClipboardCopy, Check } from 'lucide-react';
import { CASES_SCREENING_ITEMS } from '@/data/epilepsyScales';
import { toast } from '@/hooks/use-toast';
import { usePatientInfo } from '@/contexts/PatientInfoContext';
import { PatientInfoForm } from './PatientInfoForm';


interface CasesToolAssessmentProps {
  onBack?: () => void;
}

export const CasesToolAssessment = ({ onBack }: CasesToolAssessmentProps) => {
  const { patientInfo } = usePatientInfo();
  const [responses, setResponses] = useState<Record<string, boolean | null>>({});
  const [copied, setCopied] = useState(false);


  const handleResponse = (itemId: string, value: boolean) => {
    setResponses(prev => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const totalYes = Object.values(responses).filter(v => v === true).length;
  const totalAnswered = Object.values(responses).filter(v => v !== null).length;
  const totalItems = CASES_SCREENING_ITEMS.length;

  const isAppropriate = totalYes >= 4; // Typically, ≥4 positive items suggests appropriateness for surgical evaluation

  const buildClinicalReport = () => {
    const lines = [];
    lines.push('CASES Tool - Clinical Report');
    lines.push('—'.repeat(46));
    if (patientInfo.name) lines.push(`Patient: ${patientInfo.name}`);
    if (patientInfo.id) lines.push(`Patient ID: ${patientInfo.id}`);
    lines.push(`Date: ${new Date().toLocaleDateString()}`);
    lines.push('');
    lines.push('Criteria Checklist:');
    CASES_SCREENING_ITEMS.forEach(item => {
      const resp = responses[item.id];
      const status = resp === true ? '[YES]' : resp === false ? '[NO]' : '[UNANSWERED]';
      lines.push(`${status} ${item.name}`);
    });
    lines.push('');
    lines.push(`Total Criteria Met: ${totalYes} of ${totalItems}`);
    lines.push(`Clinical Impression: ${isAppropriate ? 'Appropriate for Surgical Referral' : 'Marginal or Not Appropriate'}`);
    lines.push('');
    lines.push('Disclaimer: Screening instrument designed to help identify patients appropriate for specialized surgical evaluation; not a substitute for clinical judgment.');
    return lines.join('\n');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildClinicalReport());
      setCopied(true);
      toast({ title: 'Report copied to clipboard' });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">

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


      <Card className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-emerald-500/30">
        <CardHeader>
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-emerald-700 dark:text-emerald-400 mt-1" />
            <div>
              <CardTitle className="text-2xl text-foreground">CASES Tool</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Clinical Appropriateness Scores for Epilepsy Surgery
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Screening Items */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">Surgical Evaluation Criteria</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Assess patient appropriateness for specialized epilepsy surgical evaluation
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {CASES_SCREENING_ITEMS.map(item => (
            <div key={item.id} className="p-4 rounded-lg border border-border hover:border-emerald-500/30 transition bg-muted/40">
              <div className="mb-3">
                <label className="font-semibold text-foreground text-sm">{item.name}</label>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleResponse(item.id, true)}
                  className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition ${
                    responses[item.id] === true
                      ? 'bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 border border-emerald-500'
                      : 'bg-slate-700/50 text-foreground/90 border border-input hover:bg-slate-600/50'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleResponse(item.id, false)}
                  className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition ${
                    responses[item.id] === false
                      ? 'bg-red-500/30 text-red-700 dark:text-red-300 border border-red-500'
                      : 'bg-slate-700/50 text-foreground/90 border border-input hover:bg-slate-600/50'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Results */}
      {totalAnswered > 0 && (
        <Card className={`bg-card border-border ${isAppropriate ? 'border-emerald-500/30' : 'border-yellow-500/30'}`}>
          <CardHeader>
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isAppropriate ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
              Surgical Appropriateness
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/60 border border-border">
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{totalYes}</div>
                <div className="text-xs text-muted-foreground mt-1">Positive Items</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/60 border border-border">
                <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-400">{totalAnswered}</div>
                <div className="text-xs text-muted-foreground mt-1">Answered</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/60 border border-border">
                <div className={`text-2xl font-bold ${isAppropriate ? 'text-emerald-700 dark:text-emerald-400' : 'text-yellow-700 dark:text-yellow-400'}`}>
                  {Math.round((totalYes / totalItems) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">Criteria Met</div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${isAppropriate ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
              <div className="flex items-start gap-3">
                {isAppropriate ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-700 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <div className={`font-semibold ${isAppropriate ? 'text-emerald-700 dark:text-emerald-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                    {isAppropriate ? 'Appropriate for Surgical Referral' : 'Marginal or Not Appropriate'}
                  </div>
                  <p className="text-sm text-foreground/90 mt-2">
                    {isAppropriate
                      ? `Patient meets criteria for referral to specialized epilepsy surgery center. ${totalYes} of 6 criteria satisfied.`
                      : `Patient does not clearly meet criteria for surgical evaluation. Only ${totalYes} of 6 criteria satisfied. Consider further optimization of medical management.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-center no-print">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <ClipboardCopy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy TXT Report'}
              </Button>
            </div>

          </CardContent>
        </Card>
      )}

      {/* Clinical Notes */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Clinical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Purpose:</span> The CASES tool is an online screening instrument designed
            to help neurologists identify patients who may be appropriate for specialized surgical evaluation.
          </p>
          <p>
            <span className="font-semibold text-foreground">Typical Thresholds:</span> Patients meeting ≥4 of 6 criteria are generally
            considered appropriate candidates for referral to an epilepsy surgery center.
          </p>
          <p>
            <span className="font-semibold text-foreground">Key Criteria:</span>
          </p>
          <ul className="ml-4 space-y-1 text-muted-foreground">
            <li>• Drug-resistant epilepsy (failed ≥2 ASM trials)</li>
            <li>• Focal seizure onset on EEG/imaging</li>
            <li>• Localizable to specific brain lobe</li>
            <li>• Structural MRI findings when present</li>
            <li>• Adequate cognitive function for surgery</li>
            <li>• Resectable area without eloquent cortex involvement</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
