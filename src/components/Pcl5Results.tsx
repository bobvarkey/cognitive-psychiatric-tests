import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pcl5Result } from '@/types/pcl5';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { AlertCircle, CheckCircle2, Copy, Check, FileDown, Download } from 'lucide-react';
import { generatePdfReport, generateTextReport, downloadTextReport } from '@/utils/reportGenerator';
import type { ReportData } from '@/utils/reportGenerator';
import { usePatientInfo } from '@/contexts/PatientInfoContext';

interface Pcl5ResultsProps {
  results: Pcl5Result;
  onReset: () => void;
  responses?: Map<number, number>;
}

const SYMPTOM_IDS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
const B_IDS = [1,2,3,4,5];
const C_IDS = [6,7];
const D_IDS = [8,9,10,11,12,13,14];
const E_IDS = [15,16,17,18,19,20];

export const Pcl5Results = ({ results, onReset, responses }: Pcl5ResultsProps) => {
  const { language } = useLanguage();
  const { getPatientInfoForReport } = usePatientInfo();
  const [copied, setCopied] = useState(false);

  const likertCounts = [0, 0, 0, 0, 0];
  if (responses) {
    SYMPTOM_IDS.forEach(id => {
      const v = responses.get(id);
      if (typeof v === 'number' && v >= 0 && v <= 4) likertCounts[v]++;
    });
  }
  const answeredCount = responses ? SYMPTOM_IDS.filter(id => responses.has(id)).length : 0;
  const countAtOrAbove2 = (ids: number[]) =>
    responses ? ids.reduce((s, id) => s + ((responses.get(id) ?? 0) >= 2 ? 1 : 0), 0) : 0;
  const bMet = countAtOrAbove2(B_IDS);
  const cMet = countAtOrAbove2(C_IDS);
  const dMet = countAtOrAbove2(D_IDS);
  const eMet = countAtOrAbove2(E_IDS);

  const buildReport = () => ({
    assessmentName: 'PCL-5 PTSD Checklist (DSM-5)',
    date: new Date().toLocaleDateString(),
    totalScore: `${results.totalScore}/80`,
    severity: results.probablePTSD ? 'Probable PTSD' : 'Below Clinical Threshold',
    interpretation: language === 'en' ? results.interpretation : results.interpretationMl,
    sections: [
      { title: 'Summary', items: [
        `Trauma Exposure: ${results.hasTraumaExposure ? 'Yes' : 'No'}`,
        `Total Score: ${results.totalScore}/80 (cut-off ≥33)`,
        `DSM-5 pattern (B≥1, C≥1, D≥2, E≥2 rated ≥2): ${results.meetsDsm5Pattern ? 'Met' : 'Not met'}`,
        `Items answered: ${answeredCount}/20`,
      ], type: (results.probablePTSD ? 'positive' : 'negative') as 'positive' | 'negative' },
      { title: 'Likert Distribution (items rated 0–4)', items: [
        `0 — Not at all: ${likertCounts[0]}`,
        `1 — A little bit: ${likertCounts[1]}`,
        `2 — Moderately: ${likertCounts[2]}`,
        `3 — Quite a bit: ${likertCounts[3]}`,
        `4 — Extremely: ${likertCounts[4]}`,
      ], type: 'info' as const },
      { title: 'Cluster Totals', items: [
        `B — Intrusion: ${results.clusterB}/20 (items ≥2: ${bMet}/5)`,
        `C — Avoidance: ${results.clusterC}/8 (items ≥2: ${cMet}/2)`,
        `D — Cognition/Mood: ${results.clusterD}/28 (items ≥2: ${dMet}/7)`,
        `E — Arousal/Reactivity: ${results.clusterE}/24 (items ≥2: ${eMet}/6)`,
      ], type: 'info' as const },
    ],
    disclaimer: 'PCL-5 is a screening/self-report measure, not a diagnostic instrument. Positive screens warrant a structured clinical interview (e.g., CAPS-5).',
    patientInfo: getPatientInfoForReport(),
  });

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
                  ], type: 'info' },
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

      {results.hasTraumaExposure && results.totalScore >= 33 && (
        <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-950/30">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription>
            <div className="font-semibold text-red-700 dark:text-red-400 text-base mb-2">
              {language === 'en'
                ? `Provisional PTSD cut-off met (Total ${results.totalScore} ≥ 33)`
                : `പ്രൊവിഷണൽ PTSD കട്ട്-ഓഫ് നിറവേറ്റി (മൊത്തം ${results.totalScore} ≥ 33)`}
            </div>
            <div className="text-sm space-y-1 text-red-900 dark:text-red-200">
              <div className="flex items-center gap-2">
                {results.meetsDsm5Pattern ? (
                  <CheckCircle2 className="h-4 w-4 text-red-700" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-700" />
                )}
                <span>
                  {language === 'en' ? 'DSM-5 symptom-cluster pattern (B≥1, C≥1, D≥2, E≥2 items rated ≥2): ' : 'DSM-5 ലക്ഷണ പാറ്റേൺ: '}
                  <strong>{results.meetsDsm5Pattern ? (language === 'en' ? 'Met' : 'നിറവേറ്റി') : (language === 'en' ? 'Not met' : 'നിറവേറ്റിയിട്ടില്ല')}</strong>
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                <div>B — Intrusion: <strong>{results.clusterB}/20</strong></div>
                <div>C — Avoidance: <strong>{results.clusterC}/8</strong></div>
                <div>D — Cognition/Mood: <strong>{results.clusterD}/28</strong></div>
                <div>E — Arousal: <strong>{results.clusterE}/24</strong></div>
              </div>
              <p className="mt-2 italic">
                {language === 'en'
                  ? 'Recommend structured clinical interview (e.g., CAPS-5) to confirm diagnosis and assess functional impairment, duration (>1 month), and rule out other causes.'
                  : 'രോഗനിർണ്ണയം സ്ഥിരീകരിക്കാൻ CAPS-5 പോലുള്ള ക്ലിനിക്കൽ അഭിമുഖം ശുപാർശ ചെയ്യുന്നു.'}
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}



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
