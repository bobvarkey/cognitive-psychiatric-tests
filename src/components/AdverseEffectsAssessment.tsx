import { useMemo, useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft, Pill, AlertTriangle, CheckCircle2, Info, RotateCcw,
} from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { ADVERSE_EFFECTS, ADVERSE_EFFECTS_PURPOSE } from '@/data/adverseEffectsData';
import { AssessmentReference } from '@/components/AssessmentReference';

interface AdverseEffectsAssessmentProps {
  onBack: () => void;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  antipsychotics: 'from-purple-500 to-indigo-600',
  antidepressants: 'from-blue-500 to-cyan-600',
  anxiolytics: 'from-emerald-500 to-teal-600',
  'mood-stabilizers': 'from-amber-500 to-orange-600',
  serious: 'from-rose-500 to-red-600',
};

const CATEGORY_BORDERS: Record<string, string> = {
  antipsychotics: 'border-l-purple-500',
  antidepressants: 'border-l-blue-500',
  anxiolytics: 'border-l-emerald-500',
  'mood-stabilizers': 'border-l-amber-500',
  serious: 'border-l-rose-500',
};

export const AdverseEffectsAssessment = ({ onBack }: AdverseEffectsAssessmentProps) => {
  const { language } = useLanguage();
  const isMl = language === 'ml';
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const handleReset = () => setChecked({});

  const positives = useMemo(
    () =>
      ADVERSE_EFFECTS.flatMap(cat =>
        cat.groups.flatMap(g =>
          g.items
            .filter(i => checked[i.id])
            .map(i => ({ ...i, category: cat.category, heading: g.heading })),
        ),
      ),
    [checked],
  );

  const seriousFlagged = positives.some(p =>
    ADVERSE_EFFECTS.find(c => c.id === 'serious')?.groups[0].items.some(i => i.id === p.id),
  );

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

        <Card className="mb-6 border-l-4 border-l-fuchsia-500">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-md">
                <Pill className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl md:text-3xl">
                  {isMl ? 'പാർശ്വഫല ചെക്ക്‌ലിസ്റ്റ്' : 'Adverse Effects Checklist'}
                </CardTitle>
                <CardDescription>
                  {isMl
                    ? 'ന്യൂറോസൈക്യാട്രിക് മരുന്നുകളുടെ സാധാരണ പാർശ്വഫലങ്ങൾ — ക്ലിനിഷ്യൻ റഫറൻസ്'
                    : 'Common adverse effects of neuropsychiatric medications — clinician reference'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {ADVERSE_EFFECTS_PURPOSE}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <div className="space-y-4 mb-6">
          {ADVERSE_EFFECTS.map(cat => {
            const gradient = CATEGORY_GRADIENTS[cat.id] ?? 'from-slate-500 to-slate-600';
            const border = CATEGORY_BORDERS[cat.id] ?? 'border-l-slate-500';
            return (
              <Card key={cat.id} className={`border-l-4 ${border}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-sm`}>
                      <Pill className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{cat.category}</CardTitle>
                      <CardDescription className="text-xs">{cat.examples}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cat.groups.map(g => (
                    <div key={g.heading}>
                      <h4 className="text-sm font-semibold text-foreground mb-2">
                        {g.heading}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {g.items.map(item => (
                          <label
                            key={item.id}
                            htmlFor={item.id}
                            className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                              checked[item.id]
                                ? 'bg-primary/5 border-primary/40'
                                : 'bg-card hover:bg-accent/50'
                            }`}
                          >
                            <Checkbox
                              id={item.id}
                              checked={!!checked[item.id]}
                              onCheckedChange={() => toggle(item.id)}
                              className="mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-tight">
                                {item.label}
                              </p>
                              {item.detail && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {item.detail}
                                </p>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card
          className={`mb-6 border-2 ${
            seriousFlagged
              ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30'
              : positives.length > 0
              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
              : 'border-muted'
          }`}
        >
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              {seriousFlagged ? (
                <>
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                  {isMl ? 'ഗുരുതരമായ പ്രതികൂല പ്രതികരണം' : 'Serious adverse reaction flagged'}
                </>
              ) : positives.length > 0 ? (
                <>
                  <Info className="h-5 w-5 text-amber-600" />
                  {positives.length} {isMl ? 'പാർശ്വഫലം രേഖപ്പെടുത്തി' : 'adverse effect(s) documented'}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  {isMl ? 'ഒന്നും തിരഞ്ഞെടുത്തിട്ടില്ല' : 'Nothing selected yet'}
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {seriousFlagged && (
              <Alert className="border-rose-500/50">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <AlertDescription>
                  {isMl
                    ? 'ഗുരുതരമായ പാർശ്വഫലം തിരഞ്ഞെടുത്തു. അടിയന്തിര വൈദ്യ വിലയിരുത്തൽ പരിഗണിക്കുക.'
                    : 'A serious adverse effect has been flagged. Consider urgent medical review and possible discontinuation of the implicated agent.'}
                </AlertDescription>
              </Alert>
            )}
            {positives.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {positives.map(p => (
                  <Badge key={p.id} variant="secondary" className="text-xs">
                    {p.category}: {p.label}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleReset} variant="outline" className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            {isMl ? 'പുനഃക്രമീകരിക്കുക' : 'Reset'}
          </Button>
        </div>

        <AssessmentReference assessmentKey="adverseEffects" />
      </div>
    </div>
  );
};
