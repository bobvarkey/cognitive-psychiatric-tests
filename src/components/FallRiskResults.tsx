import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { FallRiskResult } from "@/types/fallRisk";
import { MORSE_RISK_LEVELS, INTERVENTIONS } from "@/data/fallRiskScale";
import { AlertTriangle, CheckCircle, XCircle, Activity, Footprints, Pill, Home, Eye } from "lucide-react";
import { ExportButtons } from '@/components/ExportButtons';
import type { ReportData } from '@/utils/reportGenerator';

interface FallRiskResultsProps {
  result: FallRiskResult;
}

export function FallRiskResults({ result }: FallRiskResultsProps) {
  const { language } = useLanguage();

  const getOverallRiskColor = () => {
    switch (result.overallRiskLevel) {
      case 'low': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getOverallRiskLabel = () => {
    switch (result.overallRiskLevel) {
      case 'low': return language === 'ml' ? 'കുറഞ്ഞ അപകടസാധ്യത' : 'Low Fall Risk';
      case 'moderate': return language === 'ml' ? 'മിതമായ അപകടസാധ്യത' : 'Moderate Fall Risk';
      case 'high': return language === 'ml' ? 'ഉയർന്ന അപകടസാധ്യത' : 'High Fall Risk';
      default: return '';
    }
  };

  const getMorseRiskInfo = () => {
    return MORSE_RISK_LEVELS[result.morseRiskLevel];
  };

  const morseInfo = getMorseRiskInfo();

  const reportData: ReportData = useMemo(() => {
    const riskLabel = getOverallRiskLabel();
    const morseLabel = language === 'ml' ? morseInfo.labelMl : morseInfo.label;
    return {
      assessmentName: 'Fall Risk Assessment',
      date: new Date().toLocaleDateString(),
      interpretation: result.interpretation,
      severity: riskLabel,
      sections: [
        {
          title: 'STEADI Score',
          items: [`Score: ${result.steadiScore}/14 (${result.steadiAtRisk ? 'At Risk (≥4)' : 'Not At Risk (<4)'})`],
          type: result.steadiAtRisk ? 'positive' : 'negative',
        },
        {
          title: 'Morse Fall Score',
          items: [`Score: ${result.morseScore}/125`, `Level: ${morseLabel}`, `Action: ${language === 'ml' ? morseInfo.actionMl : morseInfo.action}`],
          type: result.morseRiskLevel === 'high_risk' ? 'positive' : result.morseRiskLevel === 'low_risk' ? 'negative' : 'info',
        },
        {
          title: 'Physical Assessment',
          items: [
            `TUG: ${result.tugAtRisk ? 'At Risk (≥12s)' : 'Normal (<12s)'}`,
            `Chair Stand: ${result.chairStandAtRisk ? 'Needs Attention' : 'Adequate'}`,
            `Balance: ${result.balanceAtRisk ? 'At Risk' : 'Good'}`,
          ],
          type: result.tugAtRisk || result.chairStandAtRisk || result.balanceAtRisk ? 'positive' : 'negative',
        },
        {
          title: 'Recommendations',
          items: result.recommendations.length > 0 ? result.recommendations : ['None'],
          type: 'info',
        },
      ],
      disclaimer: 'This assessment is a screening tool and not a diagnostic instrument. Results should be interpreted in the context of a comprehensive clinical evaluation.',
    };
  }, [result, language, morseInfo]);

  return (
    <div className="space-y-4">
      {/* Overall Risk Summary */}
      <Card className={`border-2 ${result.overallRiskLevel === 'high' ? 'border-red-500' : result.overallRiskLevel === 'moderate' ? 'border-yellow-500' : 'border-green-500'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            {result.overallRiskLevel === 'high' ? (
              <XCircle className="h-6 w-6 text-red-500" />
            ) : result.overallRiskLevel === 'moderate' ? (
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            ) : (
              <CheckCircle className="h-6 w-6 text-green-500" />
            )}
            {language === 'ml' ? 'മൊത്തത്തിലുള്ള വീഴ്ച അപകട വിലയിരുത്തൽ' : 'Overall Fall Risk Assessment'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Badge className={`${getOverallRiskColor()} text-white text-lg px-4 py-2`}>
              {getOverallRiskLabel()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {language === 'ml' ? result.interpretationMl : result.interpretation}
          </p>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* STEADI Score */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {language === 'ml' ? 'STEADI സ്കോർ' : 'STEADI Score'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-3xl font-bold">{result.steadiScore}</span>
              <span className="text-muted-foreground">/ 14</span>
              <Badge variant={result.steadiAtRisk ? "destructive" : "secondary"}>
                {result.steadiAtRisk 
                  ? (language === 'ml' ? 'അപകടത്തിൽ (≥4)' : 'At Risk (≥4)')
                  : (language === 'ml' ? 'അപകടത്തിൽ അല്ല (<4)' : 'Not At Risk (<4)')}
              </Badge>
            </div>
            <Progress value={(result.steadiScore / 14) * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* Morse Score */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Footprints className="h-5 w-5" />
              {language === 'ml' ? 'മോഴ്സ് ഫാൾ സ്കോർ' : 'Morse Fall Score'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-3xl font-bold">{result.morseScore}</span>
              <span className="text-muted-foreground">/ 125</span>
              <Badge variant={result.morseRiskLevel === 'high_risk' ? "destructive" : result.morseRiskLevel === 'low_risk' ? "outline" : "secondary"}>
                {language === 'ml' ? morseInfo.labelMl : morseInfo.label}
              </Badge>
            </div>
            <Progress value={(result.morseScore / 125) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {language === 'ml' ? morseInfo.actionMl : morseInfo.action}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Physical Assessment Results */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {language === 'ml' ? 'ശാരീരിക വിലയിരുത്തൽ ഫലങ്ങൾ' : 'Physical Assessment Results'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">TUG:</span>
              {result.tugAtRisk ? (
                <Badge variant="destructive">
                  {language === 'ml' ? 'അപകടത്തിൽ (≥12s)' : 'At Risk (≥12s)'}
                </Badge>
              ) : (
                <Badge variant="secondary">
                  {language === 'ml' ? 'സാധാരണ (<12s)' : 'Normal (<12s)'}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {language === 'ml' ? 'ചെയർ സ്റ്റാൻഡ്:' : 'Chair Stand:'}
              </span>
              {result.chairStandAtRisk ? (
                <Badge variant="destructive">
                  {language === 'ml' ? 'ശ്രദ്ധ ആവശ്യം' : 'Needs Attention'}
                </Badge>
              ) : (
                <Badge variant="secondary">
                  {language === 'ml' ? 'മതിയായത്' : 'Adequate'}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {language === 'ml' ? 'ബാലൻസ്:' : 'Balance:'}
              </span>
              {result.balanceAtRisk ? (
                <Badge variant="destructive">
                  {language === 'ml' ? 'അപകടത്തിൽ' : 'At Risk'}
                </Badge>
              ) : (
                <Badge variant="secondary">
                  {language === 'ml' ? 'നല്ലത്' : 'Good'}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {language === 'ml' ? 'ശുപാർശകൾ' : 'Recommendations'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(language === 'ml' ? result.recommendationsMl : result.recommendations).map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Intervention Categories */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {language === 'ml' ? 'ഇടപെടൽ മാർഗ്ഗനിർദ്ദേശങ്ങൾ' : 'Intervention Guidelines'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(INTERVENTIONS).slice(0, 4).map(([key, intervention]) => (
              <div key={key} className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {key === 'gaitBalance' && <Footprints className="h-4 w-4" />}
                  {key === 'medications' && <Pill className="h-4 w-4" />}
                  {key === 'homeHazards' && <Home className="h-4 w-4" />}
                  {key === 'visualImpairment' && <Eye className="h-4 w-4" />}
                  <span className="text-sm font-medium">
                    {language === 'ml' ? intervention.titleMl : intervention.title}
                  </span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {(language === 'ml' ? intervention.recommendationsMl : intervention.recommendations).slice(0, 2).map((rec, idx) => (
                    <li key={idx}>• {rec}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Buttons */}
      <ExportButtons data={reportData} className="mt-4" />
    </div>
  );
}
