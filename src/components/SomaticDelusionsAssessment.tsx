import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Info, BookOpen, Brain, AlertTriangle, Stethoscope, ShieldAlert, Scale, ListChecks } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { AssessmentReference } from '@/components/AssessmentReference';
import { SOMATIC_DELUSIONS_DATA } from '@/data/somaticDelusionsData';

interface SomaticDelusionsAssessmentProps {
  onBack: () => void;
}

export const SomaticDelusionsAssessment: React.FC<SomaticDelusionsAssessmentProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const isMl = language === 'ml';

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

        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
              <Brain className="h-7 w-7 text-purple-600" />
              {SOMATIC_DELUSIONS_DATA.title}
            </CardTitle>
            <CardDescription>{SOMATIC_DELUSIONS_DATA.subtitle}</CardDescription>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              <span>{isMl ? 'ക്ലിനിക്കൽ റഫറൻസ്' : 'Clinical reference — educational, not a scoring tool'}</span>
            </div>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">{SOMATIC_DELUSIONS_DATA.definition}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* By content theme */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListChecks className="h-5 w-5 text-primary" />
              {isMl ? 'ഉള്ളടക്ക തീം അനുസരിച്ച്' : '1. By Content Theme'}
            </CardTitle>
            <CardDescription>
              {isMl ? 'വിശ്വാസം എന്തിനെക്കുറിച്ചാണ്' : 'What the belief is about — recurring "templates"'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {SOMATIC_DELUSIONS_DATA.themes.map((t) => (
              <div key={t.id} className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold mb-1 flex items-center gap-2">
                  <span className="text-primary">{t.name}</span>
                </h4>
                <p className="text-sm text-muted-foreground mb-2">{t.definition}</p>
                <ul className="space-y-1">
                  {t.examples.map((e, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {e}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex flex-wrap gap-1">
                  {t.redFlags.map((r, i) => (
                    <Badge key={i} variant="outline" className="text-[10px]">
                      <AlertTriangle className="h-3 w-3 mr-1 text-amber-600" />
                      {r}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* By bizarreness */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Scale className="h-5 w-5 text-primary" />
              {isMl ? 'വിചിത്രത അനുസരിച്ച്' : '2. By Bizarreness'}
            </CardTitle>
            <CardDescription>DSM-5-TR distinguishes bizarre vs non-bizarre content — matters for diagnosis and risk formulation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {SOMATIC_DELUSIONS_DATA.bizarreness.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-lg border ${
                  b.id === 'bizarre' ? 'border-red-300 bg-red-50 dark:bg-red-950/20' : 'border-green-300 bg-green-50 dark:bg-green-950/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={b.id === 'bizarre' ? 'destructive' : 'secondary'}>{b.name}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{b.description}</p>
                <ul className="space-y-1 mb-2">
                  {b.examples.map((e, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {e}
                    </li>
                  ))}
                </ul>
                <p className="text-xs font-medium text-foreground flex items-start gap-2">
                  <ShieldAlert className="h-3.5 w-3.5 mt-0.5 text-amber-600" />
                  {b.implication}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* By clinical context */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Stethoscope className="h-5 w-5 text-primary" />
              {isMl ? 'ക്ലിനിക്കൽ സന്ദർഭം അനുസരിച്ച്' : '3. By Clinical Context'}
            </CardTitle>
            <CardDescription>Where you see them</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {SOMATIC_DELUSIONS_DATA.contexts.map((c) => (
              <div key={c.id} className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold mb-1">{c.name}</h4>
                <ul className="space-y-1 mb-2">
                  {c.features.map((f, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1">
                  {c.commonThemes.map((t, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px]">{t}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Differential */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              {isMl ? 'വ്യത്യസ്ത രോഗനിർണയം' : '4. How This Differs from Non-delusional Somatic Phenomena'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {SOMATIC_DELUSIONS_DATA.differential.map((d) => (
              <div key={d.condition} className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold mb-1">{d.condition}</h4>
                <p className="text-sm text-muted-foreground mb-1">{d.key}</p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-[10px]">Insight: {d.insight}</Badge>
                  <Badge variant="outline" className="text-[10px]">Content: {d.content}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <AssessmentReference assessmentKey="somaticDelusions" />
    </div>
  );
};
