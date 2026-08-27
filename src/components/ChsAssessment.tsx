import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Info, BookOpen, Activity, Stethoscope, Pill, AlertTriangle, CheckCircle2, Droplets, ShieldAlert, RotateCcw } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { AssessmentReference } from '@/components/AssessmentReference';
import { CHS_DATA } from '@/data/chsData';

interface ChsAssessmentProps {
  onBack: () => void;
}

const phaseColors = [
  'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
];

export const ChsAssessment: React.FC<ChsAssessmentProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const isMalayalam = language === 'ml';
  const [checkedCriteria, setCheckedCriteria] = useState<Set<number>>(new Set());

  const toggleCriterion = (index: number) => {
    setCheckedCriteria(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const allChecked =
    CHS_DATA.romeIvDiagnosticCriteria.criteria.length > 0 &&
    checkedCriteria.size === CHS_DATA.romeIvDiagnosticCriteria.criteria.length;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {isMalayalam ? 'തിരികെ' : 'Back'}
          </Button>
          <LanguageToggle />
        </div>

        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
              <ShieldAlert className="h-7 w-7 text-red-600" />
              {CHS_DATA.condition}
            </CardTitle>
            <CardDescription>
              {isMalayalam
                ? 'വിട്ടുമാറാത്ത കഞ്ചാവ് ഉപയോഗവുമായി ബന്ധപ്പെട്ട ഗട്ട്-ബ്രെയിൻ അച്ചുതണ്ട് തകരാറ്'
                : 'Gut-brain axis disorder of chronic, heavy cannabis use'}
            </CardDescription>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              <span>{isMalayalam ? 'ക്ലിനിക്കൽ റഫറൻസ്' : 'Clinical reference — educational, not a scoring tool'}</span>
            </div>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {CHS_DATA.definition}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Pathophysiology */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-primary" />
              {isMalayalam ? 'പാത്തോഫിസിയോളജി' : 'Pathophysiology'}
            </CardTitle>
            <CardDescription>
              {isMalayalam ? 'വിട്ടുമാറാത്ത കന്നാബിനോയിഡ് എക്സ്പോഷറിനോടുള്ള വിരോധാഭാസ പ്രതികരണം' : CHS_DATA.pathophysiology.overview}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {CHS_DATA.pathophysiology.mechanisms.map((m, i) => (
              <div key={i} className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold mb-1 flex items-center gap-2">
                  <span className="text-primary">{i + 1}.</span>
                  {m.name}
                </h4>
                <p className="text-sm text-muted-foreground">{m.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Clinical Phases */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Stethoscope className="h-5 w-5 text-primary" />
              {isMalayalam ? 'ക്ലിനിക്കൽ ഘട്ടങ്ങൾ' : 'Clinical Phases'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {CHS_DATA.clinicalPhases.map(phase => (
              <div key={phase.phaseNumber} className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Badge className={phaseColors[phase.phaseNumber - 1]} variant="secondary">
                    {isMalayalam ? `ഘട്ടം ${phase.phaseNumber}` : `Phase ${phase.phaseNumber}`}
                  </Badge>
                  <span className="font-semibold">{phase.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{phase.duration}</span>
                </div>
                <ul className="space-y-1.5">
                  {phase.clinicalFeatures.map((f, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Rome IV Diagnostic Criteria */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              {isMalayalam ? 'റോം IV ഡയഗ്നോസ്റ്റിക് മാനദണ്ഡങ്ങൾ' : 'Rome IV Diagnostic Criteria'}
            </CardTitle>
            <CardDescription>
              {isMalayalam ? 'പാലിക്കുന്ന മാനദണ്ഡങ്ങൾ അടയാളപ്പെടുത്തുക' : 'Check the criteria that are met'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {CHS_DATA.romeIvDiagnosticCriteria.criteria.map((c, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    checkedCriteria.has(i)
                      ? 'border-green-600 bg-green-50 dark:bg-green-950/30'
                      : 'border-border hover:border-primary/40'
                  }`}
                  onClick={() => toggleCriterion(i)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={checkedCriteria.has(i)}
                      onCheckedChange={() => toggleCriterion(i)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary text-sm shrink-0">{i + 1}.</span>
                        {i === 3 && (
                          <Badge variant="outline" className="text-[10px]">
                            {isMalayalam ? 'നിർണ്ണായകം' : 'Definitive'}
                          </Badge>
                        )}
                        {i === 4 && (
                          <Badge variant="outline" className="text-[10px]">
                            {isMalayalam ? 'പിന്തുണ' : 'Supportive'}
                          </Badge>
                        )}
                      </div>
                      <Label
                        className={`text-sm font-normal cursor-pointer ${
                          checkedCriteria.has(i) ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {c}
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary bar */}
            <div className="mt-4 flex items-center justify-between gap-2 p-3 rounded-lg bg-muted">
              <span className="text-sm font-medium">
                {isMalayalam
                  ? `തിരഞ്ഞെടുത്തു: ${checkedCriteria.size} / ${CHS_DATA.romeIvDiagnosticCriteria.criteria.length}`
                  : `Selected: ${checkedCriteria.size} / ${CHS_DATA.romeIvDiagnosticCriteria.criteria.length}`}
              </span>
              <div className="flex items-center gap-2">
                {allChecked && (
                  <Badge variant="secondary" className="text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {isMalayalam ? 'എല്ലാ മാനദണ്ഡങ്ങളും പാലിക്കുന്നു' : 'All criteria met'}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCheckedCriteria(new Set())}
                  className="h-7 px-2 text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  {isMalayalam ? 'റീസെറ്റ്' : 'Reset'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Management */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Pill className="h-5 w-5 text-primary" />
              {isMalayalam ? 'മാനേജ്മെന്റ്' : 'Management'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Acute hyperemetic phase */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                {isMalayalam ? 'അക്യൂട്ട് ഹൈപ്പർമെറ്റിക് ഘട്ടം' : 'Acute Hyperemetic Phase'}
              </h4>

              <div className="space-y-3 mb-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {isMalayalam ? 'ആദ്യ നിര രോഗലക്ഷണ ആശ്വാസം' : 'First-line symptomatic relief'}
                </p>
                {CHS_DATA.management.acuteHyperemeticPhase.firstLineSymptomaticRelief.map((item, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{item.intervention}</span>
                      {item.dose && <Badge variant="outline" className="text-xs">{item.dose}</Badge>}
                      {item.administration && (
                        <span className="text-xs text-muted-foreground">{item.administration}</span>
                      )}
                    </div>
                    {item.examples && (
                      <ul className="mt-2 space-y-1">
                        {item.examples.map((ex, j) => (
                          <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="text-primary">•</span>
                            <span className="font-medium text-foreground">{ex.drug}</span>
                            <span>{ex.dose}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.example && (
                      <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                        <span className="text-primary">•</span>
                        <span className="font-medium text-foreground">{item.example.drug}</span>
                        <span>{item.example.dose}</span>
                      </p>
                    )}
                    {item.mechanism && (
                      <p className="mt-2 text-xs text-muted-foreground italic">{item.mechanism}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg border border-border mb-3">
                <p className="text-sm font-medium mb-1">
                  {isMalayalam ? 'പരമ്പരാഗത ആന്റിമെറ്റിക്സ്' : 'Conventional antiemetics'}
                  <span className="text-xs text-muted-foreground font-normal ml-2">
                    — {CHS_DATA.management.acuteHyperemeticPhase.conventionalAntiemetics.note}
                  </span>
                </p>
                <ul className="space-y-1">
                  {CHS_DATA.management.acuteHyperemeticPhase.conventionalAntiemetics.examples.map((e, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-destructive mt-0.5">✕</span>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg border border-border">
                <p className="text-sm font-medium mb-1 flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-600" />
                  {isMalayalam ? 'സപ്പോർട്ടീവ് കെയർ' : 'Supportive care'}
                </p>
                <ul className="space-y-1">
                  {CHS_DATA.management.acuteHyperemeticPhase.supportiveCare.map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Long-term management */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-green-600" />
                {isMalayalam ? 'ദീർഘകാല മാനേജ്മെന്റ്' : 'Long-term Management'}
              </h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-green-600/30 bg-green-50 dark:bg-green-950/30">
                  <p className="font-semibold text-sm text-green-700 dark:text-green-400">
                    {CHS_DATA.management.longTermManagement.definitiveTreatment.intervention}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {CHS_DATA.management.longTermManagement.definitiveTreatment.note}
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-border">
                  <p className="font-semibold text-sm">
                    {CHS_DATA.management.longTermManagement.prophylaxis.intervention}
                  </p>
                  {CHS_DATA.management.longTermManagement.prophylaxis.example && (
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {CHS_DATA.management.longTermManagement.prophylaxis.example.drug}
                      </span>
                      <span>{CHS_DATA.management.longTermManagement.prophylaxis.example.dose}</span>
                    </p>
                  )}
                  {CHS_DATA.management.longTermManagement.prophylaxis.indication && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      {CHS_DATA.management.longTermManagement.prophylaxis.indication}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <AssessmentReference assessmentKey="chs" />
    </div>
  );
};
