import { useMemo, useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle, Info, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DSM5_CATATONIA_FEATURES, DSM5_CATATONIA_THRESHOLD,
} from '@/data/dsm5CatatoniaCriteria';
import { AssessmentReference } from '@/components/AssessmentReference';

/**
 * DSM-5-TR Catatonia (293.89) decision panel.
 * Standalone tool — rendered inside the Catatonia tab as a sub-tab alongside BFCRS.
 */
export const Dsm5CatatoniaCriteria = () => {
  const { language } = useLanguage();
  const isMl = language === 'ml';
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const count = useMemo(() => Object.values(checked).filter(Boolean).length, [checked]);
  const meets = count >= DSM5_CATATONIA_THRESHOLD;

  return (
    <div className="space-y-4">
      <Card className="border-l-4 border-l-cyan-500">
        <CardHeader>
          <CardTitle className="text-xl">
            {isMl
              ? 'DSM-5-TR കാറ്ററ്റോണിയ ഡയഗ്നോസ്റ്റിക് മാനദണ്ഡങ്ങൾ'
              : 'DSM-5-TR Catatonia Diagnostic Criteria'}
          </CardTitle>
          <CardDescription>
            {isMl
              ? `താഴെപ്പറയുന്ന 12 സവിശേഷതകളിൽ കുറഞ്ഞത് ${DSM5_CATATONIA_THRESHOLD} എണ്ണം ഉണ്ടെങ്കിൽ കാറ്ററ്റോണിയയുടെ DSM-5-TR മാനദണ്ഡങ്ങൾ പാലിക്കപ്പെടുന്നു.`
              : `Diagnosis requires three (or more) of the following twelve features.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {isMl
                ? 'കാറ്ററ്റോണിയ മറ്റൊരു മാനസിക/മെഡിക്കൽ അവസ്ഥയുമായി ബന്ധപ്പെട്ടോ, അല്ലെങ്കിൽ വ്യക്തമാക്കാത്ത കാറ്ററ്റോണിയ ആയോ കോഡ് ചെയ്യാം.'
                : 'Code as catatonia associated with another mental/medical condition, or as unspecified catatonia.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="colorful-questions space-y-2">
            {DSM5_CATATONIA_FEATURES.map((f, idx) => {
              const isChecked = !!checked[f.id];
              return (
                <label
                  key={f.id}
                  htmlFor={f.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card cursor-pointer hover:bg-accent/40 transition-colors"
                >
                  <Checkbox
                    id={f.id}
                    checked={isChecked}
                    onCheckedChange={() => toggle(f.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      {idx + 1}. {isMl ? f.featureMl : f.feature}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {isMl ? f.descriptionMl : f.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card
        className={`border-2 ${
          meets
            ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30'
            : count > 0
            ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30'
            : 'border-muted'
        }`}
      >
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {meets ? (
              <>
                <AlertTriangle className="h-5 w-5 text-rose-600" />
                {isMl
                  ? `DSM-5-TR മാനദണ്ഡങ്ങൾ പാലിക്കുന്നു (${count}/12)`
                  : `Meets DSM-5-TR criteria (${count}/12)`}
              </>
            ) : (
              <>
                <CheckCircle2 className={`h-5 w-5 ${count > 0 ? 'text-amber-600' : 'text-muted-foreground'}`} />
                {isMl
                  ? `${count}/12 സവിശേഷതകൾ — പരിധി: ${DSM5_CATATONIA_THRESHOLD}`
                  : `${count}/12 features — threshold: ${DSM5_CATATONIA_THRESHOLD}`}
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          {meets ? (
            <p>
              {isMl
                ? 'കാറ്ററ്റോണിയയുടെ DSM-5-TR മാനദണ്ഡങ്ങൾ പാലിക്കുന്നു. ലോറാസെപാം ചാലഞ്ച് (1–2 mg IV/IM) പരിഗണിക്കുക, അടിസ്ഥാന കാരണം അന്വേഷിക്കുക, ആന്റിസൈക്കോട്ടിക്കുകൾ താൽക്കാലികമായി നിർത്തുക, BFCRS ഉപയോഗിച്ച് തീവ്രത റേറ്റ് ചെയ്യുക.'
                : 'Catatonia criteria met. Consider lorazepam challenge (1–2 mg IV/IM), investigate underlying etiology, hold antipsychotics, and rate severity with the BFCRS.'}
            </p>
          ) : (
            <p>
              {isMl
                ? `DSM-5-TR രോഗനിർണയത്തിന് കുറഞ്ഞത് ${DSM5_CATATONIA_THRESHOLD} സവിശേഷതകൾ ആവശ്യമാണ്.`
                : `DSM-5-TR diagnosis requires at least ${DSM5_CATATONIA_THRESHOLD} features.`}
            </p>
          )}
        </CardContent>
      </Card>

      <Button onClick={() => setChecked({})} variant="outline" className="w-full">
        <RotateCcw className="h-4 w-4 mr-2" />
        {isMl ? 'പുനഃക്രമീകരിക്കുക' : 'Reset'}
      </Button>

      <AssessmentReference assessmentKey="catatoniaDsm5" />
    </div>
  );
};
