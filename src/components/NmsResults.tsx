import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { NmsResults as NmsResultsType } from '@/types/nms';
import { NMS_CATEGORIES, NMS_RECOMMENDATIONS, NMS_DIAGNOSTIC_CRITERIA, NMS_CLINICAL_NOTES } from '@/data/nmsScale';
import { AlertTriangle, ThermometerSun, Activity, Brain, FlaskConical, Stethoscope, Move, CheckCircle2, XCircle, HelpCircle, TrendingUp, Info } from 'lucide-react';
import { DomainRadarChart } from './DomainRadarChart';
import { ExportButtons } from '@/components/ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

interface NmsResultsProps {
  results: NmsResultsType;
  isMalayalam: boolean;
}

export const NmsResultsComponent: React.FC<NmsResultsProps> = ({ results, isMalayalam }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-yellow-500';
      case 'moderate': return 'bg-orange-500';
      case 'severe': return 'bg-red-500';
      case 'critical': return 'bg-red-700';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'mild': return 'secondary';
      case 'moderate': return 'default';
      case 'severe': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const getDiagnosticBadgeColor = (category: string) => {
    switch (category) {
      case 'noNms': return 'bg-green-500 hover:bg-green-600';
      case 'possibleNms': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'definiteNms': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getDiagnosticIcon = (category: string) => {
    switch (category) {
      case 'noNms': return <CheckCircle2 className="h-5 w-5" />;
      case 'possibleNms': return <HelpCircle className="h-5 w-5" />;
      case 'definiteNms': return <XCircle className="h-5 w-5" />;
      default: return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'temperature': return <ThermometerSun className="h-4 w-4" />;
      case 'extrapyramidal': return <Stethoscope className="h-4 w-4" />;
      case 'autonomic': return <Activity className="h-4 w-4" />;
      case 'consciousness': return <Brain className="h-4 w-4" />;
      case 'catatonia': return <Move className="h-4 w-4" />;
      case 'laboratory': return <FlaskConical className="h-4 w-4" />;
      default: return null;
    }
  };

  const diagnosticInfo = NMS_DIAGNOSTIC_CRITERIA[results.diagnosticCategory];
  const recommendations = isMalayalam
    ? NMS_RECOMMENDATIONS.generalMl
    : NMS_RECOMMENDATIONS.general;

  const reportData: ReportData = useMemo(() => {
    const diagnosticLabel = isMalayalam ? diagnosticInfo.labelMl : diagnosticInfo.label;
    const categoryItems = Object.entries(results.categoryScores).map(([category, score]) => {
      const catInfo = NMS_CATEGORIES[category as keyof typeof NMS_CATEGORIES];
      const name = isMalayalam ? catInfo.nameMl : catInfo.name;
      return `${name}: ${score}/${catInfo.maxScore}${score >= 2 ? ' (≥2)' : ''}`;
    });

    return {
      assessmentName: 'Neuroleptic Malignant Syndrome (NMS) Assessment',
      date: new Date().toLocaleDateString(),
      totalScore: `${results.totalScore}/${results.maxScore}`,
      severity: results.severity.charAt(0).toUpperCase() + results.severity.slice(1),
      interpretation: isMalayalam ? results.interpretationMl : results.interpretation,
      sections: [
        {
          title: 'Diagnostic Category',
          items: [`${diagnosticLabel}`, `Domains with score ≥2: ${results.domainsWithScore2OrMore}/6`],
          type: results.diagnosticCategory === 'definiteNms' ? 'positive' : results.diagnosticCategory === 'noNms' ? 'negative' : 'info',
        },
        {
          title: 'Category Scores',
          items: categoryItems,
          type: 'info',
        },
        {
          title: 'Management Recommendations',
          items: recommendations,
          type: 'info',
        },
      ],
      disclaimer: 'This scale is for clinical assessment purposes only. Not a substitute for comprehensive medical evaluation.',
    };
  }, [results, isMalayalam, diagnosticInfo, recommendations]);

  return (
    <div className="space-y-6">
      {/* Diagnostic Category Card - Primary Display */}
      <Card className="border-2 border-primary">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>{isMalayalam ? 'രോഗനിർണയ വിഭാഗം' : 'Diagnostic Category'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-lg text-white ${getDiagnosticBadgeColor(results.diagnosticCategory)}`}>
              {getDiagnosticIcon(results.diagnosticCategory)}
              <span className="text-xl font-bold">
                {isMalayalam ? diagnosticInfo.labelMl : diagnosticInfo.label}
              </span>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              {isMalayalam ? diagnosticInfo.descriptionMl : diagnosticInfo.description}
            </p>
            
            {/* Domain Score Indicator */}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">
                {isMalayalam ? 'സ്കോർ ≥2 ഉള്ള ഡൊമെയ്‌നുകൾ:' : 'Domains with score ≥2:'}
              </span>
              <Badge variant={results.domainsWithScore2OrMore >= 3 ? 'destructive' : 'secondary'}>
                {results.domainsWithScore2OrMore}/6
              </Badge>
            </div>

            {/* Strong Diagnostic Support Alert */}
            {results.meetsStrongDiagnosticCriteria && (
              <Alert variant="destructive" className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{isMalayalam ? 'ശക്തമായ രോഗനിർണയ പിന്തുണ' : 'Strong Diagnostic Support'}</AlertTitle>
                <AlertDescription className="text-sm">
                  {isMalayalam 
                    ? NMS_CLINICAL_NOTES.diagnosticSupport.ml 
                    : NMS_CLINICAL_NOTES.diagnosticSupport.en}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Total Score Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>{isMalayalam ? 'മൊത്തം സ്കോർ (തീവ്രത)' : 'Total Score (Severity)'}</span>
            <Badge variant={getSeverityBadgeVariant(results.severity)} className="text-lg px-3 py-1">
              {results.totalScore}/{results.maxScore}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress 
            value={(results.totalScore / results.maxScore) * 100} 
            className={`h-4 ${getSeverityColor(results.severity)}`}
          />
          <div className="mt-4 text-center">
            <Badge variant={getSeverityBadgeVariant(results.severity)} className="text-base px-4 py-2">
              {isMalayalam ? results.interpretationMl : results.interpretation}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Serial Monitoring Note */}
      <Alert>
        <TrendingUp className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>{isMalayalam ? 'തുടർച്ചയായ നിരീക്ഷണം:' : 'Serial Monitoring:'}</strong>{' '}
          {isMalayalam ? NMS_CLINICAL_NOTES.serialMonitoring.ml : NMS_CLINICAL_NOTES.serialMonitoring.en}
        </AlertDescription>
      </Alert>

      {/* Category Radar Chart */}
      <DomainRadarChart
        title={isMalayalam ? 'വിഭാഗ സ്കോർ പ്രൊഫൈൽ' : 'Category Score Profile'}
        data={Object.entries(results.categoryScores).map(([category, score]) => {
          const categoryInfo = NMS_CATEGORIES[category as keyof typeof NMS_CATEGORIES];
          return {
            domain: isMalayalam ? categoryInfo.nameMl : categoryInfo.name,
            score: score as number,
            maxScore: categoryInfo.maxScore,
            fullMark: 100,
          };
        })}
      />

      {/* Category Scores */}
      <Card>
        <CardHeader>
          <CardTitle>{isMalayalam ? 'വിഭാഗ സ്കോറുകൾ' : 'Category Scores'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(results.categoryScores).map(([category, score]) => {
              const categoryInfo = NMS_CATEGORIES[category as keyof typeof NMS_CATEGORIES];
              const hasScore2OrMore = score >= 2;
              return (
                <div 
                  key={category} 
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    hasScore2OrMore ? 'bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700' : 'bg-muted'
                  }`}
                >
                  {getCategoryIcon(category)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {isMalayalam ? categoryInfo.nameMl : categoryInfo.name}
                    </p>
                    <p className={`text-lg font-bold ${hasScore2OrMore ? 'text-red-600 dark:text-red-400' : 'text-primary'}`}>
                      {score}/{categoryInfo.maxScore}
                    </p>
                  </div>
                  {hasScore2OrMore && (
                    <Badge variant="destructive" className="text-xs">≥2</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alert for Moderate+ Severity */}
      {(results.severity === 'moderate' || results.severity === 'severe' || results.severity === 'critical') && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            {isMalayalam ? 'അടിയന്തര ശ്രദ്ധ ആവശ്യമാണ്!' : 'Urgent Attention Required!'}
          </AlertTitle>
          <AlertDescription>
            {isMalayalam 
              ? 'ഈ സ്കോർ ഗണ്യമായ NMS-നെ സൂചിപ്പിക്കുന്നു. ഉടനടി ഇടപെടലും ഐസിയു പരിചരണവും പരിഗണിക്കുക.'
              : 'This score indicates significant NMS. Consider immediate intervention and ICU care.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Purpose Note */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>{isMalayalam ? 'പ്രധാനം:' : 'Important:'}</strong>{' '}
          {isMalayalam ? NMS_CLINICAL_NOTES.purpose.ml : NMS_CLINICAL_NOTES.purpose.en}
        </AlertDescription>
      </Alert>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>{isMalayalam ? 'മാനേജ്മെന്റ് ശുപാർശകൾ' : 'Management Recommendations'}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary font-bold">{index + 1}.</span>
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Export Buttons */}
      <ExportButtons data={reportData} className="mt-4" />
    </div>
  );
};
