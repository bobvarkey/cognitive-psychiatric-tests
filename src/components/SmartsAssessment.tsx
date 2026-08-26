import { useMemo, useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, ClipboardList, AlertTriangle, CheckCircle2, XCircle, Info, RotateCcw,
} from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  SMARTS_ITEMS, SMARTS_PURPOSE, SMARTS_FOLLOWUP,
} from '@/data/smartsScale';
import { AssessmentReference } from '@/components/AssessmentReference';
import { ExportButtons } from './ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

interface SmartsAssessmentProps {
  onBack: () => void;
}

export const SmartsAssessment = ({ onBack }: SmartsAssessmentProps) => {
  const { language } = useLanguage();
  const isMl = language === 'ml';
  const [responses, setResponses] = useState<Record<string, boolean | null>>({});

  const setResponse = (id: string, value: boolean) =>
    setResponses(prev => ({ ...prev, [id]: value }));

  const handleReset = () => setResponses({});

  const positives = useMemo(
    () => SMARTS_ITEMS.filter(i => responses[i.id] === true),
    [responses],
  );
  const answered = useMemo(
    () => SMARTS_ITEMS.filter(i => responses[i.id] === true || responses[i.id] === false).length,
    [responses],
  );
  const allAnswered = answered === SMARTS_ITEMS.length;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {isMl ? 'തിരികെ' : 'Back'}
          </Button>
          <LanguageToggle />
        </div>

        <PatientInfoForm />

        <Card className="mb-6 border-l-4 border-l-orange-500">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl md:text-3xl">SMARTS</CardTitle>
                <CardDescription>
                  Systematic Monitoring of Adverse events Related to TreatmentS
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {isMl ? SMARTS_PURPOSE.ml : SMARTS_PURPOSE.en}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {isMl
                ? 'കഴിഞ്ഞ 7 ദിവസത്തെ പാർശ്വഫലങ്ങൾ'
                : 'Side effects in the past 7 days'}
            </CardTitle>
            <CardDescription>
              {isMl
                ? 'ഓരോ ഇനവും "ഉണ്ട്" അല്ലെങ്കിൽ "ഇല്ല" എന്ന് അടയാളപ്പെടുത്തുക.'
                : 'Mark each item Yes or No.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="colorful-questions space-y-3">
              {SMARTS_ITEMS.map((item, idx) => {
                const value = responses[item.id];
                return (
                  <div
                    key={item.id}
                    className="rounded-lg border bg-card p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-[10px]">
                            {idx + 1}
                          </Badge>
                          <span className="text-xs font-medium text-muted-foreground">
                            {item.domain}
                          </span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed">
                          {isMl ? item.questionMl : item.question}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant={value === true ? 'default' : 'outline'}
                          className={value === true ? 'bg-orange-500 hover:bg-orange-600' : ''}
                          onClick={() => setResponse(item.id, true)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          {isMl ? 'ഉണ്ട്' : 'Yes'}
                        </Button>
                        <Button
                          size="sm"
                          variant={value === false ? 'default' : 'outline'}
                          className={value === false ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                          onClick={() => setResponse(item.id, false)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          {isMl ? 'ഇല്ല' : 'No'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {answered} / {SMARTS_ITEMS.length} {isMl ? 'പൂർത്തിയാക്കി' : 'answered'}
            </p>
          </CardContent>
        </Card>

        <Card
          className={`mb-6 border-2 ${
            positives.length > 0
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
              : allAnswered
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
              : 'border-muted'
          }`}
        >
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              {positives.length > 0 ? (
                <>
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  {positives.length} {isMl ? 'പാർശ്വഫലം റിപ്പോർട്ട് ചെയ്തു' : 'side effect(s) endorsed'}
                </>
              ) : allAnswered ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  {isMl ? 'പാർശ്വഫലങ്ങൾ റിപ്പോർട്ട് ചെയ്തിട്ടില്ല' : 'No side effects endorsed'}
                </>
              ) : (
                <>
                  <Info className="h-5 w-5 text-muted-foreground" />
                  {isMl ? 'ഇൻപുട്ടിനായി കാത്തിരിക്കുന്നു' : 'Awaiting input'}
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {positives.length > 0 && (
              <>
                <div className="flex flex-wrap gap-2">
                  {positives.map(p => (
                    <Badge key={p.id} variant="secondary">
                      {p.domain}
                    </Badge>
                  ))}
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {isMl ? SMARTS_FOLLOWUP.ml : SMARTS_FOLLOWUP.en}
                  </AlertDescription>
                </Alert>
              </>
            )}
            {allAnswered && positives.length === 0 && (
              <p>
                {isMl
                  ? 'ഈ ചെക്ക്‌ലിസ്റ്റിൽ പ്രശ്നങ്ങളൊന്നും കണ്ടെത്തിയില്ല. പതിവ് നിരീക്ഷണം തുടരുക.'
                  : 'No problems identified on this checklist. Continue routine monitoring.'}
              </p>
            )}
          </CardContent>
        </Card>

        {positives.length > 0 && (
          <ExportButtons
            className="justify-start"
            data={{
              assessmentName: 'SMARTS — Systematic Monitoring of Adverse events Related to TreatmentS',
              date: new Date().toLocaleString(),
              totalScore: `${positives.length}/${SMARTS_ITEMS.length} side effects endorsed`,
              interpretation: positives.length > 0 ? 'Follow-up required' : 'No problems identified',
              sections: [
                {
                  title: 'Endorsed Side Effects',
                  items: positives.map(p => `${p.domain}: ${isMl ? p.questionMl : p.question}`),
                  type: 'positive',
                },
              ],
              disclaimer: 'SMARTS flags patient-reported side effects; follow up on severity and adherence impact.',
            } as ReportData}
          />
        )}

        <div className="flex gap-3">
          <Button onClick={handleReset} variant="outline" className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            {isMl ? 'പുനഃക്രമീകരിക്കുക' : 'Reset'}
          </Button>
        </div>

        <AssessmentReference assessmentKey="smarts" />
      </div>
    </div>
  );
};
