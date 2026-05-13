import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AdhdResults as AdhdResultsType } from '@/types/adhd';
import { getPresentationLabel, DOMAIN_THRESHOLDS } from '@/data/adhdScale';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { Brain, RotateCcw, Printer, AlertTriangle, CheckCircle2, Info, ArrowLeft, XCircle, Copy, Check, FileDown } from 'lucide-react';
import { generatePdfReport, generateTextReport } from '@/utils/reportGenerator';
import type { ReportData } from '@/utils/reportGenerator';
import { usePatientInfo } from '@/contexts/PatientInfoContext';
import { ADHD_INATTENTION_SYMPTOMS, ADHD_HYPERACTIVITY_SYMPTOMS } from '@/data/adhdScale';

interface AdhdResultsProps {
  results: AdhdResultsType;
  onReset: () => void;
  onBack?: () => void;
}

export const AdhdResults = ({ results, onReset, onBack }: AdhdResultsProps) => {
  const { t, language } = useLanguage();
  const { getPatientInfoForReport } = usePatientInfo();
  const [copied, setCopied] = useState(false);
  
  const threshold = results.age17Plus ? DOMAIN_THRESHOLDS.adult : DOMAIN_THRESHOLDS.childAdolescent;
  const meetsInattention = results.inattentionCount >= threshold;
  const meetsHyperactivity = results.hyperactivityCount >= threshold;
  const meetsAnyCriterionA = meetsInattention || meetsHyperactivity;
  const presentationLabel = getPresentationLabel(results.presentation, language);

  const getOverallInterpretation = () => {
    if (meetsAnyCriterionA && results.allCriteriaMet) {
      return {
        level: 'high',
        title: language === 'ml' ? 'ADHD മാനദണ്ഡങ്ങൾ പാലിക്കുന്നു' : 'Meets ADHD Criteria',
        description: language === 'ml' 
          ? 'ലക്ഷണ പ്രൊഫൈലും അധിക മാനദണ്ഡങ്ങളും (B-E) ADHD രോഗനിർണയവുമായി പൊരുത്തപ്പെടുന്നു. ഒരു യോഗ്യതയുള്ള ആരോഗ്യ പ്രൊഫഷണലിന്റെ സമഗ്ര വിലയിരുത്തൽ ശുപാർശ ചെയ്യുന്നു.'
          : 'The symptom profile and additional criteria (B-E) are consistent with an ADHD diagnosis. Comprehensive evaluation by a qualified healthcare professional is recommended.',
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    } else if (meetsAnyCriterionA && !results.allCriteriaMet) {
      return {
        level: 'moderate',
        title: language === 'ml' ? 'ഭാഗിക മാനദണ്ഡങ്ങൾ' : 'Partial Criteria Met',
        description: language === 'ml'
          ? 'ലക്ഷണ മാനദണ്ഡങ്ങൾ (A) പാലിക്കുന്നു, എന്നാൽ എല്ലാ അധിക മാനദണ്ഡങ്ങളും (B-E) പാലിക്കുന്നില്ല. കൂടുതൽ ക്ലിനിക്കൽ വിലയിരുത്തൽ ആവശ്യമായി വന്നേക്കാം.'
          : 'Symptom criteria (A) are met, but not all additional criteria (B-E) are satisfied. Further clinical assessment may be warranted.',
        icon: Info,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };
    } else {
      return {
        level: 'low',
        title: language === 'ml' ? 'മാനദണ്ഡങ്ങൾ പാലിക്കുന്നില്ല' : 'Criteria Not Met',
        description: language === 'ml'
          ? 'നിലവിലെ ലക്ഷണ എണ്ണം ADHD രോഗനിർണയത്തിനുള്ള പരിധി എത്തുന്നില്ല. എന്നിരുന്നാലും, ആശങ്കകളുണ്ടെങ്കിൽ ഒരു ആരോഗ്യ പ്രൊഫഷണലുമായി ചർച്ച ചെയ്യുക.'
          : 'Current symptom count does not reach the threshold for ADHD diagnosis. However, if concerns persist, discuss with a healthcare professional.',
        icon: CheckCircle2,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    }
  };

  const interpretation = getOverallInterpretation();
  const Icon = interpretation.icon;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-4 print:hidden">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToMenu')}
          </Button>
        )}

        {/* Header */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            <div className="flex items-center gap-3">
              <Brain className="h-10 w-10" />
              <div>
                <CardTitle className="text-2xl md:text-3xl">
                  {language === 'ml' ? 'DSM-5-TR ADHD ഫലങ്ങൾ' : 'DSM-5-TR ADHD Results'}
                </CardTitle>
                <p className="text-indigo-100 mt-1">
                  {language === 'ml' ? 'രോഗനിർണയ മാനദണ്ഡ വിലയിരുത്തൽ' : 'Diagnostic Criteria Assessment'}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Overall Interpretation */}
        <Card className={`shadow-lg border-2 ${interpretation.borderColor}`}>
          <CardContent className={`p-6 ${interpretation.bgColor}`}>
            <div className="flex items-start gap-4">
              <Icon className={`h-12 w-12 ${interpretation.color} flex-shrink-0`} />
              <div className="flex-1">
                <h2 className={`text-2xl font-bold ${interpretation.color} mb-2`}>
                  {interpretation.title}
                </h2>
                <p className="text-foreground leading-relaxed">
                  {interpretation.description}
                </p>
                {meetsAnyCriterionA && (
                  <div className="mt-4 p-3 bg-background/80 rounded-lg">
                    <p className="font-semibold text-foreground">{presentationLabel.title}</p>
                    <p className="text-sm text-muted-foreground">{presentationLabel.description}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Symptom Counts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inattention */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <CardTitle className="flex items-center justify-between">
                <span>{language === 'ml' ? 'ശ്രദ്ധക്കുറവ്' : 'Inattention'}</span>
                <span className="text-3xl font-bold">{results.inattentionCount}/9</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {language === 'ml' ? 'ആവശ്യമായ പരിധി:' : 'Required threshold:'}
                  </span>
                  <span className="font-bold text-lg">≥{threshold}</span>
                </div>
                <div className={`flex items-center gap-2 p-3 rounded-lg ${meetsInattention ? 'bg-green-100' : 'bg-red-100'}`}>
                  {meetsInattention ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={meetsInattention ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                    {meetsInattention 
                      ? (language === 'ml' ? 'മാനദണ്ഡം പാലിക്കുന്നു' : 'Criterion Met')
                      : (language === 'ml' ? 'മാനദണ്ഡം പാലിക്കുന്നില്ല' : 'Criterion Not Met')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hyperactivity-Impulsivity */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <CardTitle className="flex items-center justify-between">
                <span>{language === 'ml' ? 'അമിത സജീവത-ആവേഗം' : 'Hyperactivity-Impulsivity'}</span>
                <span className="text-3xl font-bold">{results.hyperactivityCount}/9</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {language === 'ml' ? 'ആവശ്യമായ പരിധി:' : 'Required threshold:'}
                  </span>
                  <span className="font-bold text-lg">≥{threshold}</span>
                </div>
                <div className={`flex items-center gap-2 p-3 rounded-lg ${meetsHyperactivity ? 'bg-green-100' : 'bg-red-100'}`}>
                  {meetsHyperactivity ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={meetsHyperactivity ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                    {meetsHyperactivity 
                      ? (language === 'ml' ? 'മാനദണ്ഡം പാലിക്കുന്നു' : 'Criterion Met')
                      : (language === 'ml' ? 'മാനദണ്ഡം പാലിക്കുന്നില്ല' : 'Criterion Not Met')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Criteria B-E Status */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
            <CardTitle>
              {language === 'ml' ? 'മാനദണ്ഡങ്ങൾ B-E നില' : 'Criteria B-E Status'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {results.criterionResponses.map((cr) => (
                <div key={cr.criterionId} className={`p-4 rounded-lg text-center ${cr.met ? 'bg-green-100' : 'bg-red-100'}`}>
                  <p className="font-bold text-lg text-foreground">
                    {language === 'ml' ? 'മാനദണ്ഡം' : 'Criterion'} {cr.criterionId}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {cr.met ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={cr.met ? 'text-green-700 text-sm' : 'text-red-700 text-sm'}>
                      {cr.met ? (language === 'ml' ? 'പാലിക്കുന്നു' : 'Met') : (language === 'ml' ? 'പാലിക്കുന്നില്ല' : 'Not Met')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Disclaimers */}
        <Alert className="border-2 border-amber-300 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-foreground">
            <strong className="text-amber-800">
              {language === 'ml' ? 'പ്രധാനം:' : 'Important:'}
            </strong>{' '}
            {language === 'ml'
              ? 'ഇത് ഒരു സ്ക്രീനിംഗ് ടൂൾ മാത്രമാണ്, ഒരു രോഗനിർണയ ഉപകരണമല്ല. ADHD രോഗനിർണയത്തിന് ഒരു യോഗ്യതയുള്ള ആരോഗ്യ പ്രൊഫഷണലിന്റെ സമഗ്ര വിലയിരുത്തൽ ആവശ്യമാണ്. ഈ വിലയിരുത്തൽ DSM-5-TR മാനദണ്ഡങ്ങളെ അടിസ്ഥാനമാക്കിയുള്ളതാണ്.'
              : 'This is a screening tool only and not a diagnostic instrument. A comprehensive evaluation by a qualified healthcare professional is required for an ADHD diagnosis. This assessment is based on DSM-5-TR criteria.'}
          </AlertDescription>
        </Alert>

        <Alert className="border-2 border-blue-300 bg-blue-50">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-foreground">
            <strong className="text-blue-800">
              {language === 'ml' ? 'ഉറവിടം:' : 'Source:'}
            </strong>{' '}
            American Psychiatric Association. <em>Diagnostic and Statistical Manual of Mental Disorders</em>. 5th ed, text revision. American Psychiatric Association; 2022:68-69.
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <Card className="shadow-lg border-0 print:hidden">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                {t('printResults')}
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  const positive = results.symptomResponses.filter(r => r.present).map(r => {
                    const sym = [...ADHD_INATTENTION_SYMPTOMS, ...ADHD_HYPERACTIVITY_SYMPTOMS].find(s => s.id === r.symptomId);
                    return sym ? `[${sym.domain}] ${language === 'ml' ? sym.labelMl : sym.label}` : r.symptomId;
                  });
                  const negative = results.symptomResponses.filter(r => !r.present).map(r => {
                    const sym = [...ADHD_INATTENTION_SYMPTOMS, ...ADHD_HYPERACTIVITY_SYMPTOMS].find(s => s.id === r.symptomId);
                    return sym ? `[${sym.domain}] ${language === 'ml' ? sym.labelMl : sym.label}` : r.symptomId;
                  });
                  generatePdfReport({
                    assessmentName: 'DSM-5-TR ADHD Diagnostic Criteria Assessment',
                    date: new Date().toLocaleDateString(),
                    totalScore: `Inattention: ${results.inattentionCount}/9, Hyperactivity: ${results.hyperactivityCount}/9`,
                    severity: interpretation.title,
                    interpretation: interpretation.description,
                    sections: [
                      { title: 'Positive Findings (Endorsed Symptoms)', items: positive.length > 0 ? positive : ['None endorsed'], type: 'positive' },
                      { title: 'Negative Findings (Not Endorsed)', items: negative, type: 'negative' },
                      { title: 'Criteria B-E Status', items: results.criterionResponses.map(cr => `Criterion ${cr.criterionId}: ${cr.met ? 'Met' : 'Not Met'}`), type: 'info' },
                    ],
                    disclaimer: 'This is a screening tool only, not a diagnostic instrument.',
                    patientInfo: getPatientInfoForReport(),
                  });
                }}
              >
                <FileDown className="h-4 w-4" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    const positive = results.symptomResponses.filter(r => r.present).map(r => {
                      const sym = [...ADHD_INATTENTION_SYMPTOMS, ...ADHD_HYPERACTIVITY_SYMPTOMS].find(s => s.id === r.symptomId);
                      return sym ? `[${sym.domain}] ${language === 'ml' ? sym.labelMl : sym.label}` : r.symptomId;
                    });
                    const negative = results.symptomResponses.filter(r => !r.present).map(r => {
                      const sym = [...ADHD_INATTENTION_SYMPTOMS, ...ADHD_HYPERACTIVITY_SYMPTOMS].find(s => s.id === r.symptomId);
                      return sym ? `[${sym.domain}] ${language === 'ml' ? sym.labelMl : sym.label}` : r.symptomId;
                    });
                    const text = generateTextReport({
                      assessmentName: 'DSM-5-TR ADHD Diagnostic Criteria Assessment',
                      date: new Date().toLocaleDateString(),
                      totalScore: `Inattention: ${results.inattentionCount}/9, Hyperactivity: ${results.hyperactivityCount}/9`,
                      severity: interpretation.title,
                      interpretation: interpretation.description,
                      sections: [
                        { title: 'Positive Findings (Endorsed Symptoms)', items: positive.length > 0 ? positive : ['None endorsed'], type: 'positive' },
                        { title: 'Negative Findings (Not Endorsed)', items: negative, type: 'negative' },
                        { title: 'Criteria B-E Status', items: results.criterionResponses.map(cr => `Criterion ${cr.criterionId}: ${cr.met ? 'Met' : 'Not Met'}`), type: 'info' },
                      ],
                      disclaimer: 'This is a screening tool only, not a diagnostic instrument.',
                      patientInfo: getPatientInfoForReport(),
                    });
                    await navigator.clipboard.writeText(text);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch {}
                }}
                className="flex items-center gap-1.5"
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy Text'}
              </Button>
              <Button
                onClick={onReset}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                {t('takeNewAssessment')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Print-only footer */}
        <div className="hidden print:block text-center text-sm text-muted-foreground mt-8">
          <p>DSM-5-TR ADHD Diagnostic Criteria Assessment</p>
          <p>Generated on {new Date().toLocaleDateString()}</p>
          <p className="mt-2 text-xs">This is a screening tool and not a diagnostic instrument. Consult a healthcare professional.</p>
        </div>
      </div>
    </div>
  );
};
