import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FabResponse, FabResult } from '@/types/fab';
import { fabItems } from '@/data/fabScale';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Copy, Check, FileDown } from 'lucide-react';
import { generatePdfReport, generateTextReport } from '@/utils/reportGenerator';
import type { ReportData } from '@/utils/reportGenerator';
import { usePatientInfo } from '@/contexts/PatientInfoContext';
import { DomainRadarChart } from './DomainRadarChart';

interface FabResultsProps {
  responses: FabResponse[];
  onReset: () => void;
}

const calculateResults = (responses: FabResponse[]): FabResult => {
  const totalScore = responses.reduce((sum, response) => sum + response.score, 0);

  let interpretation = '';
  let severity: FabResult['severity'];

  if (totalScore >= 15) {
    severity = 'normal';
    interpretation = 'Normal frontal lobe function. Score suggests no significant frontal dysexecutive impairment.';
  } else if (totalScore >= 12) {
    severity = 'mild-impairment';
    interpretation = 'Mild frontal impairment. Score is at or above the clinical cut-off. Monitor for changes.';
  } else if (totalScore >= 8) {
    severity = 'moderate-impairment';
    interpretation = 'Moderate frontal dysexecutive impairment. Score below cut-off of 12 suggests possible frontal-type dementia. Further neuropsychological assessment recommended.';
  } else {
    severity = 'severe-impairment';
    interpretation = 'Severe frontal dysexecutive impairment. Score significantly below cut-off indicates substantial frontal lobe dysfunction. Comprehensive evaluation and care planning recommended.';
  }

  return {
    responses,
    totalScore,
    interpretation,
    severity,
  };
};

export const FabResults = ({ responses, onReset }: FabResultsProps) => {
  const results = calculateResults(responses);
  const { language } = useLanguage();
  const { getPatientInfoForReport } = usePatientInfo();
  const [copied, setCopied] = useState(false);

  const getSeverityColor = (severity: FabResult['severity']) => {
    switch (severity) {
      case 'normal':
        return 'text-green-600 dark:text-green-400';
      case 'mild-impairment':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'moderate-impairment':
        return 'text-orange-600 dark:text-orange-400';
      case 'severe-impairment':
        return 'text-red-600 dark:text-red-400';
    }
  };

  const getSeverityLabel = (severity: FabResult['severity']) => {
    switch (severity) {
      case 'normal':
        return language === 'en' ? 'Normal' : 'സാധാരണം';
      case 'mild-impairment':
        return language === 'en' ? 'Mild Impairment' : 'നേരിയ തകരാറ്';
      case 'moderate-impairment':
        return language === 'en' ? 'Moderate Impairment' : 'മിതമായ തകരാറ്';
      case 'severe-impairment':
        return language === 'en' ? 'Severe Impairment' : 'ഗുരുതരമായ തകരാറ്';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'FAB Assessment Results' : 'FAB വിലയിരുത്തൽ ഫലങ്ങൾ'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">{results.totalScore}/18</div>
            <div className={`text-xl font-semibold ${getSeverityColor(results.severity)}`}>
              {getSeverityLabel(results.severity)}
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">
              {language === 'en' ? 'Interpretation' : 'വ്യാഖ്യാനം'}
            </h3>
            <p className="text-sm">{results.interpretation}</p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">
              {language === 'en' ? 'Clinical Note' : 'ക്ലിനിക്കൽ കുറിപ്പ്'}
            </h3>
            <p className="text-sm">
              {language === 'en'
                ? 'A cut-off score of 12 on the FAB has a sensitivity of 77% and specificity of 87% in differentiating between frontal dysexecutive type dementias and Dementia of Alzheimer\'s Type (DAT).'
                : 'FAB-യിൽ 12 എന്ന കട്ട്-ഓഫ് സ്കോർ ഫ്രണ്ടൽ ഡിസെക്സിക്യൂട്ടീവ് തരം ഡിമെൻഷ്യകളെയും അൽഷിമേഴ്സ് തരം ഡിമെൻഷ്യയെയും വേർതിരിക്കുന്നതിൽ 77% സെൻസിറ്റിവിറ്റിയും 87% സ്പെസിഫിസിറ്റിയും ഉണ്ട്.'}
            </p>
          </div>

          <DomainRadarChart
            title={language === 'en' ? 'Domain Score Profile' : 'ഡൊമെയ്ൻ സ്കോർ പ്രൊഫൈൽ'}
            data={responses.map((r) => {
              const item = fabItems.find((i) => i.id === r.itemId);
              return {
                domain: item ? (language === 'en' ? item.domain : item.domainMl) : `Item ${r.itemId}`,
                score: r.score,
                maxScore: 3,
                fullMark: 100,
              };
            })}
          />

          <div>
            <h3 className="font-semibold mb-3">
              {language === 'en' ? 'Item Breakdown' : 'ഇനം വിശദാംശങ്ങൾ'}
            </h3>
            <div className="space-y-2">
              {responses.map((response) => {
                const item = fabItems.find((i) => i.id === response.itemId);
                if (!item) return null;
                return (
                  <div key={response.itemId} className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="text-sm font-medium">
                      {language === 'en' ? item.domain : item.domainMl}
                    </span>
                    <span className="font-bold">{response.score}/3</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={onReset} className="flex-1">
              {language === 'en' ? 'New Assessment' : 'പുതിയ വിലയിരുത്തൽ'}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                const positiveFindings: string[] = [];
                const negativeFindings: string[] = [];
                responses.forEach(r => {
                  const item = fabItems.find(i => i.id === r.itemId);
                  if (!item) return;
                  const label = language === 'en' ? item.domain : item.domainMl;
                  if (r.score < 2) {
                    positiveFindings.push(`${label} — Impaired (Score: ${r.score}/3)`);
                  } else {
                    negativeFindings.push(`${label} (Score: ${r.score}/3)`);
                  }
                });
                const answeredIds = responses.map(r => r.itemId);
                const notAssessed = fabItems.filter(i => !answeredIds.includes(i.id)).map(i => language === 'en' ? i.domain : i.domainMl);
                generatePdfReport({
                  assessmentName: 'Frontal Assessment Battery (FAB)',
                  date: new Date().toLocaleDateString(),
                  totalScore: `${results.totalScore}/18`,
                  severity: getSeverityLabel(results.severity),
                  interpretation: results.interpretation,
                  sections: [
                    { title: 'Positive Findings (Impaired Domains)', items: positiveFindings, type: 'positive' },
                    { title: 'Negative Findings (Normal Domains)', items: negativeFindings, type: 'negative' },
                    { title: 'Items Not Assessed', items: notAssessed, type: 'not-assessed' },
                  ],
                  disclaimer: 'A cut-off score of 12 on the FAB differentiates frontal dysexecutive dementias from Alzheimer\'s type. This is a screening tool.',
                  patientInfo: getPatientInfoForReport(),
                });
              }}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const positiveFindings: string[] = [];
                  const negativeFindings: string[] = [];
                  responses.forEach(r => {
                    const item = fabItems.find(i => i.id === r.itemId);
                    if (!item) return;
                    const label = language === 'en' ? item.domain : item.domainMl;
                    if (r.score < 2) {
                      positiveFindings.push(`${label} — Impaired (Score: ${r.score}/3)`);
                    } else {
                      negativeFindings.push(`${label} (Score: ${r.score}/3)`);
                    }
                  });
                  const answeredIds = responses.map(r => r.itemId);
                  const notAssessed = fabItems.filter(i => !answeredIds.includes(i.id)).map(i => language === 'en' ? i.domain : i.domainMl);
                  const text = generateTextReport({
                    assessmentName: 'Frontal Assessment Battery (FAB)',
                    date: new Date().toLocaleDateString(),
                    totalScore: `${results.totalScore}/18`,
                    severity: getSeverityLabel(results.severity),
                    interpretation: results.interpretation,
                    sections: [
                      { title: 'Positive Findings (Impaired Domains)', items: positiveFindings, type: 'positive' },
                      { title: 'Negative Findings (Normal Domains)', items: negativeFindings, type: 'negative' },
                      { title: 'Items Not Assessed', items: notAssessed, type: 'not-assessed' },
                    ],
                    disclaimer: 'A cut-off score of 12 on the FAB differentiates frontal dysexecutive dementias from Alzheimer\'s type. This is a screening tool.',
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'References' : 'റഫറൻസുകൾ'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            Dubois, B.; Litvan, I. The FAB: A frontal assessment battery at bedside. <em>Neurology</em>. 55(11): 1621-1626, 2000.
          </p>
          <p>
            Slachevsky, A; Dubois, B. Frontal Assessment Battery and Differential Diagnosis of Frontotemporal Dementia and Alzheimer Disease. <em>Archives of Neurology</em>. 61(7): 1104-1107, 2004.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
