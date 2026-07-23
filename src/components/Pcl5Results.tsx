import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pcl5Result } from '@/types/pcl5';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { AlertCircle, CheckCircle2, Copy, Check, FileDown } from 'lucide-react';
import { generatePdfReport, generateTextReport } from '@/utils/reportGenerator';
import type { ReportData } from '@/utils/reportGenerator';
import { usePatientInfo } from '@/contexts/PatientInfoContext';

interface Pcl5ResultsProps {
  results: Pcl5Result;
  onReset: () => void;
}

export const Pcl5Results = ({ results, onReset }: Pcl5ResultsProps) => {
  const { language } = useLanguage();
  const { getPatientInfoForReport } = usePatientInfo();
  const [copied, setCopied] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 33) return 'text-red-600';
    if (score >= 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'PCL-5 Results' : 'PCL-5 ഫലങ്ങൾ'}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              generatePdfReport({
                assessmentName: 'PCL-5 PTSD Checklist (DSM-5)',
                date: new Date().toLocaleDateString(),
                totalScore: `${results.totalScore}/80`,
                severity: results.probablePTSD ? 'Probable PTSD' : 'Below Clinical Threshold',
                interpretation: language === 'en' ? results.interpretation : results.interpretationMl,
                sections: [
                  { title: 'Screening', items: [
                    `Trauma Exposure: ${results.hasTraumaExposure ? 'Yes' : 'No'}`,
                    `Total Score: ${results.totalScore}/80 (provisional cut-off ≥33)`,
                    `DSM-5 symptom-cluster pattern met: ${results.meetsDsm5Pattern ? 'Yes' : 'No'}`,
                  ], type: results.probablePTSD ? 'positive' : 'negative' },
                  { title: 'Cluster Subscores', items: [
                    `B — Intrusion (0–20): ${results.clusterB}`,
                    `C — Avoidance (0–8): ${results.clusterC}`,
                    `D — Negative alterations in cognition/mood (0–28): ${results.clusterD}`,
                    `E — Alterations in arousal & reactivity (0–24): ${results.clusterE}`,
                  ], type: 'neutral' },
                ],
                disclaimer: 'PCL-5 is a screening/self-report measure, not a diagnostic instrument. Positive screens warrant a structured clinical interview (e.g., CAPS-5).',
                patientInfo: getPatientInfoForReport(),
              });
            }}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={onReset} variant="outline">
            {language === 'en' ? 'New Assessment' : 'പുതിയ വിലയിരുത്തൽ'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{language === 'en' ? 'Total Score' : 'മൊത്തം സ്കോർ'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`text-6xl font-bold ${getScoreColor(results.totalScore)}`}>
              {results.totalScore}
            </div>
            <div className="text-2xl text-muted-foreground mt-2">
              {language === 'en' ? 'out of 80' : '80-ൽ'}
            </div>
            {results.hasTraumaExposure && (
              <div className="mt-4">
                <span className={`text-xl font-semibold ${getScoreColor(results.totalScore)}`}>
                  {results.probablePTSD
                    ? (language === 'en' ? 'Probable PTSD' : 'PTSD സാധ്യത')
                    : (language === 'en' ? 'Below Clinical Threshold' : 'ക്ലിനിക്കൽ പരിധിക്ക് താഴെ')}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {results.hasTraumaExposure && (
        <Card>
          <CardHeader>
            <CardTitle>{language === 'en' ? 'DSM-5 Symptom Clusters' : 'DSM-5 ലക്ഷണ ക്ലസ്റ്ററുകൾ'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'B — Intrusion', value: results.clusterB, max: 20 },
                { label: 'C — Avoidance', value: results.clusterC, max: 8 },
                { label: 'D — Cognition/Mood', value: results.clusterD, max: 28 },
                { label: 'E — Arousal/Reactivity', value: results.clusterE, max: 24 },
              ].map((c) => (
                <div key={c.label} className="p-4 rounded-lg bg-muted text-center">
                  <div className="text-sm text-muted-foreground">{c.label}</div>
                  <div className="text-2xl font-bold mt-1">{c.value}<span className="text-sm text-muted-foreground">/{c.max}</span></div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {language === 'en'
                ? 'DSM-5 symptom-cluster pattern requires ≥1 item in B, ≥1 in C, ≥2 in D, and ≥2 in E rated ≥2 (Moderately).'
                : 'DSM-5 ലക്ഷണ പാറ്റേണിന് B-യിൽ ≥1, C-യിൽ ≥1, D-യിൽ ≥2, E-യിൽ ≥2 ഇനങ്ങൾ ≥2 എന്ന് റേറ്റ് ചെയ്യണം.'}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{language === 'en' ? 'Interpretation' : 'വ്യാഖ്യാനം'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {language === 'en' ? results.interpretation : results.interpretationMl}
          </p>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">
              {language === 'en' ? 'Scoring Guidelines:' : 'സ്കോറിംഗ് മാർഗ്ഗനിർദ്ദേശങ്ങൾ:'}
            </p>
            <ul className="text-sm space-y-2 list-disc list-inside">
              <li>{language === 'en' ? 'Score range: 0–80 (sum of 20 items rated 0–4).' : 'സ്കോർ പരിധി: 0–80.'}</li>
              <li>{language === 'en' ? 'Provisional cut-off ≥33 suggests probable PTSD.' : 'പ്രൊവിഷണൽ കട്ട്-ഓഫ് ≥33 PTSD സാധ്യത സൂചിപ്പിക്കുന്നു.'}</li>
              <li>{language === 'en' ? 'Screening tool only — confirm with a structured clinical interview (e.g., CAPS-5).' : 'സ്ക്രീനിംഗ് ഉപകരണം മാത്രം — CAPS-5 പോലുള്ള ക്ലിനിക്കൽ അഭിമുഖം വഴി സ്ഥിരീകരിക്കുക.'}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
